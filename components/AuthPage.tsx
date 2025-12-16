import React, { useState, useEffect } from 'react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'signup';
type CreatorType = 'creator' | 'coach' | 'brand' | 'business';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [creatorType, setCreatorType] = useState<CreatorType | null>(null);
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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (mode === 'signup') {
      setLoadingText("Setting up your AI Reel Coach...");
    } else {
      setLoadingText("Authenticating...");
    }

    // Simulate API call
    setTimeout(() => {
      onLoginSuccess();
    }, 1500);
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
              <p className="text-slate-400 text-sm mb-8">
                {mode === 'login' ? 'Access your dashboard and saved scripts.' : 'Takes less than 30 seconds.'}
              </p>

              {/* Google Button (Primary) */}
              <button 
                onClick={handleAuth}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
              </button>
              
              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] bg-slate-800 flex-1"></div>
                <span className="text-xs text-slate-500 font-medium">
                   {mode === 'login' ? 'or continue with email' : 'or create account manually'}
                </span>
                <div className="h-[1px] bg-slate-800 flex-1"></div>
              </div>

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
                    placeholder="Email or Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#151515] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all group-hover:border-slate-700"
                  />
                  {mode === 'login' && email && <p className="text-[10px] text-slate-500 mt-1 ml-1">We’ll never share this.</p>}
                </div>

                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={mode === 'signup' ? "Create a strong password" : "Password"}
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
                  {/* Strength Meter (Mock) */}
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
                    <p className="text-[10px] text-slate-500 italic">This helps us personalize your analysis.</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                   type="submit"
                   disabled={isLoading}
                   className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
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
                    <button onClick={() => setMode('signup')} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                      Create an account →
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm">
                    Already have an account?{' '}
                    <button onClick={() => setMode('login')} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
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
