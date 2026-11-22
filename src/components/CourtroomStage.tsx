import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Gavel,
  Globe,
  MessageSquarePlus,
  Pause,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import {
  PARTICIPANTS,
  ROLE_GROUPS,
  RoleId,
  TRIAL_TURNS,
  VERDICT_CLAUSES,
  VERDICT_OPTIONS,
} from '../data/trialData';
import { ParticipantAvatar } from './ParticipantAvatar';
import { AnimatedGavelStamp, ScalesOfJustice } from './ScalesOfJustice';

interface CourtroomStageProps {
  currentTurnIndex: number;
  onChangeTurn: (index: number) => void;
  studentNames: Record<RoleId, string>;
  customNotes: Record<string, string>;
  onSaveCustomNote: (turnId: string, note: string) => void;
  selectedVerdictId: string;
  onSelectVerdict: (id: string) => void;
  selectedClauses: string[];
  onToggleClause: (id: string) => void;
  verdictSealed: boolean;
  onSealVerdict: (sealed: boolean) => void;
  onOpenLabTab: (tab: 'dichromate' | 'metabolism' | 'structure' | 'dehydration') => void;
  onGoToAssessment: () => void;
}

const PHASES = [
  '1. Açılış',
  '2. İddiaçılar',
  '3. Vəkillər',
  '4. Şahidlər',
  '5. Etanolun sözü',
  '6. Hökm',
];

