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
import AuthPage from './components/AuthPage';
import AiAnalyticsDashboard from './components/AiAnalyticsDashboard';
import GamificationSystem from './components/GamificationSystem';
import AuthorityDashboard from './components/AuthorityDashboard';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import { CivicIssue, CivicStats, User } from './types';
import { ToastItem, ToastType } from './lib/toast';


const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: 'iss-1',
    title: 'Major street water main leakage',
    description: 'A pressurized underground clean water pipe has ruptured, flooding the pedestrian walk and causing water to bubble onto Elm Road. It is washing away soil under the sidewalk tiles.',
    category: 'Water & Utilities',
    priority: 'high',
    status: 'in-progress',
    locationName: '450 Elm Road (Opposite Public Library)',
    coordinates: { x: 25, y: 35 }, // percentage on SVG
    reportedAt: '2 hours ago',
    upvotes: 42,
    reporterName: 'John Doe',
    timeline: [
      { status: 'reported', label: 'Reported', date: '2 hours ago', completed: true },
      { status: 'verified', label: 'AI & Peer Verified', date: '1.8 hours ago', completed: true },
      { status: 'dispatched', label: 'Dispatched to Utilities Team', date: '1.2 hours ago', completed: true },
      { status: 'resolved', label: 'Resolution Scheduled', date: 'Today at 5 PM', completed: false }
    ]
  },
  {
    id: 'iss-2',
    title: 'Severe pothole damaging tires',
    description: 'A massive 8-inch deep asphalt pothole has formed in the center lane of Civic Boulevard, causing cars to swerve dangerously. Multiple drivers have suffered blown tire walls here.',
    category: 'Street Maintenance',
    priority: 'critical',
    status: 'new',
    locationName: 'Civic Boulevard, East intersection',
    coordinates: { x: 15, y: 75 },
    reportedAt: '12 mins ago',
    upvotes: 68,
    reporterName: 'Alice Vance',
    timeline: [
      { status: 'reported', label: 'Reported', date: '12 mins ago', completed: true },
      { status: 'verified', label: 'AI Validation Running', date: 'Pending', completed: false },
      { status: 'dispatched', label: 'Pending Road Dispatch', date: 'Pending', completed: false },
      { status: 'resolved', label: 'Pending Repair', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'iss-3',
    title: 'Illegal battery pile dump behind park',
    description: 'Dozens of discarded lithium car batteries and electronic waste monitors have been dumped in the bush corridor behind Green Park north gate. Dangerous chemical fluid is pooling on dirt.',
    category: 'Environmental & Sanitation',
    priority: 'high',
    status: 'verified',
    locationName: 'Green Park North gate corridor',
    coordinates: { x: 48, y: 65 },
    reportedAt: '1 hour ago',
    upvotes: 31,
    reporterName: 'Raymond G.',
    timeline: [
      { status: 'reported', label: 'Reported', date: '1 hour ago', completed: true },
      { status: 'verified', label: 'Community Peer Approved', date: '45 mins ago', completed: true },
      { status: 'dispatched', label: 'Environmental Board Notified', date: 'Pending Dispatch', completed: false },
      { status: 'resolved', label: 'Pending Cleanup', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'iss-4',
    title: 'Main street light cover completely shattered',
    description: 'A low-hanging historical street light globe has been shattered, exposing active bare wires. The section of the dark alley is pitch black, presenting a major public security risk.',
    category: 'Road Safety & Forestry',
    priority: 'medium',
    status: 'resolved',
    locationName: 'Sunset Boulevard alley near 3rd Ave',
    coordinates: { x: 72, y: 22 },
    reportedAt: '1 day ago',
    upvotes: 18,
    reporterName: 'S. Cooper',
    timeline: [
      { status: 'reported', label: 'Reported', date: '1 day ago', completed: true },
      { status: 'verified', label: 'AI Categorized', date: '23 hours ago', completed: true },
      { status: 'dispatched', label: 'City Power Crew Dispatched', date: '20 hours ago', completed: true },
      { status: 'resolved', label: 'Globe replaced & re-wired', date: '3 hours ago', completed: true }
    ]
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('civic_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return true; // default to glorious dark mode
  });
  const [currentView, setCurrentView] = useState<'landing' | 'report' | 'verification' | 'tracker' | 'analytics' | 'gamification' | 'authority' | 'auth' | 'about' | 'contact'>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('civic_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return null;
      }
    }
    return null;
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);
  const [stats, setStats] = useState<CivicStats>({
    issuesReported: 14258,
    issuesResolved: 12891,
    activeVolunteers: 4320,
    impactScore: 98.4
  });

  // State for animated startup loader and notifications
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Simulation loading delay for premium hackathon startup feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
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
    setCurrentView('landing');
    
    // Trigger toast using browser event
    const event = new CustomEvent('civic_toast', {
      detail: { message: `Welcome back, ${user.fullName}! Access granted.`, type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('civic_current_user');
    setCurrentView('landing');
    
    const event = new CustomEvent('civic_toast', {
      detail: { message: 'Signed out securely. Session ended.', type: 'info' }
    });
    window.dispatchEvent(event);
  };

  const handleNavigateToAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentView('auth');
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
    setCurrentView('report');
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
  const handleUpvoteIssue = (id: string) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );

    // Trigger toast using browser event
    const event = new CustomEvent('civic_toast', {
      detail: { message: 'Upvoted successfully! Thank you for verifying.', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  // Adding a new verified report from modal or report page
  const handleNewReport = (newReport: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'timeline'>) => {
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
    setCurrentView('landing');
    setTimeout(() => {
      handleScrollToMap();
    }, 400);
  };

  const handleUpdateUserPoints = (newPoints: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, reputationPoints: newPoints };
      setCurrentUser(updatedUser);
      localStorage.setItem('civic_current_user', JSON.stringify(updatedUser));
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
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Animated Startup Loader Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            key="startup-loader"
            className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-6 text-white font-sans"
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
                <div className="p-3 bg-[#2563EB] rounded-2xl shadow-lg shadow-blue-500/20">
                  <Shield className="w-8 h-8 text-white animate-pulse" />
                </div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Civi<span className="text-[#2563EB]">Fix</span>
                </span>
              </motion.div>

              <div className="space-y-4">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                  />
                </div>
                
                <div className="h-6 text-xs text-slate-400 font-mono flex items-center justify-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-blue-500 animate-spin" />
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
        onNavigateToVerification={() => setCurrentView('verification')}
        onNavigateToTracker={() => setCurrentView('tracker')}
        onNavigateToAnalytics={() => setCurrentView('analytics')}
        onNavigateToGamification={() => setCurrentView('gamification')}
        onNavigateToAuthority={() => setCurrentView('authority')}
        onNavigateToHome={() => setCurrentView('landing')}
        onNavigateToAbout={() => setCurrentView('about')}
        onNavigateToContact={() => setCurrentView('contact')}
        currentView={currentView}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onNavigateToAuth={handleNavigateToAuth}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {currentView === 'report' ? (
            <ReportPage 
              onBack={() => setCurrentView('landing')}
              onSubmit={handleNewReport}
            />
          ) : currentView === 'verification' ? (
            <VerificationCenter 
              onBack={() => setCurrentView('landing')}
              onVerifyGameAction={handleVerifyGameAction}
              onFlagGameAction={handleFlagGameAction}
            />
          ) : currentView === 'tracker' ? (
            <IssueTracker 
              onBack={() => setCurrentView('landing')}
            />
          ) : currentView === 'analytics' ? (
            <AiAnalyticsDashboard 
              onBack={() => setCurrentView('landing')}
            />
          ) : currentView === 'gamification' ? (
            <GamificationSystem 
              currentUser={currentUser}
              onUpdateUserPoints={handleUpdateUserPoints}
              onNavigateToAuth={handleNavigateToAuth}
              onBack={() => setCurrentView('landing')}
            />
          ) : currentView === 'authority' ? (
            <AuthorityDashboard 
              currentUser={currentUser}
              onBack={() => setCurrentView('landing')}
            />
          ) : currentView === 'auth' ? (
            <AuthPage 
              onAuthSuccess={handleAuthSuccess}
              onCancel={() => setCurrentView('landing')}
              initialMode={authMode}
            />
          ) : currentView === 'about' ? (
            <AboutPage 
              onBack={() => setCurrentView('landing')}
            />
          ) : currentView === 'contact' ? (
            <ContactPage 
              onBack={() => setCurrentView('landing')}
            />
          ) : (
            <main className="relative">
              {/* Sections */}
              <Hero 
                onOpenReportModal={handleOpenReportModal} 
                onExploreMap={handleScrollToMap} 
              />
              
              <Stats stats={stats} />
              
              <CommunityMap 
                issues={issues} 
                onUpvote={handleUpvoteIssue}
                selectedIssueId={selectedIssueId}
                onSelectIssue={setSelectedIssueId}
              />
              
              <CivicDashboard 
                onVerifyIssue={handleVerifyGameAction}
                onFlagIssue={handleFlagGameAction}
              />
              
              <Features />
              
              <Impact />
              
              <Testimonials />
            </main>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Styled Footer */}
      <Footer 
        onNavigateToAbout={() => setCurrentView('about')} 
        onNavigateToContact={() => setCurrentView('contact')} 
      />

      {/* AI Incident Reporter drawer modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={handleCloseReportModal}
        onSubmit={handleNewReport}
      />

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
              className="pointer-events-auto w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 flex items-start gap-3 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
            >
              {toast.type === 'success' ? (
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400">
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
                <div className="p-1.5 bg-blue-100 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  System {toast.type}
                </p>
                <p className="text-sm text-slate-850 dark:text-white mt-1 leading-relaxed font-sans font-medium">
                  {toast.message}
                </p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 rounded-lg transition-colors cursor-pointer"
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
