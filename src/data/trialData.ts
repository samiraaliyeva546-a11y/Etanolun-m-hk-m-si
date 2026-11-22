export type RoleGroup = 'hakim' | 'cavabdeh' | 'iddia' | 'vekil' | 'sahid';

export type RoleId =
  | 'hakim'
  | 'etanol'
  | 'asayis'
  | 'toksikoloq'
  | 'polis'
  | 'farmakoloq'
  | 'etriyyatci'
  | 'kimya_muhendisi'
  | 'enerji_muhendisi'
  | 'kimyaci_sahid'
  | 'hekim_sahid'
  | 'yol_polisi';

export interface ParticipantRole {
  id: RoleId;
  title: string;
  shortTitle: string;
  group: RoleGroup;
  groupLabel: string;
  attireName: string;
  attireItems: string[];
  accentHex: string;
  surfaceTint: string;
  textbookPages: string;
  externalSource: string;
  prepBrief: string;
  keyFacts: string[];
  formulaSnippet?: string;
}

export interface TrialTurn {
  id: string;
  phaseIndex: number;
  phaseTitle: string;
  roleId: RoleId;
  headline: string;
  speech: string[];
  keyClaim: string;
  chemicalFormula?: string;
  textbookRef: string;
  externalEvidence: string;
  externalSourceLabel: string;
  judgeQuestion: string;
  rebuttalEvidence: string;
  scaleImpact: -1 | 0 | 1;
  linkedLabTab?: 'dichromate' | 'metabolism' | 'structure' | 'dehydration';
}

export interface VerdictOption {
  id: string;
  title: string;
  summary: string;
  isBalancedScientific: boolean;
}

export interface VerdictClause {
  id: string;
  label: string;
  detail: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  textbookRef: string;
}

export const ROLE_GROUPS: Record<RoleGroup, { label: string; color: string; bg: string }> = {
  hakim: { label: 'Hakim', color: '#1E3A5F', bg: '#EFF6FF' },
  cavabdeh: { label: 'Cavabdeh', color: '#0F766E', bg: '#F0FDFA' },
  iddia: { label: 'İddiaçı tərəf', color: '#DC2626', bg: '#FEF2F2' },
  vekil: { label: 'Vəkil tərəf', color: '#059669', bg: '#ECFDF5' },
  sahid: { label: 'Şahid', color: '#0284C7', bg: '#F0F9FF' },
};