export function CourtroomStage({
  currentTurnIndex,
  onChangeTurn,
  studentNames,
  customNotes,
  onSaveCustomNote,
  selectedVerdictId,
  onSelectVerdict,
  selectedClauses,
  onToggleClause,
  verdictSealed,
  onSealVerdict,
  onOpenLabTab,
  onGoToAssessment,
}: CourtroomStageProps) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showJudgeQuestion, setShowJudgeQuestion] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [weighedTurns, setWeighedTurns] = useState<Record<string, boolean>>({});

  const turn = TRIAL_TURNS[currentTurnIndex];
  const participant = PARTICIPANTS.find((p) => p.id === turn.roleId)!;
  const groupMeta = ROLE_GROUPS[participant.group];
  const assignedStudent = studentNames[participant.id]?.trim();

  // Reset local drawers when turn changes
  useEffect(() => {
    setShowJudgeQuestion(false);
    setShowNoteEditor(false);
    setNoteDraft(customNotes[turn.id] ?? '');
    // Automatically weigh turns up to current index when they have scaleImpact
    if (turn.scaleImpact !== 0) {
      setWeighedTurns((prev) => ({ ...prev, [turn.id]: true }));
    }
  }, [turn.id, turn.scaleImpact, customNotes]);

  // Auto-advance timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (currentTurnIndex >= TRIAL_TURNS.length - 1) {
      setIsAutoPlaying(false);
      return;
    }
    const timer = window.setInterval(() => {
      onChangeTurn(Math.min(TRIAL_TURNS.length - 1, currentTurnIndex + 1));
    }, 8500);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, currentTurnIndex, onChangeTurn]);

  // Compute live weighed harm & benefit totals
  const harmCount = TRIAL_TURNS.filter(
    (t) => t.scaleImpact === -1 && (weighedTurns[t.id] || TRIAL_TURNS.indexOf(t) <= currentTurnIndex)
  ).length;
  const benefitCount = TRIAL_TURNS.filter(
    (t) => t.scaleImpact === 1 && (weighedTurns[t.id] || TRIAL_TURNS.indexOf(t) <= currentTurnIndex)
  ).length;

  const isFinalVerdictTurn = turn.id === 'turn-13';
  const activeVerdict = VERDICT_OPTIONS.find((v) => v.id === selectedVerdictId) ?? VERDICT_OPTIONS[0];

  const handlePhaseJump = (phaseIdx: number) => {
    const firstTurnOfPhase = TRIAL_TURNS.findIndex((t) => t.phaseIndex === phaseIdx);
    if (firstTurnOfPhase !== -1) {
      setIsAutoPlaying(false);
      onChangeTurn(firstTurnOfPhase);
    }
  };

  return (
    <div className="space-y-5">
      {/* Phase & Playback Control Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {PHASES.map((label, idx) => {
              const isActive = turn.phaseIndex === idx;
              const isCompleted = turn.phaseIndex > idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handlePhaseJump(idx)}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : isCompleted
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 tabular-nums mr-1">
              Çıxış {currentTurnIndex + 1} / {TRIAL_TURNS.length}
            </span>
            <button
              type="button"
              onClick={() => setIsAutoPlaying((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isAutoPlaying
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoPlaying ? 'Dayandır' : 'Avtomatik gediş'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                onSealVerdict(false);
                onChangeTurn(0);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              title="İclası əvvəldən başlat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full bg-slate-900"
            initial={false}
            animate={{ width: `${((currentTurnIndex + 1) / TRIAL_TURNS.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          />
        </div>
      </div>

      {/* Main 2-Zone Courtroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Zone (65% -> 8 cols): Active Dressed Speaker Podium & Speech */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={turn.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              {/* Speaker Header & Dressed Portrait */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="shrink-0"
                  >
                    <ParticipantAvatar roleId={participant.id} isSpeaking size="lg" />
                  </motion.div>

                  <div className="flex-1 text-center sm:text-left">
                    {/* Unboxed Typographic Metadata Row (Zero-Pill Discipline) */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-xs font-semibold tracking-wide uppercase">
                      <span style={{ color: groupMeta.color }}>{groupMeta.label}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{turn.phaseTitle}</span>
                      {assignedStudent && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-800">İfaçı: {assignedStudent}</span>
                        </>
                      )}
                    </div>

                    <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {participant.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-600">{turn.headline}</p>

                    {/* Attire & Props Line */}
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Rol geyimi və atributlar
                      </p>
                      <p className="mt-0.5 text-sm text-slate-800 font-medium">
                        {participant.attireName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {participant.attireItems.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speech Transcript */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="space-y-3">
                  {turn.speech.map((paragraph, pIdx) => (
                    <motion.p
                      key={pIdx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * pIdx, duration: 0.3 }}
                      className="text-[15px] leading-relaxed text-slate-800"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* Custom Student Note if Added */}
                {customNotes[turn.id] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-sm text-amber-950"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                      Şagirdin əlavə arqumenti
                    </p>
                    <p className="leading-relaxed">{customNotes[turn.id]}</p>
                  </motion.div>
                )}

                {/* Chemical Reaction & Key Claim Strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                      Dərslik əsaslandırması
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-snug">{turn.keyClaim}</p>
                    <p className="mt-1.5 text-xs text-slate-500">{turn.textbookRef}</p>
                  </div>

                  <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 mb-1">
                      <Globe className="w-3.5 h-3.5 text-sky-700" />
                      {turn.externalSourceLabel}
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {turn.externalEvidence}
                    </p>
                  </div>
                </div>

                {/* Chemical Formula Display */}
                {turn.chemicalFormula && (
                  <div className="rounded-lg border border-slate-200 bg-slate-900 px-4 py-3 text-slate-50 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-chem text-sm sm:text-[15px] font-medium tracking-tight">
                      {turn.chemicalFormula}
                    </span>
                    {turn.linkedLabTab && (
                      <button
                        type="button"
                        onClick={() => onOpenLabTab(turn.linkedLabTab!)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-sky-200 transition-colors cursor-pointer"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        Animasiyalı laboratoriyada aç
                      </button>
                    )}
                  </div>
                )}

                {/* Interactive Cross-Examination & Note Controls */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowJudgeQuestion((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      showJudgeQuestion
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    {showJudgeQuestion ? 'Hakim sualını gizlət' : 'Hakim sualı və cavab'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowNoteEditor((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    {customNotes[turn.id] ? 'Şagird qeydinə düzəliş et' : 'Öz çıxışını əlavə et'}
                  </button>

                  {turn.linkedLabTab && !turn.chemicalFormula && (
                    <button
                      type="button"
                      onClick={() => onOpenLabTab(turn.linkedLabTab!)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 cursor-pointer"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      Laboratoriyada yoxla
                    </button>
                  )}
                </div>

                {/* Judge Question Accordion */}
                <AnimatePresence>
                  {showJudgeQuestion && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Hakimin dəqiqləşdirici sualı
                        </p>
                        <p className="text-sm font-semibold text-slate-900">“{turn.judgeQuestion}”</p>
                        <p className="text-sm text-slate-700 pt-1 border-t border-slate-200">
                          <span className="font-semibold text-slate-900">Təsdiqlənmiş cavab: </span>
                          {turn.rebuttalEvidence}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Custom Student Speech Note Editor */}
                <AnimatePresence>
                  {showNoteEditor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Bu rol üçün şagirdin əlavə arqumenti və ya nümunəsi
                        </label>
                        <textarea
                          rows={3}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Məsələn: Əlavə mənbədən tapdığınız faktı və ya öz fikrinizi bura yazın..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowNoteEditor(false)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            Ləğv et
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSaveCustomNote(turn.id, noteDraft.trim());
                              setShowNoteEditor(false);
                            }}
                            className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                          >
                            Qeydi yadda saxla
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Podium Footer Navigation */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
                <button
                  type="button"
                  disabled={currentTurnIndex === 0}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    onChangeTurn(currentTurnIndex - 1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Əvvəlki çıxış
                </button>

                {currentTurnIndex < TRIAL_TURNS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoPlaying(false);
                      onChangeTurn(currentTurnIndex + 1);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    Növbəti çıxış
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGoToAssessment}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 cursor-pointer"
                  >
                    Qiymətləndirməyə keç
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Zone (35% -> 4 cols): Scales of Justice, Speaker Roster OR Final Verdict Builder */}
        <div className="lg:col-span-4 space-y-4">
          <ScalesOfJustice
            harmCount={harmCount}
            benefitCount={benefitCount}
            verdictSealed={verdictSealed}
          />

          {isFinalVerdictTurn ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-700" />
                <h3 className="font-display text-base font-bold text-slate-900">
                  Məhkəmə Hökmü Konstruktoru
                </h3>
              </div>

              <div className="space-y-2">
                {VERDICT_OPTIONS.map((option) => {
                  const active = selectedVerdictId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onSelectVerdict(option.id);
                        onSealVerdict(false);
                      }}
                      className={`w-full text-left rounded-lg border p-3 transition-colors cursor-pointer ${
                        active
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900">{option.title}</span>
                        {option.isBalancedScientific ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{option.summary}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Qərara əlavə edilən məcburi tədbirlər
                </p>
                {VERDICT_CLAUSES.map((clause) => {
                  const checked = selectedClauses.includes(clause.id);
                  return (
                    <label
                      key={clause.id}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-2.5 cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          onToggleClause(clause.id);
                          onSealVerdict(false);
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      <div>
                        <span className="block text-xs font-semibold text-slate-800">{clause.label}</span>
                        <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                          {clause.detail}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onSealVerdict(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                Hökmü Çəkiclə Təsdiqlə
              </button>

              {verdictSealed && (
                <div className="space-y-2 pt-1">
                  <AnimatedGavelStamp active={verdictSealed} />
                  <div
                    className={`rounded-lg border p-3 text-xs leading-relaxed ${
                      activeVerdict.isBalancedScientific
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                        : 'border-amber-200 bg-amber-50 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {activeVerdict.isBalancedScientific
                        ? 'Elmi və ictimai cəhətdən ədalətli qərar!'
                        : 'Qərara yenidən nəzər yetirmək tövsiyə olunur'}
                    </div>
                    <p>{activeVerdict.summary}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Çıxış növbəsi ({TRIAL_TURNS.length} mərhələ)
              </h3>
              <div className="space-y-1.5 max-h-[430px] overflow-y-auto pr-1">
                {TRIAL_TURNS.map((item, idx) => {
                  const role = PARTICIPANTS.find((p) => p.id === item.roleId)!;
                  const active = idx === currentTurnIndex;
                  const passed = idx < currentTurnIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setIsAutoPlaying(false);
                        onChangeTurn(idx);
                      }}
                      className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white'
                          : passed
                            ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 shrink-0 rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums ${
                          active
                            ? 'bg-white/20 text-white'
                            : passed
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{role.shortTitle}</p>
                        <p
                          className={`text-[11px] truncate ${
                            active ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {item.headline}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-bold tabular-nums ${
                          active
                            ? 'text-amber-300'
                            : item.scaleImpact < 0
                              ? 'text-red-600'
                              : item.scaleImpact > 0
                                ? 'text-emerald-600'
                                : 'text-slate-400'
                        }`}
                      >
                        {item.scaleImpact < 0 ? '−' : item.scaleImpact > 0 ? '+' : '•'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
