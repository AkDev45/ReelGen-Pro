
import { useState, useRef, useEffect } from 'react';
import VideoUploader from './components/VideoUploader';
import ResultsGrid from './components/ResultsGrid';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import LearningsPage from './components/LearningsPage';
import PricingPage from './components/PricingPage';
import SaveProjectModal from './components/SaveProjectModal';
import GoalSelectionModal from './components/GoalSelectionModal';
import { VideoState, AIAnalysisResult, User, ProjectItem, ContentGoal } from './types';
import { 
  analyzeVideoContent, 
  analyzeScriptContent, 
} from './services/geminiService';
import { authService } from './services/authService';
import { projectService } from './services/projectService';
import { fileToBase64 } from './utils/videoHelpers';

type AppView = 'landing' | 'auth' | 'welcome' | 'app' | 'learnings' | 'pricing';

function App() {
  // User State
  const [user, setUser] = useState<User | null>(null);

  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  
  // Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Input State - DEFAULT TO SCRIPT
  const [inputType, setInputType] = useState<'video' | 'script'>('script');
  
  // Video Input State
  const [videoState, setVideoState] = useState<VideoState>({
    file: null,
    url: null,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Script Input State
  const [scriptText, setScriptText] = useState('');
  
  // App Mode State - Always 'analyze' now
  const [mode, setMode] = useState<'analyze' | 'remix'>('analyze');
  
  // Results State
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult | null>(null);
  
  // Project State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [defaultProjectTitle, setDefaultProjectTitle] = useState('');

  // Goal Selection State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Restricted Mode State for UI
  const [isRestrictedResult, setIsRestrictedResult] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setProjects(projectService.getProjects(currentUser.id));
    }
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setProjects(projectService.getProjects(loggedInUser.id));
    setCurrentView('welcome');
    // After 2 seconds, transition to App
    setTimeout(() => {
      setCurrentView('app');
      setInputType('script'); // Explicitly ensure script mode
    }, 2000);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setProjects([]);
    setCurrentView('landing');
  };

  const handlePlanUpdate = async (newPlan: 'Free' | 'Pro') => {
    if (!user) return;
    try {
      const updatedUser = await authService.updateUserPlan(user.id, newPlan);
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update plan", err);
    }
  };

  const handleFileSelect = (file: File) => {
    if (videoState.url) URL.revokeObjectURL(videoState.url);
    setVideoState({
      file,
      url: URL.createObjectURL(file),
    });
    setAnalysisResults(null);
    setError(null);
  };

  // STEP 1: INITIATE PROCESS -> CHECKS LIMITS & OPENS MODAL
  const handleInitiateProcess = () => {
    if (!user) return;

    // --- USAGE & LIMIT LOGIC ---
    const usage = user.analysisUsage || 0;
    const isFree = user.plan === 'Free';
    const limit = isFree ? 3 : 15;

    // Hard Stop Logic
    if (usage >= limit) {
      setError(
        isFree 
          ? "You’ve used all 3 free analyses. Surface signals won’t grow your account. Upgrade to Golden Pro to continue." 
          : "You've reached your monthly Pro limit."
      );
      return;
    }

    // Determine Restricted Mode (Free plans, usage 1 or 2)
    // Usage 0 = Golden Experience (Not restricted)
    // Usage 1, 2 = Restricted
    const willBeRestricted = isFree && usage > 0;
    setIsRestrictedResult(willBeRestricted);

    // Always open goal modal for analysis
    setIsGoalModalOpen(true);
  };

  // STEP 2: EXECUTE ANALYSIS AFTER GOAL SELECTION
  const executeAnalysis = async (selectedGoal: ContentGoal | null) => {
    if (!user) return;
    
    setIsGoalModalOpen(false);
    setIsProcessing(true);
    setError(null);

    try {
      if (inputType === 'video') {
        if (!videoState.file) return;
        
        const base64Video = await fileToBase64(videoState.file);
        
        // Pass the selected goal to the analysis
        const result = await analyzeVideoContent(base64Video, videoState.file.type, selectedGoal || 'growth');
        setAnalysisResults(result);

      } else {
        // Script Input Mode
        if (!scriptText.trim()) return;

         // Pass the selected goal to the analysis
        const result = await analyzeScriptContent(scriptText, selectedGoal || 'growth');
        setAnalysisResults(result);
      }
      
      // Increment Usage upon success
      try {
        const updatedUser = await authService.incrementUsage(user.id, 'analysis');
        setUser(updatedUser);
      } catch (e) {
        console.error("Failed to update usage count", e);
      }

      // Auto-scroll to results
      setTimeout(() => {
        document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (err) {
      console.error(err);
      setError(`Failed to process content. ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenSaveModal = () => {
    if (!user || (!analysisResults)) return;

    const savedCount = projects.length;
    const isFree = user.plan === 'Free';

    // Rule: Free max 1, Pro max 15
    if (isFree && savedCount >= 1) {
      setError("Free plan allows saving 1 project only. Golden Pro lets you save and revisit 15. Upgrade to Golden Pro.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!isFree && savedCount >= 15) {
      setError("You have reached the maximum of 15 saved projects for Pro.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Generate Default Name
    let title = "Untitled Project";
    if (analysisResults) {
      title = analysisResults.script.slice(0, 30).replace(/\n/g, ' ') + (analysisResults.script.length > 30 ? "..." : "");
    }
    
    setDefaultProjectTitle(title);
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async (title: string) => {
    if (!user) return;
    
    let score = 0;
    if (analysisResults) {
      score = analysisResults.viralScore;
    }

    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: title,
      date: new Date().toLocaleDateString(),
      type: inputType, 
      score: score,
      mode: 'analyze',
      analysisData: analysisResults || undefined,
      scriptContent: scriptText,
      goal: analysisResults?.goal // Save the goal context
    };

    projectService.saveProject(user.id, newProject);
    
    // Increment Usage Stats
    try {
      const updatedUser = await authService.incrementUsage(user.id, 'project');
      setUser(updatedUser);
    } catch (e) {
      console.error(e);
    }

    // Refresh projects list
    setProjects(projectService.getProjects(user.id));
    
    setIsSaveModalOpen(false);
  };

  const handleLoadProject = (project: ProjectItem) => {
    setCurrentView('app');
    setMode('analyze');
    setInputType(project.type);
    if (project.scriptContent) setScriptText(project.scriptContent);
    
    // Reset current results first to trigger animation
    setAnalysisResults(null);
    
    // Delay slightly for smooth transition
    setTimeout(() => {
      if (project.analysisData) {
        setAnalysisResults(project.analysisData);
      }
      
      // Auto-scroll to results
      setTimeout(() => {
         document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }, 100);

    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }
  };

  // --- RENDER LOGIC ---

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onStart={() => {
          // If user is already logged in, skip auth
          if (user) {
            setCurrentView('app');
          } else {
            setCurrentView('auth');
          }
        }} 
      />
    );
  }

  if (currentView === 'auth') {
    return <AuthPage onLoginSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
         <div className="space-y-6">
            <h1 className="text-5xl font-black text-white tracking-tight animate-in slide-in-from-bottom-4 duration-700">
              Welcome, {user?.username}.
            </h1>
            <p className="text-xl text-slate-400 font-light animate-in slide-in-from-bottom-4 duration-700 delay-200">
              Let’s optimize your scripts for maximum virality.
            </p>
            <div className="flex justify-center mt-8">
               <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative flex">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar */}
      <Sidebar 
         user={user}
         projects={projects}
         currentView={currentView} 
         onChangeView={setCurrentView} 
         onLoadProject={handleLoadProject}
         isCollapsed={isSidebarCollapsed}
         toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
         onLogout={handleLogout}
      />

      {/* Main Studio Area */}
      <main className={`flex-1 min-h-screen transition-all duration-300 relative z-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* Top Header (App View) */}
        <header className="sticky top-0 z-30 backdrop-blur-md border-b border-white/5 bg-[#050505]/80 px-8 h-20 flex items-center justify-between">
           <h1 className="text-xl font-bold text-white tracking-tight">
             {currentView === 'learnings' ? 'Learning Center' : 
              currentView === 'pricing' ? 'Account & Billing' :
              'Neural Studio'}
           </h1>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    Neural Core Online
                  </span>
             </div>
             <button 
                onClick={() => setCurrentView('landing')}
                className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group"
              >
                <span>Home</span>
              </button>
           </div>
        </header>

        {currentView === 'learnings' && (
          <LearningsPage />
        )}

        {currentView === 'pricing' && user && (
          <PricingPage user={user} onPlanChange={handlePlanUpdate} />
        )}

        {currentView === 'app' && (
          <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700">
            
            {/* Header Area */}
            <div className="mb-8 space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Workbench</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter leading-tight">
                  Script & Strategy <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Analysis Lab</span>
               </h2>
               <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
                 Turn static text into dynamic growth systems. Paste your draft below to unlock deep viral optimization and retention hooks.
               </p>
            </div>

            <VideoUploader 
              user={user}
              videoState={videoState}
              onFileSelect={handleFileSelect}
              onProcess={handleInitiateProcess} // Changed to open Modal first
              isProcessing={isProcessing}
              mode={mode}
              setMode={setMode}
              videoRef={videoRef}
              inputType={inputType}
              setInputType={setInputType}
              scriptText={scriptText}
              setScriptText={setScriptText}
              autoFocusScript={true}
            />

            {error && (
              <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-300 text-center animate-pulse flex flex-col items-center justify-center gap-4">
                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="space-y-2">
                  <p className="font-bold text-lg">System Interference Detected</p>
                  <p className="text-sm opacity-90 max-w-md mx-auto">{error}</p>
                </div>
                {error.includes("Upgrade") && (
                   <button 
                     onClick={() => setCurrentView('pricing')}
                     className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm hover:scale-105 transition-transform"
                   >
                      Upgrade to Golden Pro
                   </button>
                )}
              </div>
            )}

            <div id="results-area" className="scroll-mt-32 pb-32">
              {mode === 'analyze' && analysisResults && (
                <ResultsGrid 
                  results={analysisResults} 
                  isRestrictedMode={isRestrictedResult} 
                  onUpgradeClick={() => setCurrentView('pricing')}
                  onSave={handleOpenSaveModal}
                />
              )}
            </div>

          </div>
        )}
        
        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] ml-0">
          <p>© {new Date().getFullYear()} ReelGen Pro • Neural Content Optimization Engine</p>
        </footer>

      </main>

      {/* Modals */}
      <SaveProjectModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        onSave={handleConfirmSave} 
        defaultTitle={defaultProjectTitle}
      />
      
      <GoalSelectionModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSelect={executeAnalysis}
      />

    </div>
  );
}

export default App;
