
import React, { useState } from 'react';
import { User } from '../types';
import Spinner from './Spinner';

interface PricingPageProps {
  user: User;
  onPlanChange: (plan: 'Free' | 'Pro') => Promise<void>;
}

const PricingPage: React.FC<PricingPageProps> = ({ user, onPlanChange }) => {
  const [loadingPlan, setLoadingPlan] = useState<'Free' | 'Pro' | null>(null);

  const handlePlanSelection = async (plan: 'Free' | 'Pro') => {
    if (user.plan === plan) return;
    
    setLoadingPlan(plan);
    try {
       await onPlanChange(plan);
    } catch (e) {
       console.error("Failed to update plan", e);
    } finally {
       setLoadingPlan(null);
    }
  };

  const isPro = user.plan === 'Pro';

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
       
       <header className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">Plans & Billing</h2>
        <p className="text-slate-400 font-light text-lg">
          Manage your subscription and unlock neural capabilities.
        </p>
      </header>

       {/* Plans Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl">
           
           {/* Free Plan */}
           <div className={`rounded-3xl p-8 border flex flex-col transition-all relative ${
               !isPro ? 'bg-[#111] border-white/20 shadow-lg shadow-white/5' : 'bg-[#0A0A0A] border-white/10 opacity-70 hover:opacity-100'
           }`}>
              <div className="mb-8">
                 <div className="flex justify-between items-start">
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">The Starter</p>
                    {!isPro && <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded">CURRENT PLAN</span>}
                 </div>
                 <h3 className="text-4xl font-black text-white">$0<span className="text-xl font-medium text-slate-500">/mo</span></h3>
                 <p className="text-slate-400 text-sm mt-4">Essential tools for hobbyist creators.</p>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                 <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-slate-300"><span className="text-white">✅</span> 3 Script Analyses total</li>
                    <li className="flex gap-3 text-sm text-slate-300"><span className="text-white">✅</span> Basic Viral Score</li>
                    <li className="flex gap-3 text-sm text-slate-500"><span className="opacity-30">❌</span> No Script Doctor rewrites</li>
                 </ul>
              </div>

              <button 
                 onClick={() => handlePlanSelection('Free')}
                 disabled={!isPro || loadingPlan !== null}
                 className={`w-full py-4 font-bold rounded-xl transition-all border ${
                    !isPro 
                      ? 'bg-white/5 border-white/10 text-slate-500 cursor-default' 
                      : 'bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40'
                 } flex items-center justify-center`}
              >
                 {loadingPlan === 'Free' ? (
                    <Spinner size="sm" className="border-white" />
                 ) : (
                    !isPro ? 'Current Plan' : 'Downgrade to Free'
                 )}
              </button>
           </div>

           {/* Pro Plan */}
           <div className={`rounded-3xl p-8 border flex flex-col relative overflow-hidden transition-all ${
               isPro ? 'bg-gradient-to-b from-indigo-900/20 to-[#0A0A0A] border-indigo-500/50 shadow-lg shadow-indigo-500/20' : 'bg-gradient-to-b from-[#0F0F12] to-[#0A0A0A] border-indigo-500/30'
           }`}>
              {isPro && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>}
              
              <div className="mb-8 relative z-10">
                 <div className="flex justify-between items-start">
                    <p className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">The Creator</p>
                    {isPro && <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg shadow-indigo-500/50">ACTIVE</span>}
                 </div>
                 <h3 className="text-4xl font-black text-white">$10<span className="text-xl font-medium text-slate-500">/mo</span></h3>
                 <p className="text-slate-300 text-sm mt-4">Full neural power for serious growth.</p>
              </div>
              
              <div className="flex-1 space-y-4 mb-8 relative z-10">
                 <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-white font-medium"><span className="text-indigo-400">⚡</span> 15+ Analyses / mo</li>
                    <li className="flex gap-3 text-sm text-white font-medium"><span className="text-indigo-400">⚡</span> Script Doctor (Rewrites)</li>
                    <li className="flex gap-3 text-sm text-white font-medium"><span className="text-indigo-400">⚡</span> Monetization Scout</li>
                    <li className="flex gap-3 text-sm text-white font-medium"><span className="text-indigo-400">⚡</span> Learning Lab Access</li>
                 </ul>
              </div>

              <button 
                 onClick={() => handlePlanSelection('Pro')}
                 disabled={isPro || loadingPlan !== null}
                 className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg relative z-10 flex items-center justify-center gap-2 ${
                    isPro 
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 cursor-default' 
                      : 'bg-white text-black hover:scale-[1.02] shadow-indigo-500/10'
                 }`}
              >
                 {loadingPlan === 'Pro' ? (
                    <>
                       <Spinner size="sm" className={isPro ? "border-indigo-400" : "border-slate-800"} />
                       <span>Processing...</span>
                    </>
                 ) : (
                    isPro ? 'Manage Subscription' : 'Upgrade to Pro'
                 )}
              </button>
              {!isPro && <p className="text-center text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wide">Cancel anytime</p>}
           </div>
       </div>

       {/* Billing History (Mock) */}
       <div className="border-t border-white/5 pt-12">
          <h3 className="text-lg font-bold text-white mb-6">Billing History</h3>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead>
                   <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-4 text-slate-500 font-medium">Date</th>
                      <th className="p-4 text-slate-500 font-medium">Description</th>
                      <th className="p-4 text-slate-500 font-medium text-right">Amount</th>
                      <th className="p-4 text-slate-500 font-medium text-right">Status</th>
                   </tr>
                </thead>
                <tbody>
                   {user.plan === 'Pro' ? (
                      <tr className="border-b border-white/5">
                         <td className="p-4 text-slate-300">{new Date().toLocaleDateString()}</td>
                         <td className="p-4 text-slate-300">ReelGen Pro - Monthly</td>
                         <td className="p-4 text-slate-300 text-right">$10.00</td>
                         <td className="p-4 text-right"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold">Paid</span></td>
                      </tr>
                   ) : (
                      <tr>
                         <td colSpan={4} className="p-8 text-center text-slate-600 italic">No billing history available.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  );
};

export default PricingPage;
