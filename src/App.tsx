import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, CheckCircle, AlertTriangle, AlertCircle, Info, X, Cpu, Database } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import CommunityMap from './components/CommunityMap';
import CivicDashboard from './components/CivicDashboard';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Impact from './components/Impact';
import Footer from './components/Footer';
import ReportModal from './components/ReportModal';
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
import { CivicIssue, CivicStats, User } from './types';
import { ToastItem, ToastType } from './lib/toast';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


// INITIAL_ISSUES moved to backend database

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('civic_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return true; // default to glorious dark mode
  });
  const currentView = location.pathname.substring(1) || 'landing';
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('civic_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle old schema migration to prevent crashes
        if (parsed && !parsed.fullName && parsed.name) {
          parsed.fullName = parsed.name;
        }
        if (parsed && !parsed.fullName) {
          return null; // Force sign out if corrupted
        }
        return parsed;
      } catch (err) {
        return null;
      }
    }
    return null;
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [stats, setStats] = useState<CivicStats>({
    issuesReported: 14258,
    issuesResolved: 12891,
    activeVolunteers: 4320,
    impactScore: 98.4
  });

  // State for animated startup loader and notifications
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Fetch issues and stats from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const issuesRes = await fetch('/api/issues');
        if (issuesRes.ok) {
          const data = await issuesRes.json();
          setIssues(data);
        }
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Socket.io Real-Time Updates
  useEffect(() => {
    const socket = io(); // Connects to window.location.origin
    
    socket.on("new_issue", (issue: CivicIssue) => {
      // Prevent duplicates if the user themselves created it and state was already updated locally
      setIssues(prev => {
        if (prev.some(i => i.id === issue.id)) return prev;
        return [issue, ...prev];
      });
      setStats(prev => ({...prev, issuesReported: prev.issuesReported + 1}));
      
      // Global Notification for Real-Time Dashboard effect
      const event = new CustomEvent('toast', { detail: { message: `Live Alert: ${issue.title}`, type: 'info' } });
      window.dispatchEvent(event);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Capture global toast events
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>;
      if (customEvent.detail) {
        const { message, type } = customEvent.detail;
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        
        // Auto remove toast
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
      }
    };
    window.addEventListener('civic_toast', handleToastEvent);
    return () => window.removeEventListener('civic_toast', handleToastEvent);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('civic_current_user', JSON.stringify(user));
    
    // Trigger toast using browser event
    const event = new CustomEvent('civic_toast', {
      detail: { message: `Welcome back, ${user.fullName}! Access granted.`, type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('civic_current_user');
    localStorage.removeItem('civic_token');
    navigate('/');
    
    const event = new CustomEvent('civic_toast', {
      detail: { message: 'Signed out securely. Session ended.', type: 'info' }
    });
    window.dispatchEvent(event);
  };

  const handleNavigateToAuth = (mode: 'signin' | 'signup') => {
    navigate('/' + mode);
  };


  // Sync dark mode class with root html element
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const handleToggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    
    // Trigger theme change toast
    const event = new CustomEvent('civic_toast', {
      detail: { 
        message: `Activated ${nextMode ? 'glorious Dark Theme' : 'high-contrast Light Theme'}. Theme persisted!`, 
        type: 'info' 
      }
    });
    window.dispatchEvent(event);
  };

  const handleOpenReportModal = () => {
    navigate('/report');
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  // Scroll to Community Map
  const handleScrollToMap = () => {
    const mapSection = document.getElementById('community-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Upvote issue on Map
  const handleUpvoteIssue = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setIssues(prevIssues =>
          prevIssues.map(issue =>
            issue.id === id ? { ...issue, upvotes: data.upvotes } : issue
          )
        );
        const event = new CustomEvent('civic_toast', {
          detail: { message: 'Upvoted successfully! Thank you for verifying.', type: 'success' }
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Adding a new verified report from modal or report page
  const handleNewReport = async (newReport: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'timeline'>) => {
    const freshId = `iss-${Math.random().toString(36).substr(2, 9)}`;
    const createdIssue: CivicIssue = {
      ...newReport,
      id: freshId,
      reportedAt: 'Just now',
      upvotes: 1,
      timeline: [
        { status: 'reported', label: 'Reported', date: 'Just now', completed: true },
        { status: 'verified', label: 'AI Pre-Verification Done', date: 'Just now', completed: true },
        { status: 'dispatched', label: 'Queued for Dispatch', date: 'Pending', completed: false },
        { status: 'resolved', label: 'Pending Action', date: 'Pending', completed: false }
      ]
    };

    try {
      const token = localStorage.getItem('civic_token');
      await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ...createdIssue, reporterName: currentUser?.fullName || newReport.reporterName })
      });

      setIssues(prev => [createdIssue, ...prev]);
      setSelectedIssueId(freshId); // Auto select on map to showcase the magic
      
      // Update global indicators
      setStats(prev => ({
        ...prev,
        issuesReported: prev.issuesReported + 1,
        impactScore: Math.min(100, prev.impactScore + 0.1)
      }));

      // Trigger success toast
      const event = new CustomEvent('civic_toast', {
        detail: { 
          message: `Report geodispatched! NLP categorized as ${newReport.category}.`, 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);

      // Switch view back and scroll to map
      navigate('/');
      setTimeout(() => {
        handleScrollToMap();
      }, 400);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserPoints = async (newPoints: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, reputationPoints: newPoints };
      setCurrentUser(updatedUser);
      localStorage.setItem('civic_current_user', JSON.stringify(updatedUser));
      const token = localStorage.getItem('civic_token');
      if (token) {
        await fetch(`/api/users/${currentUser.id}/points`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ points: newPoints })
        });
      }
    }
  };

  // Simulated validation game rewards
  const handleVerifyGameAction = () => {
    setStats(prev => ({
      ...prev,
      activeVolunteers: prev.activeVolunteers + 1,
      issuesResolved: prev.issuesResolved + 1,
      impactScore: Math.min(100, prev.impactScore + 0.2)
    }));

    // Reward reputation points (+15 points per audit sweep)
    if (currentUser) {
      handleUpdateUserPoints(currentUser.reputationPoints + 15);
    } else {
      const saved = localStorage.getItem('civic_demo_points');
      const currentVal = saved ? parseInt(saved, 10) : 135;
      localStorage.setItem('civic_demo_points', (currentVal + 15).toString());
    }

    const event = new CustomEvent('civic_toast', {
      detail: { message: 'Audit recorded! You earned +15 civic reputation points.', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const handleFlagGameAction = () => {
    setStats(prev => ({
      ...prev,
      activeVolunteers: prev.activeVolunteers + 1,
      impactScore: Math.max(0, prev.impactScore - 0.05)
    }));

    // Reward small points (+5 points for flag audits)
    if (currentUser) {
      handleUpdateUserPoints(currentUser.reputationPoints + 5);
    } else {
      const saved = localStorage.getItem('civic_demo_points');
      const currentVal = saved ? parseInt(saved, 10) : 135;
      localStorage.setItem('civic_demo_points', (currentVal + 5).toString());
    }

    const event = new CustomEvent('civic_toast', {
      detail: { message: 'Flag approved! Peer verification registered (+5 reputation).', type: 'info' }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-[#7C3AED] selection:text-slate-900 dark:text-white overflow-x-hidden">
      {/* Animated Startup Loader Screen */}
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
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                  />
                </div>
                
                <div className="h-6 text-xs text-slate-400 font-mono flex items-center justify-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-[#7C3AED] animate-spin" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Calibrating Municipal AI Consensus Nodes...
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Top-level Navigation */}
      <Navbar 
        isDarkMode={isDarkMode} 
        onToggleTheme={handleToggleTheme} 
        onOpenReportModal={handleOpenReportModal}
        onNavigateToVerification={() => navigate('/verification')}
        onNavigateToTracker={() => navigate('/tracker')}
        onNavigateToAnalytics={() => navigate('/analytics')}
        onNavigateToGamification={() => navigate('/gamification')}
        onNavigateToAuthority={() => navigate('/authority')}
        onNavigateToHome={() => navigate('/')}
        currentView={currentView as 'landing' | 'report' | 'verification' | 'tracker' | 'analytics' | 'gamification' | 'authority' | 'auth' | 'about' | 'contact'}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onNavigateToAuth={handleNavigateToAuth}
      />

      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/report" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <ReportPage onBack={() => navigate('/')} onSubmit={handleNewReport} />
            </motion.div>
          } />
          <Route path="/verification" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <VerificationCenter onBack={() => navigate('/')} onVerifyGameAction={handleVerifyGameAction} onFlagGameAction={handleFlagGameAction} />
            </motion.div>
          } />
          <Route path="/tracker" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <IssueTracker onBack={() => navigate('/')} />
            </motion.div>
          } />
          <Route path="/civic" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <CivicDashboard onBack={() => navigate('/')} onVerifyIssue={handleVerifyGameAction} onFlagIssue={handleFlagGameAction} />
            </motion.div>
          } />
          <Route path="/analytics" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <AiAnalyticsDashboard onBack={() => navigate('/')} />
            </motion.div>
          } />
          <Route path="/gamification" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <GamificationSystem currentUser={currentUser} onUpdateUserPoints={handleUpdateUserPoints} onNavigateToAuth={handleNavigateToAuth} onBack={() => navigate('/')} />
            </motion.div>
          } />
          <Route path="/authority" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <AuthorityDashboard currentUser={currentUser} onBack={() => navigate('/')} />
            </motion.div>
          } />
          <Route path="/signin" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <SignInPage onAuthSuccess={handleAuthSuccess} />
            </motion.div>
          } />
          <Route path="/signup" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <SignUpPage onAuthSuccess={handleAuthSuccess} />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <AboutPage onBack={() => navigate('/')} />
            </motion.div>
          } />
          <Route path="/contact" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <ContactPage onBack={() => navigate('/')} />
            </motion.div>
          } />
          <Route path="/" element={
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <main className="relative">
                <Hero onOpenReportModal={handleOpenReportModal} onExploreMap={handleScrollToMap} />
                <Stats stats={stats} />
                <CommunityMap issues={issues} onUpvote={handleUpvoteIssue} selectedIssueId={selectedIssueId} onSelectIssue={setSelectedIssueId} />
                <CivicDashboard onVerifyIssue={handleVerifyGameAction} onFlagIssue={handleFlagGameAction} />
                <Features />
                <Impact />
                <Testimonials />
              </main>
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      {/* Styled Footer */}
      <Footer 
        onNavigateToAbout={() => navigate('/about')} 
        onNavigateToContact={() => navigate('/contact')} 
      />

      {/* AI Incident Reporter drawer modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={handleCloseReportModal}
        onSubmit={handleNewReport}
      />

      {/* AI Chatbot Assistant */}
      <AiEmergencyAssistant />

      {/* Real-time Dynamic Toast Notification Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none" id="toast-container">
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
