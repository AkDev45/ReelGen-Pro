import React from 'react';
import { AIAnalysisResult } from '../types';

interface ResultsGridProps {
  results: AIAnalysisResult | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
  if (!results) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* --- ROW 1: SCORES & HOOK --- */}
      
      {/* Viral Score Card */}
      <div className="col-span-1 md:col-span-4 bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div>
           <h2 className="text-lg font-bold text-slate-200">Viral Potential</h2>
           <p className="text-xs text-slate-400 mt-1">AI-predicted reach score</p>
        </div>
        <div className="flex items-end gap-2 mt-4">
          <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-purple-400">
            {results.viralScore}
          </span>
          <span className="text-lg text-slate-500 font-medium mb-1">/100</span>
        </div>
        <div className="w-full bg-slate-700/50 h-2 rounded-full mt-4 overflow-hidden">
           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${results.viralScore}%` }}></div>
        </div>
      </div>

      {/* Hook Analysis Card */}
      <div className="col-span-1 md:col-span-8 bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Hook Strength: <span className={results.hookStrength > 7 ? "text-green-400" : "text-amber-400"}>{results.hookStrength}/10</span>
            </h3>
          </div>
        </div>
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30">
          <p className="text-sm text-slate-300 italic">
            "{results.hookSuggestion}"
          </p>
        </div>
      </div>

      {/* --- NEW ROW: REEL GEN ROAST --- */}
      <div className="col-span-1 md:col-span-12 bg-gradient-to-r from-orange-900/40 via-red-900/30 to-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-orange-500/30 flex items-center gap-6 relative overflow-hidden shadow-lg shadow-orange-900/10">
        <div className="absolute -right-8 -top-8 text-[8rem] opacity-5 rotate-12 select-none">🔥</div>
        <div className="hidden md:flex h-16 w-16 bg-orange-500/20 rounded-full items-center justify-center shrink-0 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <span className="text-3xl" role="img" aria-label="devil">😈</span>
        </div>
        <div className="relative z-10 w-full">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-orange-200 uppercase tracking-wide">Reel Gen Roast</h3>
                <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2 py-0.5 rounded border border-orange-500/30 font-bold">AI UNCENSORED</span>
            </div>
            <p className="text-orange-100/90 text-sm md:text-base italic font-medium leading-relaxed">
                "{results.roast}"
            </p>
        </div>
      </div>

      {/* --- NEW UNIQUE FEATURES ROW --- */}
      
      {/* Feature 1: Brand Deal Scout */}
      <div className="col-span-1 md:col-span-6 bg-gradient-to-br from-emerald-900/40 to-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <svg className="w-24 h-24 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.38 0 2.53-.83 2.53-1.92 0-1.02-.93-1.63-2.31-2.09l-1.61-.53c-1.71-.56-2.67-1.76-2.67-3.23 0-1.87 1.4-3.12 3.16-3.48V3h2.67v1.86c1.72.37 2.87 1.57 2.95 3.19h-2.02c-.11-.84-.96-1.57-2.16-1.57-1.33 0-2.29.83-2.29 1.8 0 .93.9 1.54 2.12 1.95l1.61.53c1.9.62 2.88 1.83 2.88 3.32 0 2.01-1.55 3.35-3.38 3.71z"/></svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-100 mb-1 flex items-center gap-2">
           💰 Brand Deal Scout
        </h3>
        <p className="text-emerald-400/80 text-xs mb-4">Monetization Intelligence</p>
        
        <div className="space-y-4">
           <div>
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Detected Niche</span>
              <p className="text-slate-200 font-medium">{results.brandDealScout.niche}</p>
           </div>
           
           <div>
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Target Sponsors</span>
              <div className="flex gap-2 mt-1">
                 {results.brandDealScout.potentialSponsors.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded border border-emerald-500/30">{s}</span>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900/60 rounded-xl p-3 border border-emerald-500/20">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] text-slate-500 uppercase font-bold">Pitch Draft</span>
                 <button onClick={() => copyToClipboard(results.brandDealScout.pitchDraft)} className="text-xs text-emerald-400 hover:text-emerald-300">Copy</button>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{results.brandDealScout.pitchDraft}"</p>
           </div>
        </div>
      </div>

      {/* Feature 2: Magic B-Roll Director */}
      <div className="col-span-1 md:col-span-6 bg-gradient-to-br from-purple-900/40 to-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
           <svg className="w-24 h-24 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
        </div>
        <h3 className="text-lg font-bold text-purple-100 mb-1 flex items-center gap-2">
           🎬 Magic B-Roll Director
        </h3>
        <p className="text-purple-400/80 text-xs mb-4">Retention Fixes & Edits</p>

        <div className="space-y-3">
           {results.bRollSuggestions.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-xl border border-purple-500/20">
                 <div className="bg-purple-500/20 text-purple-300 font-mono text-xs px-2 py-1 rounded min-w-[50px] text-center mt-0.5">
                    {item.timestamp}
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                       <span className="text-xs font-bold text-purple-200">{item.type}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{item.suggestion}</p>
                 </div>
              </div>
           ))}
           {results.bRollSuggestions.length === 0 && (
             <p className="text-xs text-slate-500 italic">No major editing fixes needed. Great flow!</p>
           )}
        </div>
      </div>


      {/* --- ROW 2: CONTENT & PRODUCTION --- */}

      {/* Main Content (Captions & Script) */}
      <div className="col-span-1 md:col-span-8 space-y-6">
        
        {/* Captions */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-200">Viral Captions</h3>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">Click to Copy</span>
          </div>
          <div className="space-y-3">
            {results.captions.map((caption, idx) => (
              <button 
                key={idx} 
                onClick={() => copyToClipboard(caption)}
                className="w-full text-left group relative bg-slate-900/40 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/80 p-4 rounded-xl transition-all"
              >
                <p className="text-sm text-slate-300">{caption}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Comment Strategy (Engagement Bait) */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
           <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500"></div>
           <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Suggested Pinned Comment
              </h3>
              <button onClick={() => copyToClipboard(results.engagementBait)} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Copy</button>
           </div>
           <p className="text-slate-400 text-xs mb-3">Pin this to your comment section to spark debate.</p>
           <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 text-slate-200 text-sm font-medium">
             "{results.engagementBait}"
           </div>
        </div>

        {/* Production Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Visuals</h4>
               <p className="text-sm text-slate-300 leading-snug">{results.visualQuality}</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audio Vibe</h4>
               <p className="text-sm text-slate-300 leading-snug">{results.audioMood}</p>
            </div>
        </div>

      </div>

      {/* --- ROW 2 Sidebar --- */}
      <aside className="col-span-1 md:col-span-4 space-y-6">
        
        {/* SEO Keywords */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
           <h3 className="font-semibold text-slate-200 mb-4 text-sm">Description SEO Keywords</h3>
           <div className="flex flex-wrap gap-2">
            {results.keywords.map((kw, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-900 text-slate-400 text-xs rounded border border-slate-800">
                {kw}
              </span>
            ))}
           </div>
        </div>

        {/* Hashtags */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <h3 className="font-semibold text-slate-200 mb-4 text-sm">Trending Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {results.hashtags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-md border border-indigo-500/20">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => copyToClipboard(results.hashtags.join(" "))}
            className="w-full mt-4 py-2 border border-slate-600 hover:bg-slate-700/50 rounded-lg text-xs text-slate-300 transition-colors"
          >
            Copy All Tags
          </button>
        </div>

        {/* Post Times */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
           <h3 className="font-semibold text-slate-200 mb-4 text-sm">Best Time to Post</h3>
           <div className="space-y-3">
             {results.postTimes.map((time, idx) => (
               <div key={idx} className="flex justify-between items-center p-2 bg-slate-900/30 rounded-lg border border-slate-800">
                 <span className="text-xs text-slate-300 font-medium">{time.label}</span>
                 <div className="flex items-center gap-1">
                   <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${time.score * 100}%` }}
                     />
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Story Ideas */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <h3 className="font-semibold text-slate-200 mb-4 text-sm">Story Ideas</h3>
          <ul className="space-y-3">
            {results.storyIdeas.map((idea, idx) => (
              <li key={idx} className="text-xs text-slate-400 flex gap-2 leading-relaxed">
                <span className="text-indigo-500 mt-0.5">•</span>
                {idea}
              </li>
            ))}
          </ul>
        </div>

      </aside>

      {/* Script Section (Full width at bottom) */}
       <div className="col-span-1 md:col-span-12 bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
           <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-200">Content Structure Analysis</h3>
            <button 
              onClick={() => copyToClipboard(results.script)}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Copy Structure
            </button>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 text-sm text-slate-400 font-mono whitespace-pre-wrap border border-slate-800">
            {results.script}
          </div>
        </div>
    </section>
  );
};

export default ResultsGrid;