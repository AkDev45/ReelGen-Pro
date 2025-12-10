import React from 'react';
import { ScriptRemixResult } from '../types';

interface ScriptRemixResultsProps {
  results: ScriptRemixResult | null;
}

const ScriptRemixResults: React.FC<ScriptRemixResultsProps> = ({ results }) => {
  if (!results) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
          Script Extractor & Remix
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Original transcription plus 3 fresh takes to re-record your content.
        </p>
      </div>

      {/* Original Script */}
      <div className="bg-slate-900/40 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 bg-slate-800/40 border-b border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wide">Original Transcript</h3>
          </div>
          <button 
            onClick={() => copyToClipboard(results.originalScript)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono opacity-80">
          {results.originalScript}
        </div>
      </div>

      {/* Grid of Variations */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 pl-1">Remixed Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.variations.map((variant, idx) => (
            <div key={idx} className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col hover:border-indigo-500/30 transition-colors">
              <div className="mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border 
                  ${idx === 0 ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 
                    idx === 1 ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 
                    'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
                  {variant.title}
                </span>
              </div>
              <div className="flex-1 bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-800">
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {variant.content}
                </p>
              </div>
              <button 
                onClick={() => copyToClipboard(variant.content)}
                className="w-full py-2.5 rounded-lg bg-slate-700/50 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-medium transition-all"
              >
                Copy Script
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScriptRemixResults;