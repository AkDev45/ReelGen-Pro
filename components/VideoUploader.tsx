import React, { useRef, useEffect, useState } from 'react';
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
  onProcess,
  isProcessing,
  mode,
  setMode,
  scriptText,
  setScriptText,
  autoFocusScript = false
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(scriptText.length);
  }, [scriptText]);

  // Auto-focus logic for the script editor
  useEffect(() => {
    if (autoFocusScript && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
    }
  }, [autoFocusScript]);

  const hasContent = scriptText.trim().length > 10;

  return (
    <section className="relative group perspective-1000">
      {/* Dynamic Ambient Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-600/20 transition-all duration-1000"></div>

      <div className="bg-[#0D0D0F]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative">
        
        {/* Top Feature Bar (HUD Style) */}
        <div className="flex border-b border-white/5 bg-black/40 px-8 py-3 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Engine v4.0</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-600">LATENCY: 42ms</span>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
               {charCount} CHARS
             </div>
             <div className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 font-bold">
               PRO MODE
             </div>
          </div>
        </div>

        {/* --- BODY: DUAL PANEL LAYOUT --- */}
        <div className="p-4 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
          
          {/* LEFT PANEL: NEURAL SCRIPT IDE (62% width) */}
          <div className="w-full lg:w-[62%] flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                  Viral Script Editor
                </h3>
                <p className="text-[10px] text-slate-500 font-medium ml-3.5">INTELLIGENT CONTENT DRAFTING</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              </div>
            </div>

            <div className="flex-1 relative group/editor">
                {/* Editor Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/editor:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                
                <div className="bg-[#080808] border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover/editor:border-indigo-500/30">
                  {/* File Header Tab */}
                  <div className="h-9 bg-[#121214] border-b border-slate-800/60 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">unnamed_banger.script</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                    </div>
                  </div>
                  
                  <textarea
                    ref={textAreaRef}
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="DROP YOUR VIRAL HOOK HERE...
    
AI WILL RECONSTRUCT YOUR PACING AND STORY ARCS.
    
EXAMPLE: '3 SIMPLE WAYS TO SCALE YOUR BRAND TO $10K...'"
                    className="w-full h-full min-h-[380px] bg-transparent p-8 text-slate-200 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-800 leading-relaxed custom-scrollbar selection:bg-indigo-500/40"
                  />
                  
                  {/* Editor Footer HUD */}
                  <div className="h-8 border-t border-slate-800/40 px-4 flex items-center justify-between text-[9px] font-mono text-slate-600 bg-black/20">
                    <div className="flex gap-4">
                      <span>UTF-8</span>
                      <span>MD</span>
                    </div>
                    <div className="flex gap-4">
                      <span>LN {scriptText.split('\n').length}</span>
                      <span>COL {scriptText.length}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* RIGHT PANEL: VISUAL CALIBRATION (COMING SOON) (38% width) */}
          <div className="w-full lg:w-[38%] flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-slate-800 rounded-full"></span>
                  Visual Node
                </h3>
                <p className="text-[10px] text-slate-700 font-medium ml-3.5">OFFLINE CALIBRATION</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-800 animate-pulse"></div>
            </div>

            <div className="flex-1 bg-black/60 rounded-[2rem] border border-white/5 overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-10 text-center transition-all duration-700 group/locked">
               {/* High-Tech Grid Overlay */}
               <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               
               {/* Moving Scanline */}
               <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[scan_4s_infinite_linear] pointer-events-none"></div>

               <div className="relative z-10 space-y-8">
                  <div className="relative">
                    {/* Floating HUD Elements */}
                    <div className="absolute -top-4 -left-4 w-6 h-6 border-t border-l border-slate-800 group-hover/locked:border-indigo-500 transition-colors"></div>
                    <div className="absolute -top-4 -right-4 w-6 h-6 border-t border-r border-slate-800 group-hover/locked:border-indigo-500 transition-colors"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b border-l border-slate-800 group-hover/locked:border-indigo-500 transition-colors"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b border-r border-slate-800 group-hover/locked:border-indigo-500 transition-colors"></div>

                    <div className="w-24 h-24 bg-gradient-to-tr from-slate-900 to-black rounded-full border border-slate-800 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover/locked:scale-110 transition-transform duration-500 overflow-hidden">
                       <svg className="w-10 h-10 text-slate-700 group-hover/locked:text-indigo-500 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                       <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/locked:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-white font-black text-lg tracking-tight uppercase">Vision Engine Offline</h3>
                    <p className="text-slate-600 text-xs max-w-[220px] leading-relaxed mx-auto font-medium">
                      Neural visual mapping is currently reserved for the next major release cycle.
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-slate-900 rounded-full group-hover/locked:bg-indigo-900 transition-colors"></div>)}
                  </div>

                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-black border border-white/5 rounded-full shadow-2xl">
                     <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Deploying v5.0</span>
                  </div>
               </div>
            </div>
          </div>
          
        </div>

        {/* --- DYNAMIC ACTION BAR (GLASS FOOTER) --- */}
        {/* Restructured for better spacing and to prevent overlapping */}
        <div className="bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-30">
          
          {/* Advanced Mode Selector */}
          <div className="flex flex-col gap-3 w-full lg:w-auto min-w-[320px]">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Execution Protocol</span>
            <div className="flex bg-[#050505] p-2 rounded-[1.25rem] border border-white/10 w-full lg:w-max shadow-inner relative overflow-hidden">
               <button
                 onClick={() => setMode('analyze')}
                 className={`flex-1 px-5 md:px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 whitespace-nowrap ${
                   mode === 'analyze' 
                     ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                     : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 Script & Strategy Analysis
               </button>
               <button
                 onClick={() => setMode('remix')}
                 className={`flex-1 px-5 md:px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 whitespace-nowrap ${
                   mode === 'remix' 
                     ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                     : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 Remix Content
               </button>
            </div>
          </div>

          {/* Neural Action Button */}
          <div className="relative w-full lg:w-auto group/btn">
            {/* Pulsing Aura */}
            {!isProcessing && hasContent && (
               <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse rounded-2xl pointer-events-none transition-colors duration-500 ${mode === 'remix' ? 'bg-indigo-500' : 'bg-white'}`}></div>
            )}
            
            <button
              onClick={onProcess}
              disabled={!hasContent || isProcessing}
              className={`relative w-full lg:w-auto lg:min-w-[340px] py-5 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all transform active:scale-[0.97]
                ${!hasContent || isProcessing 
                  ? 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed grayscale' 
                  : mode === 'remix'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] text-white border border-indigo-500/50 shadow-xl shadow-indigo-500/20 group-hover/btn:shadow-indigo-500/40'
                    : 'bg-white text-black hover:scale-[1.02] shadow-xl shadow-white/5 group-hover/btn:shadow-white/20'
                }`}
            >
              {isProcessing ? (
                <>
                  <Spinner size="sm" className={mode === 'remix' ? "border-white" : "border-slate-800"} />
                  <span className="animate-pulse">Synthesizing Nodes...</span>
                </>
              ) : (
                <>
                  <span className="flex-1 text-center">
                    {mode === 'remix' ? "Generate Neural Remixes" : "Run Strategic Deep-Scan"}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${mode === 'remix' ? 'bg-white/10' : 'bg-black/5'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoUploader;