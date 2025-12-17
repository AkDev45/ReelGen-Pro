import React from 'react';
import { ThumbnailConfig } from '../types';

interface ThumbnailPreviewProps {
  config: ThumbnailConfig;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ config }) => {
  return (
    <div className="w-full bg-[#080808] rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
       {/* Card Header */}
       <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <span className="text-xl">🎨</span> AI Thumbnail Architect
             </h3>
             <p className="text-xs text-slate-400 mt-1">Generated high-CTR concept based on video analysis.</p>
          </div>
          <div className="flex gap-2">
             <div className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-slate-300 border border-white/5">
                {config.layout}
             </div>
          </div>
       </div>

       <div className="flex flex-col md:flex-row gap-8">
          
          {/* Preview Canvas */}
          <div className="w-full md:w-2/3 aspect-video bg-[#111] rounded-xl overflow-hidden relative shadow-2xl border border-white/5 group-hover:border-white/10 transition-colors">
             {/* Dynamic Background */}
             <div 
               className="absolute inset-0 w-full h-full"
               style={{
                  background: `linear-gradient(135deg, ${config.primaryColor} 0%, #000000 100%)`
               }}
             ></div>
             <div className="absolute inset-0 bg-black/20 backdrop-contrast-125"></div>

             {/* Layout Simulation */}
             <div className="absolute inset-0 p-8 flex flex-col justify-center h-full relative z-10">
                {/* Mock Face Area for 'Face-Focus' or 'Split' */}
                {(config.layout === 'Face-Focus' || config.layout === 'Split-Screen') && (
                   <div className={`absolute bottom-0 ${config.layout === 'Split-Screen' ? 'right-0 w-1/2' : 'right-8 w-1/3'} h-full flex items-end justify-center`}>
                      <div className="w-full h-4/5 bg-gradient-to-t from-black/80 to-transparent rounded-t-full border-t border-white/10 flex items-end justify-center pb-4 backdrop-blur-[2px]">
                         <span className="text-white/30 text-xs font-mono uppercase tracking-widest">[Creator Face]</span>
                      </div>
                   </div>
                )}

                {/* Text Layer */}
                <div className={`relative z-20 ${config.layout === 'Split-Screen' ? 'w-1/2' : 'w-full'} space-y-2`}>
                   <h1 
                     className="text-3xl md:text-4xl font-black uppercase leading-[0.9] tracking-tighter drop-shadow-xl"
                     style={{ color: config.accentColor, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
                   >
                     {config.headline}
                   </h1>
                   <div className="inline-block px-2 py-0.5 bg-black/60 text-white text-sm font-bold uppercase tracking-wide rounded">
                      {config.subtext}
                   </div>
                </div>

                {/* Mock UI Elements (Play button, duration) */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                   0:59
                </div>
             </div>
          </div>

          {/* Details Panel */}
          <div className="w-full md:w-1/3 space-y-4">
             <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Color Palette</h4>
                <div className="flex gap-3">
                   <div className="flex-1 space-y-1">
                      <div className="h-8 w-full rounded-md shadow-sm border border-white/10" style={{ background: config.primaryColor }}></div>
                      <p className="text-[10px] font-mono text-slate-400">{config.primaryColor}</p>
                   </div>
                   <div className="flex-1 space-y-1">
                      <div className="h-8 w-full rounded-md shadow-sm border border-white/10" style={{ background: config.accentColor }}></div>
                      <p className="text-[10px] font-mono text-slate-400">{config.accentColor}</p>
                   </div>
                </div>
             </div>

             <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Design Logic</h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                   "{config.description}"
                </p>
             </div>

             <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700">
                Download Concept Assets
             </button>
          </div>

       </div>
    </div>
  );
};

export default ThumbnailPreview;
