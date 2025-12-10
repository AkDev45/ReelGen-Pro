import React from 'react';
import { ThumbnailGenResult } from '../types';

interface ThumbnailResultProps {
  result: ThumbnailGenResult | null;
}

const ThumbnailResult: React.FC<ThumbnailResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <section className="animate-in fade-in duration-700 slide-in-from-bottom-4 space-y-6">
      <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-orange-400">
             Auto-Generated Thumbnail
           </h2>
           <p className="text-slate-400 text-sm mt-1">
             AI selected frame at <span className="text-amber-400 font-mono">{result.config.timestamp}s</span> with {result.theme} styling.
           </p>
        </div>
        <a 
          href={result.imageUrl} 
          download={`thumbnail-${result.theme}.jpg`}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-amber-900/20 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Image
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Image */}
        <div className="w-full md:w-2/3 bg-slate-900/50 rounded-2xl p-2 border border-slate-700/50">
          <img 
            src={result.imageUrl} 
            alt="Generated Thumbnail" 
            className="w-full h-auto rounded-xl shadow-2xl" 
          />
        </div>

        {/* AI Analysis Side Panel */}
        <div className="w-full md:w-1/3 space-y-4">
           <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <h3 className="text-slate-200 font-semibold text-sm mb-3">AI Design Logic</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Catchy Title</span>
                  <p className="text-slate-200 font-medium font-serif italic">"{result.config.textOverlay}"</p>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Reasoning</span>
                  <p>{result.config.layoutDescription}</p>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Palette</span>
                  <div className="flex gap-2 mt-1">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: result.config.primaryColor }}></div>
                        <span className="text-[10px] mt-1 font-mono">{result.config.primaryColor}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: result.config.secondaryColor }}></div>
                        <span className="text-[10px] mt-1 font-mono">{result.config.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>
           </div>
           
           <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
             <p className="text-xs text-amber-200/80">
               Tip: You can regenerate with a different theme above to get a completely different vibe!
             </p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ThumbnailResult;