import { motion } from 'motion/react';
import { RoleId } from '../data/trialData';

interface ParticipantAvatarProps {
  roleId: RoleId;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-14 h-14',
  md: 'w-24 h-24',
  lg: 'w-44 h-44 sm:w-52 sm:h-52',
};

export function ParticipantAvatar({
  roleId,
  isSpeaking = false,
  size = 'md',
  className = '',
}: ParticipantAvatarProps) {
  const breatheAnim = isSpeaking
    ? { y: [0, -2.5, 0], scale: [1, 1.015, 1] }
    : { y: [0, -1, 0] };

  const breatheTransition = {
    duration: isSpeaking ? 1.8 : 3.2,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${SIZE_MAP[size]} ${className}`}
      aria-hidden="true"
    >
      {/* Active speaker aura ring */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-1 rounded-2xl border-2 border-amber-400/50"
          animate={{ scale: [1, 1.05, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <motion.svg
        viewBox="0 0 180 180"
        className="w-full h-full overflow-visible drop-shadow-sm"
        animate={breatheAnim}
        transition={breatheTransition}
      >
        <defs>
          <clipPath id={`clip-${roleId}-${size}`}>
            <rect x="6" y="6" width="168" height="168" rx="26" />
          </clipPath>
          <linearGradient id="bg-hakim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EEF2FF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="bg-etanol" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CCFBF1" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
          <linearGradient id="bg-iddia" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEE2E2" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <linearGradient id="bg-vekil" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#F0FDF4" />
          </linearGradient>
          <linearGradient id="bg-sahid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
        </defs>

        {/* Portrait Backdrop */}
        <rect
          x="6"
          y="6"
          width="168"
          height="168"
          rx="26"
          fill={
            roleId === 'hakim'
              ? 'url(#bg-hakim)'
              : roleId === 'etanol'
                ? 'url(#bg-etanol)'
                : roleId === 'asayis' || roleId === 'toksikoloq' || roleId === 'polis'
                  ? 'url(#bg-iddia)'
                  : roleId === 'farmakoloq' ||
                      roleId === 'etriyyatci' ||
                      roleId === 'kimya_muhendisi' ||
                      roleId === 'enerji_muhendisi'
                    ? 'url(#bg-vekil)'
                    : 'url(#bg-sahid)'
          }
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        <g clipPath={`url(#clip-${roleId}-${size})`}>
          {/* Role-specific character + attire */}
          {roleId === 'hakim' && <HakimCharacter isSpeaking={isSpeaking} />}
          {roleId === 'etanol' && <EtanolCharacter isSpeaking={isSpeaking} />}
          {roleId === 'asayis' && <AsayisCharacter isSpeaking={isSpeaking} />}
          {roleId === 'toksikoloq' && <ToksikoloqCharacter isSpeaking={isSpeaking} />}
          {roleId === 'polis' && <PolisCharacter isSpeaking={isSpeaking} />}
          {roleId === 'farmakoloq' && <FarmakoloqCharacter isSpeaking={isSpeaking} />}
          {roleId === 'etriyyatci' && <EtriyyatciCharacter isSpeaking={isSpeaking} />}
          {roleId === 'kimya_muhendisi' && <KimyaMuhendisiCharacter isSpeaking={isSpeaking} />}
          {roleId === 'enerji_muhendisi' && <EnerjiMuhendisiCharacter isSpeaking={isSpeaking} />}
          {roleId === 'kimyaci_sahid' && <KimyaciSahidCharacter isSpeaking={isSpeaking} />}
          {roleId === 'hekim_sahid' && <HekimSahidCharacter isSpeaking={isSpeaking} />}
          {roleId === 'yol_polisi' && <YolPolisiCharacter isSpeaking={isSpeaking} />}
        </g>
      </motion.svg>
    </div>
  );
}

function BaseHead({
  skin = '#F3C9A6',
  hairColor = '#1E293B',
  hairStyle = 'short',
  glasses = false,
  smiling = true,
}: {
  skin?: string;
  hairColor?: string;
  hairStyle?: 'short' | 'silver' | 'bob' | 'bun' | 'parted';
  glasses?: boolean;
  smiling?: boolean;
}) {
  return (
    <g>
      {/* Neck */}
      <rect x="78" y="88" width="24" height="22" rx="8" fill={skin} />
      <path d="M78 96 Q90 103 102 96 L102 91 L78 91 Z" fill="rgba(0,0,0,0.08)" />

      {/* Back hair for long/bob */}
      {hairStyle === 'bob' && (
        <path d="M58 58 Q54 92 64 102 L116 102 Q126 92 122 58 Z" fill={hairColor} />
      )}
      {hairStyle === 'bun' && (
        <circle cx="90" cy="30" r="13" fill={hairColor} />
      )}

      {/* Ears */}
      <circle cx="62" cy="68" r="6" fill={skin} />
      <circle cx="118" cy="68" r="6" fill={skin} />

      {/* Face */}
      <rect x="64" y="38" width="52" height="56" rx="24" fill={skin} />

      {/* Hair top */}
      {hairStyle === 'short' && (
        <path
          d="M62 60 Q63 32 90 32 Q117 32 118 60 Q112 45 90 45 Q68 45 62 60 Z"
          fill={hairColor}
        />
      )}
      {hairStyle === 'silver' && (
        <path
          d="M62 60 Q64 30 90 30 Q116 30 118 60 Q113 43 90 43 Q67 43 62 60 Z"
          fill={hairColor}
        />
      )}
      {hairStyle === 'parted' && (
        <path
          d="M62 60 Q63 31 90 31 Q117 31 118 60 Q105 40 84 46 Q72 49 62 60 Z"
          fill={hairColor}
        />
      )}
      {(hairStyle === 'bob' || hairStyle === 'bun') && (
        <path
          d="M63 58 Q66 33 90 33 Q114 33 117 58 Q103 42 90 46 Q77 42 63 58 Z"
          fill={hairColor}
        />
      )}

      {/* Eyes */}
      <motion.g
        animate={{ scaleY: [1, 1, 0.15, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
        style={{ transformOrigin: '90px 64px' }}
      >
        <circle cx="79" cy="64" r="3" fill="#0F172A" />
        <circle cx="101" cy="64" r="3" fill="#0F172A" />
        <circle cx="80" cy="63" r="1" fill="#FFFFFF" />
        <circle cx="102" cy="63" r="1" fill="#FFFFFF" />
      </motion.g>

      {/* Eyebrows */}
      <path d="M73 57 Q79 54 84 57" stroke={hairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M96 57 Q101 54 107 57" stroke={hairColor} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Glasses */}
      {glasses && (
        <g stroke="#334155" strokeWidth="2" fill="rgba(255,255,255,0.2)">
          <rect x="70" y="58" width="17" height="12" rx="4" />
          <rect x="93" y="58" width="17" height="12" rx="4" />
          <line x1="87" y1="63" x2="93" y2="63" />
        </g>
      )}

      {/* Mouth */}
      {smiling ? (
        <path d="M83 78 Q90 83 97 78" stroke="#9A3412" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : (
        <line x1="84" y1="79" x2="96" y2="79" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
      )}
    </g>
  );
}

/* 1. Hakim (Kimyaçı-alim): Qara hakim mantiyası, ağ yaxalıq, akademik eynək, çəkic */
function HakimCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      {/* Judicial Robe */}
      <path d="M36 176 L46 112 Q60 102 90 102 Q120 102 134 112 L144 176 Z" fill="#0F172A" />
      {/* Gold trim on robe */}
      <path d="M74 104 L82 174 M106 104 L98 174" stroke="#D97706" strokeWidth="2.5" opacity="0.85" />
      {/* White crisp collar & judicial jabot */}
      <polygon points="75,102 105,102 90,126" fill="#FFFFFF" />
      <path d="M84 114 L96 114 L94 138 L86 138 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
      <BaseHead skin="#F1C29B" hairColor="#64748B" hairStyle="silver" glasses />

      {/* Animated Gavel in right hand */}
      <motion.g
        animate={isSpeaking ? { rotate: [0, -24, 6, 0] } : { rotate: [0, -4, 0] }}
        transition={{ duration: isSpeaking ? 1.1 : 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '132px 150px' }}
      >
        <rect x="128" y="132" width="7" height="36" rx="3" fill="#92400E" transform="rotate(-25 131 150)" />
        <rect x="115" y="122" width="24" height="12" rx="3" fill="#B45309" stroke="#F59E0B" strokeWidth="1.2" transform="rotate(-25 127 128)" />
        <circle cx="132" cy="156" r="7" fill="#F1C29B" />
      </motion.g>
    </g>
  );
}

/* 2. Cavabdeh Etanol: Firuzəyi molekulyar laboratoriya kostyumu və fırlanan C₂H₅OH halqası */
function EtanolCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      {/* Orbiting Molecular Bond Halo */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: isSpeaking ? 9 : 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '90px 72px' }}
      >
        <circle cx="90" cy="72" r="56" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
        <circle cx="90" cy="16" r="6" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="146" cy="72" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="34" cy="72" r="5" fill="#F8FAFC" stroke="#0F766E" strokeWidth="1.5" />
      </motion.g>

      {/* Teal-silver scientist/molecular suit */}
      <path d="M38 176 L48 112 Q62 102 90 102 Q118 102 132 112 L142 176 Z" fill="#0F766E" />
      <polygon points="75,102 105,102 90,132" fill="#CCFBF1" />
      <path d="M74 103 L86 138 M106 103 L94 138" stroke="#5EEAD4" strokeWidth="2.5" />

      {/* C2H5OH chest emblem */}
      <rect x="65" y="138" width="50" height="20" rx="5" fill="#042F2E" stroke="#5EEAD4" strokeWidth="1.2" />
      <text x="90" y="152" textAnchor="middle" fill="#99F6E4" fontSize="10" fontWeight="700" fontFamily="monospace">
        C₂H₅OH
      </text>

      <BaseHead skin="#F3C9A6" hairColor="#0F766E" hairStyle="parted" />
    </g>
  );
}

/* 3. İctimai asayiş keşikçisi: Tünd göy forma, papaq və qırmızı/ağ qol sarğısı */
function AsayisCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M38 176 L48 112 Q62 102 90 102 Q118 102 132 112 L142 176 Z" fill="#1E293B" />
      <polygon points="78,102 102,102 90,126" fill="#F8FAFC" />
      <polygon points="87,112 93,112 92,146 88,146" fill="#991B1B" />
      {/* Armband */}
      <rect x="42" y="132" width="18" height="16" rx="2" fill="#DC2626" />
      <rect x="42" y="138" width="18" height="4" fill="#FFFFFF" />

      <BaseHead skin="#EBB891" hairColor="#1E293B" hairStyle="short" smiling={false} />
      {/* Civic Patrol Cap */}
      <path d="M62 46 Q90 30 118 46 L115 36 Q90 25 65 36 Z" fill="#1E293B" />
      <rect x="62" y="43" width="56" height="6" rx="2" fill="#0F172A" />
      <circle cx="90" cy="36" r="3.5" fill="#F59E0B" />

      {/* Gesture Notebook */}
      <motion.g
        animate={isSpeaking ? { y: [0, -4, 0] } : { y: 0 }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <rect x="116" y="132" width="22" height="28" rx="3" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
        <line x1="120" y1="140" x2="134" y2="140" stroke="#DC2626" strokeWidth="2" />
        <line x1="120" y1="146" x2="132" y2="146" stroke="#94A3B8" strokeWidth="1.5" />
      </motion.g>
    </g>
  );
}

