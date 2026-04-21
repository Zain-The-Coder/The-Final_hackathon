import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import ResetPasswordModal from '../components/ResetPasswordModal';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetOpen, setIsResetOpen] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
       const res = await login(email, password);
       if (!res.success) setError(res.message);
    } else {
       const res = await register(name, email, password);
       if (!res.success) setError(res.message);
    }
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center -mt-24 px-12">
      <div className="w-full max-w-[1000px] grid lg:grid-cols-2 shadow-2xl rounded-[32px] overflow-hidden bg-[#f4efe6]">
        
        {/* Left: Info Side */}
        <div className="bg-[#1d2d2a] p-12 text-white flex flex-col justify-center relative overflow-hidden">
           <div className="space-y-6 relative z-10">
              <p className="text-[15px] font-bold tracking-[0.15em] text-white/60 uppercase">COMMUNITY ACCESS</p>
              <h1 className="text-5xl font-display font-bold leading-[1.1] tracking-tight text-white mb-6">
                 Enter the support<br />network.
              </h1>
              <p className="text-white/80 text-[15px] font-medium leading-relaxed mb-6">
                 Join a multi-page product flow designed for asking, offering, and tracking help with a premium interface. Powered by real MERN database interactions.
              </p>
              <ul className="space-y-4 text-white/80 font-medium text-[14px]">
                 <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5"></span>
                    <span>Role-based entry and verification tracking</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5"></span>
                    <span>Direct path into dashboard, live requests, and AI analytics</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5"></span>
                    <span>Secure JWT sessions across the platform</span>
                 </li>
              </ul>
           </div>
        </div>

        {/* Right: Form Side */}
        <div className="bg-[#fffaf3] p-12 flex flex-col justify-center relative overflow-hidden text-charcoal">
           <div className="space-y-6 relative z-10 w-full">
              <div className="space-y-2 mb-8">
                 <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#0f766e] uppercase">
                    {isLogin ? 'LOGIN' : 'SIGNUP'}
                 </p>
                 <h2 className="text-3xl font-display font-bold tracking-tight">
                    {isLogin ? 'Authenticate your profile' : 'Create your community profile'}
                 </h2>
              </div>

              {error && (
                 <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
                    {error}
                 </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                 {!isLogin && (
                    <div className="space-y-2">
                       <label className="text-[12px] font-bold text-muted">Full Name</label>
                       <input 
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder="Jane Doe"
                         required
                         className="w-full bg-white border border-charcoal/5 focus:border-[#0f766e]/40 rounded-2xl p-4 outline-none font-medium placeholder:text-charcoal/30"
                       />
                    </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-muted">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@helplytics.ai"
                      required
                      className="w-full bg-white border border-charcoal/5 focus:border-[#0f766e]/40 rounded-2xl p-4 outline-none font-medium placeholder:text-charcoal/30"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-muted">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-charcoal/5 focus:border-[#0f766e]/40 rounded-2xl p-4 outline-none font-medium text-charcoal/80 tracking-widest placeholder:text-charcoal/30" 
                    />
                    {isLogin && (
                       <div className="flex justify-end px-1">
                          <button 
                            type="button"
                            onClick={() => setIsResetOpen(true)}
                            className="text-[11px] font-bold text-muted hover:text-secondary transition-colors"
                          >
                            Forgot password?
                          </button>
                       </div>
                    )}
                 </div>

                 <button type="submit" className="w-full mt-4 bg-gradient-to-br from-[#0f766e] to-[#14b8a6] hover:-translate-y-0.5 transition-transform shadow-[0_18px_36px_rgba(15,118,110,0.22)] text-white py-4 rounded-full font-bold text-[15px]">
                    {isLogin ? 'Continue to dashboard' : 'Create account'}
                 </button>
              </form>

              <div className="text-center pt-4 border-t border-charcoal/5">
                 <button 
                   onClick={() => setIsLogin(!isLogin)}
                   className="text-[12px] font-bold text-muted hover:text-[#0f766e] transition-colors"
                 >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                 </button>
              </div>
           </div>
        </div>
      </div>
      <ResetPasswordModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </div>
  );
};

export default AuthPage;
