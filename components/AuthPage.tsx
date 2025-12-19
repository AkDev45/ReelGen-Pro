
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'signup';
type CreatorType = 'creator' | 'coach' | 'brand' | 'business';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [creatorType, setCreatorType] = useState<CreatorType>('creator');
  const [showPassword, setShowPassword] = useState(false);

  // Animated Text Logic
  const phrases = ["Fix your hook", "Improve retention", "Post smarter"];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (mode === 'signup') {
      if (!email || !password || !username) {
         setError("All fields are required.");
         setIsLoading(false);
         return;
      }
      setLoadingText("Creating your AI profile...");
    } else {
      if (!email || !password) {
         setError("Please enter email and password.");
         setIsLoading(false);
         return;
      }
      setLoadingText("Authenticating...");
    }

    try {
       let user: User;
       if (mode === 'signup') {
         user = await authService.signup(email, password, username, creatorType);
       } else {
         user = await authService.login(email, password);
       }
       onLoginSuccess(user);
    } catch (err: any) {
       setError(err.message || "Authentication failed. Please try again.");
    } finally {
       setIsLoading(false);
    }
  };

  const CreatorTypeButton = ({ type, icon, label }: { type: CreatorType, icon: string, label: string }) => (
    <button
      type="button"
      onClick={() => setCreatorType(type)}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
        creatorType === type 
          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {creatorType === type && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,1)]"></span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans overflow-hidden flex relative selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[150px] animate-pulse pointer-events-none delay-1000"></div>

      {/* --- LEFT SIDE: BRAND EXPERIENCE --- */}
      <div className="hidden lg:flex w-1/2 relative z-10 flex-col justify-between p-16 border-r border-white/5 bg-gradient-to-br from-black/50 to-transparent backdrop-blur-sm">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <span className="text-white text-xl font-black">R</span>
          </div>
          <span className="text-2xl font-black tracking-tight">ReelGen <span className="text-indigo-500">Pro</span></span>
        </div>

        {/* Center Text */}
        <div className="max-w-md">
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
            Welcome back, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Creator.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 font-light">
            Your next reel deserves better reach. Stop guessing and start dominating the algorithm.
          </p>
          
          {/* Animated Phrase */}
          <div className="h-8 overflow-hidden relative">
            {phrases.map((phrase, i) => (
              <div 
                key={i} 
                className={`absolute top-0 left-0 transition-all duration-700 transform ${
                  i === phraseIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="flex items-center gap-3 text-indigo-400 font-bold text-lg uppercase tracking-widest">
                  <span className="w-8 h-[1px] bg-indigo-500"></span>
                  {phrase}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-slate-600 text-xs font-mono">
          © {new Date().getFullYear()} Social Hubspot. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: AUTH FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-black">ReelGen Pro</span>
            </div>
          </div>

          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Subtle Glow Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' ? 'Sign in to ReelGen Pro' : 'Create your account'}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {mode === 'login' ? 'Access your dashboard and saved scripts.' : 'Takes less than 30 seconds. No credit card required.'}
              </p>

              {error && (
                <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                   <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                
                {mode === 'signup' && (
                  <div className="group">
                    <input 
                      type="text" 
                      placeholder="Pick your creator name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#151515] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all group-hover:border-slate-700"
                    />
                    {username && <p className="text-[10px] text-slate-500 mt-1 ml-1">This will appear in your reports.</p>}
                  </div>
                )}

                <div className="group">
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#151515] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all group-hover:border-slate-700"
                  />
                </div>

                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={mode === 'signup' ? "Create a password" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#151515] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all group-hover:border-slate-700 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-600 hover:text-slate-400"
                  >
                    {showPassword ? (
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                  {/* Strength Meter */}
                  {mode === 'signup' && password.length > 0 && (
                     <div className="flex gap-1 mt-2 px-1">
                        <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? 'bg-red-500' : 'bg-slate-800'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${password.length > 6 ? 'bg-yellow-500' : 'bg-slate-800'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${password.length > 10 ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                     </div>
                  )}
                </div>

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Creator Type Selector */}
                {mode === 'signup' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">I am a...</label>
                    <div className="flex flex-wrap gap-2">
                       <CreatorTypeButton type="creator" icon="🎥" label="Creator" />
                       <CreatorTypeButton type="coach" icon="🧑‍🏫" label="Coach" />
                       <CreatorTypeButton type="business" icon="🏪" label="Business" />
                       <CreatorTypeButton type="brand" icon="🧑‍💼" label="Personal Brand" />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                   type="submit"
                   disabled={isLoading}
                   className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isLoading ? (
                     <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {loadingText}
                     </>
                   ) : (
                     mode === 'login' ? 'Sign In' : 'Create My Account'
                   )}
                </button>
                
                {mode === 'signup' && (
                  <p className="text-[10px] text-center text-slate-600 mt-2">
                     By signing up, you agree to our Terms & Privacy Policy.
                  </p>
                )}
              </form>

              {/* Mode Switcher */}
              <div className="mt-8 text-center">
                {mode === 'login' ? (
                  <p className="text-slate-400 text-sm">
                    New here?{' '}
                    <button onClick={() => { setMode('signup'); setError(null); }} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                      Create an account →
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm">
                    Already have an account?{' '}
                    <button onClick={() => { setMode('login'); setError(null); }} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                      Sign in →
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
