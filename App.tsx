
import { useState, useRef, useEffect } from 'react';
import VideoUploader from './components/VideoUploader';
import ResultsGrid from './components/ResultsGrid';
import ScriptRemixResults from './components/ScriptRemixResults';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import LearningsPage from './components/LearningsPage';
import { VideoState, AIAnalysisResult, ScriptRemixResult, User } from './types';
import { 
  analyzeVideoContent, 
  remixVideoScript, 
  analyzeScriptContent, 
  remixScriptContent 
} from './services/geminiService';
import { authService } from './services/authService';
import { fileToBase64 } from './utils/videoHelpers';

type AppView = 'landing' | 'auth' | 'welcome' | 'app' | 'learnings';

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
  
  // App Mode State
  const [mode, setMode] = useState<'analyze' | 'remix'>('analyze');
  
  // Results State
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult | null>(null);
  const [remixResults, setRemixResults] = useState<ScriptRemixResult | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // If we are on landing page but logged in, allow them to stay or go to app
      // For now, we just restore the user state.
    }
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
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
    setCurrentView('landing');
  };

  const handleFileSelect = (file: File) => {
    if (videoState.url) URL.revokeObjectURL(videoState.url);
    setVideoState({
      file,
      url: URL.createObjectURL(file),
    });
    setAnalysisResults(null);
    setRemixResults(null);
    setError(null);
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (inputType === 'video') {
        if (!videoState.file) return;
        
        const base64Video = await fileToBase64(videoState.file);
        
        if (mode === 'analyze') {
          const result = await analyzeVideoContent(base64Video, videoState.file.type);
          setAnalysisResults(result);
          setRemixResults(null);
        } else {
          const result = await remixVideoScript(base64Video, videoState.file.type);
          setRemixResults(result);
          setAnalysisResults(null);
        }

      } else {
        // Script Input Mode
        if (!scriptText.trim()) return;

        if (mode === 'analyze') {
          const result = await analyzeScriptContent(scriptText);
          setAnalysisResults(result);
          setRemixResults(null);
        } else {
          const result = await remixScriptContent(scriptText);
          setRemixResults(result);
          setAnalysisResults(null);
        }
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
         currentView={currentView} 
         onChangeView={setCurrentView} 
         isCollapsed={isSidebarCollapsed}
         toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
         onLogout={handleLogout}
      />

      {/* Main Studio Area */}
      <main className={`flex-1 min-h-screen transition-all duration-300 relative z-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        
        {/* Top Header (App View) */}
        <header className="sticky top-0 z-30 backdrop-blur-md border-b border-white/5 bg-[#050505]/80 px-8 h-20 flex items-center justify-between">
           <h1 className="text-xl font-bold text-white tracking-tight">
             {currentView === 'learnings' ? 'Learning Center' : 'Neural Studio'}
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

        {currentView === 'learnings' ? (
          <LearningsPage />
        ) : (
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
              videoState={videoState}
              onFileSelect={handleFileSelect}
              onProcess={handleProcess}
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
              <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-300 text-center animate-pulse flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-bold">System Interference Detected</p>
                <p className="text-sm opacity-70">{error}</p>
              </div>
            )}

            <div id="results-area" className="scroll-mt-32 pb-32">
              {mode === 'analyze' && analysisResults && (
                <ResultsGrid results={analysisResults} />
              )}
              
              {mode === 'remix' && remixResults && (
                <ScriptRemixResults results={remixResults} />
              )}
            </div>

          </div>
        )}
        
        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] ml-0">
          <p>© {new Date().getFullYear()} ReelGen Pro • Neural Content Optimization Engine</p>
        </footer>

      </main>
    </div>
  );
}

export default App;
