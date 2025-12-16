import { useState, useRef, useEffect } from 'react';
import VideoUploader from './components/VideoUploader';
import ResultsGrid from './components/ResultsGrid';
import ScriptRemixResults from './components/ScriptRemixResults';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { VideoState, AIAnalysisResult, ScriptRemixResult } from './types';
import { 
  analyzeVideoContent, 
  remixVideoScript, 
  analyzeScriptContent, 
  remixScriptContent 
} from './services/geminiService';
import { fileToBase64 } from './utils/videoHelpers';

type AppView = 'landing' | 'auth' | 'welcome' | 'app';

function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Input State
  const [inputType, setInputType] = useState<'video' | 'script'>('video');
  
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

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleAuthSuccess = () => {
    setCurrentView('welcome');
    // After 2 seconds, transition to App
    setTimeout(() => {
      setCurrentView('app');
      // Per requirements: Auto-redirect user to Script Analyzer page
      setInputType('script');
    }, 2000);
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
      
    } catch (err) {
      console.error(err);
      setError(`Failed to process content. ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER LOGIC ---

  if (currentView === 'landing') {
    return <LandingPage onStart={() => setCurrentView('auth')} />;
  }

  if (currentView === 'auth') {
    return <AuthPage onLoginSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
         <div className="space-y-6">
            <h1 className="text-5xl font-black text-white tracking-tight animate-in slide-in-from-bottom-4 duration-700">
              Welcome to ReelGen Pro.
            </h1>
            <p className="text-xl text-slate-400 font-light animate-in slide-in-from-bottom-4 duration-700 delay-200">
              Let’s make your content sharper.
            </p>
            <div className="flex justify-center mt-8">
               <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b border-white/5 bg-[#050505]/80">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
             <div 
               className="cursor-pointer flex items-center gap-3 group"
               onClick={() => setCurrentView('landing')}
             >
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                   <span className="text-white font-black text-lg">R</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-200 group-hover:text-white transition-colors">ReelGen <span className="text-indigo-500">Pro</span></span>
             </div>
             <button 
                onClick={() => setCurrentView('landing')}
                className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group"
              >
                <span>Exit Studio</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
          </div>
      </nav>

      {/* Main Studio Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 animate-in fade-in duration-700">
        <main className="space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-white/5">
             <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">Creator Studio</h2>
                <p className="text-slate-400 font-light text-lg">
                  Upload raw content. Receive viral strategy.
                </p>
             </div>
             
             {/* Status Indicators */}
             <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    System Online
                  </span>
                  <span className="w-px h-3 bg-white/10"></span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                    AI Model Ready
                  </span>
             </div>
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
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-center animate-pulse flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <div id="results-area" className="scroll-mt-24">
            {mode === 'analyze' && analysisResults && (
              <ResultsGrid results={analysisResults} />
            )}
            
            {mode === 'remix' && remixResults && (
              <ScriptRemixResults results={remixResults} />
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-24 border-t border-white/5 pt-8 text-center text-slate-600 text-xs font-mono">
          <p>© {new Date().getFullYear()} Social Hubspot. Engineered for creators.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;