/* 4. Həkim-toksikoloq: Ağ xalat, bordo forma, stetoskop */
function ToksikoloqCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      {/* Burgundy scrubs inside */}
      <path d="M40 176 L48 112 Q65 102 90 102 Q115 102 132 112 L140 176 Z" fill="#881337" />
      {/* White coat lapels */}
      <path d="M38 176 L47 110 L76 103 L84 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <path d="M142 176 L133 110 L104 103 L96 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

      {/* Stethoscope */}
      <path d="M68 106 Q66 138 90 142 Q114 138 112 106" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <motion.circle
        cx="90"
        cy="146"
        r="6"
        fill="#CBD5E1"
        stroke="#334155"
        strokeWidth="2"
        animate={isSpeaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      <BaseHead skin="#F3C9A6" hairColor="#27272A" hairStyle="bob" glasses smiling={false} />
    </g>
  );
}

/* 5. Polis əməkdaşı: Rəsmi göy polis mundiri, poqon, döş nişanı, furajka */
function PolisCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M36 176 L46 112 Q62 102 90 102 Q118 102 134 112 L144 176 Z" fill="#1E3A8A" />
      {/* Epaulettes */}
      <rect x="46" y="106" width="18" height="7" rx="2" fill="#172554" stroke="#F59E0B" strokeWidth="1.2" />
      <rect x="116" y="106" width="18" height="7" rx="2" fill="#172554" stroke="#F59E0B" strokeWidth="1.2" />
      {/* Shirt & tie */}
      <polygon points="78,102 102,102 90,126" fill="#DBEAFE" />
      <polygon points="87,112 93,112 92,150 88,150" fill="#0F172A" />

      {/* Police Badge with Gleam */}
      <motion.polygon
        points="114,126 121,130 119,140 114,143 109,140 107,130"
        fill="#FBBF24"
        stroke="#B45309"
        strokeWidth="1"
        animate={isSpeaking ? { opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] } : { opacity: 1 }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />

      <BaseHead skin="#EBB891" hairColor="#0F172A" hairStyle="short" smiling={false} />
      {/* Police Cap */}
      <path d="M58 44 Q90 22 122 44 L118 30 Q90 18 62 30 Z" fill="#1E3A8A" />
      <rect x="61" y="41" width="58" height="7" rx="2" fill="#0F172A" />
      <circle cx="90" cy="33" r="4.5" fill="#FBBF24" stroke="#1E3A8A" strokeWidth="1" />
    </g>
  );
}

