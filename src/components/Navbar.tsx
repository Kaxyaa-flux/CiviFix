import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Sun, Moon, Menu, X, ArrowRight, ShieldCheck, BarChart3,
  LogOut, LogIn, UserPlus, Award, ChevronDown, Check, UserCheck, BrainCircuit,
  ShieldAlert
} from 'lucide-react';
import { User } from '../types';

const getAvatarStyle = (avatarId: string) => {
  const styles: Record<string, string> = {
    av1: 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-slate-900 dark:text-white',
    av2: 'bg-gradient-to-tr from-green-500 to-teal-600 text-slate-900 dark:text-white',
    av3: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-900 dark:text-white',
    av4: 'bg-gradient-to-tr from-red-500 to-pink-600 text-slate-900 dark:text-white',
    av5: 'bg-gradient-to-tr from-purple-500 to-violet-600 text-slate-900 dark:text-white',
    av6: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-900 dark:text-white',
  };
  return styles[avatarId] || 'bg-[#7C3AED] text-slate-900 dark:text-white';
};

interface NavbarProps {

  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenReportModal: () => void;
  onNavigateToVerification: () => void;
  onNavigateToTracker: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToGamification: () => void;
  onNavigateToAuthority: () => void;
  onNavigateToHome: () => void;
  currentView: 'landing' | 'report' | 'verification' | 'tracker' | 'analytics' | 'gamification' | 'authority' | 'auth' | 'about' | 'contact';
  currentUser: User | null;
  onSignOut: () => void;
  onNavigateToAuth: (mode: 'signin' | 'signup') => void;
}

