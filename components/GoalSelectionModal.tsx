
import React from 'react';
import { ContentGoal } from '../types';

interface GoalSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (goal: ContentGoal) => void;
}

const GoalSelectionModal: React.FC<GoalSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const goals: { id: ContentGoal; icon: string; title: string; desc: string; color: string }[] = [
    {
      id: 'growth',
      icon: '📈',
      title: 'Grow Followers',
      desc: 'Prioritize reach, shares, and viral hooks.',
      color: 'hover:border-indigo-500 hover:shadow-indigo-500/20'
    },
    {
      id: 'leads',
      icon: '💰',
      title: 'Get Leads',
      desc: 'Focus on authority, trust, and DM automation.',
      color: 'hover:border-emerald-500 hover:shadow-emerald-500/20'
    },
    {
      id: 'sales',
      icon: '🛍',
      title: 'Sell Product',
      desc: 'Focus on urgency, benefits, and click-throughs.',
      color: 'hover:border-rose-500 hover:shadow-rose-500/20'
    },
    {
      id: 'brand',
      icon: '🤝',
      title: 'Attract Brands',
      desc: 'Optimize for production quality and brand safety.',
      color: 'hover:border-amber-500 hover:shadow-amber-500/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 w-full max-w-2xl relative overflow-hidden">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">One Last Step.</h2>
          <p className="text-slate-400 text-lg">What is the <span className="text-white font-bold">primary goal</span> of this specific post?</p>
          <p className="text-xs text-slate-500 mt-2">The AI will adjust scoring and strategy based on your choice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => onSelect(goal.id)}
              className={`p-6 bg-[#111] border border-white/5 rounded-2xl text-left transition-all duration-300 group ${goal.color}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{goal.icon}</div>
              <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-snug">{goal.desc}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GoalSelectionModal;
