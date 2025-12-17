import React, { useState, useEffect } from 'react';
import { analyzeHook } from '../services/geminiService';
import { HookAnalysisResult } from '../types';
import Spinner from './Spinner';

const LearningsPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [dashboardInput, setDashboardInput] = useState('');

  const handleOpenModule = (moduleId: string, initialInput?: string) => {
    setActiveModule(moduleId);
    if (initialInput) {
       setTimeout(() => {
          const event = new CustomEvent('initHookInput', { detail: initialInput });
          window.dispatchEvent(event);
       }, 100);
    }
  };

  if (activeModule === 'hook-lab') {
    return <HookLabModule onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">REELGEN LEARNING</h2>
        <p className="text-slate-400 font-light text-lg">
          Don’t just generate content. Learn how winning creators think.
        </p>
      </header>

      {/* Hero Learning Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Hook Lab */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
           <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
              <span className="text-9xl">🪝</span>
           </div>
           <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold mb-4 border border-indigo-500/30">MODULE 01</span>
              <h3 className="text-3xl font-bold text-white mb-3">Interactive Hook Lab</h3>
              <p className="text-slate-400 mb-6 max-w-md">
                 Immersive module where creators learn how to stop the scroll scientifically. Learn 50+ proven frameworks and emotional triggers (curiosity, fear, relatability, shock).
              </p>
              
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6 backdrop-blur-sm">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-slate-300 font-mono uppercase">AI Feedback Preview</span>
                 </div>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={dashboardInput}
                      onChange={(e) => setDashboardInput(e.target.value)}
                      placeholder="Paste your hook here..." 
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all" 
                    />
                    <button 
                      onClick={() => handleOpenModule('hook-lab', dashboardInput)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors whitespace-nowrap"
                    >
                      Fix My Hook
                    </button>
                 </div>
              </div>

              <button 
                onClick={() => handleOpenModule('hook-lab')}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                 Start Learning Free
              </button>
           </div>
        </div>

        {/* Module 2: AI Coach (LOCKED/COMING SOON) */}
        <div className="col-span-1 bg-gradient-to-br from-slate-900 to-black border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
           {/* Scanline Effect */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
           <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 animate-[scan_3s_infinite_linear]"></div>
           
           <div className="absolute top-4 right-4">
              <span className="text-xs font-mono text-emerald-500/50 border border-emerald-500/20 px-2 py-1 rounded">V2.0 ALPHA</span>
           </div>

           <div className="relative z-10 flex flex-col h-full justify-between opacity-60 hover:opacity-100 transition-opacity">
              <div>
                <span className="inline-block px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-bold mb-4 border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                  LOCKED
                </span>
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                   AI Coach Mode
                   <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </h3>
                <p className="text-slate-500 text-sm mb-4 font-mono leading-relaxed">
                   [REDACTED] AI will analyze your entire upload history to find patterns in retention drop-offs.
                </p>
              </div>
              
              <button disabled className="w-full py-3 border border-dashed border-emerald-500/30 text-emerald-500/50 font-mono text-xs rounded-xl cursor-not-allowed hover:bg-emerald-500/5 transition-colors">
                 // JOIN WAITLIST
              </button>
           </div>
        </div>

      </div>

      {/* Secondary Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

         {/* Caption School */}
         <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all group cursor-not-allowed opacity-70">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">✍️</div>
            <h3 className="text-lg font-bold text-white mb-2">Caption School</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
               Structures that increase saves. Story arcs for 30s/60s reels. Writing CTAs without sounding salesy.
            </p>
            <span className="text-xs font-bold text-slate-500">Coming Soon</span>
         </div>

         {/* Visual Retention */}
         <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all group cursor-not-allowed opacity-70">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🎥</div>
            <h3 className="text-lg font-bold text-white mb-2">Retention Mastery</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
               Editing psychology. Where to cut (0-3s, 3-7s). Zoom patterns. Direct integration with <span className="text-purple-400">B-Roll Director</span>.
            </p>
             <span className="text-xs font-bold text-slate-500">Coming Soon</span>
         </div>

         {/* Thumbnail Psych */}
         <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all group cursor-not-allowed opacity-70">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🖼️</div>
            <h3 className="text-lg font-bold text-white mb-2">Thumbnail Lab</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
               Facial expressions that convert. Color contrast optimization. Deep dive into the psychology of the click.
            </p>
             <span className="text-xs font-bold text-slate-500">Coming Soon</span>
         </div>

         {/* Monetization */}
         <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all group cursor-not-allowed opacity-70">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">💰</div>
            <h3 className="text-lg font-bold text-white mb-2">Money Playbooks</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
               Monetization paths by niche. Brand deal pricing basics. Why brands say NO. Integrated with <span className="text-emerald-400">Monetization Scout</span>.
            </p>
             <span className="text-xs font-bold text-slate-500">Coming Soon</span>
         </div>

      </div>

      {/* Progress Bar Mockup */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
               XP
            </div>
            <div>
               <h4 className="text-white font-bold text-sm">Your Creator Level: Novice</h4>
               <div className="w-48 h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="w-1/3 h-full bg-indigo-500 rounded-full"></div>
               </div>
            </div>
         </div>
         <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400">Hook Master 🔒</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400">Story Builder 🔒</span>
         </div>
      </div>

    </div>
  );
};

const HookLabModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
   const [inputHook, setInputHook] = useState('');
   const [analysis, setAnalysis] = useState<HookAnalysisResult | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);

   useEffect(() => {
      const handleInit = (e: CustomEvent) => {
         setInputHook(e.detail);
         if (e.detail && e.detail.length > 3) {
            runAnalysis(e.detail);
         }
      };
      window.addEventListener('initHookInput', handleInit as EventListener);
      return () => window.removeEventListener('initHookInput', handleInit as EventListener);
   }, []);

   const runAnalysis = async (text: string) => {
      if (!text.trim()) return;
      setIsAnalyzing(true);
      try {
         const result = await analyzeHook(text);
         setAnalysis(result);
      } catch (e) {
         console.error(e);
      } finally {
         setIsAnalyzing(false);
      }
   };

   return (
      <div className="min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-500 bg-[#050505] text-slate-200">
         
         {/* Navbar */}
         <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               </button>
               <div>
                  <h2 className="font-bold text-white text-lg">Interactive Hook Lab</h2>
                  <p className="text-xs text-slate-500">Module 01 • <span className="text-indigo-400">Science of the Scroll</span></p>
               </div>
            </div>
            <div className="hidden md:block">
               <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-1/4"></div>
               </div>
            </div>
         </div>

         <div className="max-w-5xl mx-auto p-8 space-y-24">
            
            {/* Intro */}
            <section className="text-center space-y-6">
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                  Stop the scroll. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Scientifically.</span>
               </h1>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  The first 3 seconds decide everything. This lab breaks down <em>why</em> some hooks explode and others disappear — using real data, psychology, and AI feedback.
               </p>
            </section>

            {/* Framework Library */}
            <section>
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">🔥 Hook Framework Library</h3>
                  <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">50+ PROVEN FORMULAS</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                     { title: "The Curiosity Gap", desc: "Start with the end result, hide the method.", example: "\"I tried MrBeast's morning routine...\"", icon: "🤔" },
                     { title: "Pattern Interrupt", desc: "Visual or audio shock in first 0.5s.", example: "*Loud noise* \"Don't scroll!\"", icon: "⚡" },
                     { title: "Relatable Pain", desc: "Call out a specific struggle.", example: "\"POV: You're 25 and still broke.\"", icon: "😩" },
                     { title: "Contrarian Take", desc: "Go against common advice.", example: "\"Why discipline is overrated.\"", icon: "🛑" },
                     { title: "The 'Secret' Promise", desc: "Implies insider knowledge.", example: "\"The website CEOs don't want you to know.\"", icon: "🤫" },
                     { title: "Negative Hook", desc: "Warn against a mistake.", example: "\"Stop doing THIS in the gym.\"", icon: "⚠️" },
                  ].map((item, idx) => (
                     <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <div className="text-3xl mb-4 bg-slate-900 w-12 h-12 flex items-center justify-center rounded-xl">{item.icon}</div>
                        <h4 className="font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-400 mb-4">{item.desc}</p>
                        <div className="text-xs font-mono bg-indigo-900/20 text-indigo-300 p-2 rounded border border-indigo-500/20">
                           Ex: {item.example}
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500">🔒 Pro members get full access to 50+ niche-specific frameworks.</p>
               </div>
            </section>

            {/* Interactive Tool */}
            <section className="scroll-mt-24" id="fix-hook">
               <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                     
                     {/* Input Side */}
                     <div className="space-y-6">
                        <div>
                           <h3 className="text-3xl font-black text-white mb-2">✍️ Fix My Hook</h3>
                           <p className="text-slate-400">Paste your hook. Get instant clarity. AI analyzes emotional pull and scroll-stopping power.</p>
                        </div>
                        
                        <div className="space-y-4">
                           <textarea 
                              value={inputHook}
                              onChange={(e) => setInputHook(e.target.value)}
                              placeholder="e.g. Stop making this mistake on Instagram..."
                              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none font-medium placeholder:text-slate-600"
                           ></textarea>
                           <button 
                              onClick={() => runAnalysis(inputHook)}
                              disabled={isAnalyzing || !inputHook.trim()}
                              className="w-full py-4 bg-white text-indigo-950 font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              {isAnalyzing ? (
                                 <Spinner size="sm" className="border-indigo-950" />
                              ) : (
                                 <>
                                    Analyze Hook <span className="text-xl">✨</span>
                                 </>
                              )}
                           </button>
                           <p className="text-xs text-center text-slate-500">⚡ Feedback takes seconds — not days.</p>
                        </div>
                     </div>

                     {/* Result Side */}
                     <div className="bg-[#050505] rounded-2xl border border-white/10 p-6 md:p-8 min-h-[400px] flex flex-col justify-center relative">
                        {!analysis ? (
                           <div className="text-center opacity-30">
                              <div className="text-6xl mb-4">🔮</div>
                              <p className="font-bold">Waiting for input...</p>
                           </div>
                        ) : (
                           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                              
                              {/* Score & Trigger */}
                              <div className="flex items-center justify-between">
                                 <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Virality Score</div>
                                    <div className={`text-5xl font-black ${analysis.score > 80 ? 'text-emerald-400' : analysis.score > 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                       {analysis.score}
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Trigger</div>
                                    <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 font-bold">
                                       {analysis.emotionalTrigger}
                                    </div>
                                 </div>
                              </div>

                              {/* Critique */}
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                 <h4 className="font-bold text-white text-sm mb-2">🤖 AI Critique</h4>
                                 <p className="text-sm text-slate-300 leading-relaxed">{analysis.critique}</p>
                              </div>

                              {/* Rewrites */}
                              <div>
                                 <h4 className="font-bold text-white text-sm mb-3">✨ Better Versions</h4>
                                 <div className="space-y-2">
                                    {analysis.rewrites.map((rw, i) => (
                                       <div key={i} className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-100/90 flex gap-3">
                                          <span className="font-mono text-emerald-500/50">{i+1}.</span>
                                          {rw}
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              {/* Why it works */}
                              <div className="text-xs text-slate-500 italic border-t border-white/5 pt-4">
                                 <span className="font-bold text-slate-400 not-italic">Why? </span>
                                 {analysis.whyItWorks}
                              </div>

                           </div>
                        )}
                     </div>

                  </div>
               </div>
            </section>
         </div>
      </div>
   );
};

export default LearningsPage;