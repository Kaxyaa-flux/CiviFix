import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerToast } from '../lib/toast';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  ShieldAlert, Clock, CheckCircle2, AlertTriangle, Users, Truck, Briefcase, 
  Settings, Activity, Search, Filter, Bell, RefreshCw, ChevronRight, Check,
  ArrowRight, ShieldCheck, Play, UserCheck, AlertCircle, Ban, HelpCircle,
  TrendingUp, Calendar, MapPin, BadgeAlert, Layers, MessageSquare, ClipboardList,
  Flame, Mail, Info, Terminal, ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface AuthorityDashboardProps {
  currentUser: User | null;
  onBack: () => void;
}

interface AssignedIssue {
  id: string;
  title: string;
  category: 'Roads' | 'Water' | 'Electricity' | 'Sanitation' | 'Safety';
  location: string;
  reportedAt: string;
  slaLimitHours: number;
  slaRemainingHours: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'assigned' | 'investigating' | 'dispatching' | 'resolving' | 'resolved';
  assignedCrew: string;
  allocatedVehicles: string[];
  reportedBy: string;
  upvotes: number;
  historyLogs: { timestamp: string; action: string; actor: string }[];
}

interface AuthorityCrew {
  id: string;
  name: string;
  specialty: 'Hydraulics' | 'Structural engineering' | 'Grid systems' | 'Refuse logistics' | 'Public security';
  status: 'idle' | 'en-route' | 'active' | 'on-break';
  efficiencyRating: number; // e.g. 96
  activeJobId: string | null;
}

const INITIAL_CREWS: AuthorityCrew[] = [
  { id: 'CRW-01', name: 'Rapid Response Hydraulics 4', specialty: 'Hydraulics', status: 'idle', efficiencyRating: 98, activeJobId: null },
  { id: 'CRW-02', name: 'Roadbed Fracture Crew Alpha', specialty: 'Structural engineering', status: 'active', efficiencyRating: 94, activeJobId: 'AUTH-102' },
  { id: 'CRW-03', name: 'Grid Overload Unit 12', specialty: 'Grid systems', status: 'active', efficiencyRating: 91, activeJobId: 'AUTH-104' },
  { id: 'CRW-04', name: 'Municipal Refuse Logistics B', specialty: 'Refuse logistics', status: 'idle', efficiencyRating: 89, activeJobId: null },
  { id: 'CRW-05', name: 'Safety & Streetlighting Patrol', specialty: 'Public security', status: 'on-break', efficiencyRating: 95, activeJobId: null }
];