export const PARTICIPANTS: ParticipantRole[] = [
  {
    id: 'hakim',
    title: 'Hakim (Kimyaçı-alim)',
    shortTitle: 'Hakim',
    group: 'hakim',
    groupLabel: 'Məhkəmə Sədri',
    attireName: 'Akademik hakim mantiyası, klassik yaxalıq və qızılı çəkic',
    attireItems: ['Qara hakim mantiyası', 'Ağ bəyaz yaxalıq və qalstuk', 'Akademik eynək', 'Taxta məhkəmə çəkici'],
    accentHex: '#1E3A5F',
    surfaceTint: '#F1F5F9',
    textbookPages: 'Dərslik səh. 30',
    externalSource: 'ÜST (WHO) və Beynəlxalq Kimya Mənbələri',
    prepBrief:
      'Məhkəmə iclasını idarə edir, həm dərslikdəki, həm də qlobal elmi mənbələrdəki faktları dinləyir və sağlam həyat naminə ədalətli qərar verir.',
    keyFacts: [
      'İş: “İnsan orqanizminə vurduğu ziyana görə etanolun məsuliyyəti”',
      'Hər bir iştirakçıdan dərslik + beynəlxalq elmi statistikalara söykənən sübut istəyir',
      'Zərər və fayda tərəzisini tarazlaşdıraraq ədalətli yekun hökm çıxarır',
    ],
  },
  {
    id: 'etanol',
    title: 'Cavabdeh: Etanol (C₂H₅OH)',
    shortTitle: 'Etanol',
    group: 'cavabdeh',
    groupLabel: 'Cavabdeh',
    attireName: 'Molekulyar simvollu firuzəyi-gümüşü laboratoriya kostyumu',
    attireItems: ['C₂H₅OH molekulyar döş nişanı', 'Firuzəyi-gümüşü kimyəvi kostyum', 'Fırlanan atom rabitəsi halqası'],
    accentHex: '#0F766E',
    surfaceTint: '#F0FDFA',
    textbookPages: 'Dərslik səh. 12–15, 21–30',
    externalSource: 'WHO Essential Medicines & IUPAC məlumatları',
    prepBrief:
      'Özünün təbiətdə və sənayedəki rolunu müdafiə edir; ətriyyat, təbabət, kimya sənayesi və bioenerji sahələrindəki əhəmiyyətini sübut edir.',
    keyFacts: [
      'Molekul formulu: C₂H₅OH (Mr = 46), qaynama temperaturu +78 °C',
      'ÜST-ün Əsas Dərmanlar Siyahısına daxil olan əvəzolunmaz antiseptikdir',
      'Maddənin özü deyil, ondan sui-istifadə edilməsi ziyan törədir',
    ],
    formulaSnippet: 'CH₃–CH₂–OH  (Mr = 46)',
  },
  {
    id: 'asayis',
    title: 'İctimai asayiş keşikçisi',
    shortTitle: 'Asayiş keşikçisi',
    group: 'iddia',
    groupLabel: 'İddiaçı',
    attireName: 'Tünd göy ictimai nəzarət forması, papaq və qol sarğısı',
    attireItems: ['Tünd göy xidməti pencək', '“İctimai asayiş” qol sarğısı', 'Xidməti furajka', 'Protokol qeyd dəftəri'],
    accentHex: '#DC2626',
    surfaceTint: '#FEF2F2',
    textbookPages: 'Dərslik səh. 30',
    externalSource: 'ÜST (WHO) 2024 Qlobal Alkoqol Hesabatı',
    prepBrief:
      'Spirtli içkilərin ailə mühitinə, gənclərin gələcəyinə, əmək intizamına və ictimai asayişə vurduğu sosial ziyanları qlobal statistikalarla əsaslandırır.',
    keyFacts: [
      'ÜST (2024): Dünyada təxminən 400 milyon insan alkoqoldan istifadə pozuntusundan əziyyət çəkir',
      '20–39 yaşlı gənclər arasında bütün ölümlərin 13%-i alkoqol amili ilə əlaqədardır',
      'Sağlam həyat tərzi gənclərin asudə vaxtının və ailə dəyərlərinin qorunması ilə mümkündür',
    ],
  },
  {
    id: 'toksikoloq',
    title: 'Həkim-toksikoloq',
    shortTitle: 'Həkim-toksikoloq',
    group: 'iddia',
    groupLabel: 'İddiaçı',
    attireName: 'Ağ xəstəxana xalatı, bordo tibbi forma, stetoskop və analiz lövhəsi',
    attireItems: ['Ağ tibbi xalat', 'Bordo tibbi geyim', 'Stetoskop', 'Toksikoloji analiz planşeti'],
    accentHex: '#DC2626',
    surfaceTint: '#FEF2F2',
    textbookPages: 'Dərslik səh. 24, 177',
    externalSource: 'ÜST (WHO) & Beynəlxalq Xərçəng Araşdırmaları (IARC)',
    prepBrief:
      'Etanolun qaraciyərdə asetaldehidə çevrilməsini, zülal denaturasiyasını və ÜST-ün qlobal ölüm statistikalarını elmi dəlil kimi təqdim edir.',
    keyFacts: [
      'Qaraciyərdə zəhərli asetaldehid (CH₃CHO) yaranır, beyin fəaliyyəti kəskin azalır',
      'ÜST (2024): Alkoqol dünyada ildə 2,6 milyon ölümə (bütün ölümlərin 4,7%-i) səbəb olur',
      'Etanol canlı hüceyrə zülallarını denaturasiya edir və 1-ci qrup kanserogen kimi tanınır',
    ],
    formulaSnippet: 'C₂H₅OH → CH₃CHO (zəhərli) → CH₃COOH',
  },
  {
    id: 'polis',
    title: 'Polis əməkdaşı',
    shortTitle: 'Polis əməkdaşı',
    group: 'iddia',
    groupLabel: 'İddiaçı',
    attireName: 'Rəsmi tünd göy polis mundiri, çiyin poqonları və xidməti furajka',
    attireItems: ['Göy xidməti mundir', 'Çiyin poqonları', 'Gümüşü döş nişanı', 'Rəsmi polis furajkası'],
    accentHex: '#DC2626',
    surfaceTint: '#FEF2F2',
    textbookPages: 'Dərslik səh. 28, 30',
    externalSource: 'ÜST (WHO) Zədələnmələr və Zorakılıq Statistikası',
    prepBrief:
      'Sərxoşluq zəminində törədilən hüquqpozmaları, texniki denaturat spirtin yaratdığı təhlükəni və qəza-zorakılıq statistikalarını təqdim edir.',
    keyFacts: [
      'ÜST: İllik 700 min ölüm məhz alkoqolun təhrik etdiyi qəza, xəsarət və zorakılıq hallarındandır',
      'Texniki spirtə daxilə qəbulun qarşısını almaq üçün pis iyli və boyaq maddələr (denaturat) qatılır',
      'Qanunsuz və nəzarətsiz spirt dövriyyəsi ictimai təhlükəsizliyə birbaşa təhdiddir',
    ],
  },
  {
    id: 'farmakoloq',
    title: 'Farmakoloq',
    shortTitle: 'Farmakoloq',
    group: 'vekil',
    groupLabel: 'Vəkil',
    attireName: 'Ağ əczaçı xalatı, zümrüdü yaxalıq, Rx nişanı və kəhrəba tinktura flakonu',
    attireItems: ['Ağ əczaçı xalatı', 'Zümrüdü yaxalıq', 'Rx tibbi nişanı', 'Kəhrəba rəngli damcı flakonu'],
    accentHex: '#059669',
    surfaceTint: '#ECFDF5',
    textbookPages: 'Dərslik səh. 25, 28, 36, 140',
    externalSource: 'ÜST Əsas Dərmanlar Siyahısı (WHO EML)',
    prepBrief:
      'Etanolun ÜST-ün Əsas Dərmanlar Siyahısındakı antiseptik statusunu, ürək dərmanları və tibbi efir istehsalındakı əvəzsiz rolunu müdafiə edir.',
    keyFacts: [
      'ÜST-ün Əsas Dərmanlar Siyahısında əvəzolunmaz antiseptik və dezinfeksiyaedicidir',
      '60–80%-li məhlulu bakteriyaları, göbələkləri və örtüklü virusları (koronavirus, qrip) məhv edir',
      '1%-li nitroqliserin spirt məhlulu (stenokardiya), yod cövhəri və tibbi efir ondan hazırlanır',
    ],
    formulaSnippet: '2C₂H₅OH → C₂H₅–O–C₂H₅ + H₂O (t < 140 °C)',
  },
  {
    id: 'etriyyatci',
    title: 'Ətriyyatçı',
    shortTitle: 'Ətriyyatçı',
    group: 'vekil',
    groupLabel: 'Vəkil',
    attireName: 'Gavalı rəngli parfümer atelye jileti, ipək şərf və büllur ətir şüşəsi',
    attireItems: ['Tünd gavalı rəngli atelye jileti', 'İpək boyun şərfi', 'Büllur ətir flakonu', 'Aromatik test zolağı'],
    accentHex: '#059669',
    surfaceTint: '#ECFDF5',
    textbookPages: 'Dərslik səh. 28',
    externalSource: 'Beynəlxalq Parfümeriya (IFRA) Standartları',
    prepBrief:
      'Etanolun rəngsiz, tez buxarlanan və efir yağlarını mükəmməl həll edən təhlükəsiz kosmetik həlledici kimi əvəzsizliyini sübut edir.',
    keyFacts: [
      'Suda həll olmayan təbii efir yağlarını və aromatik mürəkkəb efirləri tam həll edir',
      'Tez buxarlanma (t_qayn = 78 °C) sayəsində ətrin dəridə iz buraxmadan yayılmasını təmin edir',
      'Dünya ətriyyat və gigiyena sənayesində etanolun tam əvəzedicisi yoxdur',
    ],
  },
  {
    id: 'kimya_muhendisi',
    title: 'Kimya sənayesi mühəndisi',
    shortTitle: 'Kimya mühəndisi',
    group: 'vekil',
    groupLabel: 'Vəkil',
    attireName: 'Ağ mühəndis dəbilqəsi, qoruyucu eynək, texniki gödəkçə və çertyoj',
    attireItems: ['Ağ təhlükəsizlik dəbilqəsi', 'Qoruyucu laboratoriya eynəyi', 'Sənaye mühəndisi gödəkçəsi', 'Texnoloji sxem çertyoju'],
    accentHex: '#059669',
    surfaceTint: '#ECFDF5',
    textbookPages: 'Dərslik səh. 18, 25–28, 85, 87',
    externalSource: 'Qlobal Neft-Kimya və Polimer Sənayesi Məlumatları',
    prepBrief:
      'Etanolun sintetik kauçuk, sirkə turşusu, etilasetat, boya, lak, plastik kütlə və bio-polimer istehsalındakı strateji rolunu sübut edir.',
    keyFacts: [
      'Lebedev üsulu ilə divinil kauçuku (–CH₂–CH=CH–CH₂–)n istehsal edilir',
      'M.A. Dalin üsulu ilə etilenin hidratlaşmasından sənayedə milyonlarla ton etanol alınır',
      'Müasir yaşıl kimyada etanoldan bio-etilen alınaraq təkrar emal olunan plastiklər hazırlanır',
    ],
    formulaSnippet: '2C₂H₅OH → CH₂=CH–CH=CH₂ + 2H₂O + H₂',
  },
  {
    id: 'enerji_muhendisi',
    title: 'Alternativ enerji mənbələri üzrə mühəndis',
    shortTitle: 'Enerji mühəndisi',
    group: 'vekil',
    groupLabel: 'Vəkil',
    attireName: 'Yaşıl eko-texniki gödəkçə, reflektor zolaqlar və bioenerji planşeti',
    attireItems: ['Yaşıl-boz texniki gödəkçə', 'Eko-yanacaq nişanı', 'İşıqqaytarıcı zolaqlar', 'Bioenerji planşeti'],
    accentHex: '#059669',
    surfaceTint: '#ECFDF5',
    textbookPages: 'Dərslik səh. 17–19, 28',
    externalSource: 'IEA & Qlobal Bioyanacaq Hesabatları (E10 / E85)',
    prepBrief:
      'ABŞ, Braziliya və Aİ-də tətbiq olunan E10, E27.5 və E85 bioetanol yanacaqlarını, eləcə də 2-ci nəsil ağac/saman tullantısı spirtini təqdim edir.',
    keyFacts: [
      'ABŞ (qarğıdalı) və Braziliya (şəkər qamışı) qlobal bioetanol istehsalında liderdir',
      'E10 (10% etanol) və Braziliyada E27.5 / E85 qarışıqları karbon emissiyasını və oktanın keyfiyyətini yaxşılaşdırır',
      '1 ton oduncağın hidrolizindən 200 litr spirt (2G bioyanacaq) alınır və his yaratmadan yanır',
    ],
    formulaSnippet: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',
  },
  {
    id: 'kimyaci_sahid',
    title: 'Kimyaçılar (Şahid)',
    shortTitle: 'Kimyaçılar',
    group: 'sahid',
    groupLabel: 'Elmi Şahid',
    attireName: 'Düyməli ağ laboratoriya xalatı, qoruyucu eynək və reaktiv kolbası',
    attireItems: ['Ağ laboratoriya xalatı', 'Kimyəvi qoruyucu eynək', 'Erlenmeyer kolbası', 'Reaktiv pipeti'],
    accentHex: '#0284C7',
    surfaceTint: '#F0F9FF',
    textbookPages: 'Dərslik səh. 12–15, 22, 26–27',
    externalSource: 'IUPAC Fiziki-Kimyəvi Sabitlər Bazası',
    prepBrief:
      'Etanolun molekul quruluşunu, hidrogen rabitəsini (+78 °C), laboratoriya təhlükəsizliyində Na metalının neytrallaşdırılmasını və oksidləşməni təsdiqləyir.',
    keyFacts: [
      'Hidrogen rabitəsi səbəbindən qaynama temperaturu propan (-42 °C) və dimetil efirdən (-24 °C) yüksəkdir (+78 °C)',
      'Laboratoriyada təhlükəli metal natrium qalıqlarını etanolda həll edib zərərsizləşdirirlər',
      'Polyar O–H rabitəsi (108.6° bucaq) ona suda sonsuz qarışma qabiliyyəti verir',
    ],
    formulaSnippet: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑',
  },
  {
    id: 'hekim_sahid',
    title: 'Həkimlər (Şahid)',
    shortTitle: 'Həkimlər',
    group: 'sahid',
    groupLabel: 'Tibbi Şahid',
    attireName: 'Səma mavisi cərrahi forma, ağ həkim xalatı və tibbi diaqnostika lövhəsi',
    attireItems: ['Ağ həkim xalatı', 'Səma mavisi tibbi forma', 'Boyunda tibbi maska', 'Klinik diaqnostika qovluğu'],
    accentHex: '#0284C7',
    surfaceTint: '#F0F9FF',
    textbookPages: 'Dərslik səh. 24, 28, 177',
    externalSource: 'ÜST Infeksiyaya Nəzarət və Kliniki Protokollar',
    prepBrief:
      'Xaricə tətbiqdə patogenləri məhv edən etanolun daxilə qəbul edildikdə insanın öz hüceyrə zülallarını və immunitetini zədələməsini izah edir.',
    keyFacts: [
      'Xaricə istifadə: iynədən əvvəl dərinin sterilizasiyası və əl antiseptikləri (ÜST formulu)',
      'Daxilə qəbul: canlı zülalların strukturunu dağıdır və immun sistemini zəiflədir (300 min yoluxucu ölüm riski)',
      'Xüsusilə yeniyetmə beyni üçün heç bir “təhlükəsiz içki dozası” mövcud deyil',
    ],
  },
  {
    id: 'yol_polisi',
    title: 'Yol polisi əməkdaşı (DYP)',
    shortTitle: 'Yol polisi',
    group: 'sahid',
    groupLabel: 'Şahid',
    attireName: 'DYP forması, neon-sarı işıqqaytarıcı jilet, furajka və alkotester',
    attireItems: ['Neon-sarı işıqqaytarıcı jilet', 'DYP xidməti furajka', 'Rəqəmsal alkotester', 'Yol hərəkəti çubuğu'],
    accentHex: '#0284C7',
    surfaceTint: '#F0F9FF',
    textbookPages: 'Dərslik səh. 27 (Fəaliyyət-2)',
    externalSource: 'ÜST Yol Təhlükəsizliyi (SAFER) Məlumatları',
    prepBrief:
      'Sürücülərin nəfəsində etanolun K₂Cr₂O₇ reaksiyası ilə aşkarlanmasını və sərxoş sürücülüyün qlobal yol qəzalarındakı payını nümayiş etdirir.',
    keyFacts: [
      'ÜST: Dünyada yol-nəqliyyat xəsarətlərinin 27%-ə qədəri sərxoş sürücülüklə bağlıdır',
      'Qanda alkoqol 0,05 q/dl (0,5 ‰) həddini keçdikdə qəza riski eksponensial artır; yeni sürücülər üçün 0,00 ‰ tövsiyə olunur',
      'Narıncı K₂Cr₂O₇ + H₂SO₄ məhlulu etanol buxarı ilə yaşıl Cr³⁺ duzuna çevrilir; reydlər yol ölümlərini ~20% azaldır',
    ],
    formulaSnippet: 'K₂Cr₂O₇ (narıncı) + C₂H₅OH → Cr₂(SO₄)₃ (yaşıl) + CH₃COOH',
  },
];