/* 6. Farmakoloq: Ağ əczaçı xalatı, zümrüdü yaxalıq, Rx nişanı, kəhrəba damcı flakonu */
function FarmakoloqCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M40 176 L48 112 Q65 102 90 102 Q115 102 132 112 L140 176 Z" fill="#047857" />
      <path d="M38 176 L47 110 L76 103 L85 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <path d="M142 176 L133 110 L104 103 L95 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

      {/* Rx Emblem */}
      <rect x="60" y="132" width="22" height="14" rx="3" fill="#ECFDF5" stroke="#059669" strokeWidth="1" />
      <text x="71" y="142" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="700">Rx</text>

      <BaseHead skin="#F5D0B5" hairColor="#7C2D12" hairStyle="bun" glasses />

      {/* Amber Medicine Bottle */}
      <motion.g
        animate={isSpeaking ? { rotate: [0, -8, 4, 0] } : { rotate: 0 }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ transformOrigin: '126px 150px' }}
      >
        <rect x="117" y="134" width="18" height="26" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
        <rect x="122" y="126" width="8" height="8" rx="1.5" fill="#1E293B" />
        <rect x="119" y="142" width="14" height="10" fill="#FEF3C7" />
        <line x1="126" y1="144" x2="126" y2="150" stroke="#059669" strokeWidth="2" />
        <line x1="123" y1="147" x2="129" y2="147" stroke="#059669" strokeWidth="2" />
      </motion.g>
    </g>
  );
}

