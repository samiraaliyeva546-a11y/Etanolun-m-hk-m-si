import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shuffle, Shirt, UserCheck } from 'lucide-react';
import { PARTICIPANTS, ROLE_GROUPS, RoleGroup, RoleId, TRIAL_TURNS } from '../data/trialData';
import { ParticipantAvatar } from './ParticipantAvatar';

interface RolesGalleryProps {
  studentNames: Record<RoleId, string>;
  onUpdateStudentName: (roleId: RoleId, name: string) => void;
  onAssignSampleNames: () => void;
  onJumpToRoleSpeech: (turnIndex: number) => void;
}

type FilterKey = 'all' | 'court' | RoleGroup;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Hamısı (12)' },
  { key: 'court', label: 'Hakim və Cavabdeh (2)' },
  { key: 'iddia', label: 'İddiaçılar (3)' },
  { key: 'vekil', label: 'Vəkillər (4)' },
  { key: 'sahid', label: 'Şahidlər (3)' },
];

export function RolesGallery({
  studentNames,
  onUpdateStudentName,
  onAssignSampleNames,
  onJumpToRoleSpeech,
}: RolesGalleryProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [hoveredId, setHoveredId] = useState<RoleId | null>(null);

  const visibleParticipants = PARTICIPANTS.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'court') return p.group === 'hakim' || p.group === 'cavabdeh';
    return p.group === filter;
  });

  const assignedCount = PARTICIPANTS.filter((p) => studentNames[p.id]?.trim()).length;

  return (
    <div className="space-y-5">
      {/* Header Control Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Məhkəmə İştirakçıları, Geyimlər və Rol Bölgüsü
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Hər iştirakçı roluna uyğun geyim və elmi atributlarla təchiz edilib · Təyin edilib:{' '}
            <span className="font-semibold text-slate-900 tabular-nums">
              {assignedCount} / {PARTICIPANTS.length}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onAssignSampleNames}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Sinif rollarını avtomatik bölüşdür
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Participant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleParticipants.map((role, index) => {
          const groupMeta = ROLE_GROUPS[role.group];
          const firstTurnIndex = TRIAL_TURNS.findIndex((t) => t.roleId === role.id);
          const isHovered = hoveredId === role.id;

          return (
            <motion.div
              key={role.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.25) }}
              onMouseEnter={() => setHoveredId(role.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3.5">
                {/* Top Row: Dressed Avatar + Role Title */}
                <div className="flex items-start gap-4">
                  <ParticipantAvatar roleId={role.id} isSpeaking={isHovered} size="md" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-wider">
                      <span style={{ color: groupMeta.color }}>{role.groupLabel}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{role.textbookPages}</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900 leading-snug">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-snug">{role.externalSource}</p>
                  </div>
                </div>

                {/* Attire Section */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    <Shirt className="w-3.5 h-3.5 text-slate-600" />
                    Rol geyimi və atributlar
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{role.attireName}</p>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    {role.attireItems.join(' · ')}
                  </p>
                </div>

                {/* Preparation Brief & Key Facts */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed">{role.prepBrief}</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {role.keyFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                  {role.formulaSnippet && (
                    <div className="rounded-md bg-slate-900 px-3 py-1.5 font-mono-chem text-xs text-sky-200">
                      {role.formulaSnippet}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Assign Student + Jump to Speech */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={studentNames[role.id] ?? ''}
                    onChange={(e) => onUpdateStudentName(role.id, e.target.value)}
                    placeholder="Şagirdin adı və soyadı..."
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                {firstTurnIndex !== -1 && (
                  <button
                    type="button"
                    onClick={() => onJumpToRoleSpeech(firstTurnIndex)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    Məhkəmədə çıxışına keç
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
