import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Captions,
  CheckCircle2,
  Download,
  Film,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  PARTICIPANTS,
  ParticipantRole,
  ROLE_GROUPS,
  RoleId,
  TRIAL_TURNS,
  VERDICT_OPTIONS,
} from '../data/trialData';
import { ParticipantAvatar } from './ParticipantAvatar';

interface VideoPresentationProps {
  studentNames: Record<RoleId, string>;
  selectedVerdictId: string;
}

const BASE_SCENE_SECONDS = 10;

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playCourtChime(type: 'gavel' | 'transition') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === 'gavel' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(type === 'gavel' ? 190 : 520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(type === 'gavel' ? 75 : 660, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
    osc.onended = () => {
      ctx.close().catch(() => {});
    };
  } catch {
    // Ignore audio context restrictions
  }
}

export function VideoPresentation({
  studentNames,
  selectedVerdictId,
}: VideoPresentationProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 1 within current scene
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // WebM Export state
  const [secondsPerSceneExport, setSecondsPerSceneExport] = useState<3 | 5>(3);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportLabel, setExportLabel] = useState('');
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const cancelExportRef = useRef(false);

  const turn = TRIAL_TURNS[sceneIndex];
  const participant = PARTICIPANTS.find((p) => p.id === turn.roleId)!;
  const groupMeta = ROLE_GROUPS[participant.group];
  const assignedStudent = studentNames[participant.id]?.trim();
  const activeVerdict = VERDICT_OPTIONS.find((v) => v.id === selectedVerdictId) ?? VERDICT_OPTIONS[0];

  const totalVideoSeconds = TRIAL_TURNS.length * BASE_SCENE_SECONDS;
  const elapsedSeconds = (sceneIndex + sceneProgress) * BASE_SCENE_SECONDS;

  // Determine which paragraph is active based on sceneProgress
  const captionIndex = Math.min(
    turn.speech.length - 1,
    Math.floor(sceneProgress * turn.speech.length)
  );
  const activeCaption = turn.speech[captionIndex];

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (exportedVideoUrl) URL.revokeObjectURL(exportedVideoUrl);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [exportedVideoUrl]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const step = (dt * playbackRate) / BASE_SCENE_SECONDS;

      setSceneProgress((prev) => {
        const next = prev + step;
        if (next >= 1) {
          if (sceneIndex < TRIAL_TURNS.length - 1) {
            setSceneIndex((s) => s + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 1;
          }
        }
        return next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, playbackRate, sceneIndex]);

  // Trigger chime & optional TTS when scene changes while playing
  useEffect(() => {
    if (!isPlaying) return;
    if (soundEnabled) {
      playCourtChime(turn.roleId === 'hakim' ? 'gavel' : 'transition');
    }
    if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${participant.shortTitle}. ${turn.headline}. ${turn.keyClaim}`
      );
      utterance.lang = 'az-AZ';
      utterance.rate = Math.min(1.4, playbackRate);
      window.speechSynthesis.speak(utterance);
    }
  }, [sceneIndex, isPlaying, soundEnabled, voiceEnabled, participant.shortTitle, turn.headline, turn.keyClaim, turn.roleId, playbackRate]);

  const handleTogglePlay = () => {
    if (!isPlaying && sceneIndex === TRIAL_TURNS.length - 1 && sceneProgress >= 0.99) {
      setSceneIndex(0);
      setSceneProgress(0);
    }
    setIsPlaying((prev) => {
      if (prev && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  };

  const handleScrub = (pct: number) => {
    const clamped = Math.max(0, Math.min(0.9999, pct));
    const exactScene = clamped * TRIAL_TURNS.length;
    const idx = Math.floor(exactScene);
    const prog = exactScene - idx;
    setSceneIndex(idx);
    setSceneProgress(prog);
  };

  // Real HTML5 Canvas -> MediaRecorder (.webm) Video Generator
  const handleExportVideo = useCallback(async () => {
    setExportError(null);
    if (typeof MediaRecorder === 'undefined') {
      setExportError('Brauzeriniz video yazma (MediaRecorder) funksiyasını dəstəkləmir.');
      return;
    }

    const mimeCandidates = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
    if (!mimeType) {
      setExportError('Brauzerinizdə WebM video kodeki tapılmadı.');
      return;
    }

    setIsPlaying(false);
    setIsExporting(true);
    setExportProgress(0);
    cancelExportRef.current = false;

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      setExportError('Canvas qrafik konteksti yaradıla bilmədi.');
      return;
    }

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 3_000_000,
    });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };

    const recordingStopped = new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };
    });

    recorder.start(250);

    const totalSlides = TRIAL_TURNS.length + 2; // intro + 13 scenes + verdict closing
    const secPerSlide = secondsPerSceneExport;
    const fps = 24;
    const framesPerSlide = secPerSlide * fps;
    const frameDurationMs = 1000 / fps;

    try {
      for (let sIdx = 0; sIdx < totalSlides; sIdx++) {
        if (cancelExportRef.current) break;

        if (sIdx === 0) {
          setExportLabel('Giriş kadrı hazırlanır...');
        } else if (sIdx <= TRIAL_TURNS.length) {
          const t = TRIAL_TURNS[sIdx - 1];
          const p = PARTICIPANTS.find((x) => x.id === t.roleId)!;
          setExportLabel(`Səhnə ${sIdx}/${TRIAL_TURNS.length}: ${p.shortTitle}`);
        } else {
          setExportLabel('Yekun hökm kadrı hazırlanır...');
        }

        for (let f = 0; f < framesPerSlide; f++) {
          if (cancelExportRef.current) break;
          const tNorm = f / framesPerSlide;
          drawVideoFrame(
            ctx,
            sIdx,
            tNorm,
            totalSlides,
            studentNames,
            activeVerdict.title,
            activeVerdict.summary
          );
          setExportProgress(Math.round(((sIdx + tNorm) / totalSlides) * 100));
          await new Promise((r) => setTimeout(r, frameDurationMs));
        }
      }

      recorder.stop();
      const blob = await recordingStopped;

      if (!cancelExportRef.current) {
        if (exportedVideoUrl) URL.revokeObjectURL(exportedVideoUrl);
        const url = URL.createObjectURL(blob);
        setExportedVideoUrl(url);
        setExportProgress(100);
        setExportLabel('Video material hazırdır!');
      }
    } catch {
      setExportError('Video yazılarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsExporting(false);
    }
  }, [secondsPerSceneExport, studentNames, activeVerdict.title, activeVerdict.summary, exportedVideoUrl]);

  const handleCancelExport = () => {
    cancelExportRef.current = true;
    setIsExporting(false);
    setExportLabel('');
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Video Material — “Etanolun Məhkəməsi”
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Bütün məhkəmə səhnələrini, geyimli iştirakçıları, kimyəvi reaksiyaları və ÜST
            statistikalarını animasiyalı video kimi izləyin və ya `.webm` faylı kimi yükləyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setSecondsPerSceneExport(3)}
              className={`rounded-md px-2.5 py-1 font-semibold cursor-pointer ${
                secondsPerSceneExport === 3
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Sürətli (~45s)
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setSecondsPerSceneExport(5)}
              className={`rounded-md px-2.5 py-1 font-semibold cursor-pointer ${
                secondsPerSceneExport === 5
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Standart (~75s)
            </button>
          </div>

          {!isExporting ? (
            <button
              type="button"
              onClick={handleExportVideo}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Film className="w-4 h-4 text-amber-400" />
              Video fayl yarat (.webm)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelExport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Dayandır ({exportProgress}%)
            </button>
          )}
        </div>
      </div>

      {/* Export Progress / Download Banner */}
      {(isExporting || exportedVideoUrl || exportError) && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          {exportError && (
            <p className="text-xs font-semibold text-red-700">{exportError}</p>
          )}

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{exportLabel}</span>
                <span className="tabular-nums">{exportProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full bg-amber-600"
                  animate={{ width: `${exportProgress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>
          )}

          {exportedVideoUrl && !isExporting && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  HD Video Material (1280×720 .webm) hazırdır!
                </div>
                <a
                  href={exportedVideoUrl}
                  download="etanolun-mehkemesi-video.webm"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Videonu Yüklə (.webm)
                </a>
              </div>
              <video
                src={exportedVideoUrl}
                controls
                className="w-full max-w-3xl rounded-lg border border-slate-200 bg-black aspect-video"
              />
            </div>
          )}
        </div>
      )}

      {/* Main 16:9 Cinema Video Player */}
      <div className="rounded-2xl border border-slate-300 bg-slate-950 overflow-hidden shadow-sm">
        {/* 16:9 Stage */}
        <div
          onClick={handleTogglePlay}
          className="relative aspect-video w-full overflow-hidden cursor-pointer select-none"
          style={{
            background:
              participant.group === 'iddia'
                ? 'radial-gradient(circle at 22% 30%, #3b0d14 0%, #0b1120 65%)'
                : participant.group === 'vekil'
                  ? 'radial-gradient(circle at 22% 30%, #063729 0%, #0b1120 65%)'
                  : participant.group === 'cavabdeh'
                    ? 'radial-gradient(circle at 22% 30%, #0c3b3d 0%, #0b1120 65%)'
                    : participant.group === 'sahid'
                      ? 'radial-gradient(circle at 22% 30%, #0a2e47 0%, #0b1120 65%)'
                      : 'radial-gradient(circle at 22% 30%, #172554 0%, #0b1120 65%)',
          }}
        >
          {/* Top Cinema Metadata Overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3.5 bg-gradient-to-b from-black/70 to-transparent text-xs text-slate-200">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-amber-400 uppercase tracking-wider">
                {turn.phaseTitle}
              </span>
              <span className="text-slate-500">·</span>
              <span>
                Səhnə {sceneIndex + 1} / {TRIAL_TURNS.length}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <span>{turn.textbookRef}</span>
              <span className="text-slate-500">·</span>
              <span>{turn.externalSourceLabel}</span>
            </div>
          </div>

          {/* Animated Scene Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={turn.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 pb-16 pt-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left: Dressed Animated Character */}
                <div className="md:col-span-5 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ParticipantAvatar
                      roleId={participant.id}
                      isSpeaking={isPlaying}
                      size="lg"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3"
                  >
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest"
                      style={{
                        color:
                          participant.group === 'iddia'
                            ? '#FCA5A5'
                            : participant.group === 'vekil'
                              ? '#6EE7B7'
                              : participant.group === 'sahid'
                                ? '#7DD3FC'
                                : '#FCD34D',
                      }}
                    >
                      {groupMeta.label}
                      {assignedStudent ? ` · ${assignedStudent}` : ''}
                    </span>
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-white mt-0.5">
                      {participant.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">{participant.attireName}</p>
                  </motion.div>
                </div>

                {/* Right: Visual Evidence Slide Cards */}
                <div className="md:col-span-7 space-y-3.5">
                  <motion.h4
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-xl sm:text-2xl font-bold text-amber-200 leading-snug"
                  >
                    {turn.headline}
                  </motion.h4>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-xs p-4 text-sm text-slate-100 leading-relaxed"
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Əsas Dəlil
                    </span>
                    {turn.keyClaim}
                  </motion.div>

                  {turn.chemicalFormula && (
                    <motion.div
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-xl border border-sky-400/30 bg-sky-950/60 px-4 py-3 font-mono-chem text-sm text-sky-200"
                    >
                      {turn.chemicalFormula}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-xl border border-amber-400/25 bg-amber-950/40 px-4 py-2.5 text-xs text-amber-100"
                  >
                    <strong className="text-amber-300">{turn.externalSourceLabel}: </strong>
                    {turn.externalEvidence}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Center Play Overlay when Paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                <Play className="w-7 h-7 ml-1 fill-white" />
              </div>
            </div>
          )}

          {/* Bottom Cinema Subtitles */}
          {showCaptions && (
            <div className="absolute bottom-3 left-0 right-0 px-4 sm:px-10 flex justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${turn.id}-${captionIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-3xl rounded-lg bg-black/80 px-4 py-2 text-center text-xs sm:text-sm font-medium text-white leading-relaxed border border-white/10"
                >
                  {activeCaption}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Video Player Controls Bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2.5 text-slate-200">
          {/* Interactive Chapter Scrubber */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max="0.999"
              step="0.002"
              value={(sceneIndex + sceneProgress) / TRIAL_TURNS.length}
              onChange={(e) => handleScrub(parseFloat(e.target.value))}
              aria-label="Video zaman xətti"
              className="w-full accent-amber-500 cursor-pointer h-1.5"
            />
            <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
              {TRIAL_TURNS.map((t, idx) => {
                const p = PARTICIPANTS.find((x) => x.id === t.roleId)!;
                const active = idx === sceneIndex;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSceneIndex(idx);
                      setSceneProgress(0);
                    }}
                    title={`${idx + 1}. ${p.shortTitle}: ${t.headline}`}
                    className={`h-1.5 rounded-full transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-400'
                        : idx < sceneIndex
                          ? 'bg-slate-500 hover:bg-slate-400'
                          : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Transport Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Fasilə' : 'Oynat'}
              </button>

              <button
                type="button"
                disabled={sceneIndex === 0}
                onClick={() => {
                  setSceneIndex((s) => Math.max(0, s - 1));
                  setSceneProgress(0);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Əvvəlki səhnə"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={sceneIndex === TRIAL_TURNS.length - 1}
                onClick={() => {
                  setSceneIndex((s) => Math.min(TRIAL_TURNS.length - 1, s + 1));
                  setSceneProgress(0);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Növbəti səhnə"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSceneIndex(0);
                  setSceneProgress(0);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Əvvələ qaytar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="ml-2 font-mono-chem text-xs text-slate-300 tabular-nums">
                {formatTime(elapsedSeconds)} / {formatTime(totalVideoSeconds)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Speed Selector */}
              <div className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 p-0.5 text-[11px]">
                {[0.75, 1, 1.25, 1.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPlaybackRate(r)}
                    className={`rounded-md px-2 py-1 font-mono-chem font-semibold cursor-pointer ${
                      playbackRate === r ? 'bg-slate-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowCaptions((c) => !c)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
                  showCaptions
                    ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
              >
                <Captions className="w-3.5 h-3.5" />
                Alt yazı
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
                  soundEnabled
                    ? 'border-sky-500/50 bg-sky-500/15 text-sky-200'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
                title="Keçid səsləri"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                Səs
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoiceEnabled((v) => {
                    if (v && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    return !v;
                  });
                }}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
                  voiceEnabled
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
                title="Brauzer səsli oxunuşu"
              >
                Oxunuş {voiceEnabled ? 'Açıq' : 'Bağlı'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Strip Below Video */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Video Fəsilləri (Klikləyərək birbaşa səhnəyə keçin)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {TRIAL_TURNS.map((item, idx) => {
            const p = PARTICIPANTS.find((x) => x.id === item.roleId)!;
            const active = idx === sceneIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSceneIndex(idx);
                  setSceneProgress(0);
                }}
                className={`flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-mono-chem text-[11px] font-bold opacity-70 tabular-nums shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{p.shortTitle}</p>
                  <p className={`text-[10px] truncate ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.phaseTitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   HD 1280x720 Canvas Frame Renderer for Real .webm Video File Export
   ============================================================================ */

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currY = y;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currY);
      line = words[i] + ' ';
      currY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currY);
    currY += lineHeight;
  }
  return currY;
}

function drawCanvasAvatar(
  ctx: CanvasRenderingContext2D,
  role: ParticipantRole,
  cx: number,
  cy: number,
  tNorm: number
) {
  const bob = Math.sin(tNorm * Math.PI * 4) * 3;
  ctx.save();
  ctx.translate(cx, cy + bob);

  // Portrait Card
  ctx.fillStyle = role.surfaceTint;
  ctx.strokeStyle = role.accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-115, -130, 230, 240, 24);
  ctx.fill();
  ctx.stroke();

  // Suit / Attire color by exact role
  const suitColor =
    role.id === 'hakim'
      ? '#0F172A'
      : role.id === 'etanol'
        ? '#0F766E'
        : role.id === 'polis' || role.id === 'yol_polisi'
          ? '#1E3A8A'
          : role.id === 'asayis'
            ? '#1E293B'
            : role.id === 'etriyyatci'
              ? '#701A75'
              : role.id === 'enerji_muhendisi'
                ? '#065F46'
                : role.id === 'kimya_muhendisi'
                  ? '#334155'
                  : '#FFFFFF';

  // Torso
  ctx.fillStyle = suitColor;
  ctx.beginPath();
  ctx.roundRect(-72, 18, 144, 86, 20);
  ctx.fill();
  if (suitColor === '#FFFFFF') {
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Yellow high-vis vest for Yol polisi
  if (role.id === 'yol_polisi') {
    ctx.fillStyle = '#EAB308';
    ctx.fillRect(-54, 24, 108, 78);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(-54, 62, 108, 8);
  }

  // Lab coat inner scrubs for doctors/scientists
  if (role.id === 'toksikoloq' || role.id === 'farmakoloq' || role.id === 'hekim_sahid' || role.id === 'kimyaci_sahid') {
    ctx.fillStyle =
      role.id === 'toksikoloq'
        ? '#881337'
        : role.id === 'farmakoloq'
          ? '#047857'
          : role.id === 'hekim_sahid'
            ? '#38BDF8'
            : '#0284C7';
    ctx.beginPath();
    ctx.moveTo(-22, 18);
    ctx.lineTo(22, 18);
    ctx.lineTo(0, 62);
    ctx.closePath();
    ctx.fill();
  }

  // Head
  ctx.fillStyle = '#F3C9A6';
  ctx.beginPath();
  ctx.arc(0, -32, 38, 0, Math.PI * 2);
  ctx.fill();

  // Hair / Cap / Helmet
  if (role.id === 'kimya_muhendisi') {
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.arc(0, -44, 42, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (role.id === 'polis' || role.id === 'yol_polisi' || role.id === 'asayis') {
    ctx.fillStyle = role.id === 'asayis' ? '#1E293B' : '#1E3A8A';
    ctx.beginPath();
    ctx.arc(0, -46, 40, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(0, -64, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = role.id === 'hakim' || role.id === 'kimyaci_sahid' ? '#64748B' : '#1E293B';
    ctx.beginPath();
    ctx.arc(0, -42, 38, Math.PI, 0);
    ctx.fill();
  }

  // Eyes
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(-13, -32, 3.5, 0, Math.PI * 2);
  ctx.arc(13, -32, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Etanol molecular badge
  if (role.id === 'etanol') {
    ctx.fillStyle = '#042F2E';
    ctx.fillRect(-42, 54, 84, 26);
    ctx.fillStyle = '#99F6E4';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('C₂H₅OH', 0, 72);
  }

  ctx.restore();
}

function drawVideoFrame(
  ctx: CanvasRenderingContext2D,
  slideIdx: number,
  tNorm: number,
  totalSlides: number,
  studentNames: Record<RoleId, string>,
  verdictTitle: string,
  verdictSummary: string
) {
  const W = 1280;
  const H = 720;

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(1, '#1E293B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (slideIdx === 0) {
    // Intro Title Slide
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('11-Cİ SİNİF KİMYA · SAĞLAM HƏYAT ROLLU OYUNU', W / 2, 230);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 58px serif';
    ctx.fillText('ETANOLUN MƏHKƏMƏSİ', W / 2, 315);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '24px sans-serif';
    ctx.fillText(
      'İnsan orqanizminə zərərləri, sənaye-tibb faydaları və beynəlxalq elmi faktlar',
      W / 2,
      380
    );

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('C₂H₅OH  ·  Dərslik + ÜST (WHO) + Bioenerji Məlumatları', W / 2, 445);
  } else if (slideIdx <= TRIAL_TURNS.length) {
    const turn = TRIAL_TURNS[slideIdx - 1];
    const role = PARTICIPANTS.find((p) => p.id === turn.roleId)!;
    const groupMeta = ROLE_GROUPS[role.group];
    const student = studentNames[role.id]?.trim();

    // Header Bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, 0, W, 68);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${turn.phaseTitle}  ·  Səhnə ${slideIdx} / ${TRIAL_TURNS.length}`, 48, 42);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${turn.textbookRef}  |  ${turn.externalSourceLabel}`, W - 48, 42);

    // Dressed Character on Left
    drawCanvasAvatar(ctx, role, 215, 290, tNorm);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(
      student ? `${groupMeta.label} · ${student}` : groupMeta.label.toUpperCase(),
      215,
      432
    );

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px serif';
    wrapCanvasText(ctx, role.title, 215, 466, 300, 30);

    // Right Evidence Panel
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 30px serif';
    const nextY = wrapCanvasText(ctx, turn.headline, 410, 145, 810, 38);

    // Key Claim Box
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    ctx.beginPath();
    ctx.roundRect(410, nextY + 12, 810, 118, 14);
    ctx.fill();
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '21px sans-serif';
    wrapCanvasText(ctx, turn.keyClaim, 434, nextY + 52, 760, 30);

    // Formula Box if present
    let boxY = nextY + 148;
    if (turn.chemicalFormula) {
      ctx.fillStyle = '#082F49';
      ctx.beginPath();
      ctx.roundRect(410, boxY, 810, 56, 12);
      ctx.fill();
      ctx.fillStyle = '#7DD3FC';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(turn.chemicalFormula, 434, boxY + 35);
      boxY += 74;
    }

    // External Evidence Box
    ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
    ctx.beginPath();
    ctx.roundRect(410, boxY, 810, 92, 12);
    ctx.fill();
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(turn.externalSourceLabel.toUpperCase(), 434, boxY + 28);
    ctx.fillStyle = '#FEF3C7';
    ctx.font = '18px sans-serif';
    wrapCanvasText(ctx, turn.externalEvidence, 434, boxY + 56, 760, 24);

    // Bottom Subtitle Bar
    const captionIdx = Math.min(turn.speech.length - 1, Math.floor(tNorm * turn.speech.length));
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.beginPath();
    ctx.roundRect(48, 566, W - 96, 108, 14);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    wrapCanvasText(ctx, turn.speech[captionIdx], W / 2, 606, W - 160, 28);
  } else {
    // Closing Verdict Slide
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MƏHKƏMƏNİN YEKUN HÖKMÜ', W / 2, 180);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px serif';
    wrapCanvasText(ctx, verdictTitle, W / 2, 250, 980, 50);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '24px sans-serif';
    wrapCanvasText(ctx, verdictSummary, W / 2, 370, 960, 36);

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Sağlam həyat tərzi naminə elmdən düzgün istifadə edək!', W / 2, 540);
  }

  // Video Timeline Bar at Very Bottom
  const totalProgress = (slideIdx + tNorm) / totalSlides;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(0, H - 8, W, 8);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(0, H - 8, W * totalProgress, 8);
}
