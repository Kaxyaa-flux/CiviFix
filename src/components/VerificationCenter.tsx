import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, Check, X, Sparkles, Activity, Clock, 
  MapPin, ThumbsUp, ThumbsDown, Trophy, RefreshCw, AlertTriangle, 
  Image as ImageIcon, Eye, BarChart3, Users, Award, Shield, ChevronRight
} from 'lucide-react';

// Define structures for internal Verification state
interface UnverifiedIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  locationName: string;
  reportedAt: string;
  reporterName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  mediaType: 'image' | 'video';
  mediaPlaceholder: string; // Describes visual representation
  peerVotesAgree: number;
  peerVotesDisagree: number;
  userVoted?: 'agree' | 'disagree';
}

interface AIScanResult {
  duplicateStatus: string;
  duplicateSimilarity: number;
  duplicateReasoning: string;
  authenticityScore: number;
  authenticityDetails: string;
  fraudRisk: string;
  fraudProbability: number;
  fraudDetails: string;
  verificationPercentage: number;
}

const SEED_PENDING_ISSUES: UnverifiedIssue[] = [
  {
    id: 'v-1',
    title: 'Burst water hydrant flooding pedestrian walk',
    description: 'The green water hydrant at the corner of Pine Road is spraying pressurized water 5 feet into the air. It is flooding the sidewalk, creating a massive puddle, and making pedestrian crossings extremely dangerous.',
    category: 'Water & Utilities',
    locationName: '144 Pine Road (Junction 5th Ave)',
    reportedAt: '15 mins ago',
    reporterName: 'Sandro K.',
    priority: 'high',
    mediaType: 'image',
    mediaPlaceholder: 'water_hydrant_spurt',
    peerVotesAgree: 14,
    peerVotesDisagree: 1
  },
  {
    id: 'v-2',
    title: 'Deep pothole hiding under rain puddle',
    description: 'A crater-like pothole has opened up in the middle lane of Oakwood Boulevard. It is filled with rainwater, making it look like a harmless puddle. I saw two sedans hit it and make awful grinding sounds.',
    category: 'Street Maintenance',
    locationName: '310 Oakwood Blvd, opposite High School',
    reportedAt: '40 mins ago',
    reporterName: 'Clara J.',
    priority: 'critical',
    mediaType: 'image',
    mediaPlaceholder: 'deep_road_crater',
    peerVotesAgree: 28,
    peerVotesDisagree: 2
  },
  {
    id: 'v-3',
    title: 'Unsecured overhead electrical wires hanging low',
    description: 'During yesterday\'s storm, a utility pole branch snapped, leaving thick insulated electrical cables drooping down to about 6 feet above the cycling pathway. Extremely dangerous for passing bike riders.',
    category: 'Public Safety',
    locationName: 'Sunset Boulevard Corridor (West Lane)',
    reportedAt: '1 hour ago',
    reporterName: 'Alex Mercer',
    priority: 'critical',
    mediaType: 'image',
    mediaPlaceholder: 'drooping_power_lines',
    peerVotesAgree: 41,
    peerVotesDisagree: 0
  },
  {
    id: 'v-4',
    title: 'Suspicious household garbage dumping in greenbelt',
    description: 'Spotted a commercial van unloading over 15 large black plastic garbage bags and an old tattered sofa directly into the conservation woodland buffer behind the park gate.',
    category: 'Environmental & Sanitation',
    locationName: 'Green Park Conservation Woodlands (Gate 4)',
    reportedAt: '2 hours ago',
    reporterName: 'Marcus T.',
    priority: 'medium',
    mediaType: 'image',
    mediaPlaceholder: 'woodland_garbage_dump',
    peerVotesAgree: 8,
    peerVotesDisagree: 3
  },
  {
    id: 'v-5',
    title: 'Shattered speed limits warning beacon',
    description: 'The solar-powered digital speed sign that flashes 25 MPH near the primary school crosswalk has been completely shattered. The screen is dark and shards of plastic are scattered on the sidewalk.',
    category: 'Road Safety & Forestry',
    locationName: 'Elm Road (Primary School Crosswalk)',
    reportedAt: '4 hours ago',
    reporterName: 'Principal Vance',
    priority: 'medium',
    mediaType: 'image',
    mediaPlaceholder: 'shattered_school_beacon',
    peerVotesAgree: 19,
    peerVotesDisagree: 0
  }
];

