import { motion } from 'motion/react';

interface ScalesOfJusticeProps {
  harmCount: number;
  benefitCount: number;
  verdictSealed?: boolean;
}

export function ScalesOfJustice({
  harmCount,
  benefitCount,
  verdictSealed = false,
}: ScalesOfJusticeProps) {
  // Positive diff tilts toward benefit (right down), negative diff tilts toward harm (left down)
  const diff = Math.max(-4, Math.min(4, benefitCount - harmCount));
  const tiltAngle = verdictSealed ? 0 : diff * 4.5; // degrees

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Məhkəmə Tərəzisi
        </span>
        <span className="text-xs font-medium text-slate-600 tabular-nums">
          {verdictSealed
            ? 'Hökm təsdiqləndi'
            : diff === 0
              ? 'Tarazlıq'
              : diff < 0
                ? 'İddia ağırlıqlıdır'
                : 'Müdafiə ağırlıqlıdır'}
        </span>
      </div>

      <div className="relative flex items-center justify-center py-2">
        <svg viewBox="0 0 240 132" className="w-full max-w-[230px] h-auto overflow-visible">
          {/* Base & Stand */}
          <rect x="78" y="118" width="84" height="8" rx="4" fill="#1E293B" />
          <rect x="92" y="112" width="56" height="6" rx="2" fill="#334155" />
          <rect x="116" y="22" width="8" height="92" rx="3" fill="#475569" />
          <circle cx="120" cy="22" r="7" fill="#B45309" />

          {/* Tilting Beam + Pans */}
          <motion.g
            animate={{ rotate: tiltAngle }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            style={{ transformOrigin: '120px 26px' }}
          >
            {/* Beam */}
            <rect x="34" y="23" width="172" height="5" rx="2.5" fill="#B45309" />
            <circle cx="38" cy="25.5" r="4" fill="#D97706" />
            <circle cx="202" cy="25.5" r="4" fill="#D97706" />

            {/* Left Pan (İddia / Zərər) */}
            <g transform="translate(38, 26)">
              <line x1="0" y1="0" x2="-18" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="18" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
              <path d="M-24 48 Q0 62 24 48 Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.8" />
              <text
                x="0"
                y="43"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#DC2626"
                className="tabular-nums"
              >
                -{harmCount}
              </text>
            </g>

            {/* Right Pan (Vəkil / Fayda) */}
            <g transform="translate(202, 26)">
              <line x1="0" y1="0" x2="-18" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="18" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
              <path d="M-24 48 Q0 62 24 48 Z" fill="#D1FAE5" stroke="#059669" strokeWidth="1.8" />
              <text
                x="0"
                y="43"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#059669"
                className="tabular-nums"
              >
                +{benefitCount}
              </text>
            </g>
          </motion.g>
        </svg>
      </div>

      {/* Numeric Score Bar */}
      <div className="mt-1 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between rounded-lg bg-red-50/70 px-2.5 py-1.5 text-red-700">
          <span className="font-medium">Zərər dəlilləri</span>
          <span className="font-bold tabular-nums">{harmCount}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-emerald-50/70 px-2.5 py-1.5 text-emerald-700">
          <span className="font-medium">Fayda dəlilləri</span>
          <span className="font-bold tabular-nums">{benefitCount}</span>
        </div>
      </div>
    </div>
  );
}

export function AnimatedGavelStamp({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -18 }}
      animate={active ? { scale: 1, opacity: 1, rotate: -6 } : { scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className="inline-flex items-center gap-2 rounded-lg border-2 border-amber-600 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-900"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M14 5l5 5-7 7-5-5 7-7z" />
        <path d="M7 12l-5 5 2 2 5-5" />
        <path d="M3 21h10" />
      </svg>
      Məhkəmə Hökmü Qüvvəyə Mindi
    </motion.div>
  );
}
