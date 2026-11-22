import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  Film,
  FlaskConical,
  Gavel,
  Scale,
  Users,
} from 'lucide-react';
import {
  PARTICIPANTS,
  RUBRIC_CRITERIA,
  RoleId,
  TRIAL_TURNS,
} from './data/trialData';
import { CourtroomStage } from './components/CourtroomStage';
import { RolesGallery } from './components/RolesGallery';
import { ChemistryLab, LabTabId } from './components/ChemistryLab';
import { AssessmentView, RubricScores } from './components/AssessmentView';
import { VideoPresentation } from './components/VideoPresentation';

type MainView = 'courtroom' | 'video' | 'roles' | 'lab' | 'assessment';

const SAMPLE_STUDENTS = [
  'Əli Məmmədov',
  'Leyla Həsənova',
  'Murad Əliyev',
  'Nigar Quliyeva',
  'Tural Rzayev',
  'Aysel Kərimova',
  'Fərid Hüseynov',
  'Zəhra Babayeva',
  'Kamran İsmayılov',
  'Səbinə Nəsirova',
  'Rəşad Vəliyev',
  'Günay Abbasova',
];

function createInitialScores(): RubricScores {
  const initial = {} as RubricScores;
  for (const p of PARTICIPANTS) {
    initial[p.id] = {
      science: 4,
      attire: 4,
      speech: 4,
      creativity: 4,
    };
  }
  return initial;
}

function createEmptyNames(): Record<RoleId, string> {
  const names = {} as Record<RoleId, string>;
  for (const p of PARTICIPANTS) {
    names[p.id] = '';
  }
  return names;
}

const NAV_ITEMS: { id: MainView; label: string; icon: typeof Gavel }[] = [
  { id: 'courtroom', label: 'Məhkəmə İclası', icon: Gavel },
  { id: 'video', label: 'Video Material', icon: Film },
  { id: 'roles', label: 'İştirakçılar və Geyimlər', icon: Users },
  { id: 'lab', label: 'Kimyəvi Laboratoriya', icon: FlaskConical },
  { id: 'assessment', label: 'Qiymətləndirmə', icon: Award },
];

export default function App() {
  const [activeView, setActiveView] = useState<MainView>('courtroom');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [labTab, setLabTab] = useState<LabTabId>('dichromate');
  const [studentNames, setStudentNames] = useState<Record<RoleId, string>>(createEmptyNames);
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});
  const [selectedVerdictId, setSelectedVerdictId] = useState('balanced-verdict');
  const [selectedClauses, setSelectedClauses] = useState<string[]>([
    'clause-health',
    'clause-denaturat',
    'clause-traffic',
    'clause-industry',
  ]);
  const [verdictSealed, setVerdictSealed] = useState(false);
  const [rubricScores, setRubricScores] = useState<RubricScores>(createInitialScores);

  const handleAssignSampleNames = () => {
    const shuffled = [...SAMPLE_STUDENTS].sort(() => Math.random() - 0.5);
    const updated = {} as Record<RoleId, string>;
    PARTICIPANTS.forEach((p, idx) => {
      updated[p.id] = shuffled[idx % shuffled.length];
    });
    setStudentNames(updated);
  };

  const handleToggleClause = (id: string) => {
    setSelectedClauses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdateScore = (
    roleId: RoleId,
    criterionId: (typeof RUBRIC_CRITERIA)[number]['id'],
    score: number
  ) => {
    setRubricScores((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [criterionId]: score,
      },
    }));
  };

  const handlePrimaryCta = () => {
    if (activeView !== 'courtroom') {
      setActiveView('courtroom');
      return;
    }
    if (currentTurnIndex < TRIAL_TURNS.length - 1) {
      setCurrentTurnIndex((i) => i + 1);
    } else {
      setActiveView('assessment');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-slate-900">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveView('courtroom')}
            className="flex items-center gap-3 text-left shrink-0 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: [-6, 6, 0] }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0"
            >
              <Scale className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="block font-display text-base sm:text-lg font-bold text-slate-900 leading-none whitespace-nowrap">
                Etanolun Məhkəməsi
              </span>
              <span className="hidden sm:block mt-1 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                Sağlam həyat · 11-ci sinif Kimya
              </span>
            </div>
          </button>

          {/* Zone 2: 4 Single-line Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Əsas bölmələr">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-full"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              {activeView !== 'courtroom'
                ? 'Məhkəməyə qayıt'
                : currentTurnIndex === 0
                  ? 'İclası başlat'
                  : currentTurnIndex < TRIAL_TURNS.length - 1
                    ? 'Növbəti çıxış'
                    : 'Qiymətləndirmə'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden border-t border-slate-100 px-3 py-2 flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'courtroom' && (
              <CourtroomStage
                currentTurnIndex={currentTurnIndex}
                onChangeTurn={setCurrentTurnIndex}
                studentNames={studentNames}
                customNotes={customNotes}
                onSaveCustomNote={(turnId, note) =>
                  setCustomNotes((prev) => ({ ...prev, [turnId]: note }))
                }
                selectedVerdictId={selectedVerdictId}
                onSelectVerdict={setSelectedVerdictId}
                selectedClauses={selectedClauses}
                onToggleClause={handleToggleClause}
                verdictSealed={verdictSealed}
                onSealVerdict={setVerdictSealed}
                onOpenLabTab={(tab) => {
                  setLabTab(tab);
                  setActiveView('lab');
                }}
                onGoToAssessment={() => setActiveView('assessment')}
              />
            )}

            {activeView === 'video' && (
              <VideoPresentation
                studentNames={studentNames}
                selectedVerdictId={selectedVerdictId}
              />
            )}

            {activeView === 'roles' && (
              <RolesGallery
                studentNames={studentNames}
                onUpdateStudentName={(roleId, name) =>
                  setStudentNames((prev) => ({ ...prev, [roleId]: name }))
                }
                onAssignSampleNames={handleAssignSampleNames}
                onJumpToRoleSpeech={(turnIndex) => {
                  setCurrentTurnIndex(turnIndex);
                  setActiveView('courtroom');
                }}
              />
            )}

            {activeView === 'lab' && (
              <ChemistryLab activeTab={labTab} onChangeTab={setLabTab} />
            )}

            {activeView === 'assessment' && (
              <AssessmentView
                studentNames={studentNames}
                rubricScores={rubricScores}
                onUpdateScore={handleUpdateScore}
                onResetScores={() => setRubricScores(createInitialScores())}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