interface VerificationCenterProps {
  onBack: () => void;
  onVerifyGameAction: () => void;
  onFlagGameAction: () => void;
}

export default function VerificationCenter({ onBack, onVerifyGameAction, onFlagGameAction }: VerificationCenterProps) {
  const [pendingIssues, setPendingIssues] = useState<UnverifiedIssue[]>(SEED_PENDING_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = useState<string>('v-1');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStateText, setScanStateText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'duplicates' | 'authenticity' | 'fraud'>('details');
  
  // Store verification results dynamically
  const [verificationResults, setVerificationResults] = useState<Record<string, AIScanResult>>({});
  const [scanError, setScanError] = useState<string | null>(null);

  // Stats Counters
  const [stats, setStats] = useState({
    totalAudited: 412,
    duplicatesFlagged: 59,
    spamCaught: 34,
    consensusRate: 96.8
  });

  // Gamification tracking local state
  const [userScore, setUserScore] = useState<number>(140);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [activities, setActivities] = useState([
    { id: 'act-1', user: 'Validator_402', action: 'Verified Hydrant Spray', time: '1 min ago', status: 'consensus' },
    { id: 'act-2', user: 'Sherlock_Civic', action: 'Flagged duplicate pothole report', time: '5 mins ago', status: 'flagged' },
    { id: 'act-3', user: 'GreenGuard_Elena', action: 'Verified woodland dumping', time: '12 mins ago', status: 'consensus' },
    { id: 'act-4', user: 'AI_Auditor_Node', action: 'Flagged low-detail report as Spam', time: '20 mins ago', status: 'spam' }
  ]);

  const activeIssue = pendingIssues.find(iss => iss.id === selectedIssueId) || pendingIssues[0];

  // Rotate activities dynamically
  useEffect(() => {
    const actInterval = setInterval(() => {
      const users = ['RoadPatrol_Dan', 'Eco_Auditor', 'Citizen_X', 'CivicSpark', 'Elena_R', 'Marcus_Chen'];
      const actionTypes = [
        { desc: 'Verified broken school beacon', stat: 'consensus' },
        { desc: 'Flagged duplicate garbage pile', stat: 'flagged' },
        { desc: 'Rejected blurred photo submission', stat: 'spam' },
        { desc: 'Verified drooping cables hazard', stat: 'consensus' }
      ];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      
      const newAct = {
        id: `act-${Math.random().toString(36).substring(2, 7)}`,
        user: randomUser,
        action: randomAction.desc,
        time: 'Just now',
        status: randomAction.stat
      };
      setActivities(prev => [newAct, ...prev.slice(0, 4)]);
    }, 12000);

    return () => clearInterval(actInterval);
  }, []);

  // Run AI deep audit scan (Gemini or Local Fallback)
  const handleRunAIDeepScan = async () => {
    setIsScanning(true);
    setScanError(null);
    setScanStateText('Initializing Deep Forensic Scans...');

    const stateTexts = [
      'Extracting camera metadata...',
      'Running image geolocation matching...',
      'Analyzing lexical semantic descriptors...',
      'Querying spatial database for duplicates...',
      'Computing fraud probability matrix...',
      'Compiling final aggregate consensus score...'
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < stateTexts.length) {
        setScanStateText(stateTexts[count]);
        count++;
      }
    }, 600);

    try {
      const response = await fetch('/api/verify-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeIssue.title,
          description: activeIssue.description,
          category: activeIssue.category,
          locationName: activeIssue.locationName
        })
      });

      if (!response.ok) {
        throw new Error('AI forensic pipeline timeout or server issue.');
      }

      const data: AIScanResult = await response.json();
      
      // Store result
      setTimeout(() => {
        clearInterval(interval);
        setVerificationResults(prev => ({
          ...prev,
          [activeIssue.id]: data
        }));
        setIsScanning(false);
        setActiveTab('duplicates'); // Automatically go to first analytical tab
      }, 3800);

    } catch (err: any) {
      clearInterval(interval);
      setScanError(err.message || 'Error executing AI pipeline.');
      setIsScanning(false);
    }
  };

  // User submits peer consensus vote
  const handleUserVote = (vote: 'agree' | 'disagree') => {
    if (activeIssue.userVoted) return; // Only allow voting once

    // Update issue state locally
    setPendingIssues(prev => 
      prev.map(iss => {
        if (iss.id === activeIssue.id) {
          return {
            ...iss,
            userVoted: vote,
            peerVotesAgree: vote === 'agree' ? iss.peerVotesAgree + 1 : iss.peerVotesAgree,
            peerVotesDisagree: vote === 'disagree' ? iss.peerVotesDisagree + 1 : iss.peerVotesDisagree
          };
        }
        return iss;
      })
    );

    // Points animation
    setUserScore(prev => prev + 50);
    setEarnedPoints(50);
    setTimeout(() => setEarnedPoints(null), 2500);

    // Call upstream handlers for statistics syncing
    if (vote === 'agree') {
      onVerifyGameAction();
      setStats(prev => ({
        ...prev,
        totalAudited: prev.totalAudited + 1,
        consensusRate: Math.min(100, prev.consensusRate + 0.1)
      }));
    } else {
      onFlagGameAction();
      setStats(prev => ({
        ...prev,
        totalAudited: prev.totalAudited + 1,
        spamCaught: prev.spamCaught + 1,
        consensusRate: Math.max(80, prev.consensusRate - 0.2)
      }));
    }

    // Add vote activity log
    const newAct = {
      id: `act-user-${Date.now()}`,
      user: 'You (Municipal Hero)',
      action: `${vote === 'agree' ? 'Verified' : 'Flagged'} "${activeIssue.title}"`,
      time: 'Just now',
      status: vote === 'agree' ? 'consensus' : 'flagged'
    };
    setActivities(prev => [newAct, ...prev.slice(0, 4)]);
  };

  const activeScan = verificationResults[activeIssue.id];

  // Helper to render media mockup icons & canvas based on category
  const renderMediaMockup = (placeholder: string) => {
    let titleStr = "INCIDENT PHOTO EVIDENCE";
    let colorText = "text-[#7C3AED]";
    let svgGraphic = null;

    if (placeholder === 'water_hydrant_spurt') {
      titleStr = "HIGH PRESSURE WATER SPRAY ANALYSIS";
      colorText = "text-cyan-400";
      svgGraphic = (
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Water spray arc lines */}
          <path d="M 50,80 Q 20,40 10,50" className="animate-pulse" />
          <path d="M 50,80 Q 30,30 20,40" />
          <path d="M 50,80 Q 70,30 80,40" />
          <path d="M 50,80 Q 80,40 90,50" className="animate-pulse" />
          {/* Hydrant base */}
          <rect x="42" y="65" width="16" height="25" rx="2" fill="currentColor" opacity="0.3" />
          <circle cx="50" cy="70" r="4" fill="currentColor" />
          <line x1="38" y1="75" x2="62" y2="75" />
          {/* Grid target */}
          <circle cx="50" cy="45" r="15" strokeDasharray="3" className="animate-spin-slow" />
        </svg>
      );
    } else if (placeholder === 'deep_road_crater') {
      titleStr = "ASPHALT DESTRUCTIVE PATTERN RECOGNITION";
      colorText = "text-amber-500";
      svgGraphic = (
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Pothole cracks */}
          <path d="M 30,50 L 45,45 L 42,55 L 60,50 L 52,62 L 68,68 L 50,75 L 35,62 Z" fill="currentColor" opacity="0.2" />
          <line x1="45" y1="45" x2="52" y2="25" />
          <line x1="60" y1="50" x2="80" y2="55" />
          <line x1="50" y1="75" x2="48" y2="90" />
          <line x1="30" y1="50" x2="15" y2="40" />
          {/* Water level lines */}
          <path d="M 35,62 Q 50,65 65,62" />
          <path d="M 38,68 Q 50,70 62,68" strokeDasharray="2" />
          {/* Scanning frame */}
          <rect x="25" y="25" width="50" height="50" strokeDasharray="4" className="animate-pulse" />
        </svg>
      );
    } else if (placeholder === 'drooping_power_lines') {
      titleStr = "Drooped Cable Sag Estimation (6.2ft)";
      colorText = "text-red-500";
      svgGraphic = (
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Utility Poles */}
          <line x1="10" y1="20" x2="10" y2="90" />
          <line x1="90" y1="20" x2="90" y2="90" />
          <line x1="5" y1="25" x2="15" y2="25" />
          <line x1="85" y1="25" x2="95" y2="25" />
          {/* Sagging wires */}
          <path d="M 10,25 Q 50,75 90,25" strokeWidth="3" className="text-red-500/80" />
          <path d="M 10,28 Q 50,78 90,28" strokeDasharray="4" />
          {/* Visual height warning */}
          <line x1="50" y1="75" x2="50" y2="95" strokeDasharray="2" />
          <path d="M 47,80 L 50,75 L 53,80" />
          <text x="55" y="85" fontSize="6" fill="currentColor" stroke="none" className="font-mono">Hazard Limit</text>
        </svg>
      );
    } else if (placeholder === 'woodland_garbage_dump') {
      titleStr = "FOREIGN MATERIAL VOLUME EXTRACTION";
      colorText = "text-green-500";
      svgGraphic = (
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Trees */}
          <path d="M 20,40 L 25,25 L 30,40 Z" fill="currentColor" opacity="0.1" />
          <line x1="25" y1="40" x2="25" y2="60" />
          <path d="M 75,45 L 80,30 L 85,45 Z" fill="currentColor" opacity="0.1" />
          <line x1="80" y1="45" x2="80" y2="60" />
          {/* Trash bags pile */}
          <circle cx="45" cy="70" r="10" fill="currentColor" opacity="0.3" />
          <circle cx="55" cy="72" r="8" fill="currentColor" opacity="0.4" />
          <circle cx="50" cy="65" r="7" fill="currentColor" opacity="0.5" />
          {/* Rectangular sofa shape */}
          <rect x="35" y="72" width="30" height="15" rx="3" fill="none" stroke="currentColor" />
          {/* Focus boxes */}
          <rect x="30" y="55" width="40" height="35" strokeDasharray="2" className="animate-pulse" />
        </svg>
      );
    } else {
      titleStr = "MUNICIPAL VISUAL SIGNATURE SCAN";
      colorText = "text-indigo-400";
      svgGraphic = (
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="50,15 90,85 10,85" strokeDasharray="3" />
          <circle cx="50" cy="55" r="12" className="animate-ping" />
          <line x1="50" y1="15" x2="50" y2="85" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </svg>
      );
    }

    return (
      <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 select-none group">
        
        {/* Hologram Matrix scanning grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-10" />

        {/* Dynamic Category Vector Graphics */}
        <div className={`relative z-10 p-4 rounded-xl ${colorText}`}>
          {svgGraphic}
        </div>

        {/* Forensic metadata sidebar overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1.5 rounded text-[9px] font-mono text-slate-400 space-y-0.5 pointer-events-none max-w-xs z-10">
          <p className="font-bold text-slate-300">INCIDENT ID: <span className="text-[#7C3AED]">{activeIssue.id}</span></p>
          <p>CAMERA: SONY IMX586-MOBILE</p>
          <p>ISO: 100 | APERTURE: f/1.8</p>
          <p>GPS SYNC: 100% MATCHED</p>
        </div>

        {/* Scanning telemetry overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1.5 rounded text-[9px] font-mono text-slate-400 space-y-0.5 pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping"></span>
            <span className="text-green-400 font-bold uppercase">FORENSIC FEED</span>
          </div>
          <p>SCALE: 1.0x VECTOR</p>
          <p>ANALYSIS: ACTIVE GRIDS</p>
        </div>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-slate-900/90 border border-slate-800/85 px-3 py-1 rounded text-[10px] font-mono text-slate-300 font-bold tracking-tight">
            {titleStr}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-50 pt-[7rem] pb-16 transition-colors duration-300">
      
      {/* Floating score toast points */}
      <AnimatePresence>
        {earnedPoints && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            className="fixed inset-x-0 bottom-10 mx-auto w-fit z-50 bg-[#10B981] text-slate-900 dark:text-white font-mono font-bold text-sm px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-green-400"
          >
            <Trophy className="w-4 h-4 animate-bounce" />
            CONGRATULATIONS! +{earnedPoints} HERO POINTS EARNED!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#7C3AED] transition-colors font-mono cursor-pointer"
            >
              ← RETURN TO LANDING
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#7C3AED] animate-pulse" />
              AI Verification <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#10B981]">Center</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
              Audit reported incidents using dual peer voting and multi-tiered server-side neural analysis. Prevent duplicates, capture fake reports, and ensure fast municipal routing.
            </p>
          </div>

          {/* User Score Gauge */}
          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-4 rounded-2xl shadow-xs flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#163832]/15 flex items-center justify-center text-[#7C3AED]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold">Your Hero Rank</p>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-900 dark:text-white flex items-center gap-2">
                Level 4 Auditor
                <span className="text-xs bg-[#163832] text-slate-900 dark:text-white px-2 py-0.5 rounded-md font-mono">
                  {userScore} pts
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 1. Statistics Cards Display */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-4 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute right-4 top-4 text-[#7C3AED]/10">
              <Eye className="w-12 h-12" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase font-bold">Total Audited</p>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-950 dark:text-slate-900 dark:text-white">{stats.totalAudited}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono">
              <span className="text-[#10B981] font-bold">● Active Node</span>
              <span>• Synced 12s ago</span>
            </div>
          </div>

          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-4 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute right-4 top-4 text-[#10B981]/10">
              <BarChart3 className="w-12 h-12" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase font-bold">Duplicates Caught</p>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-950 dark:text-slate-900 dark:text-white">{stats.duplicatesFlagged}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-[#10B981] font-mono">
              <span>94.2% Spatial Recall</span>
            </div>
          </div>

          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-4 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute right-4 top-4 text-red-500/10">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase font-bold">Spam / Fraud Arrested</p>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-950 dark:text-slate-900 dark:text-white">{stats.spamCaught}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-red-500 font-mono">
              <span>Low-detail/Out of grid block</span>
            </div>
          </div>

          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-4 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute right-4 top-4 text-amber-500/10">
              <Users className="w-12 h-12" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase font-bold">Peer Consensus Rate</p>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-950 dark:text-slate-900 dark:text-white">{stats.consensusRate}%</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-500 font-mono">
              <span>98% agreement threshold</span>
            </div>
          </div>

        </div>

        {/* 2. Main Center Grid (Issues Queue List + Forensic Active Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Pending Issues Sidebar List (Col-span 4) */}
          <div className="lg:col-span-4 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
              <span className="text-xs font-bold text-[#7C3AED] font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                PENDING INCIDENTS QUEUE
              </span>
              <span className="text-[10px] bg-blue-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                {pendingIssues.filter(iss => !iss.userVoted).length} Pending
              </span>
            </div>

            {/* Filterable List of Issues */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {pendingIssues.map((issue) => {
                const isSelected = issue.id === selectedIssueId;
                const totalVotes = issue.peerVotesAgree + issue.peerVotesDisagree;
                const agreePct = totalVotes > 0 ? Math.round((issue.peerVotesAgree / totalVotes) * 100) : 100;
                
                return (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setScanError(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-2 relative cursor-pointer group ${
                      isSelected
                        ? 'bg-[#163832]/5 border-white/10 dark:bg-[#163832]/10'
                        : 'bg-slate-50 dark:bg-transparent/40 border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Priority badge & category name */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                        {issue.category}
                      </span>
                      
                      <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                        issue.priority === 'critical'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : issue.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-[#16161D]/90 backdrop-blur-md0/10 text-slate-500 border border-slate-500/20'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>

                    {/* Title and date */}
                    <div>
                      <h4 className={`text-xs font-extrabold line-clamp-1 group-hover:text-[#7C3AED] transition-colors ${
                        isSelected ? 'text-[#7C3AED] dark:text-[#7C3AED]' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {issue.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        By @{issue.reporterName} • {issue.reportedAt}
                      </p>
                    </div>

                    {/* Dynamic state markers */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/10/80 text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {issue.locationName.split(',')[0]}
                      </span>

                      {issue.userVoted ? (
                        <span className={`font-bold flex items-center gap-0.5 ${
                          issue.userVoted === 'agree' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {issue.userVoted === 'agree' ? '✓ VERIFIED' : '✗ FLAGGED'}
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold animate-pulse">
                          ● AWAITING VOTE
                        </span>
                      )}
                    </div>

                    {/* Vote progress meter bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${agreePct > 70 ? 'bg-[#10B981]' : 'bg-red-500'}`}
                        style={{ width: `${agreePct}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* AI Warning guidelines banner */}
            <div className="bg-slate-50 dark:bg-transparent/40 border border-white/10/80 p-3.5 rounded-2xl flex gap-3 text-xs text-slate-500 dark:text-slate-400 leading-normal">
              <Shield className="w-6 h-6 text-[#7C3AED] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-300">Auditing Standards:</span>
                <p className="text-[11px] mt-0.5 text-slate-400">Validate claims using visual evidence and municipal grid overlaps. Do not verify duplicate entries.</p>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Active Incident Workspace (Col-span 8) */}
          <div className="lg:col-span-8 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* Active Workspace Header details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#7C3AED] font-mono uppercase">
                  ACTIVE AUDIT SCAN {activeIssue.id}
                </span>
                <h2 className="text-xl font-bold text-slate-950 dark:text-slate-900 dark:text-white">
                  {activeIssue.title}
                </h2>
              </div>

              {/* Status Indicator pill */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Consensus Rate:</span>
                <span className="font-mono text-xs font-extrabold text-[#10B981] bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg">
                  {activeIssue.peerVotesAgree + activeIssue.peerVotesDisagree > 0 
                    ? Math.round((activeIssue.peerVotesAgree / (activeIssue.peerVotesAgree + activeIssue.peerVotesDisagree)) * 100) 
                    : 100}% Agree
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Grid: Media Preview & Description details (Span 6) */}
              <div className="md:col-span-6 space-y-4">
                
                {/* Media representation mock rendering */}
                {renderMediaMockup(activeIssue.mediaPlaceholder)}

                {/* Issue details textual summary */}
                <div className="space-y-3 bg-slate-50 dark:bg-transparent/40 border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                      Reported {activeIssue.reportedAt}
                    </span>
                    <span>By @{activeIssue.reporterName}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeIssue.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{activeIssue.category}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Location Tag:</span>
                    <span className="font-bold text-rose-400 truncate max-w-[150px]">{activeIssue.locationName}</span>
                  </div>
                </div>

              </div>

              {/* Right Grid: AI Scans, Gauges, Deep Audit button (Span 6) */}
              <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
                
                {/* 1. Deep AI Scan Workspace Panel */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-transparent/40 border border-white/10 space-y-4 flex-1">
                  
                  {isScanning ? (
                    <div className="py-16 text-center space-y-4 flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-white/10/20 border-t-blue-500 animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-[#7C3AED] absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Running AI Deep Forensic Audit...</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono animate-pulse">{scanStateText}</p>
                      </div>
                    </div>
                  ) : activeScan ? (
                    <div className="space-y-4">
                      
                      {/* Scan Header with Confidence Gauge */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981] font-mono uppercase">
                          <Sparkles className="w-4 h-4 text-[#10B981]" />
                          Neural Forensic Audit Completed
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">GRID SCALE</span>
                      </div>

                      {/* Interactive Analytical Tabs selector */}
                      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-[#16161D]/90 rounded-xl border border-slate-250 dark:border-white/10">
                        {(['details', 'duplicates', 'authenticity', 'fraud'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-1.5 text-[10px] uppercase font-bold tracking-tight rounded-lg cursor-pointer transition-all ${
                              activeTab === tab
                                ? 'bg-[#163832] text-slate-900 dark:text-white'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Tab Contents */}
                      <AnimatePresence mode="wait">
                        {activeTab === 'details' && (
                          <motion.div 
                            key="details"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            {/* Verification score gauge */}
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-[9px] text-slate-500 font-mono">MUNICIPAL TRUST LEVEL</p>
                                <p className="text-xs font-bold text-slate-300">Integrity Classification Index</p>
                              </div>
                              <div className="text-right">
                                <span className={`text-2xl font-black ${
                                  activeScan.verificationPercentage > 80 
                                    ? 'text-[#10B981]' 
                                    : activeScan.verificationPercentage > 50 
                                      ? 'text-amber-400' 
                                      : 'text-red-500'
                                }`}>
                                  {activeScan.verificationPercentage}%
                                </span>
                                <p className="text-[9px] text-slate-500 font-mono">Forensic Certainty</p>
                              </div>
                            </div>

                            {/* Verification indicator bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                <span>Risk Level: {activeScan.fraudRisk}</span>
                                <span>Fraud: {activeScan.fraudProbability}%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-[#10B981]"
                                  style={{ width: `${activeScan.verificationPercentage}%` }}
                                ></div>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic text-center px-4">
                              "Automated duplicate checks and semantic content comparisons classify this report as high-confidence and safe for dispatch."
                            </p>
                          </motion.div>
                        )}

                        {activeTab === 'duplicates' && (
                          <motion.div 
                            key="duplicates"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2.5"
                          >
                            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                              <div>
                                <span className="text-[9px] text-slate-500 font-mono">DUPLICATE AUDIT</span>
                                <p className="text-xs font-extrabold text-slate-200">{activeScan.duplicateStatus}</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-[#7C3AED]">
                                Similarity: {activeScan.duplicateSimilarity}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans bg-slate-100 dark:bg-[#16161D]/90/60 p-3 rounded-xl border border-white/10">
                              {activeScan.duplicateReasoning}
                            </p>
                          </motion.div>
                        )}

                        {activeTab === 'authenticity' && (
                          <motion.div 
                            key="authenticity"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2.5"
                          >
                            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                              <div>
                                <span className="text-[9px] text-slate-500 font-mono">IMAGE & DESC MATCH</span>
                                <p className="text-xs font-extrabold text-slate-200">Lexical Material Signature</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-[#10B981]">
                                Score: {activeScan.authenticityScore}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans bg-slate-100 dark:bg-[#16161D]/90/60 p-3 rounded-xl border border-white/10">
                              {activeScan.authenticityDetails}
                            </p>
                          </motion.div>
                        )}

                        {activeTab === 'fraud' && (
                          <motion.div 
                            key="fraud"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2.5"
                          >
                            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                              <div>
                                <span className="text-[9px] text-slate-500 font-mono">META RISK SCORE</span>
                                <p className="text-xs font-extrabold text-slate-200">{activeScan.fraudRisk} Risk Indicators</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-rose-400">
                                Fraud Prob: {activeScan.fraudProbability}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans bg-slate-100 dark:bg-[#16161D]/90/60 p-3 rounded-xl border border-white/10">
                              {activeScan.fraudDetails}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 space-y-3 h-full flex flex-col justify-center items-center">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-slate-750 dark:text-slate-300">Awaiting Neural Forensic Scan</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto">Click below to parse report descriptors, test metadata, and scan local duplicate indexes.</p>
                      </div>
                      <button
                        onClick={handleRunAIDeepScan}
                        className="mt-2 px-5 py-2.5 bg-[#163832] hover:bg-[#7C3AED] font-sans text-xs font-bold text-slate-900 dark:text-white rounded-xl shadow-md transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                      >
                        Run AI Deep Audit Scan
                      </button>
                    </div>
                  )}

                  {scanError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-rose-400 rounded-xl text-xs flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{scanError}</span>
                    </div>
                  )}

                </div>

                {/* 2. Interactive Peer-Consensus Voter Section */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-transparent/40 border border-white/10 space-y-4">
                  <span className="text-[10px] font-bold text-[#7C3AED] font-mono uppercase tracking-wider block">
                    PEER CITIZEN ALIGNMENT & DEED CAST
                  </span>

                  {activeIssue.userVoted ? (
                    <div className="py-3 text-center font-mono text-xs font-bold text-emerald-600 dark:text-green-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1">
                      <p>🎉 Consensual Deed Cast Confirmed!</p>
                      <p className="text-[10px] font-medium text-slate-500">Earned +50 Hero Points. Consolidating work order dispatch...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleUserVote('agree')}
                          className="py-3 bg-[#10B981] hover:bg-emerald-600 text-slate-900 dark:text-white text-xs font-bold font-sans rounded-xl flex items-center justify-center gap-2 shadow-md shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Verify & Dispatch
                        </button>

                        <button
                          onClick={() => handleUserVote('disagree')}
                          className="py-3 bg-[#16161D]/90 backdrop-blur-md dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-250 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold font-sans rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <ThumbsDown className="w-4 h-4 text-red-500" />
                          Flag as Spam / Fake
                        </button>
                      </div>

                      {/* Consensus current percentage rating */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <span>Consensus Voters: {activeIssue.peerVotesAgree} Agreed</span>
                        <span>{activeIssue.peerVotesDisagree} Flagged</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* 3. Bottom Row: Community Activity Live Logs Feed */}
        <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
            <span className="text-xs font-bold text-[#7C3AED] font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              LIVE PEER VERIFICATION PULSE FEED
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded font-mono">
              Network Logs Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence initial={false}>
              {activities.map((act) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-transparent/40 border border-slate-200/80 dark:border-white/10/80 space-y-2 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#7C3AED] font-mono">
                      @{act.user}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {act.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate">
                    {act.action}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/40 dark:border-white/10/50">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono uppercase">
                      Action Result
                    </span>

                    <span className={`text-[9px] font-mono font-extrabold uppercase ${
                      act.status === 'consensus' 
                        ? 'text-green-500' 
                        : act.status === 'flagged' 
                          ? 'text-amber-500' 
                          : 'text-red-500'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