const INITIAL_ISSUES: AssignedIssue[] = [
  {
    id: 'AUTH-101',
    title: 'Pine Road Conduit Cavitation Leak',
    category: 'Water',
    location: 'Pine Road Grid-Hub 4',
    reportedAt: '2026-06-24 04:30',
    slaLimitHours: 12,
    slaRemainingHours: 4.5,
    priority: 'CRITICAL',
    status: 'assigned',
    assignedCrew: 'Rapid Response Hydraulics 4',
    allocatedVehicles: ['Sewer Scanner Truck-4'],
    reportedBy: 'Kanak B.',
    upvotes: 42,
    historyLogs: [
      { timestamp: '04:30', action: 'Issue reported by citizen telemetry hub', actor: 'System Core' },
      { timestamp: '05:00', action: 'Severity escalated to CRITICAL based on sub-surface sensor arrays', actor: 'AI Dispatcher' },
      { timestamp: '05:15', action: 'Issue routed to Rapid Response Hydraulics 4', actor: 'Director Julian' }
    ]
  },
  {
    id: 'AUTH-102',
    title: 'Structural Roadbed Joint Failure Cascade',
    category: 'Roads',
    location: 'Oakwood Boulevard Underpass',
    reportedAt: '2026-06-23 20:15',
    slaLimitHours: 36,
    slaRemainingHours: 11.2,
    priority: 'HIGH',
    status: 'investigating',
    assignedCrew: 'Roadbed Fracture Crew Alpha',
    allocatedVehicles: ['Heavy Duty Asphalt Mixer B', 'Support Fleet Escort 1'],
    reportedBy: 'Sandro K.',
    upvotes: 28,
    historyLogs: [
      { timestamp: 'Yesterday 20:15', action: 'Roadway fracture reported via camera node', actor: 'AI Computer Vision' },
      { timestamp: 'Yesterday 21:00', action: 'Assigned to Structural Engineering team', actor: 'System Core' },
      { timestamp: 'Today 06:00', action: 'Crew dispatched to conduct ultrasound scans', actor: 'Crew Alpha Leader' }
    ]
  },
  {
    id: 'AUTH-103',
    title: 'Series-Fault Photocell Blackout',
    category: 'Electricity',
    location: 'Sunset Boulevard Corridor (West Lane)',
    reportedAt: '2026-06-24 01:10',
    slaLimitHours: 48,
    slaRemainingHours: 25.8,
    priority: 'MEDIUM',
    status: 'dispatching',
    assignedCrew: 'Safety & Streetlighting Patrol',
    allocatedVehicles: [],
    reportedBy: 'Julian F.',
    upvotes: 14,
    historyLogs: [
      { timestamp: '01:10', action: 'Streetlight array failure flagged automatically', actor: 'Grid Telemetry' },
      { timestamp: '03:45', action: 'Added photocell replacements to crew patrol queue', actor: 'Director Julian' }
    ]
  },
  {
    id: 'AUTH-104',
    title: 'Gate 4 Access Path Overflow Hazard',
    category: 'Sanitation',
    location: 'Green Park Woodlands Access Road',
    reportedAt: '2026-06-24 06:15',
    slaLimitHours: 24,
    slaRemainingHours: 22.8,
    priority: 'MEDIUM',
    status: 'dispatching',
    assignedCrew: 'Municipal Refuse Logistics B',
    allocatedVehicles: ['Bio-Hygienic Compactor Heavy-3'],
    reportedBy: 'Diana P.',
    upvotes: 19,
    historyLogs: [
      { timestamp: '06:15', action: 'Overloaded hopper detected', actor: 'Sensor Path Gate' },
      { timestamp: '07:00', action: 'Assigned crew dispatched with compactor logistics vehicle', actor: 'AI Auto-Route' }
    ]
  },
  {
    id: 'AUTH-105',
    title: 'Broadway Bridge Deck Strain Shear Risk',
    category: 'Roads',
    location: 'Broadway Viaduct (South Abutment)',
    reportedAt: '2026-06-24 03:00',
    slaLimitHours: 72,
    slaRemainingHours: 67.5,
    priority: 'LOW',
    status: 'assigned',
    assignedCrew: 'Roadbed Fracture Crew Alpha',
    allocatedVehicles: [],
    reportedBy: 'Clara J.',
    upvotes: 5,
    historyLogs: [
      { timestamp: '03:00', action: 'Strain sensor alerts detected above 1.1x threshold', actor: 'IoT Core' }
    ]
  }
];

const RESOLUTION_CHART_DATA = [
  { name: 'Mon', completed: 18, breached: 1, target: 20 },
  { name: 'Tue', completed: 24, breached: 0, target: 20 },
  { name: 'Wed', completed: 15, breached: 3, target: 20 },
  { name: 'Thu', completed: 29, breached: 2, target: 20 },
  { name: 'Fri', completed: 32, breached: 0, target: 20 },
  { name: 'Sat', completed: 22, breached: 1, target: 20 },
  { name: 'Sun', completed: 27, breached: 0, target: 20 }
];

const TEAM_PERFORMANCE_DATA = [
  { name: 'Hydraulics Team', efficiency: 98, jobsDone: 45, onTime: 44 },
  { name: 'Structural Crew', efficiency: 94, jobsDone: 38, onTime: 35 },
  { name: 'Grid Systems', efficiency: 91, jobsDone: 29, onTime: 26 },
  { name: 'Refuse Logistics', efficiency: 89, jobsDone: 52, onTime: 48 },
  { name: 'Patrol / Security', efficiency: 95, jobsDone: 61, onTime: 60 }
];