/* 7. Ətriyyatçı: Gavalı jilet, ipək şərf, büllur ətir şüşəsi + qalxan ətir buxarı */
function EtriyyatciCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M40 176 L48 112 Q65 102 90 102 Q115 102 132 112 L140 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      {/* Plum Waistcoat */}
      <path d="M52 176 L58 110 L78 104 L88 148 L102 104 L122 110 L128 176 Z" fill="#701A75" />
      {/* Silk Scarf */}
      <path d="M78 103 Q90 120 102 103 L96 128 L84 128 Z" fill="#F472B6" />

      <BaseHead skin="#F5D0B5" hairColor="#451A03" hairStyle="bob" />

      {/* Crystal Perfume Flacon + Aromatic Mist */}
      <g>
        <rect x="115" y="134" width="22" height="24" rx="5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="122" y="127" width="8" height="7" fill="#F59E0B" />
        <motion.circle
          cx="120"
          cy="118"
          r="3"
          fill="#EC4899"
          opacity="0.55"
          animate={{ y: [0, -14], opacity: isSpeaking ? [0.7, 0] : [0.4, 0], scale: [0.8, 1.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <motion.circle
          cx="131"
          cy="115"
          r="2.5"
          fill="#A855F7"
          opacity="0.5"
          animate={{ y: [0, -16], opacity: isSpeaking ? [0.7, 0] : [0.35, 0], scale: [0.8, 1.6] }}
          transition={{ duration: 1.9, delay: 0.5, repeat: Infinity }}
        />
      </g>
    </g>
  );
}

/* 8. Kimya sənayesi mühəndisi: Ağ təhlükəsizlik dəbilqəsi, qoruyucu eynək, gödəkçə */
function KimyaMuhendisiCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M36 176 L46 112 Q62 102 90 102 Q118 102 134 112 L144 176 Z" fill="#334155" />
      {/* High-vis shoulder bands */}
      <rect x="52" y="114" width="10" height="62" fill="#0EA5E9" opacity="0.85" />
      <rect x="118" y="114" width="10" height="62" fill="#0EA5E9" opacity="0.85" />
      <polygon points="78,102 102,102 90,126" fill="#F8FAFC" />

      <BaseHead skin="#EBB891" hairColor="#1E293B" hairStyle="short" />
      {/* Blue Safety Goggles */}
      <rect x="68" y="57" width="19" height="12" rx="4" fill="rgba(56,189,248,0.28)" stroke="#0284C7" strokeWidth="2" />
      <rect x="93" y="57" width="19" height="12" rx="4" fill="rgba(56,189,248,0.28)" stroke="#0284C7" strokeWidth="2" />
      <line x1="87" y1="62" x2="93" y2="62" stroke="#0284C7" strokeWidth="2" />

      {/* White Engineer Safety Helmet */}
      <path d="M58 46 Q90 22 122 46 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="55" y="44" width="70" height="5" rx="2.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
      <rect x="85" y="29" width="10" height="14" rx="2" fill="#059669" />

      {/* Blueprint Roll */}
      <motion.g
        animate={isSpeaking ? { rotate: [0, -6, 4, 0] } : { rotate: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '126px 150px' }}
      >
        <rect x="116" y="130" width="14" height="38" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        <ellipse cx="123" cy="130" rx="7" ry="3" fill="#7DD3FC" />
      </motion.g>
    </g>
  );
}

