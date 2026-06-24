import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, Mail, Lock, Eye, EyeOff, Shield, ShieldCheck, 
  ArrowRight, Check, AlertCircle, Award, Sparkles, Building2, UserCheck
} from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
  initialMode?: 'signin' | 'signup';
}

const PRESET_AVATARS = [
  { id: 'av1', label: 'E', color: 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white' },
  { id: 'av2', label: 'M', color: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white' },
  { id: 'av3', label: 'S', color: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white' },
  { id: 'av4', label: 'K', color: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white' },
  { id: 'av5', label: 'J', color: 'bg-gradient-to-tr from-purple-500 to-violet-600 text-white' },
  { id: 'av6', label: 'A', color: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white' },
];

export default function AuthPage({ onAuthSuccess, onCancel, initialMode = 'signin' }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'citizen' | 'moderator'>('citizen');
  const [selectedAvatar, setSelectedAvatar] = useState('av1');

  // Interactive controls
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Demo Accounts to choose from
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
    }, 700);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);

      // 1. Check custom accounts in localStorage
      const savedAccountsRaw = localStorage.getItem('civic_registered_users');
      let registeredUsers: User[] = [];
      if (savedAccountsRaw) {
        try {
          registeredUsers = JSON.parse(savedAccountsRaw);
        } catch (err) {
          console.error(err);
        }
      }

      // Check if matches custom
      const matched = registeredUsers.find(
        (u) => u.email.toLowerCase() === signInEmail.trim().toLowerCase()
      );

      if (matched) {
        onAuthSuccess(matched);
        return;
      }

      // 2. Or match typical static logins for ease of use
      if (signInEmail.includes('mod') && signInPassword.length >= 4) {
        onAuthSuccess({
          id: 'user-mod-1',
          email: signInEmail.trim(),
          fullName: 'Clara J. (Gov Moderator)',
          avatar: 'av2',
          role: 'moderator',
          reputationPoints: 340,
          joinedAt: '2026-04-01'
        });
      } else if (signInPassword.length >= 4) {
        onAuthSuccess({
          id: 'user-cit-1',
          email: signInEmail.trim(),
          fullName: signInEmail.split('@')[0] || 'Civic Citizen',
          avatar: 'av1',
          role: 'citizen',
          reputationPoints: 50,
          joinedAt: '2026-06-24'
        });
      } else {
        setError('Incorrect password. (Try entering at least 4 characters for instant demo access)');
      }
    }, 800);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      setIsLoading(false);

      // Create new user
      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: signUpName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        avatar: selectedAvatar,
        role: signUpRole,
        reputationPoints: signUpRole === 'moderator' ? 150 : 25,
        joinedAt: new Date().toISOString().split('T')[0]
      };

      // Read & append to local store
      const savedAccountsRaw = localStorage.getItem('civic_registered_users');
      let registeredUsers: User[] = [];
      if (savedAccountsRaw) {
        try {
          registeredUsers = JSON.parse(savedAccountsRaw);
        } catch (err) {
          console.error(err);
        }
      }

      // Check duplicate
      if (registeredUsers.some(u => u.email === newUser.email)) {
        setError('An account with this email address already exists.');
        return;
      }

      registeredUsers.push(newUser);
      localStorage.setItem('civic_registered_users', JSON.stringify(registeredUsers));

      setSuccessMsg('Account registered successfully! Redirecting you...');
      
      setTimeout(() => {
        onAuthSuccess(newUser);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 pt-28 pb-16 flex items-center justify-center transition-colors duration-300 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative z-10">
        
        {/* LEFT PANEL: Municipal Information Branding Grid (Hidden on Mobile) */}
        <div className="md:w-5/12 bg-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          <div className="absolute top-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full bg-[#2563EB]/15 blur-[60px]" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-blue-400">
              <Building2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              SECURE IDENTITY NETWORK
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Civic <span className="text-blue-500">Shield</span> Access
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock official municipal dashboard capabilities, claim volunteer tasks, authorize validation sweeps, and track community impact.
              </p>
            </div>

            {/* Informative list items */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="w-5.5 h-5.5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
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

          {/* Core Footer */}
          <div className="pt-8 border-t border-slate-900 text-[10px] font-mono text-slate-500 relative z-10">
            MUNICIPAL DATA INTEGRITY SYSTEM v2.6 // AES SECURED
          </div>
        </div>

        {/* RIGHT PANEL: Interactive forms */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center min-h-[500px]">
          
          {/* Header switch buttons */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-850 mb-6">
            <div className="flex gap-3">
              <button 
                onClick={() => { setMode('signin'); setError(null); }}
                className={`text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                  mode === 'signin' 
                    ? 'border-[#2563EB] text-slate-950 dark:text-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMode('signup'); setError(null); }}
                className={`text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                  mode === 'signup' 
                    ? 'border-[#2563EB] text-slate-950 dark:text-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Create Account
              </button>
            </div>

            <button 
              onClick={onCancel}
              className="text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Feedback alerts */}
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
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2 mb-4 font-sans"
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              
              /* SIGN IN MODE */
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
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
                    <span className="text-[10px] text-slate-400 font-mono">Demo: Enter any 4 characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-hidden focus:border-[#2563EB]"
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
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-6"
                >
                  {isLoading ? 'Decrypting Secure Token...' : 'Authenticate Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Demo Quick Entry Block */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-850 mt-6">
                  <p className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-2.5 text-center">
                    Instant Demo Workspace Access
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectDemo('citizen')}
                      className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl hover:border-blue-500/50 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                        Citizen Demo
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-blue-500 font-mono">
                        sandro.citizen@civic.org
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDemo('moderator')}
                      className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
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
            ) : (
              
              /* SIGN UP MODE */
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
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-[#2563EB]"
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
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar Selection Grid */}
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
                            ? 'ring-3 ring-[#2563EB] scale-105 border-white dark:border-slate-900 border-2' 
                            : 'opacity-70 hover:opacity-100 scale-95'
                        }`}
                      >
                        {av.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Picker Option */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Assign Municipal Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setSignUpRole('citizen')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        signUpRole === 'citizen'
                          ? 'bg-blue-500/10 border-blue-500'
                          : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-750'
                      }`}
                    >
                      <UserCheck className={`w-4 h-4 mt-0.5 ${signUpRole === 'citizen' ? 'text-blue-500' : 'text-slate-400'}`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Citizen Reporter</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Submit incident reports, vote on issues, local metrics tracking.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignUpRole('moderator')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        signUpRole === 'moderator'
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-750'
                      }`}
                    >
                      <Shield className={`w-4 h-4 mt-0.5 ${signUpRole === 'moderator' ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Municipal Volunteer</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Audit files, update dispatch state, moderate verification pipelines.</p>
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
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-hidden focus:border-[#2563EB]"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isLoading ? 'Creating secure container credentials...' : 'Register Secure Profile'}
                  <ArrowRight className="w-4 h-4" />
                </button>

              </motion.form>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