export const TRIAL_TURNS: TrialTurn[] = [
  {
    id: 'turn-1',
    phaseIndex: 0,
    phaseTitle: '1. İclasın açılışı',
    roleId: 'hakim',
    headline: 'Məhkəmə iclası açıq elan edilir',
    speech: [
      'Hörmətli məhkəmə iştirakçıları! Bugünkü iclasımızda “İnsan orqanizminə vurduğu ziyana görə etanolun məsuliyyəti” işinə baxılır.',
      'Bir çox peşə sahibləri etanolun insan orqanizminə vurduğu ciddi ziyan və cəmiyyətə mənfi təsiri ilə bağlı onun üzvi birləşmələr aləmindən çıxarılması barədə məhkəmə iddiası qaldırmışlar.',
      'Vəkilləri isə etanolun cəmiyyət üçün böyük fayda verdiyini əsaslandırmağa çalışırlar. İştirakçılardan həm kimya dərsliyindəki faktlara, həm də beynəlxalq elmi mənbələrə söykənən dəlil və sübutlar təqdim etmələrini xahiş edirəm.',
    ],
    keyClaim: 'İşin predmeti: Etanol üzvi birləşmələr aləmindən çıxarılmalıdırmı, yoxsa düzgün istifadə şərtilə bəraət almalıdır?',
    textbookRef: 'Dərslik, 1.1.5 Praktik dərs (səh. 30)',
    externalEvidence: 'Məhkəmədə dərsliklə yanaşı ÜST (WHO 2024), IEA bioenerji və beynəlxalq toksikologiya məlumatları da dəlil kimi qəbul edilir.',
    externalSourceLabel: 'ÜST və Beynəlxalq Mənbələr',
    judgeQuestion: 'Tərəflər elmi faktlara, kimyəvi reaksiyalara və real dünya statistikalarına əsaslanmalıdırlar.',
    rebuttalEvidence: 'Məhkəmə protokolu təsdiqləndi. İlk söz iddiaçı tərəfə verilir.',
    scaleImpact: 0,
  },
  {
    id: 'turn-2',
    phaseIndex: 1,
    phaseTitle: '2. İddiaçıların çıxışı',
    roleId: 'asayis',
    headline: 'İctimai asayişə və gənclərin gələcəyinə vurulan sosial zərər',
    speech: [
      'Möhtərəm Hakim! Mən ictimai asayiş keşikçisi kimi spirtli içkilərin cəmiyyətdə yaratdığı ağır sosial fəsadların canlı şahidiyəm.',
      'Ümumdünya Səhiyyə Təşkilatının (ÜST) 2024-cü il hesabatına əsasən, hazırda dünyada təxminən 400 milyon insan alkoqoldan istifadə pozuntusundan əziyyət çəkir. Xüsusilə 20–39 yaşlı gənclər arasında bütün ölümlərin 13%-i məhz alkoqol amili ilə bağlıdır!',
      'Etanol asılılığı ailələri dağıdır, əmək qabiliyyətini məhv edir və sağlam həyat tərzinə ağır zərbə vurur. İctimai asayişi qorumaq üçün bu maddənin kütləvi dövriyyəsinə son qoyulmalıdır!',
    ],
    keyClaim: 'Spirtli içkilər dünyada 400 milyon insanda asılılıq yaradır və gənclər arasında ölümlərin 13%-nə səbəb olur.',
    textbookRef: 'Dərslik səh. 30 (Sağlam həyatın qorunması)',
    externalEvidence: 'ÜST (2024): 400 milyon nəfərdə alkoqol pozuntusu (209 milyonunda birbaşa asılılıq); 20–39 yaş qrupunda ölümlərin 13%-i alkoqolla bağlıdır.',
    externalSourceLabel: 'ÜST Qlobal Hesabatı (2024)',
    judgeQuestion: 'İddiaçı ciddi sosial statistikalar təqdim etdi. Bəs etanolun insan orqanizmində yaratdığı biokimyəvi zərər nədən ibarətdir?',
    rebuttalEvidence: 'Qlobal sosial statistika və ictimai nizam-intizam pozuntuları protokola “İddia dəlili” kimi daxil edildi.',
    scaleImpact: -1,
  },
  {
    id: 'turn-3',
    phaseIndex: 1,
    phaseTitle: '2. İddiaçıların çıxışı',
    roleId: 'toksikoloq',
    headline: 'Asetaldehid zəhərlənməsi, zülal denaturasiyası və qlobal ölüm statistikası',
    speech: [
      'Möhtərəm Hakim! Dərslikdəki biokimyəvi faktlara görə, etanol qaraciyərdə əvvəlcə çox zəhərli maddəyə — asetaldehidə (CH₃CHO) çevrilir. Çoxlu spirtli içki qəbul etdikdə orqanizm onu zərərsizləşdirə bilmir, baş beyin fəaliyyəti kəskin azalır və qaraciyər sirrozu yaranır.',
      'Eyni zamanda etanol canlı hüceyrə zülallarının ikincili və üçüncülü quruluşunu dağıdaraq onları denaturasiyaya uğradır.',
      'ÜST-ün son məlumatlarına görə, dünyada hər il 2,6 milyon insan (bütün ölümlərin 4,7%-i) alkoqol səbəbindən həyatını itirir; bunun 1,6 milyonu sirroz, ürək-damar və 1-ci qrup kanserogen kimi törətdiyi xərçəng xəstəlikləridir!',
    ],
    keyClaim: 'Asetaldehid (CH₃CHO) beyni və qaraciyəri dağıdır, zülalları denaturasiya edir; dünyada ildə 2,6 milyon ölümə səbəb olur.',
    chemicalFormula: 'C₂H₅OH  —[ADH]→  CH₃CHO (zəhərli)  —[ALDH]→  CH₃COOH',
    textbookRef: 'Dərslik səh. 24 (Alkoqolun təsiri) və səh. 177 (Denaturasiya)',
    externalEvidence: 'ÜST (2024): İldə 2,6 milyon ölüm (4,7%), o cümlədən 1,6 milyon xəstəlik (sirroz, xərçəng, ürək-damar) və 300 min immun zəifliyi ölümü.',
    externalSourceLabel: 'ÜST & IARC Tibbi Dəlil',
    judgeQuestion: 'Həkim-toksikoloq! Bu toksiki təsir istənilən şəraitdə baş verir, yoxsa yalnız daxilə qəbul zamanı?',
    rebuttalEvidence: 'Daxilə qəbul zamanı ADH fermenti toksiki asetaldehid toplayır və hüceyrə zülallarını çökdürür.',
    scaleImpact: -1,
    linkedLabTab: 'metabolism',
  },
  {
    id: 'turn-4',
    phaseIndex: 1,
    phaseTitle: '2. İddiaçıların çıxışı',
    roleId: 'polis',
    headline: 'Hüquqpozmalar, zorakılıq və texniki denaturat spirt təhlükəsi',
    speech: [
      'Möhtərəm Hakim! Polis əməkdaşı kimi bildirirəm ki, xuliqanlıq və məişət zorakılıqlarının böyük qismi məhz sərxoş vəziyyətdə törədilir. Beynəlxalq məlumatlara görə, illik 700 min ölüm hadisəsi alkoqolun təhrik etdiyi qəza, zədələnmə və zorakılıqların payına düşür.',
      'Bundan əlavə, sənaye üçün istehsal olunan texniki spirti insanların içməməsi üçün onun tərkibinə bilərəkdən pis iyli və boyaq maddələr qatılaraq “denaturat” hazırlanır.',
      'Qanunsuz spirt dövriyyəsi və sərxoş halda törədilən cinayətlər cəmiyyətin təhlükəsizliyi üçün birbaşa təhdiddir.',
    ],
    keyClaim: 'Alkoqol ildə 700 min zorakılıq və xəsarət ölümünə yol açır; texniki spirtin içilməsini önləmək üçün denaturatlaşdırma vacibdir.',
    textbookRef: 'Dərslik səh. 28 (Denaturat haqqında məlumat)',
    externalEvidence: 'ÜST Statistikası: İllik 2,6 milyon ölümün 700 mini qəza, düşmə, zorakılıq və özünəxəsarət hallarından qaynaqlanır.',
    externalSourceLabel: 'ÜST Təhlükəsizlik Statistikası',
    judgeQuestion: 'Denaturat qatqıları təsadüfi zəhərlənmələrin qarşısını almaq üçün xəbərdarlıq rolunu oynayır?',
    rebuttalEvidence: 'Bəli, cənab Hakim. Rəngli və pis iyli denaturat nişanlanması yalnız texniki istifadəni fərqləndirmək üçündür.',
    scaleImpact: -1,
  },
  {
    id: 'turn-5',
    phaseIndex: 2,
    phaseTitle: '3. Vəkillərin müdafiəsi',
    roleId: 'farmakoloq',
    headline: 'ÜST-ün Əsas Dərmanlar Siyahısında yer alan xilasedici antiseptik',
    speech: [
      'Möhtərəm Hakim! Etanolu üzvi birləşmələr aləmindən çıxarmaq təbabəti ən əsas qoruyucu silahından məhrum etməkdir! Etanol Ümumdünya Səhiyyə Təşkilatının (ÜST) “Əsas Dərmanlar Siyahısı”na rəsmi olaraq antiseptik və dezinfeksiyaedici kimi daxil edilib.',
      'Pandemiyalar dövründə 60–80%-li etanol məhlulu bakteriyaların, göbələklərin və örtüklü virusların (koronavirus, qrip) lipid qişasını parçalayaraq milyonlarla insanı yoluxmadan qorudu.',
      'Üstəlik, stenokardiya tutmalarında 1%-li nitroqliserin spirt məhlulu, revmatizmdə 1,25%-li qarışqa spirti, yod tinkturası və cərrahi “tibbi efir” (dietil efiri) məhz etanoldan hazırlanır!',
    ],
    keyClaim: 'Etanol ÜST-ün Əsas Dərmanlar Siyahısındadır; antiseptik, 1%-li nitroqliserin məhlulu, tinktura və tibbi efir ondan alınır.',
    chemicalFormula: '2C₂H₅OH  —[H₂SO₄, t < 140 °C]→  C₂H₅–O–C₂H₅ (tibbi efir) + H₂O',
    textbookRef: 'Dərslik səh. 25, 28, 36 (Tibbi efir) və səh. 140 (Nitroqliserin)',
    externalEvidence: 'WHO Model List of Essential Medicines: Farmakopeyada əsas antiseptik; əl dezinfektantlarının qlobal standart komponenti.',
    externalSourceLabel: 'ÜST Əsas Dərmanlar Siyahısı',
    judgeQuestion: 'Deməli, etanol xaricə və dərman tərkibində dəqiq dozada insan həyatını xilas edir?',
    rebuttalEvidence: 'Tamamilə doğrudur. Klinik gigiyenadan təcili ürək tutmalarının dayandırılmasına qədər müasir tibb etanola söykənir.',
    scaleImpact: 1,
    linkedLabTab: 'dehydration',
  },
  {
    id: 'turn-6',
    phaseIndex: 2,
    phaseTitle: '3. Vəkillərin müdafiəsi',
    roleId: 'etriyyatci',
    headline: 'Ətriyyat və kosmetika sənayesinin əvəzolunmaz həlledicisi',
    speech: [
      'Hörmətli Hakim! Parfümeriya sənayesi adından çıxış edərək bildirirəm ki, etanol rəngsiz, xoş və təmiz buxarlanma xüsusiyyətinə malik nadir həlledicidir.',
      'Təbii çiçək yağları və aromatik mürəkkəb efirlər suda həll olmur, lakin etanolda mükəmməl həll olur. Qaynama temperaturu +78 °C olduğu üçün dəriyə vurulduqda tez buxarlanır və ətrin saf şəkildə yayılmasını təmin edir.',
      'Beynəlxalq parfümeriya standartlarına əsasən, metanol zəhərli olduğu üçün qadağandır — dünya üzrə ətir, odekolon və gigiyenik losyonların 90%-dən çoxu məhz yüksək təmizlikli etanol əsasında hazırlanır.',
    ],
    keyClaim: 'Etanol uçucu və təmiz həlledici kimi bütün dünya ətriyyat və kosmetika sənayesinin əsas daşıyıcısıdır.',
    textbookRef: 'Dərslik səh. 21–22 (Fiziki xassələr) və səh. 28 (Ətriyyatda tətbiqi)',
    externalEvidence: 'Beynəlxalq parfümeriya (IFRA) təcrübəsində yüksək saflıqlı etanol ətir yağlarının təhlükəsiz əsas həlledicisi kimi istifadə olunur.',
    externalSourceLabel: 'Beynəlxalq Parfümeriya Təcrübəsi',
    judgeQuestion: 'Sizin sahədə etanolun əvəzedicisi varmı?',
    rebuttalEvidence: 'Metanol ölümcül zəhərdir, digər spirtlərin isə kəskin iyi var. Yalnız etanol təmiz və tez buxarlanan ətir daşıyıcısıdır.',
    scaleImpact: 1,
  },
  {
    id: 'turn-7',
    phaseIndex: 2,
    phaseTitle: '3. Vəkillərin müdafiəsi',
    roleId: 'kimya_muhendisi',
    headline: 'Sintetik kauçuk, plastik kütlə və yaşıl kimya sənayesinin dayağı',
    speech: [
      'Möhtərəm Hakim! Etanol kimya sənayesinin strateji xammalıdır. Ondan S.V. Lebedev üsulu ilə avtomobil şinləri üçün divinil kauçuku, M.A. Dalin üsulu ilə isə etilenin hidratlaşmasından milyonlarla ton sənaye etanolu alınır.',
      'Etanoldan sirkə turşusu, etilxlorid, meyvə ətirli etilasetat, boyalar, laklar, tüstüsüz barıt və müasir bio-plastiklər (bio-etilen əsasında) istehsal edilir.',
      'Kimya sənayesini etanolsuz təsəvvür etmək tibbi cihazlardan tutmuş nəqliyyat şinlərinə qədər bütün istehsalatı dayandırmaq deməkdir!',
    ],
    keyClaim: 'Sintetik kauçuk, sirkə turşusu, etilasetat, lak, boya və bio-polimerlərin sintezi etanola əsaslanır.',
    chemicalFormula: '2C₂H₅OH  —[Al₂O₃, ZnO, 450 °C]→  CH₂=CH–CH=CH₂ + 2H₂O + H₂↑',
    textbookRef: 'Dərslik səh. 18 (M.A. Dalin), səh. 25–28, səh. 85–87 (Divinil kauçuku)',
    externalEvidence: 'Müasir yaşıl kimyada bioetanoldan alınan bio-etilen neftdən asılılığı azaldan təkrar emal edilə bilən polimerlərin xammalıdır.',
    externalSourceLabel: 'Müasir Kimya Sənayesi',
    judgeQuestion: 'Bəs temperatur şəraitindən asılı olaraq etanoldan hansı iki fərqli sənaye məhsulu alınır?',
    rebuttalEvidence: 't < 140 °C olduqda tibbi efir (dietil efiri), t > 140 °C olduqda isə polimerlər üçün etilen (CH₂=CH₂) alınır.',
    scaleImpact: 1,
    linkedLabTab: 'dehydration',
  },
  {
    id: 'turn-8',
    phaseIndex: 2,
    phaseTitle: '3. Vəkillərin müdafiəsi',
    roleId: 'enerji_muhendisi',
    headline: 'Qlobal E10 / E85 bioetanol yanacağı və yaşıl enerji',
    speech: [
      'Hörmətli Hakim! Qazıntı yanacaqlarının azaldığı dövrdə etanol bərpa olunan yaşıl enerji mənbəyidir. ABŞ (qarğıdalıdan) və Braziliya (şəkər qamışından) dünyada bioetanol istehsalının liderləridir.',
      'Hazırda ABŞ, Böyük Britaniya və Aİ ölkələrində avtomobillərin əksəriyyəti E10 (10% etanol + 90% benzin), Braziliyada E27.5 və xüsusi mühərriklərdə E85 (85% etanol) yanacağı ilə işləyir. Üstəlik, 2-ci nəsil texnologiya ilə qida məhsullarına toxunmadan 1 ton ağac və saman tullantısından 200 litrə qədər bioetanol alınır!',
      'Etanol tam yanaraq yalnız CO₂ və H₂O verir, oktan ədədini artırır və zərərli kükürd qazları buraxmır!',
    ],
    keyClaim: 'E10/E85 bioetanol yanacaqları və 2G tullantı bioetanolu atmosferə atılan zərərli qazları və neft asılılığını azaldır.',
    chemicalFormula: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂↑   |   C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',
    textbookRef: 'Dərslik səh. 17–19 (Hidroliz spirti, bioetanol) və səh. 28',
    externalEvidence: 'Beynəlxalq Enerji Məlumatları: E10 qlobal standart benzin qarışığıdır; Braziliyada E27.5 məcburidir; E85 yüksək oktanlı təmiz yanacaqdır.',
    externalSourceLabel: 'Qlobal Bioenerji Məlumatları',
    judgeQuestion: 'Etanolun yanma istiliyi benzindən bir qədər az olsa da, niyə ona üstünlük verilir?',
    rebuttalEvidence: 'Etanol oktan ədədini yüksəldir, mühərrikin səmərəliliyini artırır, hissiz yanır və bərpa olunan bitki mənşəlidir.',
    scaleImpact: 1,
  },
  {
    id: 'turn-9',
    phaseIndex: 3,
    phaseTitle: '4. Şahid ifadələri',
    roleId: 'kimyaci_sahid',
    headline: 'Molekul quruluşu, hidrogen rabitəsi və laboratoriya faktları',
    speech: [
      'Möhtərəm Hakim! Biz kimyaçılar etanolun molekul quruluşu haqqında obyektiv faktları təqdim edirik. Etanolun nisbi molekul kütləsi 46-dır, lakin molekullararası hidrogen rabitəsi səbəbindən +78 °C-də qaynayır.',
      'Müqayisə üçün, eyni molekul kütləli dimetil efiri (-24 °C) və propan (-42 °C) qaz halındadır. Etanolun maye halda olması və suda sonsuz qarışması məhz polyar O–H qrupundakı (∠108,6°) hidrogen rabitəsinin nəticəsidir.',
      'Laboratoriyada təhlükəsizlik üçün artıq qalmış partlayış təhlükəli natrium metalını da məhz etanolda həll edib zərərsizləşdiririk: 2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑.',
    ],
    keyClaim: 'Hidrogen rabitəsi etanola +78 °C qaynama temperaturu və suda həllolma verir; laboratoriyada Na qalıqlarını neytrallaşdırır.',
    chemicalFormula: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑',
    textbookRef: 'Dərslik səh. 12–15 (Quruluş, H-rabitəsi) və səh. 22, 26',
    externalEvidence: 'IUPAC sabitləri: Etanolun qaynama nöqtəsi +78,37 °C, sıxlığı 0,789 q/sm³, su ilə istənilən nisbətdə qarışan azeotrop sistem yaradır.',
    externalSourceLabel: 'IUPAC Fiziki-Kimyəvi Bazası',
    judgeQuestion: 'Şahid! Bəs dimetil efiri ilə etanolun tərkibi eyni olduğu halda xassələri niyə belə fərqlidir?',
    rebuttalEvidence: 'Onlar siniflərarası izomerlərdir (C₂H₆O): etanolda –OH hidroksil qrupu olduğu üçün hidrogen rabitəsi yaranır, efirdə isə yaranmır.',
    scaleImpact: 0,
    linkedLabTab: 'structure',
  },
  {
    id: 'turn-10',
    phaseIndex: 3,
    phaseTitle: '4. Şahid ifadələri',
    roleId: 'hekim_sahid',
    headline: 'Tibbi həqiqət: Xarici şəfa və daxili zəhər arasındakı sərhəd',
    speech: [
      'Möhtərəm Hakim! Həkimlər olaraq hər iki tərəfin faktlarını obyektiv təsdiqləyirik. Etanol bizim klinikada hər gün istifadə etdiyimiz əsas antiseptikdir və milyonlarla əməliyyatı infeksiyadan qoruyur.',
      'Lakin dərinin səthində bakteriya zülallarını dağıdan həmin xüsusiyyət insan spirtli içki qəbul etdikdə onun öz hüceyrələrinə qarşı çevrilir. ÜST məlumatına görə, alkoqol immun sistemini zəiflədərək vərəm və digər infeksiyalardan ildə 300 min əlavə ölümə səbəb olur.',
      'Xüsusilə inkişafda olan yeniyetmə orqanizmi üçün alkoqol tamamilə qəbuledilməzdir!',
    ],
    keyClaim: 'Xarici tibbi istifadədə həyat xilas edən maddə daxilə qəbulda zülalları denaturasiya edir və immuniteti çökdürür.',
    textbookRef: 'Dərslik səh. 24 və səh. 177',
    externalEvidence: 'ÜST (2024): Alkoqol immun sistemini zəiflətməklə ildə 300 000 yoluxucu xəstəlik ölümünə şərait yaradır.',
    externalSourceLabel: 'ÜST Klinik Məlumatları',
    judgeQuestion: 'Deməli, əsas məsələ etanolun mövcudluğu deyil, onun istifadə məqsədi və dozasıdır?',
    rebuttalEvidence: 'Bəli, tibbi və texniki istifadə nəzarət altındadır; təhlükə spirtli içkilərin istehlakından doğur.',
    scaleImpact: 0,
    linkedLabTab: 'metabolism',
  },
  {
    id: 'turn-11',
    phaseIndex: 3,
    phaseTitle: '4. Şahid ifadələri',
    roleId: 'yol_polisi',
    headline: 'Kalium-bixromat testi (Fəaliyyət-2) və qlobal yol qəzası rəqəmləri',
    speech: [
      'Hörmətli Hakim! ÜST-ün yol təhlükəsizliyi məlumatlarına görə, dünyada baş verən bütün yol-nəqliyyat xəsarətlərinin 27%-ə qədəri sərxoş sürücülüklə bağlıdır! Qanda alkoqol səviyyəsi 0,05 q/dl (0,5 ‰) həddini aşdıqda ağır qəza riski eksponensial artır.',
      'Lakin kimya elmi bizə güclü nəzarət aləti verir: narıncı kalium-bixromat (K₂Cr₂O₇) və sulfat turşusu məhlulu sürücünün nəfəsindəki etanol buxarı ilə reaksiyaya girərək dərhal yaşıl rəngli Cr³⁺ duzuna çevrilir.',
      'ÜST sübut edib ki, müntəzəm alkotester reydləri və 0,05 q/dl (yeni sürücülər üçün 0,00 ‰) həddinin tətbiqi yollarda ölüm hallarını təxminən 20% azaldır!',
    ],
    keyClaim: 'Yol xəsarətlərinin 27%-i sərxoşluqdandır; narıncı K₂Cr₂O₇ → yaşıl Cr³⁺ reaksiyası və reydlər ölümləri 20% azaldır.',
    chemicalFormula: 'K₂Cr₂O₇ (narıncı) + H₂SO₄ + C₂H₅OH  →  Cr₂(SO₄)₃ (yaşıl) + CH₃COOH',
    textbookRef: 'Dərslik səh. 27 (Fəaliyyət-2: Alkoqolun aşkarlanması)',
    externalEvidence: 'ÜST SAFER Paketi: Yol xəsarətlərinin 27%-i alkoqol amilindəndir; limitin 0,05 q/dl-ə endirilməsi və nəfəs testləri ölümləri ~20% azaldır.',
    externalSourceLabel: 'ÜST SAFER Yol Təhlükəsizliyi',
    judgeQuestion: 'Reaksiya zamanı xromun oksidləşmə dərəcəsi necə dəyişir?',
    rebuttalEvidence: 'Cr⁺⁶ (narıncı bixromat) reduksiya olunaraq Cr⁺³ (yaşıl xrom(III) sulfat) ionuna çevrilir; etanol isə oksidləşir.',
    scaleImpact: -1,
    linkedLabTab: 'dichromate',
  },
  {
    id: 'turn-12',
    phaseIndex: 4,
    phaseTitle: '5. Cavabdehin son sözü',
    roleId: 'etanol',
    headline: 'Etanolun məhkəməyə son müraciəti',
    speech: [
      'Möhtərəm Hakim və hörmətli iştirakçılar! Mən — Etanol (C₂H₅OH) — bütün iddiaları və statistikaları diqqətlə dinlədim. Spirtli içki şəklində qəbul edildikdə insan orqanizminə və cəmiyyətə verdiyim ziyanları qətiyyən inkar etmirəm.',
      'Lakin mənim öz təbiətimdə pislik yoxdur! Mən ətriyyatda xoş ətir daşıyıcısıyam, təbabətdə ÜST-ün Əsas Dərmanlar Siyahısında yer alan antiseptik və ürək dərmanlarının həlledicisiyəm, kimya sənayesində kauçuk, sirkə turşusu, lak, boya və plastiklərin əsasıyam, nəqliyyatda isə E10/E85 bioyanacağam.',
      'Məni üzvi birləşmələr aləmindən çıxarmayın — məndən yalnız düzgün, elmi və faydalı məqsədlərlə istifadə olunması barədə ədalətli qərar çıxarmağınızı xahiş edirəm!',
    ],
    keyClaim: 'Etanol ətriyyat, təbabət, kimya sənayesi və bioenerji sahələrindəki xidmətlərinə görə düzgün istifadə şərtilə bəraət istəyir.',
    chemicalFormula: 'C₂H₅OH — Tibb · Ətriyyat · Kimya Sənayesi · Bioenerji',
    textbookRef: 'Dərslik səh. 28–30',
    externalEvidence: 'ÜST Əsas Dərmanlar Siyahısı, Qlobal Bioyanacaq (E10/E85) və Yaşıl Kimya sənayesi etanoldan imtina edilməsinin mümkün olmadığını təsdiqləyir.',
    externalSourceLabel: 'ÜST & Qlobal Sənaye İcmalı',
    judgeQuestion: 'Etanolun son sözü dinlənildi. İndi məhkəmə müşavirəyə çəkilir və yekun qərarı formalaşdırır.',
    rebuttalEvidence: 'Müdafiə və ittiham dəlilləri məhkəmə tərəzisində qarşılaşdırıldı.',
    scaleImpact: 1,
  },
  {
    id: 'turn-13',
    phaseIndex: 5,
    phaseTitle: '6. Hökm və Qərar',
    roleId: 'hakim',
    headline: 'Kimyaçı-alimin yekun məhkəmə qərarı',
    speech: [
      'Məhkəmə bütün iddiaçıların şikayətlərini, vəkillərin müdafiə arqumentlərini, şahidlərin elmi faktlarını, beynəlxalq ÜST/IEA məlumatlarını və Cavabdeh Etanolun son sözünü ətraflı araşdırdı.',
      'Aşağıdakı sağ paneldə məhkəmənin yekun hökm variantını seçin, sağlam həyat tərzini qoruyan icra şərtlərini təsdiqləyin və çəkic zərbəsi ilə qərarı elan edin!',
    ],
    keyClaim: 'Elmi dəlillər əsasında ədalətli hökm çıxarılır: spirtli içki sui-istifadəsinə qarşı sərt qadağa, faydalı elmi-sənaye etanoluna bəraət!',
    textbookRef: 'Dərslik səh. 30 (Yekun qərar və fərdi yaradıcılığın qiymətləndirilməsi)',
    externalEvidence: 'ÜST SAFER siyasəti və sağlam həyat tələbləri elmi-sənaye istifadəsinin qorunmasını, zərərli içki istifadəsinin isə məhdudlaşdırılmasını tövsiyə edir.',
    externalSourceLabel: 'ÜST SAFER & Elmi Nəticə',
    judgeQuestion: 'Məhkəmə hökmü sağ tərəfdəki Hökm Panelindən təsdiqlənir.',
    rebuttalEvidence: 'Hökm qüvvəyə mindikdən sonra iştirakçıların fərdi yaradıcılığı qiymətləndirilə bilər.',
    scaleImpact: 0,
  },
];