/* 9. Alternativ enerji mühəndisi: Yaşıl eko-texniki gödəkçə, reflektor zolaqlar, yaşıl enerji emblemi */
function EnerjiMuhendisiCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M36 176 L46 112 Q62 102 90 102 Q118 102 134 112 L144 176 Z" fill="#065F46" />
      {/* Reflective stripes */}
      <rect x="46" y="142" width="88" height="7" fill="#A7F3D0" opacity="0.85" />
      <polygon points="78,102 102,102 90,126" fill="#ECFDF5" />

      <BaseHead skin="#F3C9A6" hairColor="#3F2E21" hairStyle="parted" />

      {/* Animated Eco Leaf / Biofuel Symbol */}
      <motion.g
        animate={isSpeaking ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 1.3, repeat: Infinity }}
        style={{ transformOrigin: '126px 136px' }}
      >
        <circle cx="126" cy="136" r="14" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <path d="M120 142 Q122 128 134 126 Q133 139 120 142 Z" fill="#10B981" />
        <line x1="119" y1="143" x2="128" y2="133" stroke="#065F46" strokeWidth="1.5" />
      </motion.g>
    </g>
  );
}

/* 10. Kimyaçılar (Şahid): Ağ laboratoriya xalatı, eynək, rəngi dəyişən qaynayan kolba */
function KimyaciSahidCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M40 176 L48 112 Q65 102 90 102 Q115 102 132 112 L140 176 Z" fill="#0284C7" />
      <path d="M38 176 L47 110 L76 103 L85 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <path d="M142 176 L133 110 L104 103 L95 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

      <BaseHead skin="#F1C29B" hairColor="#475569" hairStyle="silver" glasses />

      {/* Erlenmeyer Flask with color-shifting reaction */}
      <g>
        <polygon points="122,126 130,126 138,158 114,158" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
        <motion.polygon
          points="118,144 134,144 137,157 115,157"
          animate={
            isSpeaking
              ? { fill: ['#F97316', '#10B981', '#F97316'] }
              : { fill: '#0EA5E9' }
          }
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        <motion.circle
          cx="126"
          cy="140"
          r="2"
          fill="#059669"
          animate={{ y: [0, -10], opacity: [0.9, 0] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      </g>
    </g>
  );
}

