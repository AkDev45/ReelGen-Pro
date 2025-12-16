import React, { useRef, useEffect } from 'react';
import { VideoState } from '../types';
import Spinner from './Spinner';

interface VideoUploaderProps {
  videoState: VideoState;
  onFileSelect: (file: File) => void;
  onProcess: () => void;
  isProcessing: boolean;
  mode: 'analyze' | 'remix';
  setMode: (mode: 'analyze' | 'remix') => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  inputType: 'video' | 'script';
  setInputType: (type: 'video' | 'script') => void;
  scriptText: string;
  setScriptText: (text: string) => void;
  autoFocusScript?: boolean;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  videoState, 
  onFileSelect, 
  onProcess,
  isProcessing,
  mode,
  setMode,
  videoRef,
  inputType,
  setInputType,
  scriptText,
  setScriptText,
  autoFocusScript = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus logic
  useEffect(() => {
    if (inputType === 'script' && autoFocusScript && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
    }
  }, [inputType, autoFocusScript]);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert("Please upload a valid video file.");
        return;
      }
      onFileSelect(file);
    }
  };

  const handleLoadedData = async () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0.5;
    }
  };

  const hasContent = inputType === 'video' ? !!videoState.file : scriptText.trim().length > 10;

  return (
    <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>
      
      {/* --- HEADER: INPUT TABS --- */}
      <div className="flex border-b border-white/5 bg-black/20">
        <button 
          onClick={() => setInputType('video')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
            inputType === 'video' 
              ? 'text-white bg-white/5' 
              : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             Video Upload
          </div>
          {inputType === 'video' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>}
        </button>
        
        <button 
          onClick={() => setInputType('script')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
            inputType === 'script' 
              ? 'text-white bg-white/5' 
              : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             Script Editor
          </div>
          {inputType === 'script' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>}
        </button>
      </div>

      {/* --- BODY: MAIN CONTENT AREA --- */}
      <div className="p-8 md:p-12 min-h-[400px] flex flex-col md:flex-row gap-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
        
        {/* LEFT: INPUT */}
        <div className="w-full md:w-1/2 flex flex-col">
          {inputType === 'video' ? (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="flex-1 border border-dashed border-slate-700 hover:border-indigo-500/50 bg-[#080808] hover:bg-[#0c0c0c] rounded-2xl p-8 transition-all cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <input 
                   ref={fileInputRef}
                   type="file" 
                   accept="video/*" 
                   onChange={handleUploadChange} 
                   className="hidden" 
                />
                
                {/* Cinema Frame Decor */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-700 group-hover:border-indigo-500 transition-colors"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-700 group-hover:border-indigo-500 transition-colors"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-700 group-hover:border-indigo-500 transition-colors"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-700 group-hover:border-indigo-500 transition-colors"></div>

                <div className="w-20 h-20 mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/30 transition-all shadow-xl">
                   <svg className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                
                <h3 className="text-xl font-bold text-slate-300 group-hover:text-white transition-colors mb-2">Upload Raw Footage</h3>
                <p className="text-slate-500 text-sm mb-6">Drag & drop or click to browse</p>
                <span className="px-3 py-1 bg-slate-800 rounded-md text-[10px] text-slate-400 font-mono border border-slate-700">MP4, MOV • Max 50MB</span>
             </div>
          ) : (
             <div className="flex-1 relative flex flex-col h-full min-h-[300px]">
                <div className="absolute top-0 left-0 w-full h-8 bg-[#080808] border-t border-l border-r border-slate-800 rounded-t-xl flex items-center px-4 gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <textarea
                  ref={textAreaRef}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="Paste your hook, script, or rough ideas here..."
                  className="w-full h-full flex-1 bg-[#080808] border border-slate-800 rounded-b-xl rounded-t-none p-6 pt-10 text-slate-300 font-mono text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all placeholder:text-slate-700 leading-relaxed"
                />
             </div>
          )}
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex-1 bg-black rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center group">
               {/* Reflection */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20"></div>

               {inputType === 'video' ? (
                  videoState.url ? (
                    <video 
                      ref={videoRef} 
                      src={videoState.url} 
                      controls 
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain max-h-[400px]"
                      onLoadedData={handleLoadedData}
                    />
                  ) : (
                    <div className="text-center p-8 opacity-40 group-hover:opacity-60 transition-opacity">
                       <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                       <p className="text-sm font-medium text-slate-500">Video Preview Standby</p>
                    </div>
                  )
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/50">
                     <div className="w-20 h-20 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 flex items-center justify-center mb-6 shadow-xl transform rotate-3">
                        <span className="text-3xl">📝</span>
                     </div>
                     <h3 className="text-white font-bold mb-2">Text Analysis Mode</h3>
                     <p className="text-slate-500 text-center text-sm max-w-xs">
                       The AI will break down your script structure, tone, and pacing without video data.
                     </p>
                  </div>
               )}
            </div>
            
            {inputType === 'video' && videoState.file && (
               <div className="mt-3 flex justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-xs text-slate-400 font-mono">{videoState.file.name}</span>
                  </div>
                  <span className="text-xs text-slate-600 font-mono">{(videoState.file.size / (1024 * 1024)).toFixed(1)} MB</span>
               </div>
            )}
        </div>
      </div>

      {/* --- COMMAND BAR (BOTTOM) --- */}
      <div className="bg-[#050505] border-t border-white/5 p-6 md:px-12 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Mode Selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full md:w-auto">
           <button
             onClick={() => setMode('analyze')}
             className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
               mode === 'analyze' 
                 ? 'bg-slate-700 text-white shadow-lg' 
                 : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
             }`}
           >
             Analysis
           </button>
           <button
             onClick={() => setMode('remix')}
             className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
               mode === 'remix' 
                 ? 'bg-indigo-600 text-white shadow-lg' 
                 : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
             }`}
           >
             Remix Script
           </button>
        </div>

        {/* Action Button */}
        <button
          onClick={onProcess}
          disabled={!hasContent || isProcessing}
          className={`w-full md:w-auto md:min-w-[240px] py-4 px-8 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]
            ${!hasContent || isProcessing 
              ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed' 
              : mode === 'remix'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-indigo-500/25 text-white border border-transparent'
                : 'bg-white text-black hover:scale-105 hover:bg-indigo-50 hover:shadow-white/20 border border-transparent'
            }`}
        >
          {isProcessing ? (
            <>
              <Spinner size="sm" className={mode === 'remix' ? "border-white" : "border-slate-800"} />
              Processing...
            </>
          ) : (
            <>
              {mode === 'remix' ? "Generate Remixes" : "Run Analysis"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </>
          )}
        </button>

      </div>
    </section>
  );
};

export default VideoUploader;