export const VERDICT_OPTIONS: VerdictOption[] = [
  {
    id: 'balanced-verdict',
    title: 'Şərti Bəraət və Ciddi Nəzarət (Elmi-Ədalətli Hökm)',
    summary:
      'Etanol üzvi birləşmələr aləmində saxlanılsın; tibb (ÜST əsas antiseptik), ətriyyat, kimya sənayesi və E10/E85 bioenerji sahələrində azad istifadəsinə icazə verilsin. Spirtli içkilərdən sui-istifadə və yeniyetmələrə satışı isə qəti pislənsin və məhdudlaşdırılsın.',
    isBalancedScientific: true,
  },
  {
    id: 'ban-ethanol',
    title: 'Tam Qadağa (Üzvi birləşmələrdən çıxarılsın)',
    summary:
      'Etanol tamamilə qadağan edilsin. (Diqqət: Bu halda təbabətdə antiseptik, 1%-li nitroqliserin məhlulu, ətriyyat, sintetik kauçuk və bioyanacaq istehsalı dayanacaq!)',
    isBalancedScientific: false,
  },
  {
    id: 'unrestricted',
    title: 'Nəzarətsiz Sərbəstlik',
    summary:
      'Etanolun bütün sahələrdə məhdudiyyətsiz istifadəsinə icazə verilsin. (Diqqət: Bu halda illik 2,6 milyon ölüm, yol qəzaları və yeniyetmə sağlamlığına təhlükə nəzarətsiz qalacaq!)',
    isBalancedScientific: false,
  },
];

