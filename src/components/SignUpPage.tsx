import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, Mail, Lock, Eye, EyeOff, Shield, ShieldCheck, 
  ArrowRight, Check, AlertCircle, Award, Sparkles, Building2, UserCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface SignUpPageProps {
  onAuthSuccess: (user: User) => void;
}

const PRESET_AVATARS = [
  { id: 'av1', label: 'E', color: 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-slate-900 dark:text-white' },
  { id: 'av2', label: 'M', color: 'bg-gradient-to-tr from-green-500 to-teal-600 text-slate-900 dark:text-white' },
  { id: 'av3', label: 'S', color: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-900 dark:text-white' },
  { id: 'av4', label: 'K', color: 'bg-gradient-to-tr from-red-500 to-pink-600 text-slate-900 dark:text-white' },
  { id: 'av5', label: 'J', color: 'bg-gradient-to-tr from-purple-500 to-violet-600 text-slate-900 dark:text-white' },
  { id: 'av6', label: 'A', color: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-900 dark:text-white' },
];

export default function SignUpPage({ onAuthSuccess }: SignUpPageProps) {
  const navigate = useNavigate();
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'citizen' | 'moderator'>('citizen');
  const [selectedAvatar, setSelectedAvatar] = useState('av1');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signUpName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (signUpPassword.length < 5) {
      setError('Password must be at least 5 characters for security.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signUpEmail.trim().toLowerCase(),
          password: signUpPassword,
          fullName: signUpName.trim(),
          role: signUpRole,
          avatar: selectedAvatar,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to sign up');
      } else {
        localStorage.setItem('civic_token', data.token);
        
        // Ensure user object has the selected avatar and correct structure
        const newUser = {
          ...data.user,
          avatar: selectedAvatar,
        };
        
        setSuccessMsg('Account registered successfully! Redirecting you...');
        setTimeout(() => {
          onAuthSuccess(newUser);
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError('An error occurred during sign up.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-50 pt-[7rem] pb-16 flex items-center justify-center transition-colors duration-300 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-5xl bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative z-10">
        
        {/* LEFT PANEL */}
        <div className="md:w-5/12 bg-slate-950 p-8 sm:p-10 text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          <div className="absolute top-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full bg-[#163832]/15 blur-[60px]" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16161D]/90 backdrop-blur-md/5 border border-white/10 rounded-full text-xs font-mono text-blue-400">
              <Building2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              SECURE IDENTITY NETWORK
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Civic <span className="text-[#7C3AED]">Shield</span> Access
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock official municipal dashboard capabilities, claim volunteer tasks, authorize validation sweeps, and track community impact.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="w-5.5 h-5.5 rounded-lg bg-[#7C3AED]/10 border border-white/10/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">AI Trust Scoring</h4>
                  <p className="text-[11px] text-slate-400">Authenticated reports are prioritized with 95% higher automated scan approvals.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5.5 h-5.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-green-400" />
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
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-900 dark:text-white">Create Account</h3>
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

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-green-500/10 border border-green-500/20 text-emerald-600 dark:text-green-400 text-xs p-3 rounded-xl flex items-center gap-2 mb-4 font-sans"
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            key="signup"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            onSubmit={handleSignUpSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text"
                    required
                    placeholder="Sandro K."
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-transparent border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="email"
                    required
                    placeholder="sandro@civic.org"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-transparent border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-white/10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Choose Civic Identity Avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center font-bold text-base transition-all cursor-pointer ${av.color} ${
                      selectedAvatar === av.id 
                        ? 'ring-3 ring-[#8EB69B] scale-105 border-white dark:border-slate-900 border-2' 
                        : 'opacity-70 hover:opacity-100 scale-95'
                    }`}
                  >
                    {av.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Assign Municipal Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSignUpRole('citizen')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    signUpRole === 'citizen'
                      ? 'bg-[#7C3AED]/10 border-white/10'
                      : 'bg-slate-50 dark:bg-transparent/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-750'
                  }`}
                >
                  <UserCheck className={`w-4 h-4 mt-0.5 ${signUpRole === 'citizen' ? 'text-[#7C3AED]' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-900 dark:text-white">Citizen Reporter</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Submit incident reports.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSignUpRole('moderator')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    signUpRole === 'moderator'
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-slate-50 dark:bg-transparent/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-750'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 mt-0.5 ${signUpRole === 'moderator' ? 'text-green-500' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-900 dark:text-white">Moderator</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Manage and verify reports.</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 5 characters"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-transparent border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-hidden focus:border-white/10"
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-900 dark:text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Creating secure container credentials...' : 'Register Secure Profile'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Already have an account? </span>
              <Link to="/signin" className="text-xs font-bold text-[#7C3AED] hover:underline">
                Sign In
              </Link>
            </div>

          </motion.form>

        </div>

      </div>
    </div>
  );
}
