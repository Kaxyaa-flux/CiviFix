import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle, AlertTriangle, AlertCircle, Info, X, Cpu } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import CommunityMap from './components/CommunityMap';
import CivicDashboard from './components/CivicDashboard';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Impact from './components/Impact';
import Footer from './components/Footer';
import ReportPage from './components/ReportPage';
import VerificationCenter from './components/VerificationCenter';
import IssueTracker from './components/IssueTracker';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import AiAnalyticsDashboard from './components/AiAnalyticsDashboard';
import GamificationSystem from './components/GamificationSystem';
import AuthorityDashboard from './components/AuthorityDashboard';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AiEmergencyAssistant from './components/AiEmergencyAssistant';
import { CivicIssue, CivicStats } from './types';
import { ToastItem, ToastType, triggerToast } from './lib/toast';
import { api } from './lib/api';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── Theme ──────────────────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('civic_theme');
    if (savedTheme !== null) return savedTheme === 'dark';
    return true; // default to dark mode
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('civic_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('civic_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    triggerToast(
      `Activated ${nextMode ? 'glorious Dark Theme' : 'high-contrast Light Theme'}. Theme persisted!`,
      'info'
    );
  };

  // ── Auth (extracted to useAuth) ────────────────────────────────────────────
  const { currentUser, handleAuthSuccess, handleSignOut, handleUpdateUserPoints } = useAuth();

  // ── Issues & Stats ─────────────────────────────────────────────────────────
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [stats, setStats] = useState<CivicStats>({
    issuesReported: 14258,
    issuesResolved: 12891,
    activeVolunteers: 4320,
    impactScore: 98.4,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issuesData, statsData] = await Promise.all([
          api.get<CivicIssue[]>('/api/issues'),
          api.get<CivicStats>('/api/stats'),
        ]);
        setIssues(issuesData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        triggerToast('Failed to connect to municipal data nodes. Retrying in background...', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Socket.io real-time (extracted to useSocket) ───────────────────────────
  useSocket({
    onNewIssue: (issue) => {
      setIssues(prev => {
        if (prev.some(i => i.id === issue.id)) return prev;
        return [issue, ...prev];
      });
    },
    onStatsIncrement: () => {
      setStats(prev => ({ ...prev, issuesReported: prev.issuesReported + 1 }));
    },
  });

  // ── Toast system ───────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>;
      if (customEvent.detail) {
        const { message, type } = customEvent.detail;
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
      }
    };
    window.addEventListener('civic_toast', handleToastEvent);
    return () => window.removeEventListener('civic_toast', handleToastEvent);
  }, []);

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const currentView = location.pathname.substring(1) || 'landing';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const handleNavigateToAuth = (mode: 'signin' | 'signup') => navigate('/' + mode);
  const handleOpenReportModal = () => navigate('/report');

  const handleScrollToMap = () => {
    const mapSection = document.getElementById('community-map');
    if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Issue actions ──────────────────────────────────────────────────────────
  const handleUpvoteIssue = async (id: string) => {
    try {
      const data = await api.patch<{ upvotes: number }>(`/api/issues/${id}/upvote`, {});
      setIssues(prev =>
        prev.map(issue => (issue.id === id ? { ...issue, upvotes: data.upvotes } : issue))
      );
      triggerToast('Upvoted successfully! Thank you for verifying.', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewReport = async (
    newReport: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'timeline'> & { images?: File[] }
  ) => {
    const freshId = `iss-${Math.random().toString(36).substr(2, 9)}`;
    const { images, ...reportData } = newReport;
    const createdIssue: CivicIssue = {
      ...reportData,
      id: freshId,
      reportedAt: 'Just now',
      upvotes: 1,
      timeline: [
        { status: 'reported',   label: 'Reported',                date: 'Just now', completed: true },
        { status: 'verified',   label: 'AI Pre-Verification Done', date: 'Just now', completed: true },
        { status: 'dispatched', label: 'Queued for Dispatch',      date: 'Pending',  completed: false },
        { status: 'resolved',   label: 'Pending Action',           date: 'Pending',  completed: false },
      ],
    };

    try {
      const payload = { ...createdIssue, reporterName: currentUser?.fullName || newReport.reporterName };

      if (images && images.length > 0) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
          }
        });
        images.forEach(file => formData.append('images', file));
        await api.upload('/api/issues', formData);
      } else {
        await api.post('/api/issues', payload);
      }

      setIssues(prev => [createdIssue, ...prev]);
      setSelectedIssueId(freshId);
      setStats(prev => ({
        ...prev,
        issuesReported: prev.issuesReported + 1,
        impactScore: Math.min(100, prev.impactScore + 0.1),
      }));

      triggerToast(`Report geodispatched! NLP categorized as ${newReport.category}.`, 'success');
      navigate('/');
      setTimeout(handleScrollToMap, 400);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Verification game actions ──────────────────────────────────────────────
  const handleVerifyGameAction = () => {
    setStats(prev => ({
      ...prev,
      activeVolunteers: prev.activeVolunteers + 1,
      issuesResolved: prev.issuesResolved + 1,
      impactScore: Math.min(100, prev.impactScore + 0.2),
    }));
    if (currentUser) {
      handleUpdateUserPoints(currentUser.reputationPoints + 15);
    } else {
      const saved = localStorage.getItem('civic_demo_points');
      const current = saved ? parseInt(saved, 10) : 135;
      localStorage.setItem('civic_demo_points', (current + 15).toString());
    }
    triggerToast('Audit recorded! You earned +15 civic reputation points.', 'success');
  };

  const handleFlagGameAction = () => {
    setStats(prev => ({
      ...prev,
      activeVolunteers: prev.activeVolunteers + 1,
      impactScore: Math.max(0, prev.impactScore - 0.05),
    }));
    if (currentUser) {
      handleUpdateUserPoints(currentUser.reputationPoints + 5);
    } else {
      const saved = localStorage.getItem('civic_demo_points');
      const current = saved ? parseInt(saved, 10) : 135;
      localStorage.setItem('civic_demo_points', (current + 5).toString());
    }
    triggerToast('Flag approved! Peer verification registered (+5 reputation).', 'info');
  };

  // ── Page transition wrapper ────────────────────────────────────────────────
  const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-[#7C3AED] selection:text-slate-900 dark:text-white overflow-x-hidden">

      {/* Animated startup loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="startup-loader"
            className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white font-sans"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-md w-full text-center space-y-8">
              <motion.div
                className="flex items-center justify-center space-x-3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="p-3 bg-[#163832] rounded-2xl shadow-lg shadow-[#051F20]/30">
                  <Shield className="w-8 h-8 text-slate-900 dark:text-white animate-pulse" />
                </div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                  Civi<span className="text-[#7C3AED]">Fix</span>
                </span>
              </motion.div>

              <div className="space-y-4">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#7C3AED] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                  />
                </div>
                <div className="h-6 text-xs text-slate-400 font-mono flex items-center justify-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-[#7C3AED] animate-spin" />
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    Calibrating Municipal AI Consensus Nodes...
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <Navbar
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenReportModal={handleOpenReportModal}
        onNavigateToVerification={() => navigate('/verification')}
        onNavigateToTracker={() => navigate('/tracker')}
        onNavigateToAnalytics={() => navigate('/analytics')}
        onNavigateToGamification={() => navigate('/gamification')}
        onNavigateToAuthority={() => navigate('/authority')}
        onNavigateToCivic={() => navigate('/civic')}
        onNavigateToHome={() => navigate('/')}
        currentView={currentView as 'landing' | 'report' | 'verification' | 'tracker' | 'analytics' | 'gamification' | 'authority' | 'signin' | 'signup' | 'about' | 'contact' | 'civic'}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onNavigateToAuth={handleNavigateToAuth}
      />

      {/* Routes */}
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/report" element={
            <PageTransition>
              <ReportPage onBack={() => navigate('/')} onSubmit={handleNewReport} />
            </PageTransition>
          } />
          <Route path="/verification" element={
            <PageTransition>
              <VerificationCenter onBack={() => navigate('/')} onVerifyGameAction={handleVerifyGameAction} onFlagGameAction={handleFlagGameAction} />
            </PageTransition>
          } />
          <Route path="/tracker" element={
            <PageTransition>
              <IssueTracker onBack={() => navigate('/')} />
            </PageTransition>
          } />
          <Route path="/civic" element={
            <PageTransition>
              <CivicDashboard onBack={() => navigate('/')} onVerifyIssue={handleVerifyGameAction} onFlagIssue={handleFlagGameAction} />
            </PageTransition>
          } />
          <Route path="/analytics" element={
            <PageTransition>
              <AiAnalyticsDashboard onBack={() => navigate('/')} />
            </PageTransition>
          } />
          <Route path="/gamification" element={
            <PageTransition>
              <GamificationSystem currentUser={currentUser} onUpdateUserPoints={handleUpdateUserPoints} onNavigateToAuth={handleNavigateToAuth} onBack={() => navigate('/')} />
            </PageTransition>
          } />
          <Route path="/authority" element={
            currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin') ? (
              <PageTransition>
                <AuthorityDashboard currentUser={currentUser} onBack={() => navigate('/')} />
              </PageTransition>
            ) : (
              <Navigate to="/signin" replace />
            )
          } />
          <Route path="/signin" element={
            <PageTransition>
              <SignInPage onAuthSuccess={handleAuthSuccess} />
            </PageTransition>
          } />
          <Route path="/signup" element={
            <PageTransition>
              <SignUpPage onAuthSuccess={handleAuthSuccess} />
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <AboutPage onBack={() => navigate('/')} />
            </PageTransition>
          } />
          <Route path="/contact" element={
            <PageTransition>
              <ContactPage onBack={() => navigate('/')} />
            </PageTransition>
          } />
          <Route path="/" element={
            <PageTransition>
              <main className="relative">
                <Hero onOpenReportModal={handleOpenReportModal} onExploreMap={handleScrollToMap} />
                <Stats stats={stats} />
                <CommunityMap issues={issues} onUpvote={handleUpvoteIssue} selectedIssueId={selectedIssueId} onSelectIssue={setSelectedIssueId} />
                <CivicDashboard onVerifyIssue={handleVerifyGameAction} onFlagIssue={handleFlagGameAction} />
                <Features />
                <Impact />
                <Testimonials />
              </main>
            </PageTransition>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Footer
        onNavigateToAbout={() => navigate('/about')}
        onNavigateToContact={() => navigate('/contact')}
      />

      {/* AI Chatbot Assistant */}
      <AiEmergencyAssistant />

      {/* Toast notification overlay */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none" id="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className="pointer-events-auto w-full bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-2xl shadow-xl p-4 flex items-start gap-3 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
            >
              {toast.type === 'success' ? (
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : toast.type === 'warning' ? (
                <div className="p-1.5 bg-amber-100 dark:bg-amber-950/50 rounded-lg text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : toast.type === 'error' ? (
                <div className="p-1.5 bg-rose-100 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1.5 bg-blue-100 dark:bg-blue-950/50 rounded-lg text-[#7C3AED] dark:text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  System {toast.type}
                </p>
                <p className="text-sm text-slate-850 dark:text-slate-900 dark:text-white mt-1 leading-relaxed font-sans font-medium">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-900 dark:text-white p-0.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
