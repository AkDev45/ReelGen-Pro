
import React, { useState, useEffect, useRef } from 'react';
import { analyzeScriptContent } from '../services/geminiService';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [demoInput, setDemoInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<{ score: number; roast: string } | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // FAQ State
  const [leftOpenIndex, setLeftOpenIndex] = useState<number | null>(null);
  const [rightOpenIndex, setRightOpenIndex] = useState<number | null>(null);

  // How It Works Animation State
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Observer for How It Works section
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStepsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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

  const faqLeft = [
    { q: "What happens when I paste my script into ReelGen Pro?", a: "ReelGen Pro performs a deep scan analysis of your script — evaluating hook strength, clarity, emotional pull, pacing, and retention risks. You get a complete breakdown of what’s working and what needs improvement before you post." },
    { q: "Does ReelGen Pro rewrite my script?", a: "No. ReelGen Pro does not rewrite your script. Instead, it tells you what to add, what to remove, and what to improve so you stay in control of your voice while making smarter creative decisions." },
    { q: "Will this work for Instagram, TikTok, and YouTube Shorts?", a: "Yes. The analysis is optimized for short-form content behavior and works across Instagram Reels, TikTok, and YouTube Shorts." }
  ];

  const faqRight = [
    { q: "Will I get captions, hashtags, and posting guidance?", a: "Yes. Along with script analysis, ReelGen Pro provides optimized captions, relevant hashtags, and posting-time guidance." },
    { q: "Can ReelGen Pro help with monetization?", a: "Yes. ReelGen Pro identifies monetization scope by analyzing content positioning, brand friendliness, and potential sponsorship angles." },
    { q: "Do I need to upload a video?", a: "No. ReelGen Pro works entirely from your script. Just paste it in — no video upload required." }
  ];

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

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" ref={howItWorksRef} className="py-32 bg-white/[0.01] relative overflow-hidden">
         {/* Background Ambience */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
         
         <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">From Idea to Viral <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">in 3 Steps</span></h2>
               <p className="text-slate-400 text-lg">The clear path to creator growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               
               {/* Connector Line (Desktop Only) */}
               <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -z-10"></div>

               {/* Step 1 */}
               <div className={`transition-all duration-700 delay-0 ease-out ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  <StepCard 
                    number="01" 
                    title="Paste Your Script" 
                    desc="Drop your raw script into the editor. No formatting. No video upload. No complexity." 
                  />
               </div>

               {/* Step 2 */}
               <div className={`transition-all duration-700 delay-200 ease-out ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  <StepCard 
                    number="02" 
                    title="ReelGen Deep Scan Analysis" 
                    desc="ReelGen Pro performs a deep scan of your script to analyze hook strength, clarity, emotional triggers, pacing, and retention risks — showing exactly what’s working and what’s not." 
                  />
               </div>

               {/* Step 3 */}
               <div className={`transition-all duration-700 delay-400 ease-out ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  <StepCard 
                    number="03" 
                    title="Post with Clarity" 
                    desc="Get a proven hook direction, what to add and remove in your script, optimized captions, hashtags, posting guidance, and monetization scope — so you publish with confidence, not hope." 
                  />
               </div>

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
                  <div className="glass p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center relative overflow-hidden">
                     {/* Decorative background blur to make it pop */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>
                     
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 relative z-10">Virality Score</p>
                     
                     <div className="relative w-40 h-40 flex items-center justify-center z-10">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                           {/* Track */}
                           <circle
                              cx="60" cy="60" r="54"
                              stroke="currentColor" strokeWidth="8"
                              fill="transparent"
                              className="text-white/5"
                           />
                           {/* Progress */}
                           <circle
                              cx="60" cy="60" r="54"
                              stroke="currentColor" strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={339.292} // 2 * pi * 54
                              strokeDashoffset={339.292 - (339.292 * demoResult.score) / 100}
                              strokeLinecap="round"
                              className={`transition-all duration-1000 ease-out ${demoResult.score > 80 ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : demoResult.score > 50 ? 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-4xl font-black text-white tracking-tighter">{demoResult.score}</span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase">/ 100</span>
                        </div>
                     </div>
                     
                     <p className="text-[10px] text-slate-500 font-medium mt-6 uppercase tracking-wider relative z-10">
                        Estimated viral potential
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

      {/* --- USE CASES SECTION (NEW) --- */}
      <section className="py-32 bg-[#050505] relative border-t border-white/5">
         <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Built for Every Creator</h2>
               <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                 Whether you're building a personal brand or running an automation empire, ReelGen Pro adapts to your goals.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Use Case 1: The Expert */}
               <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                  <div className="p-10 relative">
                     <div className="absolute top-0 right-0 p-6 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500">
                        <span className="text-8xl">🎓</span>
                     </div>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-500/20">
                        For Coaches & Experts
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-4">The Authority Builder</h3>
                     <p className="text-slate-400 leading-relaxed mb-8">
                        You have the knowledge, but your videos feel like lectures. ReelGen Pro transforms your expertise into viral edutainment.
                     </p>
                     
                     <div className="space-y-4 bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 text-rose-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </div>
                           <div>
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Before</p>
                              <p className="text-sm text-slate-300">"Today I want to talk about three tips for better sleep..." (Scroll past)</p>
                           </div>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <div>
                              <p className="text-xs font-bold text-emerald-500 uppercase mb-1">With ReelGen</p>
                              <p className="text-sm text-white font-medium">"Stop sleeping 8 hours. It's killing your energy. Do this instead..." (Viral Hook)</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Use Case 2: Creators, Content Writers & SMMs */}
               <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                  <div className="p-10 relative">
                     <div className="absolute top-0 right-0 p-6 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500">
                        <span className="text-8xl">🚀</span>
                     </div>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6 border border-purple-500/20">
                        For Creators, Writers & SMMs
                     </div>
                     <h3 className="text-3xl font-bold text-white mb-8">The Content Powerhouse</h3>
                     
                     <div className="space-y-6">
                        {/* 1) The Script Doctor */}
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-2xl">
                              🩺
                           </div>
                           <div>
                              <h4 className="font-bold text-white text-lg mb-1">The Script Doctor</h4>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                 Diagnoses weak hooks, fixes pacing, and rewrites your ideas into scroll-stopping scripts — fast, story-driven, or bold.
                              </p>
                           </div>
                        </div>

                        {/* 2) Brand Collabs */}
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-2xl">
                              💰
                           </div>
                           <div>
                              <h4 className="font-bold text-white text-lg mb-1">Brand Collabs & Monetization</h4>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                 Crafts high-conversion brand collab cold DMs, pitch angles, and monetizable content ideas — so creators get paid, not ignored.
                              </p>
                           </div>
                        </div>

                        {/* 3) Content Coach */}
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-2xl">
                              🤖
                           </div>
                           <div>
                              <h4 className="font-bold text-white text-lg mb-1">All-in-One Content Coach</h4>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                 One AI that analyzes, teaches, rewrites, and guides — from idea to posting to monetization.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

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

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 relative border-t border-white/5 bg-[#050505]">
         <div className="container mx-auto px-6 max-w-5xl relative z-10">
            {/* Header */}
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Stop Guessing. Start Growing.</h2>
               <p className="text-slate-400 text-lg">Start for free. Upgrade when you're ready to scale.</p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto">
               
               {/* Free Plan */}
               <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 flex flex-col hover:border-white/20 transition-all">
                  <div className="mb-8">
                     <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">The Starter</p>
                     <h3 className="text-4xl font-black text-white">$0<span className="text-xl font-medium text-slate-500">/mo</span></h3>
                     <p className="text-slate-400 text-sm mt-4">Perfect for trying ReelGen Pro before committing.</p>
                  </div>
                  
                  <div className="flex-1 space-y-4 mb-8">
                     <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-white">✅</span> 3 Script Analyses total
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-white">✅</span> Basic Viral Score
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-white">✅</span> Hook Grade
                        </li>
                        <li className="flex gap-3 text-sm text-slate-500">
                           <span className="opacity-30">❌</span> No deep analysis
                        </li>
                        <li className="flex gap-3 text-sm text-slate-500">
                           <span className="opacity-30">❌</span> No Script Doctor rewrites
                        </li>
                     </ul>
                  </div>

                  <button 
                     onClick={onStart}
                     className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                  >
                     Start Free
                  </button>
                  <p className="text-center text-[10px] text-slate-600 mt-3 font-medium uppercase tracking-wide">No credit card required</p>
               </div>

               {/* Pro Plan */}
               <div className="bg-gradient-to-b from-[#0F0F12] to-[#0A0A0A] rounded-3xl p-8 border border-indigo-500/50 flex flex-col relative shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)] transform md:-translate-y-4">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">Most Popular</div>
                  
                  <div className="mb-8">
                     <p className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">The Creator</p>
                     <h3 className="text-4xl font-black text-white">$10<span className="text-xl font-medium text-slate-500">/mo</span></h3>
                     <p className="text-slate-300 text-sm mt-4">For serious creators who want clarity, not guesswork.</p>
                  </div>
                  
                  <div className="flex-1 space-y-4 mb-8">
                     <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-white font-medium">
                           <span className="text-indigo-400">⚡</span> 15+ Script Analyses / mo
                        </li>
                        <li className="flex gap-3 text-sm text-white font-medium">
                           <span className="text-indigo-400">⚡</span> Full Hook Strength Breakdown
                        </li>
                        <li className="flex gap-3 text-sm text-white font-medium">
                           <span className="text-indigo-400">⚡</span> Script Doctor (Fast, Story, Bold)
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-indigo-400">⚡</span> Deep Caption & Hashtag Analysis
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-indigo-400">⚡</span> Monetization & Brand Collab Insights
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-indigo-400">⚡</span> B-Roll & Visual Direction
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <span className="text-indigo-400">⚡</span> Learning Lab Access
                        </li>
                     </ul>
                  </div>

                  <button 
                     onClick={onStart}
                     className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
                  >
                     Upgrade to Pro
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wide">Cancel anytime</p>
               </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr>
                        <th className="p-4 border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/2">Feature Comparison</th>
                        <th className="p-4 border-b border-white/10 text-xs font-bold text-slate-300 uppercase tracking-widest text-center">Free</th>
                        <th className="p-4 border-b border-white/10 text-xs font-bold text-indigo-400 uppercase tracking-widest text-center">Pro</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {[
                        { name: "Monthly Script Analyses", free: "3", pro: "15+" },
                        { name: "Hook Score", free: "✅", pro: "✅" },
                        { name: "Caption Performance", free: "✅", pro: "✅" },
                        { name: "Hashtag Reach", free: "✅", pro: "✅" },
                        { name: "Script Doctor (Rewrites)", free: "-", pro: "✅" },
                        { name: "Deep Analysis (Logic)", free: "-", pro: "✅" },
                        { name: "B-Roll Suggestions", free: "-", pro: "✅" },
                        { name: "Monetization Insights", free: "-", pro: "✅" },
                        { name: "Learning Lab Access", free: "-", pro: "✅" },
                     ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                           <td className="p-4 text-slate-300 font-medium">{row.name}</td>
                           <td className="p-4 text-slate-400 text-center">{row.free}</td>
                           <td className="p-4 text-white text-center font-bold">{row.pro}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Trust Section */}
            <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-8 text-sm text-slate-500 font-medium">
               <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  No long-term contracts
               </span>
               <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Upgrade only when ready
               </span>
               <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Built for creators, not marketers
               </span>
            </div>

         </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Frequently Asked Questions</h2>
             <p className="text-slate-400">Common questions about ReelGen Pro analysis.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
             {/* Left Column */}
             <div className="space-y-4">
                {faqLeft.map((item, i) => (
                   <FAQItem 
                      key={i} 
                      question={item.q} 
                      answer={item.a} 
                      isOpen={leftOpenIndex === i} 
                      onClick={() => setLeftOpenIndex(leftOpenIndex === i ? null : i)} 
                   />
                ))}
             </div>
             
             {/* Right Column */}
             <div className="space-y-4">
                {faqRight.map((item, i) => (
                   <FAQItem 
                      key={i} 
                      question={item.q} 
                      answer={item.a} 
                      isOpen={rightOpenIndex === i} 
                      onClick={() => setRightOpenIndex(rightOpenIndex === i ? null : i)} 
                   />
                ))}
             </div>
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
           <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} REELGEN PRO • BUILT FOR CREATORS • ALL RIGHTS RESERVED • BUILT BY <a href="https://www.linkedin.com/in/mohammed-akram-digital-marketer/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors font-bold">AKRAM</a>
           </p>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ number, title, desc }: any) => (
  <div 
     className={`relative p-8 rounded-3xl border border-white/10 bg-[#0A0A0A] group hover:border-indigo-500/50 hover:bg-[#0F0F12] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)] flex flex-col items-start text-left h-full`}
  >
     {/* Number Badge */}
     <div className="mb-6 relative">
        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-700 to-slate-800 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-500 select-none">
           {number}
        </span>
        <div className="absolute -bottom-2 left-0 w-8 h-1 bg-slate-800 group-hover:bg-indigo-500 transition-colors duration-500 rounded-full"></div>
     </div>

     <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-100 transition-colors">
        {title}
     </h3>
     <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
        {desc}
     </p>
  </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`group bg-white/5 border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 ${isOpen ? 'border-indigo-500/30 bg-white/[0.07]' : 'hover:border-white/10'}`}
    >
      <div className="flex justify-between items-center">
        <h3 className={`font-bold text-lg transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
          {question}
        </h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen ? 'bg-indigo-500 border-indigo-500 rotate-180' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
           <svg className={`w-4 h-4 transition-colors ${isOpen ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      <div 
        className={`grid transition-[grid-template-rows,opacity,padding] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0 pt-0'}`}
      >
        <div className="overflow-hidden">
           <p className="text-slate-400 leading-relaxed">
             {answer}
           </p>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
    <div className="text-5xl mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