const CATEGORY_STATS_DATA = [
  { name: 'Water Leakages', value: 35, color: '#3B82F6' },
  { name: 'Road Fractures', value: 25, color: '#F59E0B' },
  { name: 'Grid blackouts', value: 20, color: '#EF4444' },
  { name: 'Refuse / Waste', value: 15, color: '#10B981' },
  { name: 'Public Hazards', value: 5, color: '#8B5CF6' }
];

export default function AuthorityDashboard({ currentUser, onBack }: AuthorityDashboardProps) {
  const [issues, setIssues] = useState<AssignedIssue[]>(INITIAL_ISSUES);
  const [crews, setCrews] = useState<AuthorityCrew[]>(INITIAL_CREWS);
  
  // Selection and tracking
  const [selectedIssueId, setSelectedIssueId] = useState<string>('AUTH-101');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active notification stack
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; type: 'alert' | 'success' | 'info' }[]>([
    { id: 'n-1', text: 'Subterranean Feed-Main pressure surges approaching cavitation risk limits', time: '07:22', type: 'alert' },
    { id: 'n-2', text: 'Crew Alpha reported on-site ultrasound scan completion at Oakwood Boulevard', time: '06:55', type: 'info' },
    { id: 'n-3', text: 'Emergency Bio-Compactor dispatched to Gate 4 Access Path', time: '06:18', type: 'success' }
  ]);

  // Logs audit trails
  const [activityLogs, setActivityLogs] = useState<{ timestamp: string; action: string; level: 'critical' | 'normal' | 'dispatch' }[]>([
    { timestamp: '07:25:11', action: 'Authorized Water Flow Bypass Lockout - Pine Road Grid-Hub 4', level: 'critical' },
    { timestamp: '07:18:42', action: 'Resource Allocation Check - BIO-H Heavy Compactor approved', level: 'dispatch' },
    { timestamp: '07:02:05', action: 'SLA countdown timer refreshed across active queue', level: 'normal' },
    { timestamp: '06:45:19', action: 'Security patrol logged complete on South Abutment', level: 'normal' }
  ]);

  const activeIssue = useMemo(() => {
    return issues.find(i => i.id === selectedIssueId) || issues[0];
  }, [issues, selectedIssueId]);

  // Compute live aggregates for enterprise KPIs
  const kpis = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length;
    const avgSla = (issues.reduce((sum, curr) => sum + curr.slaRemainingHours, 0) / total).toFixed(1);
    const resolved = issues.filter(i => i.status === 'resolved').length;
    return { total, critical, avgSla, resolved };
  }, [issues]);

  // Filtered issue list
  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      const matchesCategory = categoryFilter === 'all' || i.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'all' || i.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            i.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPriority && matchesSearch;
    });
  }, [issues, categoryFilter, priorityFilter, searchQuery]);

  // Trigger Resolution Step Progression (Assigned -> Investigating -> Dispatching -> Resolving -> Resolved)
  const handleNextStatus = (issueId: string) => {
    setIssues(prevIssues => prevIssues.map(issue => {
      if (issue.id === issueId) {
        let nextStatus: AssignedIssue['status'] = 'assigned';
        let actionMessage = '';

        if (issue.status === 'assigned') {
          nextStatus = 'investigating';
          actionMessage = 'Initiated field investigative scan workflow';
        } else if (issue.status === 'investigating') {
          nextStatus = 'dispatching';
          actionMessage = 'Authorized heavy equipment and crew dispatch operations';
        } else if (issue.status === 'dispatching') {
          nextStatus = 'resolving';
          actionMessage = 'Mechanical mitigations in active resolution phase';
        } else if (issue.status === 'resolving') {
          nextStatus = 'resolved';
          actionMessage = 'Mitigations validated. Structural integrity restored to baseline';
        } else {
          return issue; // Already resolved
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const actor = currentUser?.fullName || 'Supervisory Authority';

        // Add to historical issue audit trail
        const updatedLogs = [
          ...issue.historyLogs,
          { timestamp: now, action: actionMessage, actor }
        ];

        // Append to general dashboard activity logs
        setActivityLogs(currentLogs => [
          { timestamp: new Date().toLocaleTimeString(), action: `${issue.id}: ${actionMessage}`, level: nextStatus === 'resolved' ? 'normal' : 'dispatch' },
          ...currentLogs
        ]);

        // Push new system notification
        setNotifications(currNots => [
          { id: `n-${Date.now()}`, text: `${issue.id} status upgraded to ${nextStatus.toUpperCase()}`, time: now, type: nextStatus === 'resolved' ? 'success' : 'info' },
          ...currNots
        ]);

        triggerToast(`${issue.id} updated to ${nextStatus.toUpperCase()}!`, nextStatus === 'resolved' ? 'success' : 'info');

        return {
          ...issue,
          status: nextStatus,
          historyLogs: updatedLogs
        };
      }
      return issue;
    }));
  };

  // Reallocate new resources dynamically
  const handleAssignCrew = (issueId: string, crewName: string) => {
    setIssues(prevIssues => prevIssues.map(issue => {
      if (issue.id === issueId) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const actor = currentUser?.fullName || 'Supervisory Authority';
        
        const updatedLogs = [
          ...issue.historyLogs,
          { timestamp: now, action: `Re-assigned operational oversight to ${crewName}`, actor }
        ];

        setActivityLogs(currentLogs => [
          { timestamp: new Date().toLocaleTimeString(), action: `Resource allocation update for ${issue.id} to ${crewName}`, level: 'dispatch' },
          ...currentLogs
        ]);

        triggerToast(`Operational oversight assigned to ${crewName}.`, 'success');

        return {
          ...issue,
          assignedCrew: crewName,
          historyLogs: updatedLogs
        };
      }
      return issue;
    }));
  };

  // Add customized telemetry asset / truck dispatching
  const [customVehicle, setCustomVehicle] = useState('');
  const handleAllocateVehicle = (issueId: string) => {
    if (!customVehicle.trim()) return;

    setIssues(prevIssues => prevIssues.map(issue => {
      if (issue.id === issueId) {
        const vehicles = [...issue.allocatedVehicles, customVehicle.trim()];
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const updatedLogs = [
          ...issue.historyLogs,
          { timestamp: now, action: `Allocated logistics asset: ${customVehicle.trim()}`, actor: currentUser?.fullName || 'Supervisor' }
        ];

        triggerToast(`Logistics asset ${customVehicle.trim()} geodispatched!`, 'success');
        setCustomVehicle('');
        return {
          ...issue,
          allocatedVehicles: vehicles,
          historyLogs: updatedLogs
        };
      }
      return issue;
    }));
  };

  return (
    <div className="min-h-screen bg-[#DAF1DE]/30 dark:bg-[#051F20] text-slate-900 dark:text-slate-50 pt-32 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#163832]">
          <div className="space-y-1.5">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#8EB69B] transition-colors font-mono cursor-pointer"
            >
              ← RETURN TO CIVILIAN VIEW
            </button>
            <h1 className="text-3.5xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white flex flex-wrap items-center gap-3">
              <ShieldAlert className="w-9 h-9 text-indigo-600 animate-pulse" />
              Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500">Authority Dispatch Console</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
              Supervisory resource control, SLA telemetry monitors, live citizen validation audit trails, and multi-vehicle coordination systems.
            </p>
          </div>

          {/* Quick Stats indicator badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              SLA BREACH ALERT: 1 PENDING
            </span>
            <span className="bg-[#8EB69B]/10 text-[#8EB69B] border border-[#235347]/20 px-3 py-1.5 rounded-xl font-bold">
              SYS STATUS: OPERATIONAL
            </span>
          </div>
        </div>

        {/* Dynamic Alerts and Notifications Tray */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Notifications feed */}
          <div className="md:col-span-8 bg-amber-500/5 dark:bg-amber-500/2 border border-amber-500/15 p-4 rounded-2.5xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-500/10">
              <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
                Live Dispatch Telemetry Feeds
              </span>
              <span className="text-[10px] font-mono text-amber-500 uppercase font-black">{notifications.length} flagged notifications</span>
            </div>

            <div className="space-y-2 max-h-[85px] overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-start justify-between text-xs gap-3 font-sans py-1.5 px-2 bg-[#DAF1DE]/20/40 dark:bg-[#0B2B26]/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      notif.type === 'alert' ? 'bg-red-500 animate-ping' : 
                      notif.type === 'success' ? 'bg-emerald-500' : 'bg-[#8EB69B]'
                    }`} />
                    <span className="text-slate-700 dark:text-slate-350">{notif.text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Overview KPI indicator */}
          <div className="md:col-span-4 bg-indigo-600 text-white p-4.5 rounded-2.5xl flex flex-col justify-between h-full min-h-[145px] relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#DAF1DE]/20/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-1 z-10">
              <p className="text-[10px] font-mono uppercase tracking-wider font-black text-slate-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Average SLA Clock
              </p>
              <h3 className="text-3.5xl font-black">{kpis.avgSla} hrs</h3>
            </div>
            <p className="text-[11px] text-slate-200 mt-2">
              Mean response window remaining before performance penalty thresholds.
            </p>
          </div>

        </div>

        {/* 1. Main KPI Dashboard Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-2.5xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#8EB69B]/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-black tracking-wider flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5 text-[#8EB69B]" />
              Total Assigned Issues
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-slate-950 dark:text-white">{kpis.total}</span>
              <span className="text-xs font-mono text-slate-400">active jobs</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Supervised municipal queue</p>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-2.5xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-black tracking-wider flex items-center gap-1">
              <BadgeAlert className="w-3.5 h-3.5 text-red-500" />
              Critical Red Alerts
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-red-600 dark:text-red-500">{kpis.critical}</span>
              <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/15 px-2 py-0.5 rounded-full font-mono font-bold uppercase">Escalated</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Urgent dispatcher triage needed</p>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-2.5xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-black tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              Crews On-Site Dispatch
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-emerald-600 dark:text-emerald-500">
                {crews.filter(c => c.status === 'active').length} / {crews.length}
              </span>
              <span className="text-xs font-mono text-emerald-500">Crews deployed</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Telemetry-monitored vehicles</p>
          </div>

          <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 rounded-2.5xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-black tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
              SLA Compliance Goal
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-purple-600 dark:text-purple-400">96.4%</span>
              <span className="text-xs font-mono text-emerald-500 flex items-center">
                <TrendingUp className="w-3.5 h-3.5" /> +1.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Within standard response metrics</p>
          </div>

        </div>

        {/* 2. Analytical Charts Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Weekly SLA Compliance & Resolution Volume Chart */}
          <div className="lg:col-span-7 bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                SLA Compliance & Resolution Volatility
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                Compare completed ticket closures versus SLA breach events throughout the weekly operational cycle
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESOLUTION_CHART_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
                  <YAxis tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
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
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Bar dataKey="completed" name="Completed Closures" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="breached" name="SLA Breaches" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational Team Efficiency Index Chart */}
          <div className="lg:col-span-5 bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8EB69B]" />
                Operational Crew Efficiency Scorecard
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                Comparative overview of specialized team resolve rates and punctuality benchmarks
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TEAM_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.12}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fontFamily: 'monospace' }} stroke="#64748B" />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
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
                  <Area type="monotone" name="Efficiency %" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorEfficiency)" />
                  <Line type="monotone" name="On Time Jobs" dataKey="onTime" stroke="#10B981" strokeWidth={1.5} dot={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* 3. Primary Dispatch Board: Issue Queue + Detailed Inspector Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Asssigned Issue queue and advanced filters list */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] rounded-3xl p-5 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white font-mono uppercase tracking-wider">
                  Operational Queue ({filteredIssues.length} issues)
                </h3>

                {/* Filters container */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-105 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 p-2 rounded-xl focus:outline-hidden text-xs font-mono font-bold"
                  >
                    <option value="all">All Sectors</option>
                    <option value="Roads">Roads</option>
                    <option value="Water">Water</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>

                  {/* Priority Filter */}
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-slate-105 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 p-2 rounded-xl focus:outline-hidden text-xs font-mono font-bold"
                  >
                    <option value="all">All Priorities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>

                </div>
              </div>

              {/* Live search field */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dispatcher queue by issue ID, location, or telemetry description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20]/60 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden"
                />
              </div>

              {/* Issues queue scrollable list */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredIssues.map((item) => {
                  const isSelected = item.id === selectedIssueId;
                  
                  const getPriorityStyle = (priority: AssignedIssue['priority']) => {
                    const styles = {
                      CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/25',
                      HIGH: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
                      MEDIUM: 'bg-[#8EB69B]/10 text-[#8EB69B] border-[#235347]/25',
                      LOW: 'bg-[#DAF1DE]/300/10 text-slate-500 border-slate-500/25'
                    };
                    return styles[priority];
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIssueId(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/70 ring-1 ring-indigo-500/20' 
                          : 'bg-[#DAF1DE]/30/70 dark:bg-[#051F20]/20 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-950'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-slate-200 dark:bg-[#0B2B26] px-2 py-0.5 rounded border border-slate-300 dark:border-[#163832] text-slate-500 dark:text-slate-400">
                            {item.id}
                          </span>
                          <span className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded ${getPriorityStyle(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            {item.location}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-950 dark:text-white leading-tight">{item.title}</h4>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-[8px] font-mono text-slate-400 uppercase">SLA REMAINING</p>
                          <p className={`text-xs font-mono font-bold ${item.slaRemainingHours <= 6 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
                            {item.slaRemainingHours} hrs
                          </p>
                        </div>

                        {/* Interactive Status flow indicator */}
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                          item.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          item.status === 'resolving' ? 'bg-[#8EB69B]/10 text-[#8EB69B] border border-[#235347]/20 animate-pulse' :
                          item.status === 'dispatching' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {item.status}
                        </span>

                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-indigo-500' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

          {/* RIGHT: Selected Issue Resolution Center (Resource allocation + SLA Timers + Dispatches) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] rounded-3xl p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-indigo-500" />
                  Resolution Workstation
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-[#051F20] border border-slate-200 dark:border-[#163832] px-2.5 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
                  {activeIssue.id}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">TITLE & telemetry SECTOR</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white leading-tight">{activeIssue.title}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {activeIssue.location} • Upvoted {activeIssue.upvotes} times by locals
                </p>
              </div>

              {/* Interactive Status Workflow Slider / Steps */}
              <div className="space-y-3 bg-[#DAF1DE]/30 dark:bg-[#051F20] p-4 rounded-2.5xl border border-slate-200 dark:border-slate-850/60">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-400 uppercase text-[9px]">SLA Timer Status</span>
                  <span className={activeIssue.slaRemainingHours <= 6 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}>
                    {activeIssue.slaRemainingHours} hours remaining
                  </span>
                </div>

                {/* Progress Workflow Tracker bar */}
                <div className="grid grid-cols-5 gap-1 pt-1.5">
                  {['assigned', 'investigating', 'dispatching', 'resolving', 'resolved'].map((step, idx) => {
                    const stepsOrder = ['assigned', 'investigating', 'dispatching', 'resolving', 'resolved'];
                    const currentIdx = stepsOrder.indexOf(activeIssue.status);
                    const stepIdx = stepsOrder.indexOf(step);
                    const isPassed = stepIdx <= currentIdx;
                    
                    return (
                      <div key={step} className="space-y-1 text-center">
                        <div className={`h-1.5 rounded-full ${
                          isPassed 
                            ? 'bg-indigo-600 dark:bg-indigo-500' 
                            : 'bg-slate-200 dark:bg-slate-850'
                        }`} />
                        <span className="text-[8px] font-mono block text-slate-400 capitalize truncate">{step}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Workflow Transition Action Button */}
                <div className="pt-2">
                  {activeIssue.status === 'resolved' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-3 rounded-xl flex items-center justify-center gap-2 font-mono font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      SLA RESOLUTION COMPLETED SUCCESSFULLY
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNextStatus(activeIssue.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      PROGRESS STATUS TO {
                        activeIssue.status === 'assigned' ? 'INVESTIGATION' :
                        activeIssue.status === 'investigating' ? 'DISPATCH' :
                        activeIssue.status === 'dispatching' ? 'RESOLUTION PHASE' : 'MARK RESOLVED / COMPLETE'
                      }
                    </button>
                  )}
                </div>
              </div>

              {/* Crew Resource Allocation */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Assigned Operational Crew</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={activeIssue.assignedCrew}
                    onChange={(e) => handleAssignCrew(activeIssue.id, e.target.value)}
                    className="flex-1 bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-250 dark:border-slate-850/60 p-3 rounded-xl text-xs font-mono font-bold"
                  >
                    {crews.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.specialty})</option>
                    ))}
                  </select>

                  <div className="bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-200 dark:border-slate-850 px-3.5 py-2.5 rounded-xl text-center shrink-0">
                    <p className="text-[8px] font-mono text-slate-400">CREW RATING</p>
                    <p className="text-xs font-mono font-bold text-emerald-500">
                      {crews.find(c => c.name === activeIssue.assignedCrew)?.efficiencyRating || 95}% Eff
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Vehicle Allocation list */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Allocated Vehicles & Equipment Fleet</span>
                
                {/* Vehicles List tags */}
                <div className="flex flex-wrap gap-1.5">
                  {activeIssue.allocatedVehicles.length === 0 ? (
                    <span className="text-xs text-slate-400 font-sans italic">No vehicle resources allocated yet.</span>
                  ) : (
                    activeIssue.allocatedVehicles.map((vehicle, idx) => (
                      <span key={idx} className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase font-bold">
                        <Truck className="w-3 h-3 text-indigo-500" />
                        {vehicle}
                      </span>
                    ))
                  )}
                </div>

                {/* Allocate asset form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter asset tag (e.g. Compactor Heavy-3)..."
                    value={customVehicle}
                    onChange={(e) => setCustomVehicle(e.target.value)}
                    className="flex-1 bg-[#DAF1DE]/30 dark:bg-[#051F20] border border-slate-250 dark:border-slate-850/60 px-3 py-2 text-xs rounded-lg focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleAllocateVehicle(activeIssue.id)}
                    className="bg-slate-950 dark:bg-[#DAF1DE]/20 text-white dark:text-slate-900 font-mono text-xs font-bold px-3 py-2 rounded-lg cursor-pointer hover:opacity-90"
                  >
                    Allocate
                  </button>
                </div>
              </div>

              {/* Issue Specific Historical Event Logs */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block font-black">Issue Incident Audit Trail</span>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {activeIssue.historyLogs.map((log, idx) => (
                    <div key={idx} className="bg-[#DAF1DE]/30 dark:bg-[#051F20]/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-850/50 text-xs font-sans space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Timestamp: {log.timestamp}</span>
                        <span className="text-indigo-500 font-bold">Actor: {log.actor}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-tight">
                        {log.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* General Dashboard Audit Log Terminal */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.1),transparent_60%)] pointer-events-none" />
              
              <div className="space-y-1">
                <h3 className="text-sm font-black tracking-wider uppercase font-mono text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                  Consolidated Dispatch Logs
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  System-wide, tamper-proof activity ledger recording automated transitions and administrative routing parameters.
                </p>
              </div>

              <div className="space-y-2 pt-2 max-h-[185px] overflow-y-auto pr-1">
                {activityLogs.map((log, idx) => (
                  <div key={idx} className="font-mono text-[10px] leading-relaxed py-1 border-b border-white/5 flex gap-2">
                    <span className="text-indigo-450 shrink-0">[{log.timestamp}]</span>
                    <span className={log.level === 'critical' ? 'text-red-400 font-bold' : log.level === 'dispatch' ? 'text-amber-400' : 'text-slate-300'}>
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
