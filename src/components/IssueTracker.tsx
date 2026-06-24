import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  Search, Filter, Shield, Clock, MapPin, AlertCircle, CheckCircle2, 
  ArrowUpRight, Users, ChevronRight, Check, AlertTriangle, FileText, 
  BarChart3, RefreshCw, Calendar, Sparkles, Building2, TrendingUp, Inbox
} from 'lucide-react';

// Define Interface for Tracked Issue
interface TrackedIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'verified' | 'in-progress' | 'resolved' | 'escalated';
  locationName: string;
  reportedAt: string; // e.g. "2026-06-10"
  reporterName: string;
  upvotes: number;
  aiVerificationPercentage: number;
  resolutionTimeHours?: number; // hours taken to resolve if status is resolved
  mediaPlaceholder: 'water_hydrant_spurt' | 'deep_road_crater' | 'drooping_power_lines' | 'woodland_garbage_dump' | 'shattered_school_beacon' | 'general_hazard';
  timeline: {
    status: string;
    label: string;
    date: string;
    completed: boolean;
    details?: string;
  }[];
}

const SEED_TRACKED_ISSUES: TrackedIssue[] = [
  {
    id: 'TRK-101',
    title: 'Burst water main flooding pedestrian walk',
    description: 'The green water hydrant at the corner of Pine Road is spraying pressurized water 5 feet into the air. It is flooding the sidewalk, creating a massive puddle, and making pedestrian crossings extremely dangerous.',
    category: 'Water & Utilities',
    priority: 'high',
    status: 'in-progress',
    locationName: '144 Pine Road (Junction 5th Ave)',
    reportedAt: '2026-06-23',
    reporterName: 'Sandro K.',
    upvotes: 42,
    aiVerificationPercentage: 94,
    mediaPlaceholder: 'water_hydrant_spurt',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-23 08:30', completed: true, details: 'Incident submitted by Sandro K.' },
      { status: 'verified', label: 'AI Forensic Scan Approval', date: '2026-06-23 08:31', completed: true, details: '94% authenticity signature confirmed' },
      { status: 'dispatched', label: 'Crew Dispatched', date: '2026-06-23 09:15', completed: true, details: 'Plumbing Emergency Crew 4 assigned' },
      { status: 'resolved', label: 'Awaiting Valve Fix', date: 'Pending', completed: false, details: 'Temporary bypass lock applied' }
    ]
  },
  {
    id: 'TRK-102',
    title: 'Deep pothole hiding under rain puddle',
    description: 'A crater-like pothole has opened up in the middle lane of Oakwood Boulevard. It is filled with rainwater, making it look like a harmless puddle. I saw two sedans hit it and make awful grinding sounds.',
    category: 'Street Maintenance',
    priority: 'critical',
    status: 'new',
    locationName: '310 Oakwood Blvd, opposite High School',
    reportedAt: '2026-06-24',
    reporterName: 'Clara J.',
    upvotes: 68,
    aiVerificationPercentage: 88,
    mediaPlaceholder: 'deep_road_crater',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-24 06:12', completed: true, details: 'Incident submitted by Clara J.' },
      { status: 'verified', label: 'AI Duplicate Checking', date: '2026-06-24 06:13', completed: true, details: 'Passed spatial duplicate screening (92% confidence)' },
      { status: 'dispatched', label: 'Awaiting Road Crew Dispatch', date: 'Pending', completed: false },
      { status: 'resolved', label: 'Scheduled Asphalt Patching', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'TRK-103',
    title: 'Unsecured overhead electrical wires hanging low',
    description: 'During yesterday\'s storm, a utility pole branch snapped, leaving thick insulated electrical cables drooping down to about 6 feet above the cycling pathway. Extremely dangerous for passing bike riders.',
    category: 'Public Safety',
    priority: 'critical',
    status: 'escalated',
    locationName: 'Sunset Boulevard Corridor (West Lane)',
    reportedAt: '2026-06-22',
    reporterName: 'Alex Mercer',
    upvotes: 112,
    aiVerificationPercentage: 99,
    mediaPlaceholder: 'drooping_power_lines',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-22 14:20', completed: true, details: 'Submitted by Alex Mercer' },
      { status: 'verified', label: 'Peer and AI Verified', date: '2026-06-22 14:22', completed: true, details: 'Assigned 99% Public Threat indicator' },
      { status: 'dispatched', label: 'Grid Operator Alerted', date: '2026-06-22 14:30', completed: true, details: 'Grid contractor failed initial dispatch response window' },
      { status: 'escalated', label: 'Escalated to Municipal Safety Commissioner', date: '2026-06-23 10:00', completed: true, details: 'Fined utility operator; alternative crew dispatched' }
    ]
  },
  {
    id: 'TRK-104',
    title: 'Suspicious household garbage dumping in greenbelt',
    description: 'Spotted a commercial van unloading over 15 large black plastic garbage bags and an old tattered sofa directly into the conservation woodland buffer behind the park gate.',
    category: 'Environmental & Sanitation',
    priority: 'medium',
    status: 'resolved',
    locationName: 'Green Park Conservation Woodlands (Gate 4)',
    reportedAt: '2026-06-18',
    reporterName: 'Marcus T.',
    upvotes: 31,
    aiVerificationPercentage: 82,
    resolutionTimeHours: 18,
    mediaPlaceholder: 'woodland_garbage_dump',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-18 10:00', completed: true, details: 'Submitted by Marcus T.' },
      { status: 'verified', label: 'AI Forensics Passed', date: '2026-06-18 10:02', completed: true, details: 'Identified non-organic bulk furniture in report text' },
      { status: 'dispatched', label: 'Sanitation Truck Assigned', date: '2026-06-18 13:45', completed: true, details: 'Refuse collection unit 7 dispatched' },
      { status: 'resolved', label: 'Cleaned and Fenced', date: '2026-06-19 04:00', completed: true, details: 'Bags loaded, warning signage posted. Completed in 18 hours.' }
    ]
  },
  {
    id: 'TRK-105',
    title: 'Shattered speed limits warning beacon',
    description: 'The solar-powered digital speed sign that flashes 25 MPH near the primary school crosswalk has been completely shattered. The screen is dark and shards of plastic are scattered on the sidewalk.',
    category: 'Road Safety & Forestry',
    priority: 'medium',
    status: 'verified',
    locationName: 'Elm Road (Primary School Crosswalk)',
    reportedAt: '2026-06-24',
    reporterName: 'Principal Vance',
    upvotes: 19,
    aiVerificationPercentage: 86,
    mediaPlaceholder: 'shattered_school_beacon',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-24 08:05', completed: true },
      { status: 'verified', label: 'AI Hardware Identification', date: '2026-06-24 08:06', completed: true, details: 'Classified asset ID #SL-884' },
      { status: 'dispatched', label: 'Procurement Scheduled', date: 'Pending', completed: false },
      { status: 'resolved', label: 'Pending Replacement', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'TRK-106',
    title: 'Clogged storm gutter causing street puddle',
    description: 'Storm gutter is completely packed with decomposing leaves, silt, and tree branches. Heavy rains are causing a huge water pond to extend across two lanes of traffic.',
    category: 'Water & Utilities',
    priority: 'low',
    status: 'resolved',
    locationName: '88 Lily Road',
    reportedAt: '2026-06-10',
    reporterName: 'Timothy Y.',
    upvotes: 12,
    aiVerificationPercentage: 79,
    resolutionTimeHours: 24,
    mediaPlaceholder: 'general_hazard',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-10 11:20', completed: true },
      { status: 'verified', label: 'AI Validation Passed', date: '2026-06-10 11:22', completed: true },
      { status: 'dispatched', label: 'Dispatched to Drainage Team', date: '2026-06-10 16:30', completed: true },
      { status: 'resolved', label: 'Debris Cleared & Flushed', date: '2026-06-11 11:20', completed: true, details: 'Gutter cleared, full flow restored. Done in 24 hours.' }
    ]
  },
  {
    id: 'TRK-107',
    title: 'Snapped oak branch blocking cycle path',
    description: 'A large heavy oak tree branch has snapped and is hanging in mid-air over the cycle path. It is supported by very weak twigs and is ready to fall on any passing cyclist.',
    category: 'Road Safety & Forestry',
    priority: 'medium',
    status: 'resolved',
    locationName: 'Greenwood cycle loop, Mile 2.3',
    reportedAt: '2026-06-12',
    reporterName: 'Clara J.',
    upvotes: 27,
    aiVerificationPercentage: 91,
    resolutionTimeHours: 6,
    mediaPlaceholder: 'general_hazard',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-12 09:00', completed: true },
      { status: 'verified', label: 'Arbor Division Notified', date: '2026-06-12 09:05', completed: true },
      { status: 'dispatched', label: 'Chainsaw Crew Sent', date: '2026-06-12 11:30', completed: true },
      { status: 'resolved', label: 'Branch Cut and Chipped', date: '2026-06-12 15:00', completed: true, details: 'Cleared from path. Completed in 6 hours.' }
    ]
  },
  {
    id: 'TRK-108',
    title: 'Damaged pedestrian walking signal button',
    description: 'The physical crosswalk push button is dangling by its electrical wire from the post. Pressing the button does not activate the walking light.',
    category: 'Street Maintenance',
    priority: 'low',
    status: 'in-progress',
    locationName: 'North Market St & 3rd St',
    reportedAt: '2026-06-21',
    reporterName: 'Sandro K.',
    upvotes: 8,
    aiVerificationPercentage: 74,
    mediaPlaceholder: 'general_hazard',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-21 16:45', completed: true },
      { status: 'verified', label: 'AI Validation Passed', date: '2026-06-21 16:47', completed: true },
      { status: 'dispatched', label: 'Traffic Signal Unit Assigned', date: '2026-06-22 08:30', completed: true },
      { status: 'resolved', label: 'Awaiting replacement switch', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'TRK-109',
    title: 'Illegal dump of commercial chemical paint barrels',
    description: 'Three 50-gallon metal barrels labeled industrial solvent have been left behind an empty warehouse. One is leaking a blue sludge into the storm drain.',
    category: 'Environmental & Sanitation',
    priority: 'critical',
    status: 'in-progress',
    locationName: 'Industrial Zone Alley, Sector 7',
    reportedAt: '2026-06-23',
    reporterName: 'Marcus T.',
    upvotes: 95,
    aiVerificationPercentage: 97,
    mediaPlaceholder: 'general_hazard',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-23 13:10', completed: true },
      { status: 'verified', label: 'Hazmat Threat Verified', date: '2026-06-23 13:15', completed: true, details: '97% confidence Hazmat leak signature' },
      { status: 'dispatched', label: 'Hazmat Disposal Team Dispatched', date: '2026-06-23 14:00', completed: true, details: 'Spill containment socks deployed' },
      { status: 'resolved', label: 'Awaiting toxic sludge scraping', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'TRK-110',
    title: 'Flickering street lamp making alley dangerous',
    description: 'The main street light in the dark pedestrian alley is turning off for 2 minutes and then back on for 10 seconds. It makes the corridor look like a horror movie and is a security threat.',
    category: 'Road Safety & Forestry',
    priority: 'low',
    status: 'resolved',
    locationName: 'Alleyway behind Broadway Theatre',
    reportedAt: '2026-06-14',
    reporterName: 'Principal Vance',
    upvotes: 14,
    aiVerificationPercentage: 81,
    resolutionTimeHours: 32,
    mediaPlaceholder: 'shattered_school_beacon',
    timeline: [
      { status: 'reported', label: 'Report Registered', date: '2026-06-14 21:00', completed: true },
      { status: 'verified', label: 'AI Diagnostics Passed', date: '2026-06-14 21:02', completed: true },
      { status: 'dispatched', label: 'Utility Technician Dispatched', date: '2026-06-15 09:00', completed: true },
      { status: 'resolved', label: 'Ballast & LED Module Replaced', date: '2026-06-16 05:00', completed: true, details: 'Completed in 32 hours.' }
    ]
  }
];

// Seed monthly metrics for reports
const MONTHLY_REPORTS_DATA = [
  { month: 'Jan', reports: 42, resolved: 38, participation: 180 },
  { month: 'Feb', reports: 56, resolved: 50, participation: 220 },
  { month: 'Mar', reports: 68, resolved: 61, participation: 310 },
  { month: 'Apr', reports: 92, resolved: 80, participation: 450 },
  { month: 'May', reports: 110, resolved: 98, participation: 580 },
  { month: 'Jun', reports: 144, resolved: 118, participation: 790 },
];

const COLORS = ['#8EB69B', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface IssueTrackerProps {
  onBack: () => void;
}

export default function IssueTracker({ onBack }: IssueTrackerProps) {
  const [issues, setIssues] = useState<TrackedIssue[]>(SEED_TRACKED_ISSUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Selected issue for deep timeline details view
  const [selectedIssueId, setSelectedIssueId] = useState<string>('TRK-101');

  // Filter Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
      const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [issues, searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  // Current active issue details object
  const activeIssue = useMemo(() => {
    return issues.find(i => i.id === selectedIssueId) || filteredIssues[0] || issues[0];
  }, [issues, selectedIssueId, filteredIssues]);

  // Dynamic calculated Metrics based on currently filtered subset
  const metrics = useMemo(() => {
    const total = filteredIssues.length;
    const pending = filteredIssues.filter(i => i.status !== 'resolved').length;
    const resolved = filteredIssues.filter(i => i.status === 'resolved').length;
    const escalated = filteredIssues.filter(i => i.status === 'escalated').length;
    
    // Resolution rate calculation
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Average resolution time of resolved issues
    const resolvedIssues = filteredIssues.filter(i => i.status === 'resolved' && i.resolutionTimeHours);
    const avgTime = resolvedIssues.length > 0 
      ? Math.round(resolvedIssues.reduce((sum, curr) => sum + (curr.resolutionTimeHours || 0), 0) / resolvedIssues.length)
      : 22; // default standard benchmark hours

    return { total, pending, resolved, escalated, rate, avgTime };
  }, [filteredIssues]);

  // Dynamic Chart Data: Category Distribution
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredIssues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredIssues]);

  // Dynamic Chart Data: Resolution Performance by Status
  const statusPerformanceData = useMemo(() => {
    const counts = { new: 0, verified: 0, 'in-progress': 0, resolved: 0, escalated: 0 };
    filteredIssues.forEach(issue => {
      counts[issue.status] = (counts[issue.status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name: name.toUpperCase(),
      count
    }));
  }, [filteredIssues]);

  // Reset Filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
  };

  // Status Badge styling helper
  const getStatusBadge = (status: TrackedIssue['status']) => {
    const styles = {
      new: 'bg-[#8EB69B]/10 text-[#8EB69B] dark:text-blue-400 border border-[#235347]/20',
      verified: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      'in-progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      resolved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      escalated: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
    };
    return <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase ${styles[status]}`}>{status}</span>;
  };

  // Priority Badge styling helper
  const getPriorityBadge = (priority: TrackedIssue['priority']) => {
    const styles = {
      low: 'text-slate-500 dark:text-slate-400',
      medium: 'text-[#8EB69B]',
      high: 'text-amber-500',
      critical: 'text-red-500 font-extrabold animate-pulse'
    };
    return <span className={`text-xs font-mono font-bold capitalize flex items-center gap-1 ${styles[priority]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {priority}
    </span>;
  };

  // SVG Media Mockup Render
  const renderMediaPreview = (placeholder: string) => {
    return (
      <div className="relative h-44 bg-slate-950 rounded-xl border border-slate-200 dark:border-[#163832] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
        <div className="absolute top-2 left-2 bg-slate-900/90 text-[8px] font-mono text-slate-400 px-2 py-0.5 rounded border border-slate-800 z-10">
          MEDIA INDEX: MATCHED
        </div>

        {placeholder === 'water_hydrant_spurt' ? (
          <svg className="w-16 h-16 text-cyan-400 animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 50,80 Q 20,40 10,50" />
            <path d="M 50,80 Q 30,30 20,40" />
            <path d="M 50,80 Q 70,30 80,40" />
            <rect x="42" y="65" width="16" height="25" rx="1" fill="currentColor" opacity="0.3" />
          </svg>
        ) : placeholder === 'deep_road_crater' ? (
          <svg className="w-16 h-16 text-amber-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 30,50 L 45,45 L 42,55 L 60,50 L 52,62 L 68,68 Z" fill="currentColor" opacity="0.2" />
            <line x1="45" y1="45" x2="52" y2="25" />
            <line x1="60" y1="50" x2="80" y2="55" />
          </svg>
        ) : placeholder === 'drooping_power_lines' ? (
          <svg className="w-16 h-16 text-red-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="20" x2="10" y2="90" />
            <line x1="90" y1="20" x2="90" y2="90" />
            <path d="M 10,25 Q 50,75 90,25" strokeWidth="3" />
          </svg>
        ) : placeholder === 'woodland_garbage_dump' ? (
          <svg className="w-16 h-16 text-emerald-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="35" y="70" width="30" height="15" rx="2" fill="none" stroke="currentColor" />
            <circle cx="45" cy="65" r="8" fill="currentColor" opacity="0.3" />
            <circle cx="55" cy="67" r="6" fill="currentColor" opacity="0.4" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-slate-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="25" y="25" width="50" height="50" rx="4" strokeDasharray="3" />
            <circle cx="50" cy="50" r="10" />
          </svg>
        )}

        <span className="text-[10px] font-mono text-slate-400 mt-2">VISUAL TELEMETRY ATTACHMENT</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#DAF1DE]/30 dark:bg-[#051F20] text-slate-900 dark:text-slate-50 pt-32 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Title Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#8EB69B] transition-colors font-mono cursor-pointer"
            >
              ← RETURN TO LANDING
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
              <Building2 className="w-8 h-8 text-[#8EB69B]" />
              Municipal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8EB69B] to-purple-600">Issue Tracker</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
              Professional administrative workspace monitoring live reports, tracking response metrics, and exploring AI forensic authenticity audits.
            </p>
          </div>

          {/* Quick Refresh Tracker */}
          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs shrink-0 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-emerald-500" />
            Last Sync: Just Now
            <RefreshCw className="w-3.5 h-3.5 ml-1 text-slate-400 dark:hover:text-white cursor-pointer hover:rotate-180 transition-all duration-500" />
          </div>
        </div>

        {/* 1. Statistics Cards Display */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-2xl relative overflow-hidden shadow-xs">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-tight">Total Reports</p>
            <p className="text-3xl font-black mt-1 text-slate-950 dark:text-white">{metrics.total}</p>
            <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
              <span className="text-[#8EB69B] font-bold">100%</span> indexed
            </div>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-2xl relative overflow-hidden shadow-xs">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-tight">Pending Dispatch</p>
            <p className="text-3xl font-black mt-1 text-amber-500">{metrics.pending}</p>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Active triage queues
            </div>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-2xl relative overflow-hidden shadow-xs">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-tight">Resolved Reports</p>
            <p className="text-3xl font-black mt-1 text-emerald-500">{metrics.resolved}</p>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              Archived & Cleared
            </div>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-2xl relative overflow-hidden shadow-xs">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-tight">Escalated</p>
            <p className="text-3xl font-black mt-1 text-red-500">{metrics.escalated}</p>
            <div className="text-[10px] text-red-500 font-mono mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Commissioner Triage
            </div>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-2xl relative overflow-hidden shadow-xs">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-tight">Resolution Rate</p>
            <p className="text-3xl font-black mt-1 text-purple-500">{metrics.rate}%</p>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Target benchmark: 85%
            </div>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-2xl relative overflow-hidden shadow-xs">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-tight">Avg Resolution Time</p>
            <p className="text-3xl font-black mt-1 text-[#8EB69B]">{metrics.avgTime} hrs</p>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              From report to sign-off
            </div>
          </div>

        </div>

        {/* 2. Graphical Insights (Recharts Block) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart A: Monthly Reports and Resolution Trend (Line + Area) */}
          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">Monthly Reports & Resolution Trends</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Incident volume trajectory over last six periods</p>
              </div>
              <TrendingUp className="w-4 h-4 text-[#8EB69B]" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REPORTS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8EB69B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8EB69B" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748B" />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} stroke="#64748B" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderColor: '#1E293B', 
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '11px',
                      fontFamily: 'monospace' 
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Area type="monotone" name="Report Volume" dataKey="reports" stroke="#8EB69B" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
                  <Area type="monotone" name="Resolved Tickets" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart B: Category Distribution & Performance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category Pie Chart */}
            <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-3xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">Category Distribution</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Reports spread by municipal sector</p>
              </div>

              {categoryChartData.length > 0 ? (
                <div className="h-44 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '10px', fontFamily: 'monospace', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Total Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-slate-400 font-mono">Total</span>
                    <span className="text-base font-black text-slate-950 dark:text-white">{metrics.total}</span>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                  No Category Data Available
                </div>
              )}

              {/* Legend checklist */}
              <div className="flex flex-wrap gap-1.5 justify-center max-h-[80px] overflow-y-auto">
                {categoryChartData.map((item, idx) => (
                  <span key={item.name} className="text-[9px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-850">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="truncate max-w-[80px]">{item.name}</span>
                    <span className="font-bold">({item.value})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Resolution Performance by Status (Bar Chart) */}
            <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-4.5 rounded-3xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">Resolution Status Distribution</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Current state volume tracker</p>
              </div>

              <div className="h-44 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusPerformanceData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 8, fontFamily: 'monospace' }} stroke="#64748B" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 8, fontFamily: 'monospace' }} stroke="#64748B" />
                    <Tooltip contentStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                      {statusPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-center pt-2">
                Real-time active tracking nodes
              </div>
            </div>

          </div>

        </div>

        {/* Chart Row 3: Citizen Participation Frequency */}
        <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">Citizen Voting & Validation Participation</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Daily volunteer audit logs submitted to verify municipal anomalies</p>
            </div>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_REPORTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
                <YAxis tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#FFF', fontSize: '10px', fontFamily: 'monospace' }} />
                <Line type="monotone" name="Volunteer Reviews Cast" dataKey="participation" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Search, Filters, and Primary Tracked Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Issue Search, Interactive Filtering, and Main List (Col-span 7) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-3xl shadow-xs space-y-4">
              
              {/* Search input field */}
              <div className="relative">
                <Search className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="Search issues by keyword, ID, location, or reporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-hidden focus:border-[#235347] dark:focus:border-[#235347] transition-colors"
                />
              </div>

              {/* Advanced Multi-parameter Filter Row */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                
                {/* Filter Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">Sector</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="All">All Sectors</option>
                    <option value="Water & Utilities">Water & Utilities</option>
                    <option value="Street Maintenance">Street Maintenance</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Environmental & Sanitation">Environmental & Sanitation</option>
                    <option value="Road Safety & Forestry">Road Safety & Forestry</option>
                  </select>
                </div>

                {/* Filter Priority */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">Priority</label>
                  <select 
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="All">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                {/* Filter Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="All">All Statuses</option>
                    <option value="new">New</option>
                    <option value="verified">Verified</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>

              </div>

              {/* Reset filter banner info */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Displaying {filteredIssues.length} of {issues.length} matching incidents</span>
                {(searchQuery || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-[#8EB69B] font-bold hover:underline cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

            </div>

            {/* List of Filtered Issues */}
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => {
                  const isSelected = issue.id === selectedIssueId;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssueId(issue.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start gap-4 cursor-pointer group ${
                        isSelected 
                          ? 'bg-blue-50/50 dark:bg-[#163832]/10 border-[#235347]' 
                          : 'bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border-slate-200 dark:border-[#163832] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-[#051F20] px-2 py-0.5 rounded border border-slate-200 dark:border-[#163832]">
                            {issue.id}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{issue.category}</span>
                        </div>

                        <div>
                          <h4 className={`text-sm font-extrabold line-clamp-1 group-hover:text-[#8EB69B] transition-colors ${
                            isSelected ? 'text-[#8EB69B]' : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {issue.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                            {issue.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-850/60 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            {issue.locationName.split('(')[0]}
                          </span>
                          <span>By @{issue.reporterName}</span>
                          <span>• {issue.reportedAt}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end gap-2 sm:self-stretch justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-850">
                        {getStatusBadge(issue.status)}
                        {getPriorityBadge(issue.priority)}
                        <span className="text-xs text-emerald-500 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {issue.aiVerificationPercentage}% AI
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] rounded-3xl space-y-3">
                  <Inbox className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching tracking records</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Try refining your search keyword or clearing the status/sector filtering selectors.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Selected Issue Details and Timeline (Col-span 5) */}
          <div className="lg:col-span-5 bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* Header / ID */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-250 dark:border-slate-850">
              <span className="text-xs font-mono font-black text-[#8EB69B] uppercase">
                DETAILED INSPECTION WORKSPACE
              </span>
              <span className="text-xs bg-slate-100 dark:bg-[#051F20] border border-slate-200 dark:border-[#163832] px-3 py-1 rounded font-mono text-slate-500 dark:text-slate-400">
                {activeIssue.id}
              </span>
            </div>

            {/* Active Details Content */}
            <div className="space-y-4">
              
              {/* Media Preview Mock */}
              {renderMediaPreview(activeIssue.mediaPlaceholder)}

              {/* Core Text details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getStatusBadge(activeIssue.status)}
                  {getPriorityBadge(activeIssue.priority)}
                </div>

                <h3 className="font-extrabold text-base text-slate-950 dark:text-white leading-snug">
                  {activeIssue.title}
                </h3>

                <p className="text-xs text-slate-450 dark:text-slate-500 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {activeIssue.locationName}
                </p>

                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-[#DAF1DE]/30 dark:bg-[#051F20]/40 p-3.5 rounded-xl border border-slate-200 dark:border-[#163832]/80">
                  {activeIssue.description}
                </p>
              </div>

              {/* AI forensic assurance meter */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 uppercase font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" /> AI Integrity Index
                  </span>
                  <span>{activeIssue.aiVerificationPercentage}% Verified</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    style={{ width: `${activeIssue.aiVerificationPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Comprehensive Activity Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase font-mono tracking-tight flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8EB69B]" />
                  INCIDENT ACTIVITY TIMELINE
                </h4>

                <div className="relative pl-6 border-l border-slate-200 dark:border-[#163832] space-y-4 ml-2.5">
                  {activeIssue.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="relative">
                        
                        {/* Bullets */}
                        <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          step.completed
                            ? 'bg-[#10B981] border-[#10B981] text-white'
                            : 'bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border-slate-300 dark:border-[#163832] text-slate-400'
                        }`}>
                          {step.completed ? (
                            <Check className="w-2.5 h-2.5" />
                          ) : (
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold ${step.completed ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{step.date}</span>
                          </div>
                          {step.details && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                              {step.details}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