export const VERDICT_CLAUSES: VerdictClause[] = [
  {
    id: 'clause-health',
    label: 'Sağlam həyat maarifləndirməsi',
    detail: 'Məktəblərdə spirtli içkilərin zərəri (asetaldehid toksikliyi, zülal denaturasiyası və ÜST statistikaları) barədə daimi maarifləndirmə aparılsın.',
  },
  {
    id: 'clause-denaturat',
    label: 'Texniki spirtin denaturatlaşdırılması',
    detail: 'Sənaye və texniki etanolun üzərinə xüsusi xəbərdarlıq nişanı və rəng-qoxu qatqısı vurulması məcburi saxlanılsın.',
  },
  {
    id: 'clause-traffic',
    label: 'Yol nəzarəti (≤ 0,05 q/dl və alkotester)',
    detail: 'Sürücülər arasında K₂Cr₂O₇ əsaslı alkotester yoxlaması gücləndirilsin, gənc və peşəkar sürücülər üçün 0,00 ‰ qaydası tətbiq edilsin.',
  },
  {
    id: 'clause-industry',
    label: 'Yaşıl bioenerji və tibbi prioritet',
    detail: 'Etanol istehsalı əsasən tibbi antiseptika, əczaçılıq, sintetik kauçuk və E10/E85 ekoloji bioyanacaq məqsədlərinə yönəldilsin.',
  },
];

