import React, { useState } from 'react';
import { analyzeScriptContent } from '../services/geminiService';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [demoInput, setDemoInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<{ score: number; roast: string } | null>(null);

  const handleDemoAnalyze = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    try {
      const result = await analyzeScriptContent(demoInput);
      setDemoResult({ score: result.viralScore, roast: result.roast });
    } catch (error) {
      console.error("Demo analysis failed", error);
      setDemoResult({ 
         score: 45, 
         roast: "I'd roast your script, but I couldn't connect to the server. Just assume it needs a better hook and more energy." 
      });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* --- GLOBAL EFFECTS --- */}
      {/* Noise Texture */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-rose-600/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md border-b border-white/5 bg-black/50 supports-[backdrop-filter]:bg-black/20">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
             <div className="font-black text-xl tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <span className="text-white text-lg font-bold">R</span>
                </div>
                <span>ReelGen <span className="text-indigo-400">Pro</span></span>
             </div>
             <button 
                onClick={onStart} 
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all hover:scale-105"
             >
                Launch App
             </button>
          </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
          <div className="container mx-auto max-w-7xl">
             <div className="flex flex-col lg:flex-row items-center gap-16">
                
                {/* Hero Text */}
                <div className="flex-1 text-center lg:text-left z-10">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 hover:bg-indigo-500/20 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      AI Reel Coach 2.0
                   </div>
                   
                   <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                      Stop Guessing. <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
                         Go Viral on Purpose.
                      </span>
                   </h1>
                   
                   <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                      ReelGen Pro is your brutally honest AI Coach. Turn raw videos into optimized scripts, captions, and viral hooks—before you hit post.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                      <button 
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 overflow-hidden"
                      >
                         <span className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                         <span className="relative flex items-center gap-2">
                           Try ReelGen Pro Free
                           <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                         </span>
                      </button>
                      <p className="text-xs text-slate-500 font-mono mt-2 sm:mt-0">No credit card required</p>
                   </div>
                </div>

                {/* Hero Visual / Mockup */}
                <div className="flex-1 relative w-full max-w-lg lg:max-w-xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                   {/* Floating Card Composition */}
                   <div className="relative z-10 perspective-1000 group">
                      <div className="relative transform rotate-y-[-6deg] rotate-x-[6deg] group-hover:rotate-y-[-2deg] group-hover:rotate-x-[2deg] transition-all duration-700 ease-out preserve-3d">
                         
                         {/* Back Card Element */}
                         <div className="absolute top-[-20px] right-[-20px] w-full h-full bg-slate-900 border border-slate-700/50 rounded-2xl p-6 opacity-60 scale-95 -z-10 translate-z-[-20px]"></div>
                         
                         {/* Main Interface Card */}
                         <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5 relative overflow-hidden">
                            {/* Glass Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                            {/* Fake UI Header */}
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                               <div className="flex gap-2">
                                  <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                               </div>
                               <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                  gemini-2.5-flash
                               </div>
                            </div>

                            {/* Fake UI Body */}
                            <div className="space-y-5">
                               {/* Score Section */}
                               <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                  <div>
                                     <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Virality Score</div>
                                     <div className="text-5xl font-black text-emerald-400 tracking-tighter">98<span className="text-xl text-slate-600 font-medium">/100</span></div>
                                  </div>
                                  <div className="relative h-16 w-16 flex items-center justify-center">
                                      <svg className="w-full h-full animate-spin-slow text-emerald-500/30" viewBox="0 0 100 100">
                                         <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="200" strokeDashoffset="50" />
                                      </svg>
                                      <span className="absolute text-2xl">🚀</span>
                                  </div>
                               </div>
                               
                               {/* Script Analysis Preview */}
                               <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-4 border border-indigo-500/20">
                                  <div className="flex items-center gap-2 mb-2">
                                     <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded shadow-sm shadow-indigo-500/50 font-bold">HOOK</span>
                                     <span className="text-[10px] text-indigo-300 font-mono">00:00 - 00:03</span>
                                  </div>
                                  <div className="text-sm text-slate-200 font-medium leading-relaxed">
                                     "Stop making this mistake if you want to grow on Instagram..."
                                  </div>
                               </div>

                               {/* Mock Graph */}
                               <div className="flex items-end gap-1 h-12 w-full opacity-50">
                                  {[40, 60, 45, 70, 85, 95, 80, 60, 50, 75].map((h, i) => (
                                     <div key={i} className="flex-1 bg-slate-700 rounded-t-sm hover:bg-indigo-500 transition-colors" style={{ height: `${h}%` }}></div>
                                  ))}
                               </div>
                            </div>

                            {/* Floating "Approved" Badge */}
                            <div className="absolute -bottom-4 -left-4 bg-emerald-500 text-black font-bold px-4 py-2 rounded-lg shadow-[0_10px_20px_-5px_rgba(16,185,129,0.5)] rotate-6 flex items-center gap-2 border border-emerald-400">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                               READY TO POST
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </section>

      {/* --- LIVE DEMO SECTION --- */}
      <section className="py-24 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-950/10 -z-10"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Try ReelGen Pro — Live Demo
            </h2>
            <p className="text-lg text-slate-400">
              Paste your reel script or hook below and see how Gemini 2.5 evaluates it.
            </p>
          </div>

          <div className="bg-[#0f0f10] border border-white/10 rounded-2xl p-1 shadow-2xl">
            <div className="bg-[#050505] rounded-xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
              
              {/* Terminal Header */}
              <div className="flex items-center gap-4 mb-6 opacity-50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-mono text-slate-500">interactive_terminal</div>
              </div>

              {/* Input Area */}
              <div className="relative mb-8 group">
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Paste your reel script here... (e.g. 'Stop making this mistake if you want to grow on Instagram...')"
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none font-mono text-sm leading-relaxed"
                />
                <button
                  onClick={handleDemoAnalyze}
                  disabled={demoLoading || !demoInput.trim()}
                  className="absolute bottom-4 right-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  {demoLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Scanning...
                    </>
                  ) : (
                    'Analyze Script'
                  )}
                </button>
              </div>

              {/* Results Display */}
              {demoResult && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-white/10 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Gauge Card */}
                    <div className="col-span-1 bg-white/5 rounded-xl p-6 border border-white/5 flex flex-col items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Virality Score</p>
                        <div className="relative flex flex-col items-center justify-center">
                          <svg className="w-40 h-20 overflow-visible" viewBox="0 0 200 100">
                            <defs>
                              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={demoResult.score >= 80 ? '#10b981' : demoResult.score >= 50 ? '#f59e0b' : '#ef4444'} />
                                <stop offset="100%" stopColor={demoResult.score >= 80 ? '#3b82f6' : demoResult.score >= 50 ? '#d97706' : '#be123c'} />
                              </linearGradient>
                            </defs>
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * demoResult.score / 100)} className="transition-all duration-1000 ease-out" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }} />
                          </svg>
                          <div className="absolute bottom-0 flex flex-col items-center translate-y-1">
                             <span className={`text-4xl font-black tracking-tighter ${demoResult.score >= 80 ? 'text-emerald-400' : demoResult.score >= 50 ? 'text-amber-400' : 'text-rose-400'} drop-shadow-lg`}>
                               {demoResult.score}
                             </span>
                          </div>
                        </div>
                    </div>

                    {/* Roast Card */}
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-orange-900/10 to-slate-900 rounded-xl p-6 border border-orange-500/20 relative overflow-hidden flex flex-col justify-center">
                      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl select-none grayscale">🔥</div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">😈</span>
                        <h3 className="font-bold text-orange-200 text-sm uppercase tracking-wide">ReelGen Roast</h3>
                      </div>
                      <p className="text-orange-100/80 italic font-medium leading-relaxed font-serif text-lg">
                        "{demoResult.roast}"
                      </p>
                    </div>
                  </div>

                  {/* Upsell */}
                  <div className="text-center bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6">
                    <p className="text-slate-300 mb-4 font-medium text-sm">
                      Want a full breakdown, script remix, captions, hashtags, posting time, and monetization insights?
                    </p>
                    <button
                      onClick={onStart}
                      className="inline-flex items-center px-6 py-2 bg-white text-indigo-950 font-bold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                    >
                      Unlock Full Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM SECTION (Horizontal Cards) --- */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6">
           <div className="max-w-4xl mx-auto text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Creating Reels Shouldn’t Feel Like Gambling 🎰</h2>
             <p className="text-xl text-slate-400">Creators struggle every day with:</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                { text: "“My content is good… but reach is dead”", icon: "📉" },
                { text: "Writing captions and hooks again and again", icon: "✍️" },
                { text: "Not knowing why a reel failed", icon: "🤷‍♂️" },
                { text: "Posting randomly and hoping it works", icon: "🎲" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all group flex flex-col justify-between h-full min-h-[180px]">
                  <span className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 origin-left">{item.icon}</span>
                  <p className="text-slate-300 font-medium leading-snug">{item.text}</p>
                </div>
              ))}
           </div>
           
           <div className="text-center mt-16">
             <p className="text-3xl font-bold text-slate-200">
               The problem isn’t effort. <span className="text-indigo-400">It’s lack of clarity.</span>
             </p>
           </div>
        </div>
      </section>

      {/* --- SOLUTION SECTION (Split Layout) --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
               <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                 Meet Your <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI Reel Coach 🤖</span>
               </h2>
               <div className="space-y-8 text-lg text-slate-300">
                 <p className="leading-relaxed">
                   Upload one video. ReelGen Pro analyzes, optimizes, and coaches you — <strong className="text-white">before you post.</strong>
                 </p>
                 <div className="flex flex-col gap-4 border-l-2 border-slate-800 pl-6">
                   <div className="flex items-center gap-3 text-slate-500 line-through">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Not just captions.
                   </div>
                   <div className="flex items-center gap-3 text-slate-500 line-through">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Not just hashtags.
                   </div>
                   <div className="flex items-center gap-3 text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]"></span> Clear direction.
                   </div>
                 </div>
               </div>
            </div>
            
            {/* Abstract Graphic */}
            <div className="w-full md:w-1/2 relative">
               <div className="aspect-square bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full border border-white/5 p-12 relative animate-pulse-slow">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-2/3 h-2/3 border border-dashed border-emerald-500/30 rounded-full animate-spin-slow"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-1/3 h-1/3 border border-dashed border-cyan-500/30 rounded-full animate-reverse-spin-slow"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center text-4xl shadow-2xl z-10">
                        🎥
                     </div>
                  </div>
                  {/* Satellites */}
                  <div className="absolute top-1/4 left-1/4 bg-slate-800 p-3 rounded-lg text-xs font-mono border border-slate-700 shadow-xl animate-float">Script</div>
                  <div className="absolute bottom-1/4 right-1/4 bg-slate-800 p-3 rounded-lg text-xs font-mono border border-slate-700 shadow-xl animate-float delay-700">Hooks</div>
                  <div className="absolute top-1/3 right-0 bg-slate-800 p-3 rounded-lg text-xs font-mono border border-slate-700 shadow-xl animate-float delay-1000">Tags</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4">What ReelGen Pro Does</h2>
            <p className="text-slate-500 text-lg">(So You Don’t Have To)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)] max-w-6xl mx-auto">
            {/* Large Card 1 */}
            <BentoCard 
              colSpan="md:col-span-2"
              icon="🎯"
              title="Auto Reel Analysis"
              desc="Breaks down hook strength, visuals, audio mood, and retention killers."
            />
             {/* Wide Card 2 (Script Doctor) */}
             <BentoCard 
               colSpan="md:col-span-1"
               icon="🚑"
               title="Script Doctor"
               desc="Golden Feature: Tells you exactly what sentences to add and remove to fix pacing."
               highlight
               gradient="from-yellow-900/20 to-amber-900/20"
            />
            {/* Tall Card 3 */}
            <BentoCard 
               colSpan="md:col-span-1 md:row-span-2"
               icon="🧠"
               title="Viral Content Generator"
               desc="3 high-performing captions. Curated hashtags. Best posting times."
               gradient="from-indigo-900/20 to-purple-900/20"
            />
            {/* Card 4 */}
            <BentoCard 
               colSpan="md:col-span-1"
               icon="🎬"
               title="B-Roll Director"
               desc="Tells you where to cut, zoom, overlay, or add subtitles."
            />
            {/* Card 5 (Roast) */}
            <BentoCard 
               colSpan="md:col-span-1"
               icon="😈"
               title="ReelGen Roast"
               desc="A savage, unfiltered AI critique. Sugarcoating kills growth."
            />
             {/* Wide Card 6 */}
             <BentoCard 
               colSpan="md:col-span-2"
               icon="💰"
               title="Brand Deal Scout"
               desc="Finds your niche and writes professional pitch drafts for potential sponsors."
            />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-40 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 to-[#050505] -z-10"></div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

         <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
           Create Smarter. <br/>
           <span className="text-indigo-400">Grow Faster.</span>
         </h2>
         
         <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
           Stop posting blindly. Start posting with clarity.
         </p>

         <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white transition-all duration-200 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-md"
          >
            Try ReelGen Pro Free
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
         </button>
         <p className="mt-8 text-sm text-slate-600">No credit card. No pressure.</p>
      </section>

      <footer className="py-8 border-t border-white/5 text-center text-slate-700 text-xs">
        <p>&copy; {new Date().getFullYear()} ReelGen Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

const BentoCard = ({ 
  colSpan = "", 
  icon, 
  title, 
  desc, 
  highlight = false, 
  gradient = "" 
}: { 
  colSpan?: string, 
  icon: string, 
  title: string, 
  desc: string, 
  highlight?: boolean,
  gradient?: string
}) => (
  <div className={`${colSpan} bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between ${highlight ? 'border-amber-500/20' : ''}`}>
    {highlight && <div className="absolute inset-0 bg-amber-500/5 pointer-events-none"></div>}
    {gradient && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 pointer-events-none`}></div>}
    
    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
      <span className="text-8xl grayscale">{icon}</span>
    </div>

    <div className="text-4xl mb-6 relative z-10">{icon}</div>
    <div className="relative z-10">
      <h3 className={`text-xl font-bold mb-3 ${highlight ? 'text-amber-200' : 'text-slate-200'}`}>{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default LandingPage;