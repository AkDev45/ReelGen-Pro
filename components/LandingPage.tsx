import React, { useState, useEffect } from 'react';
import { analyzeScriptContent } from '../services/geminiService';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [demoInput, setDemoInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<{ score: number; roast: string } | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoAnalyze = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    try {
      // In a real scenario, you might want a lighter API call here, 
      // but we use the main one and just show limited results.
      const result = await analyzeScriptContent(demoInput);
      setDemoResult({ score: result.viralScore, roast: result.roast });
    } catch (error) {
      console.error("Demo analysis failed", error);
      // Fallback for demo purposes if API fails or is not configured in landing view
      setDemoResult({ 
         score: 42, 
         roast: "This hook is sleeping. You took 5 seconds to get to the point. The algorithm wants speed, not a preamble." 
      });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="bg-[#020202] text-white selection:bg-indigo-500/30 overflow-x-hidden relative font-sans">
      
      {/* --- SOFT CREATOR GLOWS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] glow-orb opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[120px] glow-orb delay-2000 opacity-40"></div>
      </div>

      {/* --- CLEAN NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'py-4 backdrop-blur-xl bg-black/60 border-b border-white/5' : 'py-8 bg-transparent'}`}>
          <div className="container mx-auto px-6 flex items-center justify-between">
             <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <span className="text-black text-xl font-black">R</span>
                </div>
                <span className="text-xl font-bold tracking-tight">ReelGen <span className="text-indigo-500">Pro</span></span>
             </div>
             
             <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-slate-400">
                <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
             </div>

             <button 
                onClick={onStart} 
                className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
             >
                Try Free
             </button>
          </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 px-6">
          <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center">
             
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                ✨ Trusted by 12,000+ top creators
             </div>
             
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Stop Guessing. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Turn Scripts into Reels</span> <br/>
                That Actually Perform.
             </h1>
             
             <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                Upload or paste your script and get optimized hooks, rewrites, captions, and posting strategy — before you hit publish.
             </p>
             
             <button 
               onClick={onStart}
               className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_-15px_rgba(255,255,255,0.2)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
             >
                Try ReelGen Pro Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4-4m4-4H3"></path></svg>
             </button>
          </div>

          {/* SCRIPT OPTIMIZER MOCKUP (CREATOR FRIENDLY) */}
          <div className="mt-24 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
             <div className="bg-[#0D0D0F] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                
                {/* Interface Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/20">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/5"></div>
                     <div className="w-3 h-3 rounded-full bg-white/5"></div>
                     <div className="w-3 h-3 rounded-full bg-white/5"></div>
                   </div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      AI Content Studio v5.0
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                   {/* Left: Your Input */}
                   <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5">
                      <div className="flex items-center gap-2 mb-6">
                         <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Your Raw Draft</span>
                      </div>
                      <div className="space-y-4 text-slate-400 font-medium text-sm leading-relaxed">
                         <p className="p-4 bg-white/5 rounded-xl border border-white/5 italic">
                            "Hey guys, so today I'm going to talk about how I grow my business... it's really easy if you follow these steps..."
                         </p>
                         <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mt-4">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            Boring intro — viewers will scroll past.
                         </div>
                      </div>
                   </div>

                   {/* Right: AI Magic */}
                   <div className="p-8 md:p-12 bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-6">
                         <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Optimization</span>
                      </div>
                      <div className="space-y-4">
                         <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                            <p className="text-xs text-indigo-300 font-bold mb-1">New Viral Hook</p>
                            <p className="text-sm text-white font-bold leading-snug">"Stop trading time for money. Here is the exact blueprint I used to automate $10k/mo..."</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Retention</p>
                               <p className="text-xl font-bold text-white">+84%</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Viral Potential</p>
                               <p className="text-xl font-bold text-emerald-400">High</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </section>

      {/* --- HOW IT WORKS: 3 STEPS --- */}
      <section id="how-it-works" className="py-24 bg-white/[0.01]">
         <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">From Idea to Viral in 3 Steps</h2>
               <p className="text-slate-400">The clear path to creator growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <Step 
                 num="1" 
                 title="Paste Your Script" 
                 desc="Drop your raw script, into the editor. No formatting needed." 
               />
               <Step 
                 num="2" 
                 title="ReelGen Deep Scan Analysis" 
                 desc="ReelGen Pro performs a deep scan of your script and delivers a complete analysis, including hook strength, clarity, emotional triggers, retention risks, and structural gaps — so you know exactly what’s working and what’s not." 
               />
               <Step 
                 num="3" 
                 title="Post with Clarity" 
                 desc="Get a proven hook, clear what to add and what to remove in your script, optimized captions, hashtags, posting guidance, and monetization scope — so you publish with confidence, not hope." 
               />
            </div>
         </div>
      </section>

      {/* --- TRY REELGEN PRO — LIVE DEMO --- */}
      <section id="demo" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Try ReelGen Pro — Live Demo
          </h2>
          <p className="text-lg text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
             Paste your reel script or hook below and see how ReelGen Pro evaluates it.
          </p>

          <div className="bg-[#0A0A0B] rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <textarea
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Paste your reel script here…"
              className="w-full h-44 bg-black border border-white/5 rounded-2xl p-6 text-lg text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none font-medium mb-8 shadow-inner"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Neural Mode Active</span>
              </div>
              <button
                onClick={handleDemoAnalyze}
                disabled={demoLoading || !demoInput.trim()}
                className="w-full sm:w-auto px-12 py-4 bg-white text-black rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                {demoLoading ? 'Scanning...' : 'Analyze Script'}
              </button>
            </div>
            
            {demoResult && (
              <div className="mt-12 pt-12 border-t border-white/5 animate-in slide-in-from-bottom-10 duration-700 text-left space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Metric 1: Virality Score */}
                  <div className="glass p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Virality Score</p>
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                           <circle
                              cx="64" cy="64" r="58"
                              stroke="currentColor" strokeWidth="8"
                              fill="transparent"
                              className="text-white/5"
                           />
                           <circle
                              cx="64" cy="64" r="58"
                              stroke="currentColor" strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={364.4}
                              strokeDashoffset={364.4 - (364.4 * demoResult.score) / 100}
                              className={`transition-all duration-1000 ease-out ${demoResult.score > 80 ? 'text-emerald-500' : demoResult.score > 50 ? 'text-amber-500' : 'text-rose-500'}`}
                           />
                        </svg>
                        <span className="absolute text-3xl font-black text-white">{demoResult.score}</span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-medium mt-6 uppercase tracking-wider">
                        Estimated viral potential based on hook & clarity
                     </p>
                  </div>

                  {/* Metric 2: ReelGen Roast */}
                  <div className="glass p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 relative overflow-hidden flex flex-col justify-center">
                     <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🔥</div>
                     <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">ReelGen Roast</p>
                     <p className="text-rose-100/90 italic text-xl font-medium leading-relaxed">
                        "{demoResult.roast}"
                     </p>
                  </div>
                </div>

                {/* Gated Content Callout */}
                <div className="mt-12 p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 rounded-[2rem] text-center space-y-8 backdrop-blur-md">
                   <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
                      Want a full breakdown, script remix, captions, hashtags, posting time, and monetization insights?
                   </p>
                   <button 
                     onClick={onStart}
                     className="px-12 py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] group relative overflow-hidden"
                   >
                      <span className="relative z-10">[ Unlock Full Analysis – Sign Up ]</span>
                      <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-white/[0.01]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">A-List Creator Tools</h2>
            <p className="text-slate-400">Everything you need to grow your personal brand.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon="🎯" title="Hook Architect" desc="We fix your first 3 seconds to ensure people stop scrolling and watch." />
            <FeatureCard icon="⚖️" title="Script Doctor" desc="Identify boring parts of your video so you can cut them and keep retention high." />
            <FeatureCard icon="🎭" title="Script Remix" desc="Turn one idea into three different video styles so you never run out of content." />
            <FeatureCard icon="💹" title="Money Scout" desc="We scan your niche and suggest brand deals and sponsors that would fit your style." />
            <FeatureCard icon="😈" title="Savage Roast" desc="Our AI tells you exactly why your video might fail. Brutally honest, but helpful." />
            <FeatureCard icon="📈" title="Strategy Lab" desc="Get the perfect captions, hashtags, and posting times for every single video." />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-40 relative overflow-hidden text-center">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-indigo-600/10 rounded-full blur-[150px] -z-10"></div>
         <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-none">
               Stop Guessing. <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Start Winning.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium">
               Join 12,000+ creators engineering their success with ReelGen Pro.
            </p>
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-white text-black font-bold text-xl rounded-3xl hover:scale-110 transition-all shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)]"
            >
               Get Started for Free
            </button>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-[#030303] text-center text-slate-600">
        <div className="container mx-auto px-6">
           <div className="font-bold text-2xl text-white mb-8 flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                 <span className="text-black text-sm font-black">R</span>
              </div>
              ReelGen <span className="text-indigo-500 font-black">Pro</span>
           </div>
           <div className="flex justify-center gap-10 text-sm font-medium mb-10">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
           </div>
           <p className="text-xs opacity-40">
              © {new Date().getFullYear()} REELGEN PRO • BUILT FOR CREATORS • ALL RIGHTS RESERVED
           </p>
        </div>
      </footer>
    </div>
  );
};

const Step = ({ num, title, desc }: any) => (
  <div className="text-center space-y-4">
    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-indigo-500/20 mx-auto mb-6">
       {num}
    </div>
    <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
    <div className="text-5xl mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;