export default function Navbar({ 
  isDarkMode, 
  onToggleTheme, 
  onOpenReportModal,
  onNavigateToVerification,
  onNavigateToTracker,
  onNavigateToAnalytics,
  onNavigateToGamification,
  onNavigateToAuthority,
  onNavigateToHome,
  currentView,
  currentUser,
  onSignOut,
  onNavigateToAuth
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active section detection only on landing view
      if (currentView !== 'landing') return;

      const sections = ['home', 'features', 'community-map', 'dashboard', 'impact', 'testimonials'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'Community Map', id: 'community-map' },
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Impact', id: 'impact' },
    { name: 'Testimonials', id: 'testimonials' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    if (currentView !== 'landing') {
      onNavigateToHome();
      // Allow view change and mounting to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav-aurora py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateToHome}>
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center shadow-md shadow-[#7C3AED]/30 overflow-hidden bg-white">
                <img src="/logo.png" alt="CiviFix Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#7C3AED] rounded-lg blur-md opacity-20 -z-10"></div>
              </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-950 dark:text-slate-900 dark:text-white">
              Civi<span className="text-[#7C3AED]">Fix</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'landing' && activeSection === link.id
                    ? 'text-[#7C3AED] dark:text-[#7C3AED]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-900 dark:text-white'
                }`}
              >
                {link.name}
                {currentView === 'landing' && activeSection === link.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>


            {/* Secure Authentication Portal trigger / profile dropdown */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 rounded-xl border border-white/10 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${getAvatarStyle(currentUser.avatar)}`}>
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold font-sans max-w-[90px] truncate text-slate-800 dark:text-slate-200 hidden lg:inline-block">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-left"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${getAvatarStyle(currentUser.avatar)}`}>
                          {currentUser.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-0.5 truncate">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-900 dark:text-white truncate">{currentUser.fullName}</h4>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-transparent p-2 rounded-xl">
                          <span className="text-slate-400 font-mono text-[9px]">ROLE:</span>
                          <span className={`px-2 py-0.5 font-bold font-mono text-[9px] rounded-full uppercase ${
                            currentUser.role === 'moderator' 
                              ? 'bg-green-500/10 text-green-500 border border-green-500/25' 
                              : 'bg-[#7C3AED]/10 text-[#7C3AED] border border-white/10/25'
                          }`}>
                            {currentUser.role}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 dark:bg-transparent p-2 rounded-xl">
                          <span className="text-slate-400 font-mono text-[9px] flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" /> REPUTATION:
                          </span>
                          <span className="font-bold text-amber-500">{currentUser.reputationPoints} PTS</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onNavigateToGamification();
                        }}
                        className="w-full bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-blue-400 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-550" />
                        My Rewards & Badges
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onSignOut();
                        }}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out Session
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigateToAuth('signin')}
                  className="flex items-center gap-1 px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-blue-400 text-xs font-bold font-sans rounded-xl border border-white/10 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => onNavigateToAuth('signup')}
                  className="flex items-center gap-1 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-900 dark:text-white text-xs font-bold font-sans rounded-xl transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Sign Up
                </button>
              </div>
            )}
          </div>


          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Bar (Row 2) - Hidden on mobile */}
      <div className="hidden md:block w-full bg-[#163832] dark:bg-[#16161D]/90 border-t border-slate-200/50 dark:border-white/10/50 shadow-sm">
        <div className="flex items-center justify-center gap-2 flex-wrap px-4 py-2 max-w-7xl mx-auto">
          {/* Authority Console */}
          <button
            onClick={onNavigateToAuthority}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              currentView === 'authority'
                ? 'bg-[#163832] border-[#7C3AED] text-[#DAF1DE]'
                : 'bg-transparent border-white/10 text-[#7C3AED] hover:bg-[#163832]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Authority Console
          </button>

          {/* AI Verification Center */}
          <button
            onClick={onNavigateToVerification}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              currentView === 'verification'
                ? 'bg-[#163832] border-[#7C3AED] text-[#DAF1DE]'
                : 'bg-transparent border-white/10 text-[#7C3AED] hover:bg-[#163832]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Verification Center
          </button>

          {/* Issue Tracker */}
          <button
            onClick={onNavigateToTracker}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              currentView === 'tracker'
                ? 'bg-[#163832] border-[#7C3AED] text-[#DAF1DE]'
                : 'bg-transparent border-white/10 text-[#7C3AED] hover:bg-[#163832]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Issue Tracker
          </button>

          {/* AI Analytics */}
          <button
            onClick={onNavigateToAnalytics}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              currentView === 'analytics'
                ? 'bg-[#163832] border-[#7C3AED] text-[#DAF1DE]'
                : 'bg-transparent border-white/10 text-[#7C3AED] hover:bg-[#163832]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Analytics
          </button>

          {/* Rewards & Badges */}
          <button
            onClick={onNavigateToGamification}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              currentView === 'gamification'
                ? 'bg-[#163832] border-[#7C3AED] text-[#DAF1DE]'
                : 'bg-transparent border-white/10 text-[#7C3AED] hover:bg-[#163832]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Rewards & Badges
          </button>

          {/* Report Issue CTA */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer bg-[#163832] hover:bg-[#22D3EE] text-[#DAF1DE] border-[#7C3AED]"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-white/10 bg-slate-50 dark:bg-transparent overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-sans text-base font-medium transition-colors cursor-pointer ${
                    currentView === 'landing' && activeSection === link.id
                      ? 'bg-blue-50 dark:bg-[#163832]/15 text-[#7C3AED] dark:text-[#7C3AED] font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </button>
              ))}

              
              <div className="pt-4 border-t border-white/10 space-y-2">
                {/* Mobile session indicator / auth triggers */}
                {currentUser ? (
                  <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${getAvatarStyle(currentUser.avatar)}`}>
                        {currentUser.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-900 dark:text-white truncate">{currentUser.fullName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-slate-50 dark:bg-transparent p-2 rounded-lg border border-slate-100 dark:border-white/5">
                        <span className="block text-[8px] font-mono text-slate-400 uppercase">Role</span>
                        <span className="font-bold text-[#7C3AED] text-[10px] uppercase font-mono">{currentUser.role}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-transparent p-2 rounded-lg border border-slate-100 dark:border-white/5">
                        <span className="block text-[8px] font-mono text-slate-400 uppercase">Reputation</span>
                        <span className="font-bold text-amber-500 text-[10px]">{currentUser.reputationPoints} PTS</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onSignOut();
                      }}
                      className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 py-2.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out Session
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateToAuth('signin');
                      }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-blue-400 text-xs font-bold font-sans rounded-xl transition-all cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateToAuth('signup');
                      }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-[#16161D]/90 text-slate-900 dark:text-slate-900 dark:text-white text-xs font-bold font-sans rounded-xl border border-white/10/15 transition-all cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-[#7C3AED]" />
                      Sign Up
                    </button>
                  </div>
                )}

                {/* Secure Authority Panel on Mobile */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToAuthority();
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-5 py-3 font-sans text-base font-bold rounded-xl border transition-all cursor-pointer ${
                    currentView === 'authority'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500 shadow-md'
                      : 'bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 text-slate-705 dark:text-slate-305 border-slate-205 dark:border-slate-805 hover:bg-indigo-500/5'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 text-indigo-500 animate-pulse" />
                  Authority Dashboard
                </button>

                {/* AI Verification Button on Mobile */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToVerification();
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-5 py-3 font-sans text-base font-bold rounded-xl border transition-all cursor-pointer ${
                    currentView === 'verification'
                      ? 'bg-green-500/10 text-emerald-600 dark:text-green-400 border-green-500 shadow-md'
                      : 'bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 text-emerald-600 dark:text-green-400 border-green-500/35 hover:bg-green-500/5'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  AI Verification Center
                </button>

                {/* Issue Tracker Button on Mobile */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToTracker();
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-5 py-3 font-sans text-base font-bold rounded-xl border transition-all cursor-pointer ${
                    currentView === 'tracker'
                      ? 'bg-[#7C3AED]/10 text-[#7C3AED] dark:text-blue-400 border-white/10 shadow-md'
                      : 'bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 text-[#7C3AED] dark:text-blue-400 border-white/10/35 hover:bg-[#7C3AED]/5'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 text-[#7C3AED]" />
                  Issue Tracker
                </button>

                {/* AI Analytics Button on Mobile */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToAnalytics();
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-5 py-3 font-sans text-base font-bold rounded-xl border transition-all cursor-pointer ${
                    currentView === 'analytics'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500 shadow-md'
                      : 'bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 text-purple-600 dark:text-purple-400 border-purple-500/35 hover:bg-purple-500/5'
                  }`}
                >
                  <BrainCircuit className="w-5 h-5 text-purple-500" />
                  AI Analytics Dashboard
                </button>

                {/* Civic Rewards Button on Mobile */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToGamification();
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-5 py-3 font-sans text-base font-bold rounded-xl border transition-all cursor-pointer ${
                    currentView === 'gamification'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 shadow-md'
                      : 'bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 text-amber-600 dark:text-amber-400 border-amber-500/35 hover:bg-amber-500/5'
                  }`}
                >
                  <Award className="w-5 h-5 text-amber-500" />
                  Rewards & Badges
                </button>

                {/* Quick Report CTA */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenReportModal();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#163832] hover:bg-[#0B2B26] text-slate-900 dark:text-white font-sans text-base font-medium rounded-xl shadow-lg cursor-pointer"
                >
                  Report Issue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
