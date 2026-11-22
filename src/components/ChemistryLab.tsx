import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  FlaskConical,
  HeartPulse,
  Pause,
  Play,
  ShieldAlert,
  Thermometer,
} from 'lucide-react';

export type LabTabId = 'dichromate' | 'metabolism' | 'structure' | 'dehydration';

interface ChemistryLabProps {
  activeTab: LabTabId;
  onChangeTab: (tab: LabTabId) => void;
}

const LAB_TABS: { id: LabTabId; label: string; ref: string }[] = [
  { id: 'dichromate', label: 'Alkotester: K₂Cr₂O₇ Testi', ref: 'Səh. 27 · ÜST SAFER' },
  { id: 'metabolism', label: 'Asetaldehid və Denaturasiya', ref: 'Səh. 24, 177 · ÜST 2024' },
  { id: 'structure', label: 'Hidrogen Rabitəsi (78 °C)', ref: 'Səh. 12–15 · IUPAC' },
  { id: 'dehydration', label: 'Temperatur və Sənaye Sintezi', ref: 'Səh. 25, 36, 85' },
];

export function ChemistryLab({ activeTab, onChangeTab }: ChemistryLabProps) {
  return (
    <div className="space-y-5">
      {/* Lab Selector Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Kimyəvi Sübut Laboratoriyası
            </h2>
            <p className="text-sm text-slate-600">
              Məhkəmədə təqdim olunan reaksiyaları və biokimyəvi mexanizmləri canlı idarə edin
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            İnteraktiv animasiya simulyatoru · 4 təcrübə
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {LAB_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`text-left rounded-lg border px-3.5 py-2.5 transition-colors cursor-pointer ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs font-semibold leading-snug">{tab.label}</span>
                <span
                  className={`block text-[11px] mt-0.5 ${
                    active ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {tab.ref}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Simulation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
        >
          {activeTab === 'dichromate' && <DichromateSimulator />}
          {activeTab === 'metabolism' && <MetabolismSimulator />}
          {activeTab === 'structure' && <StructureSimulator />}
          {activeTab === 'dehydration' && <DehydrationSimulator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* 1. K2Cr2O7 Breathalyzer Simulator */
function DichromateSimulator() {
  const [bac, setBac] = useState(0.65); // promille (‰)

  // Interpolate color from bright orange (#EA580C) to deep green (#059669)
  const ratio = Math.min(1, bac / 1.2);
  const r = Math.round(234 + (5 - 234) * ratio);
  const g = Math.round(88 + (150 - 88) * ratio);
  const b = Math.round(12 + (105 - 12) * ratio);
  const solutionColor = `rgb(${r}, ${g}, ${b})`;

  const isDanger = bac >= 0.5;
  const isWarning = bac > 0.05 && bac < 0.5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left 7 cols: Animated Tube & Vapor Flow */}
      <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Fəaliyyət-2 · Kalium-bixromat Oksidləşmə Borusu
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${
              isDanger ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            {isDanger ? (
              <ShieldAlert className="w-4 h-4" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {isDanger
              ? 'TƏHLÜKƏLİ HƏDD (≥ 0,5 ‰)'
              : isWarning
                ? 'YÜNGÜL TƏSİR'
                : 'NORMAL (0,0 ‰)'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-center">
          <svg viewBox="0 0 420 220" className="w-full max-w-[440px] h-auto">
            {/* Air inlet tube */}
            <rect x="24" y="96" width="90" height="18" rx="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="69" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569">
              Nəfəs axını
            </text>

            {/* Animated Ethanol Vapor Bubbles */}
            {bac > 0 &&
              [0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  cy="105"
                  r={3 + bac * 1.4}
                  fill="#0EA5E9"
                  opacity="0.75"
                  animate={{ cx: [35, 130], opacity: [0, 0.85, 0] }}
                  transition={{
                    duration: Math.max(0.7, 2 - bac * 0.6),
                    delay: i * 0.35,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              ))}

            {/* Reaction Chamber / Test Tube */}
            <rect x="120" y="34" width="140" height="152" rx="22" fill="#FFFFFF" stroke="#64748B" strokeWidth="2.5" />
            <motion.rect
              x="124"
              y="78"
              width="132"
              height="104"
              rx="18"
              animate={{ fill: solutionColor }}
              transition={{ duration: 0.4 }}
            />

            {/* Fizzing reaction bubbles inside liquid when bac > 0 */}
            {bac > 0.05 &&
              [0, 1, 2, 3, 4].map((i) => (
                <motion.circle
                  key={i}
                  cx={145 + i * 22}
                  r="3.5"
                  fill="#FFFFFF"
                  opacity="0.6"
                  animate={{ cy: [170, 86], opacity: [0.7, 0] }}
                  transition={{
                    duration: 1.4,
                    delay: i * 0.25,
                    repeat: Infinity,
                  }}
                />
              ))}

            <text x="190" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">
              K₂Cr₂O₇ + H₂SO₄
            </text>
            <text x="190" y="136" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF">
              {bac < 0.15 ? 'Cr⁺⁶ (Narıncı)' : bac < 0.65 ? 'Cr⁺⁶ → Cr⁺³' : 'Cr⁺³ (Yaşıl)'}
            </text>

            {/* Digital Readout Gauge */}
            <rect x="292" y="54" width="110" height="112" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <text x="347" y="78" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94A3B8">
              ALKOTESTER
            </text>
            <text
              x="347"
              y="112"
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill={isDanger ? '#F87171' : isWarning ? '#FBBF24' : '#34D399'}
              fontFamily="monospace"
            >
              {bac.toFixed(2)} ‰
            </text>
            <text x="347" y="134" textAnchor="middle" fontSize="10" fill="#CBD5E1">
              {(bac / 10).toFixed(3)} q/dl
            </text>
            <motion.circle
              cx="347"
              cy="151"
              r="5"
              animate={{
                fill: isDanger ? ['#EF4444', '#7F1D1D', '#EF4444'] : isWarning ? '#F59E0B' : '#10B981',
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </svg>
        </div>

        <div className="mt-3 rounded-lg bg-slate-900 px-4 py-2.5 font-mono-chem text-xs sm:text-sm text-slate-100">
          2K₂Cr₂O₇ (narıncı) + 8H₂SO₄ + 3C₂H₅OH → 2Cr₂(SO₄)₃ (yaşıl) + 3CH₃COOH + 2K₂SO₄ + 11H₂O
        </div>
      </div>

      {/* Right 5 cols: Controls & Concept Annotations */}
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Yol Polisi Ekspertizası (Nəfəs Testi)
          </h3>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="bac-slider">Etanol konsentrasiyası (‰ promille)</label>
              <span className="font-mono-chem text-sm text-slate-900 tabular-nums">
                {bac.toFixed(2)} ‰
              </span>
            </div>
            <input
              id="bac-slider"
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={bac}
              onChange={(e) => setBac(parseFloat(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
              <span>0.00 ‰ (Təmiz)</span>
              <span>0.50 ‰ (ÜST həddi)</span>
              <span>2.00 ‰ (Ağır)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Təmiz (0.00 ‰)', val: 0 },
              { label: 'ÜST Həddi (0.50 ‰)', val: 0.5 },
              { label: 'Sərxoş (1.40 ‰)', val: 1.4 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setBac(preset.val)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-700 leading-relaxed pt-1">
            <p>
              <strong className="text-slate-900">Kimyəvi mexanizm (Səh. 27):</strong> Narıncı bixromat
              ionundakı <span className="font-mono-chem">Cr⁺⁶</span> etanolu sirkə turşusuna qədər
              oksidləşdirərkən özü yaşıl <span className="font-mono-chem">Cr⁺³</span> ionuna
              reduksiya olunur.
            </p>
            <p>
              <strong className="text-slate-900">ÜST SAFER statistikası:</strong> Qanda alkoqol
              <span className="font-semibold"> 0,05 q/dl (0,5 ‰)</span> həddini aşdıqda ölümcül yol
              qəzası riski eksponensial artır; yeni sürücülər üçün 0,00 ‰ tələb olunur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. Liver Metabolism & Protein Denaturation Simulator */
function MetabolismSimulator() {
  const [doseLevel, setDoseLevel] = useState<'low' | 'high'>('high');
  const [isPlaying, setIsPlaying] = useState(true);

  const isHigh = doseLevel === 'high';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Biokimyəvi Yol · Qaraciyər Metabolizmi və Zülal Denaturasiyası
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${
              isHigh ? 'text-red-700' : 'text-amber-700'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            {isHigh ? 'ASETALDEHİD TOPLANMASI' : 'MƏHDUD EMAL'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <svg viewBox="0 0 460 225" className="w-full h-auto">
            {/* Step 1: Ethanol */}
            <rect x="14" y="42" width="96" height="54" rx="10" fill="#EFF6FF" stroke="#0284C7" strokeWidth="1.5" />
            <text x="62" y="64" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0369A1" fontFamily="monospace">
              C₂H₅OH
            </text>
            <text x="62" y="82" textAnchor="middle" fontSize="10" fill="#475569">
              Etanol
            </text>

            {/* Arrow 1 (ADH) */}
            <line x1="112" y1="69" x2="162" y2="69" stroke="#64748B" strokeWidth="2" />
            <polygon points="160,64 168,69 160,74" fill="#64748B" />
            <text x="138" y="57" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">
              ADH
            </text>

            {/* Step 2: Toxic Acetaldehyde */}
            <motion.rect
              x="170"
              y="36"
              width="118"
              height="66"
              rx="10"
              animate={{
                fill: isHigh ? ['#FEE2E2', '#FECACA', '#FEE2E2'] : '#FEF3C7',
                stroke: isHigh ? '#DC2626' : '#D97706',
              }}
              transition={{ duration: 1.4, repeat: Infinity }}
              strokeWidth="2"
            />
            <text x="229" y="61" textAnchor="middle" fontSize="13" fontWeight="700" fill="#991B1B" fontFamily="monospace">
              CH₃CHO
            </text>
            <text x="229" y="79" textAnchor="middle" fontSize="10" fontWeight="700" fill="#DC2626">
              Zəhərli Asetaldehid
            </text>
            <text x="229" y="93" textAnchor="middle" fontSize="9" fill="#7F1D1D">
              {isHigh ? 'Qanda və beyində toplanır!' : 'Tədricən zərərsizləşir'}
            </text>

            {/* Arrow 2 (ALDH) */}
            <line x1="290" y1="69" x2="342" y2="69" stroke={isHigh ? '#EF4444' : '#64748B'} strokeWidth="2" strokeDasharray={isHigh ? '4 3' : 'none'} />
            <polygon points="340,64 348,69 340,74" fill={isHigh ? '#EF4444' : '#64748B'} />
            <text x="316" y="57" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">
              ALDH {isHigh ? '(Ləng!)' : ''}
            </text>

            {/* Step 3: Acetic Acid */}
            <rect x="350" y="42" width="96" height="54" rx="10" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
            <text x="398" y="64" textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857" fontFamily="monospace">
              CH₃COOH
            </text>
            <text x="398" y="82" textAnchor="middle" fontSize="10" fill="#475569">
              Sirkə turşusu
            </text>

            {/* Moving Metabolite Pulses */}
            {isPlaying && (
              <>
                <motion.circle
                  cy="69"
                  r="4.5"
                  fill="#0284C7"
                  animate={{ cx: [112, 168], opacity: [0, 1, 0] }}
                  transition={{ duration: isHigh ? 0.7 : 1.4, repeat: Infinity }}
                />
                <motion.circle
                  cy="69"
                  r="4.5"
                  fill="#DC2626"
                  animate={{ cx: [290, 348], opacity: isHigh ? [0.4, 0.1] : [0, 1, 0] }}
                  transition={{ duration: isHigh ? 2.4 : 1.3, repeat: Infinity }}
                />
              </>
            )}

            {/* Protein Denaturation Section (Bottom Half) */}
            <rect x="14" y="122" width="432" height="90" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <text x="28" y="142" fontSize="10.5" fontWeight="700" fill="#334155">
              Canlı hüceyrə zülallarının quruluşu (Dərslik səh. 177):
            </text>

            {/* Intact vs Unwound Protein Helix */}
            <motion.path
              d={
                isHigh
                  ? 'M 34 176 Q 90 192 145 170 Q 200 156 260 184 Q 330 195 415 172'
                  : 'M 34 174 C 54 150, 74 198, 94 174 C 114 150, 134 198, 154 174 C 174 150, 194 198, 214 174 C 234 150, 254 198, 274 174 C 294 150, 314 198, 334 174 C 354 150, 374 198, 394 174'
              }
              fill="none"
              stroke={isHigh ? '#DC2626' : '#059669'}
              strokeWidth="4"
              strokeLinecap="round"
              animate={{
                d: isHigh
                  ? 'M 34 176 Q 90 192 145 170 Q 200 156 260 184 Q 330 195 415 172'
                  : 'M 34 174 C 54 150, 74 198, 94 174 C 114 150, 134 198, 154 174 C 174 150, 194 198, 214 174 C 234 150, 254 198, 274 174 C 294 150, 314 198, 334 174 C 354 150, 374 198, 394 174',
              }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            <text x="28" y="203" fontSize="10.5" fontWeight="600" fill={isHigh ? '#B91C1C' : '#047857'}>
              {isHigh
                ? '▲ DENATURASİYA: Zülalın ikincili və üçüncülü quruluşu dağılır, bioloji aktivlik itir!'
                : '● NORMAL QURULUŞ: Zülal spiralı qorunur (xaricə antiseptikdə yalnız mikrob zülalları məhv olur)'}
            </text>
          </svg>
        </div>
      </div>

      {/* Right 5 cols */}
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Toksikoloji Simulyasiya
          </h3>
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Dayandır' : 'Oynat'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDoseLevel('low')}
            className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
              !isHigh
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="block text-xs font-bold">Məhdud / Xarici Tətbiq</span>
            <span className={`block text-[11px] mt-0.5 ${!isHigh ? 'text-slate-300' : 'text-slate-500'}`}>
              Hüceyrə zülalları qorunur
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDoseLevel('high')}
            className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
              isHigh
                ? 'border-red-700 bg-red-700 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="block text-xs font-bold">Yüksək Daxili Qəbul</span>
            <span className={`block text-[11px] mt-0.5 ${isHigh ? 'text-red-100' : 'text-slate-500'}`}>
              Asetaldehid + Denaturasiya
            </span>
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed pt-1">
          <p>
            <strong className="text-slate-900">1. Asetaldehid zərbəsi (Səh. 24):</strong> Qaraciyər
            fermentləri çoxlu alkoqolu sirkə turşusuna çevirib çatdırmadıqda qanda{' '}
            <span className="font-mono-chem font-semibold">CH₃CHO</span> toplanır və beyin fəaliyyətini
            kəskin zəiflədir.
          </p>
          <p>
            <strong className="text-slate-900">2. Zülal denaturasiyası (Səh. 177):</strong> Etil spirti
            zülal molekullarının su qişasını və fəza quruluşunu dağıdır — buna görə xaricdə bakteriyaları
            öldürür, daxildə isə insan orqanlarını zədələyir.
          </p>
          <p>
            <strong className="text-slate-900">3. ÜST (2024):</strong> İllik 2,6 milyon ölümün 1,6
            milyonu qaraciyər sirrozu, xərçəng və ürək-damar xəstəliklərindən baş verir.
          </p>
        </div>
      </div>
    </div>
  );
}

/* 3. Hydrogen Bonding & Boiling Point Comparison */
function StructureSimulator() {
  const [selectedMol, setSelectedMol] = useState<'ethanol' | 'ether' | 'propane'>('ethanol');

  const molInfo = {
    ethanol: {
      name: 'Etanol (C₂H₅OH)',
      mr: 46,
      bp: '+78 °C',
      state: 'Maye (20 °C-də)',
      hasHBond: true,
      barWidth: '92%',
      color: '#0284C7',
      note: 'Polyar O–H qrupu molekullar arasında möhkəm hidrogen rabitəsi yaradır.',
    },
    ether: {
      name: 'Dimetil efiri (CH₃–O–CH₃)',
      mr: 46,
      bp: '-24 °C',
      state: 'Qaz (20 °C-də)',
      hasHBond: false,
      barWidth: '34%',
      color: '#D97706',
      note: 'Etanolda olduğu kimi C₂H₆O tərkibli izomerdir, lakin –OH qrupu olmadığından H-rabitəsi yoxdur.',
    },
    propane: {
      name: 'Propan (C₃H₈)',
      mr: 44,
      bp: '-42 °C',
      state: 'Qaz (20 °C-də)',
      hasHBond: false,
      barWidth: '18%',
      color: '#64748B',
      note: 'Qeyri-polyar karbohidrogendir; molekullararası rabitə çox zəifdir.',
    },
  }[selectedMol];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Molekulyar Animasiya · Hidrogen Rabitəsi və Aqreqat Halı
          </span>
          <span className="text-xs font-bold text-sky-700 tabular-nums">
            t_qayn = {molInfo.bp} · {molInfo.state}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <svg viewBox="0 0 440 210" className="w-full h-auto">
            {/* Molecule 1 */}
            <motion.g
              animate={
                molInfo.hasHBond
                  ? { x: [0, 3, 0], y: [0, 2, 0] }
                  : { x: [-12, 16, -8, 12], y: [-10, 12, -6, 10] }
              }
              transition={{ duration: molInfo.hasHBond ? 2.4 : 1.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect x="42" y="72" width="128" height="58" rx="14" fill="#FFFFFF" stroke={molInfo.color} strokeWidth="2" />
              <text x="106" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A" fontFamily="monospace">
                {selectedMol === 'ethanol' ? 'C₂H₅–O–H' : selectedMol === 'ether' ? 'CH₃–O–CH₃' : 'CH₃–CH₂–CH₃'}
              </text>
              <text x="106" y="116" textAnchor="middle" fontSize="10" fill="#64748B">
                {molInfo.hasHBond ? 'δ⁻ O — H δ⁺' : 'H-rabitəsi yoxdur'}
              </text>
            </motion.g>

            {/* Hydrogen Bond Bridge (only for Ethanol) */}
            {molInfo.hasHBond ? (
              <motion.g
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <line x1="176" y1="101" x2="264" y2="101" stroke="#0284C7" strokeWidth="3.5" strokeDasharray="6 5" />
                <rect x="186" y="74" width="68" height="18" rx="4" fill="#E0F2FE" />
                <text x="220" y="86" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369A1">
                  H-rabitəsi
                </text>
              </motion.g>
            ) : (
              <text x="220" y="105" textAnchor="middle" fontSize="11" fontWeight="600" fill="#94A3B8">
                ✕ Rabitəsiz sərbəst uçuş
              </text>
            )}

            {/* Molecule 2 */}
            <motion.g
              animate={
                molInfo.hasHBond
                  ? { x: [0, -3, 0], y: [0, -2, 0] }
                  : { x: [14, -14, 10, -10], y: [12, -12, 8, -8] }
              }
              transition={{ duration: molInfo.hasHBond ? 2.4 : 0.95, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect x="270" y="72" width="128" height="58" rx="14" fill="#FFFFFF" stroke={molInfo.color} strokeWidth="2" />
              <text x="334" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A" fontFamily="monospace">
                {selectedMol === 'ethanol' ? 'H–O–C₂H₅' : selectedMol === 'ether' ? 'CH₃–O–CH₃' : 'CH₃–CH₂–CH₃'}
              </text>
              <text x="334" y="116" textAnchor="middle" fontSize="10" fill="#64748B">
                {molInfo.hasHBond ? '∠C–O–H = 108,6°' : `Mr = ${molInfo.mr}`}
              </text>
            </motion.g>

            {/* Boiling point visual gauge at bottom */}
            <text x="42" y="172" fontSize="11" fontWeight="600" fill="#334155">
              Qaynama temperaturu şkalası:
            </text>
            <rect x="42" y="182" width="356" height="12" rx="6" fill="#E2E8F0" />
            <motion.rect
              x="42"
              y="182"
              height="12"
              rx="6"
              fill={molInfo.color}
              animate={{ width: selectedMol === 'ethanol' ? 320 : selectedMol === 'ether' ? 120 : 65 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            />
          </svg>
        </div>
      </div>

      {/* Right 5 cols */}
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900">
          Kimyaçı Şahidin Müqayisəsi
        </h3>

        <div className="space-y-2">
          {[
            { id: 'ethanol' as const, label: 'Etanol (C₂H₅OH)', bp: '+78 °C · Mr = 46' },
            { id: 'ether' as const, label: 'Dimetil efiri (C₂H₆O)', bp: '-24 °C · Mr = 46' },
            { id: 'propane' as const, label: 'Propan (C₃H₈)', bp: '-42 °C · Mr = 44' },
          ].map((item) => {
            const active = selectedMol === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedMol(item.id)}
                className={`w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-semibold">{item.label}</span>
                <span className={`font-mono-chem text-xs ${active ? 'text-sky-300' : 'text-slate-500'}`}>
                  {item.bp}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 mb-1">{molInfo.name}</p>
          <p>{molInfo.note}</p>
        </div>
      </div>
    </div>
  );
}

/* 4. Temperature-dependent Dehydration Simulator */
function DehydrationSimulator() {
  const [temp, setTemp] = useState(125);
  const isHighTemp = temp >= 140;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            H₂SO₄ (qatı) İştirakı ilə Dehidratlaşma
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold tabular-nums ${
              isHighTemp ? 'text-sky-700' : 'text-emerald-700'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            t = {temp} °C · {isHighTemp ? 'Molekuldaxili (Etilen)' : 'Molekullararası (Tibbi efir)'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <svg viewBox="0 0 440 205" className="w-full h-auto">
            {/* Reactant */}
            <rect x="20" y="54" width="128" height="62" rx="12" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.8" />
            <text x="84" y="81" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A" fontFamily="monospace">
              {isHighTemp ? 'C₂H₅OH' : '2 C₂H₅OH'}
            </text>
            <text x="84" y="100" textAnchor="middle" fontSize="10" fill="#64748B">
              {isHighTemp ? '1 mol etanol' : '2 mol etanol'}
            </text>

            {/* Reaction Arrow + Animated Heat Flame */}
            <line x1="154" y1="85" x2="236" y2="85" stroke="#334155" strokeWidth="2.2" />
            <polygon points="234,80 242,85 234,90" fill="#334155" />
            <text x="196" y="73" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
              H₂SO₄, {temp} °C
            </text>

            <motion.g
              animate={{ scaleY: isHighTemp ? [1, 1.25, 1] : [0.8, 0.95, 0.8] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              style={{ transformOrigin: '196px 128px' }}
            >
              <path d="M196 102 Q208 118 196 130 Q184 118 196 102 Z" fill={isHighTemp ? '#EF4444' : '#F59E0B'} />
            </motion.g>

            {/* Product */}
            <motion.rect
              x="248"
              y="46"
              width="172"
              height="78"
              rx="12"
              animate={{
                fill: isHighTemp ? '#E0F2FE' : '#ECFDF5',
                stroke: isHighTemp ? '#0284C7' : '#059669',
              }}
              strokeWidth="2"
            />
            <text x="334" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A" fontFamily="monospace">
              {isHighTemp ? 'CH₂=CH₂ + H₂O' : 'C₂H₅–O–C₂H₅ + H₂O'}
            </text>
            <text
              x="334"
              y="96"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={isHighTemp ? '#0369A1' : '#047857'}
            >
              {isHighTemp ? 'Etilen (Polimer xammalı)' : 'Dietil efiri (“Tibbi efir”)'}
            </text>
            <text x="334" y="112" textAnchor="middle" fontSize="9.5" fill="#475569">
              {isHighTemp ? 'Polietilen və kauçuk sintezi' : 'Cərrahi narkoz və həlledici'}
            </text>

            {/* Info footer */}
            <rect x="20" y="150" width="400" height="36" rx="8" fill="#0F172A" />
            <text x="220" y="172" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#F8FAFC" fontFamily="monospace">
              {isHighTemp
                ? 'C₂H₅OH —(t > 140 °C, H₂SO₄)→ CH₂=CH₂↑ + H₂O'
                : '2C₂H₅OH —(t < 140 °C, H₂SO₄)→ C₂H₅–O–C₂H₅ + H₂O'}
            </text>
          </svg>
        </div>
      </div>

      {/* Right 5 cols */}
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-slate-700" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            Farmakologiya və Kimya Sənayesi
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor="temp-slider">Reaksiya temperaturu (°C)</label>
            <span className="font-mono-chem text-sm text-slate-900 tabular-nums">{temp} °C</span>
          </div>
          <input
            id="temp-slider"
            type="range"
            min="110"
            max="180"
            step="5"
            value={temp}
            onChange={(e) => setTemp(parseInt(e.target.value, 10))}
            className="w-full accent-slate-900 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
            <span>110 °C</span>
            <span>140 °C (Keçid həddi)</span>
            <span>180 °C</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTemp(125)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
          >
            t &lt; 140 °C (Tibbi efir)
          </button>
          <button
            type="button"
            onClick={() => setTemp(170)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            t &gt; 140 °C (Etilen)
          </button>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Eyni maddə yalnız temperatur şəraitini dəyişməklə həm tibdə ağrıkəsici{' '}
          <strong className="text-slate-900">dietil efiri</strong> (səh. 36), həm də müasir
          plastiklər və kauçuk üçün strateji <strong className="text-slate-900">etilen</strong>{' '}
          verir (səh. 25, 85).
        </p>
      </div>
    </div>
  );
}
