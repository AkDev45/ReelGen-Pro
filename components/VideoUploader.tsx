import React, { useRef } from 'react';
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
  // New props for text input
  inputType: 'video' | 'script';
  setInputType: (type: 'video' | 'script') => void;
  scriptText: string;
  setScriptText: (text: string) => void;
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
  setScriptText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <section className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-700/50">
      
      {/* Top Controls: Input Type & Action Mode */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        
        {/* Input Type Toggle */}
        <div className="bg-slate-900/80 p-1 rounded-lg flex border border-slate-700/50">
           <button
             onClick={() => setInputType('video')}
             className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
               inputType === 'video' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
             }`}
           >
             📹 Video Upload
           </button>
           <button
             onClick={() => setInputType('script')}
             className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
               inputType === 'script' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
             }`}
           >
             📝 Paste Script
           </button>
        </div>

        {/* Action Mode Toggle */}
        <div className="bg-slate-900/80 p-1 rounded-lg flex border border-slate-700/50">
          <button
            onClick={() => setMode('analyze')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'analyze' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setMode('remix')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              mode === 'remix' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Remix
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left: Input Area */}
        <div className="w-full md:w-2/5 flex flex-col">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {inputType === 'video' 
              ? (mode === 'remix' ? 'Upload to remix' : 'Upload your reel') 
              : 'Paste your script or ideas'}
          </label>
          
          {inputType === 'video' ? (
            /* Video Dropzone */
            <div 
              className="flex-1 min-h-[200px] border-2 border-dashed border-slate-700 hover:border-indigo-500/50 transition-colors p-6 rounded-xl bg-slate-900/40 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/*" 
                onChange={handleUploadChange} 
                className="hidden" 
              />
              <div className="w-12 h-12 mb-3 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p className="text-sm text-slate-300 text-center font-medium">Click to upload video</p>
              <p className="text-xs text-slate-500 text-center mt-1">MP4, MOV (Max 50MB)</p>
            </div>
          ) : (
            /* Script Text Area */
            <div className="flex-1 min-h-[200px] relative">
               <textarea
                 value={scriptText}
                 onChange={(e) => setScriptText(e.target.value)}
                 placeholder="Paste your video script, rough notes, or voiceover text here..."
                 className="w-full h-full min-h-[200px] bg-slate-900/40 border-2 border-slate-700 rounded-xl p-4 text-slate-300 text-sm focus:border-indigo-500/50 focus:ring-0 resize-none transition-colors placeholder:text-slate-600"
               />
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={onProcess}
              disabled={!hasContent || isProcessing}
              className={`w-full py-3 rounded-lg font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all
                ${!hasContent || isProcessing 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : mode === 'remix'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transform hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white transform hover:-translate-y-0.5'
                }`}
            >
              {isProcessing && <Spinner size="sm" className="border-white" />}
              {isProcessing 
                ? (mode === 'remix' ? "Remixing..." : "Analyzing...") 
                : (mode === 'remix' ? "Remix Script" : "Generate Magic")
              }
            </button>
          </div>
        </div>

        {/* Right: Preview Area (Video or Static Icon for Script) */}
        <div className="w-full md:w-3/5 bg-slate-900/40 p-1 rounded-xl border border-slate-700/50 flex flex-col">
          {inputType === 'video' ? (
             <div className="relative w-full h-0 pb-[100%] md:pb-[56.25%] bg-black rounded-lg overflow-hidden flex-1">
              {videoState.url ? (
                <video 
                  ref={videoRef} 
                  src={videoState.url} 
                  controls 
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-contain"
                  onLoadedData={handleLoadedData}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <svg className="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9v6l5-3-5-3zm-1 0v6h-1v-6h1zm-1 0v6h-1v-6h1zm-1 0v6h-1v-6h1zm16-1v8h-20v-8h20zm-2 2h-16v4h16v-4z"/></svg>
                  <span className="text-sm">Video preview</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full min-h-[200px] md:min-h-[auto] bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-8 text-center">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </div>
               <h3 className="text-slate-300 font-semibold mb-2">Script Analysis Mode</h3>
               <p className="text-slate-500 text-sm max-w-xs">
                 The AI will analyze your text for hook strength, tone, and viral potential, or remix it into new variations.
               </p>
            </div>
          )}
          
          {inputType === 'video' && (
            <div className="px-3 py-2 flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>{videoState.file ? videoState.file.name : "NO_FILE"}</span>
              <span>{videoState.file ? `${(videoState.file.size / (1024 * 1024)).toFixed(1)} MB` : "--"}</span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default VideoUploader;