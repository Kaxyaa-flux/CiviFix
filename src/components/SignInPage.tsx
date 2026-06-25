import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, Mail, Lock, Eye, EyeOff, Shield, ShieldCheck, 
  ArrowRight, Check, AlertCircle, Award, Sparkles, Building2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface SignInPageProps {
  onAuthSuccess: (user: User) => void;
}

export default function SignInPage({ onAuthSuccess }: SignInPageProps) {
  const navigate = useNavigate();
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDemo = (role: 'citizen' | 'moderator') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser: User = role === 'moderator' 
        ? {
            id: 'demo-mod',
            email: 'clara.moderator@municipal.gov',
            fullName: 'Clara J. (Gov Moderator)',
            avatar: 'av2',
            role: 'moderator',
            reputationPoints: 480,
            joinedAt: '2026-03-12'
          }
        : {
            id: 'demo-user',
            email: 'sandro.citizen@civic.org',
            fullName: 'Sandro K. (Citizen)',
            avatar: 'av1',
            role: 'citizen',
            reputationPoints: 120,
            joinedAt: '2026-05-20'
          };
      onAuthSuccess(demoUser);
      navigate('/');
    }, 700);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail.trim().toLowerCase(), password: signInPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to sign in');
      } else {
        localStorage.setItem('civic_token', data.token);
        onAuthSuccess(data.user);
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred during sign in.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DAF1DE]/30 dark:bg-[#051F20] text-slate-900 dark:text-slate-50 pt-36 pb-16 flex items-center justify-center transition-colors duration-300 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-5xl bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative z-10">
        
        {/* LEFT PANEL */}
        <div className="md:w-5/12 bg-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          <div className="absolute top-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full bg-[#163832]/15 blur-[60px]" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DAF1DE]/20/5 border border-white/10 rounded-full text-xs font-mono text-blue-400">
              <Building2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              SECURE IDENTITY NETWORK
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Civic <span className="text-[#8EB69B]">Shield</span> Access
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock official municipal dashboard capabilities, claim volunteer tasks, authorize validation sweeps, and track community impact.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="w-5.5 h-5.5 rounded-lg bg-[#8EB69B]/10 border border-[#235347]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">AI Trust Scoring</h4>
                  <p className="text-[11px] text-slate-400">Authenticated reports are prioritized with 95% higher automated scan approvals.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5.5 h-5.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Reputation Leaderboards</h4>
                  <p className="text-[11px] text-slate-400">Earn municipal badges and ascend the live Community Hero list.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5.5 h-5.5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Volunteer Moderator Tools</h4>
                  <p className="text-[11px] text-slate-400">Claim tasks, update public dispatches, and trigger street patching.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 text-[10px] font-mono text-slate-500 relative z-10">
            MUNICIPAL DATA INTEGRITY SYSTEM v2.6 // AES SECURED
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center min-h-[500px]">
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-850 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign In</h3>
            <button 
              onClick={() => navigate('/')}
              className="text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl flex items-center gap-2 mb-4 font-sans"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            key="signin"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            onSubmit={handleSignInSubmit}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="email"
                  required
                  placeholder="e.g. sandro@civic.org"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-[#163832] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-[#235347]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
                <span className="text-[10px] text-slate-400 font-mono">Demo: Enter any 4 chars</span>
              </div>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-[#163832] rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-hidden focus:border-[#235347]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#163832] hover:bg-[#0B2B26] text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-6"
            >
              {isLoading ? 'Decrypting Secure Token...' : 'Authenticate Account'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Don't have an account? </span>
              <Link to="/signup" className="text-xs font-bold text-[#8EB69B] hover:underline">
                Sign Up
              </Link>
            </div>

            {/* Demo Quick Entry Block */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-850 mt-6">
              <p className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-2.5 text-center">
                Instant Demo Workspace Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('citizen')}
                  className="bg-slate-100 dark:bg-[#051F20] border border-slate-200 dark:border-[#163832] p-2.5 rounded-xl hover:border-[#235347]/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <UserIcon className="w-3.5 h-3.5 text-[#8EB69B]" />
                    Citizen Demo
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-[#8EB69B] font-mono">
                    sandro.citizen@civic.org
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('moderator')}
                  className="bg-slate-100 dark:bg-[#051F20] border border-slate-200 dark:border-[#163832] p-2.5 rounded-xl hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    Moderator Demo
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-emerald-500 font-mono">
                    clara.moderator@municipal.gov
                  </p>
                </button>
              </div>
            </div>

          </motion.form>

        </div>
      </div>
    </div>
  );
}