export const RUBRIC_CRITERIA = [
  { id: 'science', label: 'Elmi dəlillər (dərslik + xarici mənbələr)', max: 5 },
  { id: 'attire', label: 'Rol və geyimə uyğun təqdimat', max: 5 },
  { id: 'speech', label: 'Nitq mədəniyyəti və inandırıcılıq', max: 5 },
  { id: 'creativity', label: 'Fərdi yaradıcılıq və suallara cavab', max: 5 },
] as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Etanol insan orqanizminə daxil olduqda qaraciyərdə ilkin olaraq hansı zəhərli maddəyə çevrilir?',
    options: [
      'Asetaldehid (CH₃CHO)',
      'Dimetil efiri (CH₃–O–CH₃)',
      'Natrium etilat (C₂H₅ONa)',
      'Etilen (CH₂=CH₂)',
    ],
    correctIndex: 0,
    explanation:
      'Qaraciyərdə etanol əvvəlcə zəhərli asetaldehidə (CH₃CHO) oksidləşir. Çox içdikdə orqanizm onu zərərsizləşdirə bilmir və baş beyin fəaliyyəti kəskin azalır.',
    textbookRef: 'Dərslik səh. 24',
  },
  {
    id: 'q2',
    question: 'Yol polisi alkotesterlərində etanol buxarının aşkarlanması zamanı narıncı K₂Cr₂O₇ məhlulu hansı rəngə çevrilir?',
    options: ['Qırmızı', 'Yaşıl', 'Mavi', 'Rəngsiz'],
    correctIndex: 1,
    explanation:
      'Sulfat turşulu mühitdə narıncı kalium-bixromat (Cr⁺⁶) etanolu oksidləşdirərkən özü yaşıl rəngli xrom(III) sulfata (Cr⁺³) reduksiya olunur.',
    textbookRef: 'Dərslik səh. 27 (Fəaliyyət-2)',
  },
  {
    id: 'q3',
    question: 'ÜST-ün (2024) Qlobal Hesabatına görə dünyada alkoqol istehlakı ilə bağlı ölümlərin illik sayı təxminən nə qədərdir?',
    options: ['250 min', '800 min', '2,6 milyon', '12 milyon'],
    correctIndex: 2,
    explanation:
      'ÜST-ün 2024-cü il hesabatına əsasən, alkoqol dünyada ildə 2,6 milyon ölümə (bütün qlobal ölümlərin təxminən 4,7%-nə) səbəb olur.',
    textbookRef: 'ÜST Qlobal Hesabatı (2024)',
  },
  {
    id: 'q4',
    question: 'Nisbi molekul kütləsi demək olar ki, eyni olan propandan (-42 °C) fərqli olaraq etanolun +78 °C-də qaynamasının səbəbi nədir?',
    options: [
      'Metal rabitəsi',
      'İon rabitəsi',
      'Molekullararası hidrogen rabitəsi',
      'Qeyri-polyar kovalent rabitə',
    ],
    correctIndex: 2,
    explanation:
      'Etanolun –OH qrupundakı polyar O–H rabitəsi molekullar arasında güclü hidrogen rabitələri yaradır və qaynama temperaturunu kəskin yüksəldir.',
    textbookRef: 'Dərslik səh. 14–15, 22',
  },
  {
    id: 'q5',
    question: 'Avtomobil nəqliyyatında geniş istifadə olunan “E10” bioyanacağı nə deməkdir?',
    options: [
      '10% etanol və 90% benzin qarışığı',
      '100% saf etanol',
      '10% su və 90% etanol',
      '10% dizel və 90% metanol',
    ],
    correctIndex: 0,
    explanation:
      'E10 yanacağı 10% bioetanol və 90% benzin qarışığıdır; oktan ədədini artırır və zərərli emissiyaları azaltmağa kömək edir.',
    textbookRef: 'Qlobal Bioenerji Standartları',
  },
  {
    id: 'q6',
    question: 'Etanolun sulfat turşusu iştirakı ilə 140 °C-dən aşağı temperaturda molekullanarası dehidratlaşmasından nə alınır?',
    options: [
      'Divinil kauçuku',
      'Dietil efiri (“tibbi efir”)',
      'Sirkə turşusu',
      'Etilxlorid',
    ],
    correctIndex: 1,
    explanation:
      't < 140 °C şəraitində 2 mol etanoldan 1 mol su ayrılaraq tibdə narkoz kimi istifadə olunan dietil efiri (C₂H₅–O–C₂H₅) alınır.',
    textbookRef: 'Dərslik səh. 25, 36',
  },
];
