
import React, { useState, useEffect } from 'react';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  defaultTitle?: string;
}

const SaveProjectModal: React.FC<SaveProjectModalProps> = ({ isOpen, onClose, onSave, defaultTitle = '' }) => {
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    if (isOpen) setTitle(defaultTitle);
  }, [isOpen, defaultTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-2">Save Project</h3>
        <p className="text-slate-400 text-sm mb-6">Give your project a memorable name.</p>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Viral Skincare Hook V1"
          className="w-full bg-[#151515] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all mb-6"
          autoFocus
        />

        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(title)}
            disabled={!title.trim()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveProjectModal;