/* 11. Həkimlər (Şahid): Səma mavisi cərrahi forma, ağ xalat, maska */
function HekimSahidCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M40 176 L48 112 Q65 102 90 102 Q115 102 132 112 L140 176 Z" fill="#38BDF8" />
      <path d="M38 176 L47 110 L76 103 L85 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <path d="M142 176 L133 110 L104 103 L95 176 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      {/* Mask around neck */}
      <rect x="74" y="103" width="32" height="12" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />

      <BaseHead skin="#F5D0B5" hairColor="#1E293B" hairStyle="bun" />
      {/* Medical Cap */}
      <path d="M64 43 Q90 29 116 43 L114 34 Q90 24 66 34 Z" fill="#0284C7" />
      <rect x="86" y="32" width="8" height="3" fill="#FFFFFF" />
      <rect x="88.5" y="29.5" width="3" height="8" fill="#FFFFFF" />

      {/* Medical chart */}
      <motion.rect
        x="114"
        y="132"
        width="22"
        height="28"
        rx="3"
        fill="#FFFFFF"
        stroke="#0284C7"
        strokeWidth="1.5"
        animate={isSpeaking ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </g>
  );
}

/* 12. Yol polisi əməkdaşı: Neon-sarı işıqqaytarıcı jilet, DYP furajkası, alkotester */
function YolPolisiCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <g>
      <path d="M36 176 L46 112 Q62 102 90 102 Q118 102 134 112 L144 176 Z" fill="#1E3A8A" />
      {/* High-Vis Neon Yellow Vest */}
      <path d="M50 176 L55 110 L75 104 L82 140 L98 140 L105 104 L125 110 L130 176 Z" fill="#EAB308" />
      <rect x="52" y="144" width="76" height="6" fill="#E2E8F0" />
      <rect x="51" y="158" width="78" height="6" fill="#E2E8F0" />
      <polygon points="78,102 102,102 90,126" fill="#DBEAFE" />

      <BaseHead skin="#EBB891" hairColor="#0F172A" hairStyle="short" smiling={false} />
      {/* DYP Cap */}
      <path d="M58 44 Q90 22 122 44 L118 30 Q90 18 62 30 Z" fill="#1E3A8A" />
      <rect x="61" y="41" width="58" height="6" rx="2" fill="#FACC15" />
      <circle cx="90" cy="33" r="4" fill="#FBBF24" />

      {/* Digital Breathalyzer */}
      <g>
        <rect x="116" y="128" width="18" height="30" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
        <rect x="119" y="132" width="12" height="9" rx="1.5" fill="#0F172A" />
        <motion.circle
          cx="125"
          cy="148"
          r="3.5"
          animate={
            isSpeaking
              ? { fill: ['#F97316', '#22C55E', '#EF4444', '#F97316'] }
              : { fill: '#22C55E' }
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </g>
    </g>
  );
}
