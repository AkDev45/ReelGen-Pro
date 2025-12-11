import { useState, useRef } from 'react';
import VideoUploader from './components/VideoUploader';
import ResultsGrid from './components/ResultsGrid';
import ScriptRemixResults from './components/ScriptRemixResults';
import { VideoState, AIAnalysisResult, ScriptRemixResult } from './types';
import { 
  analyzeVideoContent, 
  remixVideoScript, 
  analyzeScriptContent, 
  remixScriptContent 
} from './services/geminiService';
import { fileToBase64 } from './utils/videoHelpers';

function App() {
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

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-300">
              ReelGen Pro
            </h1>
            <p className="text-slate-400 mt-2 max-w-md mx-auto md:mx-0">
              Transform videos or scripts into viral gold. AI-powered captions, tags, and strategy.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:block px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
                Powered by Gemini 2.5 Flash
             </div>
          </div>
        </header>

        {/* Main Interface */}
        <main className="space-y-8">
          
          <VideoUploader 
            videoState={videoState}
            onFileSelect={handleFileSelect}
            onProcess={handleProcess}
            isProcessing={isProcessing}
            mode={mode}
            setMode={setMode}
            videoRef={videoRef}
            // New props
            inputType={inputType}
            setInputType={setInputType}
            scriptText={scriptText}
            setScriptText={setScriptText}
          />

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-center animate-pulse">
              {error}
            </div>
          )}

          <div id="results-area">
            {mode === 'analyze' && analysisResults && (
              <ResultsGrid results={analysisResults} />
            )}
            
            {mode === 'remix' && remixResults && (
              <ScriptRemixResults results={remixResults} />
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-800/50 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Social Hubspot.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;