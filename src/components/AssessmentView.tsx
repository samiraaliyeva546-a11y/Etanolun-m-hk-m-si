import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import {
  PARTICIPANTS,
  QUIZ_QUESTIONS,
  RUBRIC_CRITERIA,
  RoleId,
} from '../data/trialData';
import { ParticipantAvatar } from './ParticipantAvatar';

export type RubricScores = Record<RoleId, Record<(typeof RUBRIC_CRITERIA)[number]['id'], number>>;

interface AssessmentViewProps {
  studentNames: Record<RoleId, string>;
  rubricScores: RubricScores;
  onUpdateScore: (
    roleId: RoleId,
    criterionId: (typeof RUBRIC_CRITERIA)[number]['id'],
    score: number
  ) => void;
  onResetScores: () => void;
}

export function AssessmentView({
  studentNames,
  rubricScores,
  onUpdateScore,
  onResetScores,
}: AssessmentViewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [subTab, setSubTab] = useState<'rubric' | 'quiz'>('rubric');

  const participantTotals = PARTICIPANTS.map((p) => {
    const scores = rubricScores[p.id];
    const total = RUBRIC_CRITERIA.reduce((acc, c) => acc + (scores[c.id] || 0), 0);
    return { role: p, total };
  });

  const maxTotal = RUBRIC_CRITERIA.length * 5;
  const averageScore =
    participantTotals.reduce((acc, item) => acc + item.total, 0) / PARTICIPANTS.length;

  const topParticipant = [...participantTotals].sort((a, b) => b.total - a.total)[0];

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const quizAnsweredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-5">
      {/* Header Summary Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Fərdi Yaradıcılıq Qiymətləndirməsi və Bilik Yoxlaması
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Dərslik tələbi (səh. 30): Dərsin sonunda hər bir iştirakçının fərdi yaradıcılığı və elmi
            sübutlardan istifadəsi qiymətləndirilir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('rubric')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'rubric'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Yaradıcılıq Rubrikası (12 rol)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('quiz')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              subTab === 'quiz'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Bilik Testi ({quizAnsweredCount}/{QUIZ_QUESTIONS.length})
          </button>
        </div>
      </div>

      {subTab === 'rubric' ? (
        <div className="space-y-4">
          {/* KPI Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Orta Sinif Nəticəsi
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
                {averageScore.toFixed(1)} / {maxTotal} bal
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ən Yüksək Yaradıcılıq
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                  {studentNames[topParticipant.role.id]?.trim() || topParticipant.role.shortTitle}{' '}
                  <span className="text-emerald-700 tabular-nums">({topParticipant.total} bal)</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Qiymətləndirmə Şkalası
                </p>
                <p className="mt-1 text-xs text-slate-600">Hər meyar üzrə 1–5 bal</p>
              </div>
              <button
                type="button"
                onClick={onResetScores}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            </div>
          </div>

          {/* Rubric Cards per Dressed Role */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {PARTICIPANTS.map((role) => {
              const scores = rubricScores[role.id];
              const total = RUBRIC_CRITERIA.reduce((acc, c) => acc + (scores[c.id] || 0), 0);
              const pct = Math.round((total / maxTotal) * 100);
              const student = studentNames[role.id]?.trim();

              return (
                <div
                  key={role.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ParticipantAvatar roleId={role.id} size="sm" className="shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{role.title}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {student ? `İfaçı: ${student}` : 'Şagird təyin edilməyib'} · {role.groupLabel}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono-chem text-base font-bold text-slate-900 tabular-nums">
                        {total}/{maxTotal}
                      </span>
                      <span className="block text-[11px] text-slate-500 tabular-nums">{pct}%</span>
                    </div>
                  </div>

                  {/* Animated Score Bar */}
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-600"
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    {RUBRIC_CRITERIA.map((criterion) => {
                      const val = scores[criterion.id] || 0;
                      return (
                        <div
                          key={criterion.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="text-slate-700">{criterion.label}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => onUpdateScore(role.id, criterion.id, num)}
                                className={`w-6 h-6 rounded-md font-mono-chem text-xs font-semibold transition-colors cursor-pointer ${
                                  val === num
                                    ? 'bg-slate-900 text-white'
                                    : val > num
                                      ? 'bg-slate-200 text-slate-800'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Düzgün cavablar:{' '}
              <span className="font-bold text-slate-900 tabular-nums">
                {quizCorrectCount} / {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedAnswers({})}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Testi yenilə
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {QUIZ_QUESTIONS.map((q, qIdx) => {
              const chosen = selectedAnswers[q.id];
              const isAnswered = chosen !== undefined;
              const isCorrect = chosen === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Sual {qIdx + 1}</span>
                    <span>{q.textbookRef}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{q.question}</h3>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isThisChosen = chosen === oIdx;
                      const isThisCorrect = q.correctIndex === oIdx;

                      let btnStyle =
                        'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100';
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                        } else if (isThisChosen && !isThisCorrect) {
                          btnStyle = 'border-red-400 bg-red-50 text-red-950';
                        } else {
                          btnStyle = 'border-slate-200 bg-white text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                          }
                          className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isThisChosen && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-lg p-3 text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-amber-50 text-amber-950 border border-amber-200'
                      }`}
                    >
                      <span className="font-bold">İzah: </span>
                      {q.explanation}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
