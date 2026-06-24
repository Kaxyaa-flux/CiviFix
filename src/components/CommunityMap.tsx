import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, AlertCircle, CheckCircle, Shield, ArrowUp, Clock, 
  Layers, Filter, Search, Activity, Zap, Eye, Plus, Minus, 
  Crosshair, Sparkles, Check, Flame, X, RefreshCw, Volume2, ShieldAlert
} from 'lucide-react';
import { CivicIssue } from '../types';

interface CommunityMapProps {
  issues: CivicIssue[];
  onUpvote: (id: string) => void;
  selectedIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
}

// Emergency Alerts Data
const EMERGENCY_ALERTS = [
  {
    id: 'em-1',
    title: 'Water Main Rupture Flood Warning',
    desc: 'High-pressure flooding hazard surrounding 450 Elm Road. City Crews on-site.',
    location: 'Elm Road Corridor (Sector C)',
    coords: { x: 25, y: 35 },
    severity: 'critical'
  },
  {
    id: 'em-2',
    title: 'Severe Road Hazard Alert',
    desc: 'Deep pavement potholes at East intersection. Heavy damage reported. Slow down.',
    location: 'Civic Boulevard (Sector E)',
    coords: { x: 15, y: 75 },
    severity: 'high'
  },
  {
    id: 'em-3',
    title: 'Chemical Battery Dumping Hazard',
    desc: 'Hazardous chemicals near park north gate. Environmental squads active.',
    location: 'Green Park North gate corridor',
    coords: { x: 48, y: 65 },
    severity: 'high'
  }
];

// Mock Live updates stream entries
const LIVE_STREAM_MOCK_UPDATES = [
  "Resident @Kanak verified Water Main Leakage",
  "AI upgraded Severity Score to 9/10 for Pothole",
  "City Power Crew completed Sunset light replacement",
  "Water Works Team dispatched to Sector C",
  "Local Citizen upvoted Pothole urgency",
  "Community peer-review confirmed Green Park battery pile cleanup is scheduled"
];

export default function CommunityMap({ issues, onUpvote, selectedIssueId, onSelectIssue }: CommunityMapProps) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Map Toggles & Layers
  const [activeLayer, setActiveLayer] = useState<'streets' | 'hybrid' | 'topological'>('streets');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  // Live updates simulator state
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);
  const [recentLiveUpdates, setRecentLiveUpdates] = useState<string[]>([
    "Water Works Team dispatched to Sector C",
    "Local Citizen upvoted Pothole urgency"
  ]);

  // Selected Emergency Alert for highlighting
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  // Trigger simulated live updates
  useEffect(() => {
    if (!isLiveEnabled) return;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LIVE_STREAM_MOCK_UPDATES.length);
      const randomUpdate = LIVE_STREAM_MOCK_UPDATES[randomIndex];
      setRecentLiveUpdates(prev => {
        const next = [randomUpdate, ...prev];
        return next.slice(0, 4); // Keep latest 4
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isLiveEnabled]);

  // Parsing relative date strings for filtering
  const matchDate = (issueDate: string, filterVal: string) => {
    if (filterVal === 'all') return true;
    const normalized = issueDate.toLowerCase();
    if (filterVal === 'today') {
      return normalized.includes('hour') || normalized.includes('min') || normalized.includes('now') || normalized.includes('today');
    }
    if (filterVal === 'yesterday') {
      return normalized.includes('1 day') || normalized.includes('yesterday') || normalized.includes('24 hours');
    }
    if (filterVal === 'week') {
      return normalized.includes('day') && !normalized.includes('15') && !normalized.includes('30');
    }
    return true;
  };

  // Main filter engine
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || issue.priority === severityFilter;
    const matchesDate = matchDate(issue.reportedAt, dateFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity && matchesDate;
  });

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  // Helper colors
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical': return 'bg-[#EF4444] text-white';
      case 'high': return 'bg-[#F97316] text-white';
      case 'medium': return 'bg-[#EAB308] text-slate-950';
      case 'low': return 'bg-[#10B981] text-white';
      default: return 'bg-[#163832] text-white';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-500/20';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-[#235347]/20';
      case 'verified': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-500/20';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-500/20';
    }
  };

  // Center Map on Coordinates helper
  const handleCenterOn = (x: number, y: number) => {
    // Zoom in slightly and offset map center
    setZoomLevel(1.3);
    setMapOffset({
      x: (50 - x) * 2,
      y: (50 - y) * 2
    });
  };

  // Reset Map View Parameters
  const handleResetMap = () => {
    setZoomLevel(1);
    setMapOffset({ x: 0, y: 0 });
    onSelectIssue(null);
    setActiveAlertId(null);
  };

  return (
    <section 
      id="community-map" 
      className="relative py-20 bg-[#DAF1DE]/30 dark:bg-[#051F20] border-b border-slate-200 dark:border-slate-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title / Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163832]/10 border border-[#235347]/20 rounded-full text-xs font-semibold text-[#8EB69B] font-mono uppercase">
              <Layers className="w-3.5 h-3.5" />
              Advanced Geospatial Node Map
            </div>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
              Community Interactive Map
            </h2>
            <p className="max-w-2xl text-slate-600 dark:text-slate-400 font-sans text-sm sm:text-base">
              Explore localized high-density incident heatmaps, active emergency broadcasts, and resolution pipelines synced with city dispatch centers.
            </p>
          </div>

          {/* Quick Metrics Info */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] px-4 py-2.5 rounded-2xl shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {issues.length} Dispatch Nodes Live
              </span>
            </div>

            <button 
              onClick={handleResetMap}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5" />
              Recenter Grid
            </button>
          </div>
        </div>

        {/* Dynamic Emergency Alerts Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMERGENCY_ALERTS.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => {
                setActiveAlertId(alert.id);
                handleCenterOn(alert.coords.x, alert.coords.y);
              }}
              className={`p-4 rounded-2xl transition-all cursor-pointer border flex items-start gap-3.5 relative overflow-hidden group ${
                activeAlertId === alert.id 
                  ? 'bg-rose-500/10 border-rose-500 shadow-lg shadow-rose-500/10' 
                  : 'bg-[#DAF1DE]/20 dark:bg-[#0B2B26]/60 border-rose-500/20 hover:border-rose-500/50 hover:bg-[#DAF1DE]/30 dark:hover:bg-slate-900'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold font-mono uppercase bg-rose-500 text-white px-1.5 py-0.5 rounded">
                    EMERGENCY
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {alert.location}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-500 transition-colors">
                  {alert.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed truncate max-w-[220px]">
                  {alert.desc}
                </p>
              </div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Filter Controls Dashboard Grid */}
        <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26]/80 border border-slate-200 dark:border-[#163832] p-5 rounded-3xl shadow-xl space-y-4 backdrop-blur-md">
          
          {/* Top Line: Search Bar and Category selection */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, department, or address..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#DAF1DE]/30 dark:bg-[#051F20]/80 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#8EB69B]/40 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter tags header */}
            <div className="lg:col-span-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-[#8EB69B] shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">Category:</span>
              {['all', 'Water & Utilities', 'Road Safety & Forestry', 'Environmental & Sanitation', 'Street Maintenance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-xl shrink-0 transition-all cursor-pointer border ${
                    categoryFilter === cat
                      ? 'bg-[#163832] text-white border-[#235347]'
                      : 'bg-[#DAF1DE]/30 dark:bg-[#051F20]/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

          </div>

          {/* Bottom Line: Grid filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-[#163832]/80">
            
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Workflow Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20]/80 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs outline-none transition-all focus:border-[#235347]"
              >
                <option value="all">All States</option>
                <option value="new">New Reports</option>
                <option value="verified">Verified Nodes</option>
                <option value="in-progress">In-Progress Repairs</option>
                <option value="resolved">Resolved / Complete</option>
              </select>
            </div>

            {/* Severity / Priority Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Severity / Priority</label>
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20]/80 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs outline-none transition-all focus:border-[#235347]"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Severity</option>
                <option value="critical">Critical Severity</option>
              </select>
            </div>

            {/* Date Occurred Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Incident Date</label>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-[#DAF1DE]/30 dark:bg-[#051F20]/80 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs outline-none transition-all focus:border-[#235347]"
              >
                <option value="all">All History</option>
                <option value="today">Today / Recent</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Past 7 Days</option>
              </select>
            </div>

            {/* Layer Configuration & Heatmap Toggle */}
            <div className="space-y-1.5 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Geospatial Overlay Toggles</span>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Heatmap Toggle */}
                <button
                  type="button"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`py-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showHeatmap 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' 
                      : 'bg-[#DAF1DE]/30 dark:bg-[#051F20]/60 text-slate-500 border-slate-200 dark:border-slate-850 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Heatmap
                </button>

                {/* Risk Radar Zones Toggle */}
                <button
                  type="button"
                  onClick={() => setShowRiskZones(!showRiskZones)}
                  className={`py-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showRiskZones 
                      ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' 
                      : 'bg-[#DAF1DE]/30 dark:bg-[#051F20]/60 text-slate-500 border-slate-200 dark:border-slate-850 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Risk Zones
                </button>

              </div>
            </div>

          </div>

        </div>

        {/* Main Geospatial Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Map Core (Col-span 8) */}
          <div className="lg:col-span-8 relative bg-slate-200 dark:bg-[#051F20] border border-slate-300 dark:border-slate-850 rounded-3xl h-[520px] overflow-hidden shadow-2xl flex items-center justify-center transition-all">
            
            {/* Layers selector at top-left of the Map */}
            <div className="absolute top-4 left-4 z-30 bg-[#DAF1DE]/20/90 dark:bg-[#0B2B26]/95 border border-slate-200 dark:border-slate-850 backdrop-blur-md p-1.5 rounded-2xl shadow-xl flex items-center gap-1">
              {(['streets', 'hybrid', 'topological'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold capitalize transition-all cursor-pointer ${
                    activeLayer === layer
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>

            {/* Simulated Zoom & Navigation Controls at top-right */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
              <div className="bg-[#DAF1DE]/20/90 dark:bg-[#0B2B26]/95 border border-slate-200 dark:border-slate-850 backdrop-blur-md rounded-2xl shadow-xl p-1 flex flex-col">
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="border-t border-slate-200 dark:border-[#163832] my-1"></div>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Toggles cluster option */}
              <button 
                onClick={() => setShowClusters(!showClusters)}
                title="Toggle Clusters"
                className={`p-2.5 rounded-2xl shadow-xl backdrop-blur-md border transition-all cursor-pointer ${
                  showClusters 
                    ? 'bg-[#163832]/15 text-[#8EB69B] border-[#235347]/30' 
                    : 'bg-[#DAF1DE]/20/90 dark:bg-[#0B2B26]/95 text-slate-500 border-slate-200 dark:border-[#163832]'
                }`}
              >
                <Activity className="w-4 h-4" />
              </button>
            </div>

            {/* Zoomable / Pannable Map Content Container */}
            <div 
              className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
              }}
            >
              
              {/* Custom Vector Base Map */}
              <svg className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" preserveAspectRatio="none">
                
                {/* Geological Background Water lines */}
                {activeLayer === 'hybrid' ? (
                  <rect width="100%" height="100%" fill="#1E293B" />
                ) : (
                  <rect width="100%" height="100%" className="fill-slate-100 dark:fill-[#070b19]" />
                )}

                {/* Styled Grid lines */}
                <defs>
                  <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-slate-850/60" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#city-grid)" />

                {/* Topological lines overlay */}
                {activeLayer === 'topological' && (
                  <g className="opacity-40 stroke-emerald-500/20 stroke-1 fill-none">
                    <circle cx="200" cy="200" r="160" />
                    <circle cx="200" cy="200" r="120" />
                    <circle cx="200" cy="200" r="80" />
                    <circle cx="650" cy="120" r="90" />
                    <path d="M50,420 C180,380 320,440 450,410 C580,380 650,450 800,430" />
                  </g>
                )}

                {/* Background water body */}
                <path d="M0,450 C300,430 400,500 800,450 L800,520 L0,520 Z" className="fill-[#8EB69B]/15 dark:fill-blue-500/10 stroke-blue-500/20" strokeWidth="2" />
                <path d="M0,210 C150,210 250,160 380,180 C500,195 620,240 800,230" stroke="rgba(37, 99, 235, 0.12)" strokeWidth="16" fill="none" />

                {/* Parks and green areas */}
                <rect x="350" y="280" width="180" height="150" rx="20" className="fill-emerald-500/10 dark:fill-emerald-500/5 stroke-emerald-500/15" strokeWidth="1" />
                <rect x="50" y="40" width="120" height="90" rx="15" className="fill-emerald-500/10 dark:fill-emerald-500/5 stroke-emerald-500/15" strokeWidth="1" />

                {/* Major City Highways / Arteries */}
                <g className="stroke-white dark:stroke-slate-800 stroke-[18px] opacity-70">
                  <line x1="0" y1="80" x2="800" y2="80" />
                  <line x1="0" y1="360" x2="800" y2="360" />
                  <line x1="120" y1="0" x2="120" y2="520" />
                  <line x1="560" y1="0" x2="560" y2="520" />
                </g>

                {/* Street Inner Tracks for High Definition Look */}
                <g className="stroke-slate-200 dark:stroke-slate-950 stroke-[14px]">
                  <line x1="0" y1="80" x2="800" y2="80" />
                  <line x1="0" y1="360" x2="800" y2="360" />
                  <line x1="120" y1="0" x2="120" y2="520" />
                  <line x1="560" y1="0" x2="560" y2="520" />
                </g>

                {/* Center lane dash lines */}
                <g className="stroke-amber-400 dark:stroke-amber-500 stroke-1 stroke-dasharray-[4,6] opacity-60">
                  <line x1="0" y1="80" x2="800" y2="80" />
                  <line x1="0" y1="360" x2="800" y2="360" />
                  <line x1="120" y1="0" x2="120" y2="520" />
                  <line x1="560" y1="0" x2="560" y2="520" />
                </g>

                {/* Landmark Texts */}
                <text x="440" y="325" className="fill-slate-400 dark:fill-slate-600 font-sans text-[10px] tracking-widest font-extrabold select-none">GREEN CORRIDOR</text>
                <text x="145" y="105" className="fill-slate-400 dark:fill-slate-600 font-sans text-[9px] tracking-widest font-extrabold select-none">CIVIC PLAZA</text>
                <text x="585" y="220" className="fill-slate-400 dark:fill-slate-600 font-sans text-[9px] tracking-widest font-extrabold select-none">SUNSET HIGHWAY</text>

              </svg>

              {/* Heatmap Overlay Layer (Visual density glow patches) */}
              {showHeatmap && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* Pothole density glow (Civic Blvd) */}
                  <div className="absolute w-36 h-36 rounded-full bg-red-500/25 blur-3xl" style={{ left: '15%', top: '75%', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Water Leakage glow (Elm Road library) */}
                  <div className="absolute w-44 h-44 rounded-full bg-amber-500/25 blur-3xl" style={{ left: '25%', top: '35%', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Environmental toxic dumpsite glow (Green Park Gate) */}
                  <div className="absolute w-40 h-40 rounded-full bg-orange-600/25 blur-3xl" style={{ left: '48%', top: '65%', transform: 'translate(-50%, -50%)' }}></div>
                </div>
              )}

              {/* Pulsing Risk Zones Overlays */}
              {showRiskZones && (
                <div className="absolute inset-0 pointer-events-none z-15">
                  {/* Sector A / Sector C danger radar */}
                  <div className="absolute border border-rose-500/40 bg-rose-500/5 rounded-full w-48 h-48 animate-pulse flex items-center justify-center" style={{ left: '25%', top: '35%', transform: 'translate(-50%, -50%)' }}>
                    <div className="border border-rose-500/20 rounded-full w-32 h-32 animate-ping opacity-60"></div>
                    <span className="bg-rose-500/80 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded absolute top-2">
                      HIGH HAZARD ZONE
                    </span>
                  </div>

                  {/* Sector E danger radar */}
                  <div className="absolute border border-amber-500/40 bg-amber-500/5 rounded-full w-40 h-40 animate-pulse flex items-center justify-center" style={{ left: '15%', top: '75%', transform: 'translate(-50%, -50%)' }}>
                    <span className="bg-amber-500/90 text-slate-950 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded absolute bottom-2">
                      CRITICAL POTHOLE SEGMENT
                    </span>
                  </div>
                </div>
              )}

              {/* Smart Cluster Aggregates overlays */}
              {showClusters && filteredIssues.length > 2 && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {/* Display smart cluster icon near Elm Road Area */}
                  <div className="absolute bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 font-bold border border-slate-700 dark:border-slate-300 text-[10px] px-2.5 py-1 rounded-2xl flex items-center gap-1 shadow-2xl" style={{ left: '28%', top: '26%' }}>
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>2 Incidents Cluster</span>
                  </div>
                </div>
              )}

              {/* Interactive Node Markers */}
              {filteredIssues.map((issue) => {
                const isSelected = selectedIssueId === issue.id;
                
                return (
                  <button
                    key={issue.id}
                    onClick={() => onSelectIssue(isSelected ? null : issue.id)}
                    style={{ left: `${issue.coordinates.x}%`, top: `${issue.coordinates.y}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-25 cursor-pointer focus:outline-none"
                  >
                    {/* Ring ping indicators based on severity */}
                    <span className={`absolute inline-flex h-9 w-9 rounded-full opacity-50 animate-ping -left-2.5 -top-2.5 ${
                      issue.status === 'resolved' ? 'bg-[#10B981]' :
                      issue.priority === 'critical' ? 'bg-[#EF4444]' :
                      issue.priority === 'high' ? 'bg-[#F97316]' :
                      issue.priority === 'medium' ? 'bg-[#EAB308]' : 'bg-[#163832]'
                    }`} />

                    {/* Highly visually polished node pin body */}
                    <div className={`relative p-2 rounded-full border shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-125 ${
                      isSelected 
                        ? 'bg-slate-950 text-white dark:bg-[#DAF1DE]/20 dark:text-slate-950 border-[#235347] scale-125 ring-2 ring-blue-500/45' 
                        : issue.status === 'resolved' 
                          ? 'bg-[#10B981] text-white border-emerald-600'
                          : issue.priority === 'critical'
                            ? 'bg-[#EF4444] text-white border-red-700'
                            : issue.priority === 'high'
                              ? 'bg-[#F97316] text-white border-orange-600'
                              : issue.priority === 'medium'
                                ? 'bg-[#EAB308] text-slate-950 border-yellow-600'
                                : 'bg-[#163832] text-white border-blue-700'
                    }`}>
                      {issue.status === 'resolved' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </div>

                    {/* Map marker hover tooltip */}
                    <div className="absolute left-1/2 bottom-full mb-3 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-slate-100 border border-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-2xl whitespace-nowrap pointer-events-none z-40 space-y-1">
                      <p className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${issue.status === 'resolved' ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                        {issue.title}
                      </p>
                      <p className="text-[9px] text-slate-400 font-normal">
                        Status: <span className="capitalize">{issue.status}</span> | Upvotes: {issue.upvotes}
                      </p>
                    </div>
                  </button>
                );
              })}

            </div>

            {/* Micro instruction / search state indicator at the bottom left */}
            <div className="absolute bottom-4 left-4 bg-[#DAF1DE]/20/90 dark:bg-[#0B2B26]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl text-[11px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-850 shadow-xl flex items-center gap-1.5">
              <span>🗺️ Active Layers:</span>
              <span className="capitalize font-mono text-[#8EB69B]">{activeLayer} Layout</span>
              {filteredIssues.length !== issues.length && (
                <span className="text-slate-400">({filteredIssues.length} of {issues.length} showing)</span>
              )}
            </div>

          </div>

          {/* Incident Detail / Map Legend Sidebar Drawer (Col-span 4) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            
            {/* Detail Drawer */}
            <div className="bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] rounded-3xl p-6 shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {selectedIssue ? (
                  <motion.div
                    key={selectedIssue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 flex-1 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      {/* Badge line */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold font-mono tracking-wider ${getPriorityColor(selectedIssue.priority)}`}>
                          {selectedIssue.priority.toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold font-mono ${getStatusColor(selectedIssue.status)}`}>
                          {selectedIssue.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Header title */}
                      <div>
                        <h3 className="font-sans font-extrabold text-base text-slate-950 dark:text-white leading-snug">
                          {selectedIssue.title}
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8EB69B]" />
                          {selectedIssue.locationName}
                        </p>
                      </div>

                      {/* Paragraph */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                        {selectedIssue.description}
                      </p>

                      {/* Live updates dynamic timestamp */}
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Reported {selectedIssue.reportedAt}</span>
                        <span>•</span>
                        <span>By {selectedIssue.reporterName}</span>
                      </div>

                      {/* AI Core Routing Summary */}
                      <div className="p-3 bg-[#DAF1DE]/30 dark:bg-[#051F20]/60 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-[#8EB69B] font-extrabold font-mono">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI PRE-ROUTING ACTION
                          </span>
                          <span>99% Score</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          Categorized under <strong className="text-slate-900 dark:text-white font-bold">{selectedIssue.category}</strong>. Targeted agent dispatch queued.
                        </p>
                      </div>

                    </div>

                    {/* Urgent Action button */}
                    <div className="border-t border-slate-100 dark:border-[#163832]/80 pt-4 mt-4 flex items-center gap-2.5">
                      <button
                        onClick={() => onUpvote(selectedIssue.id)}
                        className="flex-1 py-3 bg-[#163832] hover:bg-[#0B2B26] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#051F20]/30 transition-all duration-200 transform active:scale-95 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                        Upvote Priority ({selectedIssue.upvotes})
                      </button>
                      <button
                        onClick={() => onSelectIssue(null)}
                        className="px-4 py-3 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-[#DAF1DE]/30 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12"
                  >
                    <div className="p-4 bg-[#163832]/10 text-[#8EB69B] rounded-2xl animate-pulse">
                      <Layers className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-sans font-extrabold text-sm text-slate-900 dark:text-white">
                        Civic Node Inspector
                      </h3>
                      <p className="max-w-[220px] text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-sans leading-relaxed">
                        Select any interactive coordinate pin or emergency alert to trigger granular agency dispatch reviews.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* High Tech Map Legend Map Widget */}
            <div className="p-5 rounded-3xl bg-[#DAF1DE]/20 dark:bg-[#0B2B26] border border-slate-200 dark:border-[#163832] shadow-xl space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                🗺️ Geospatial Map Legend
              </h4>
              
              <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-rose-700 shrink-0 block"></span>
                  <span>Critical Severity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 shrink-0 block"></span>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#8EB69B] border border-blue-700 shrink-0 block"></span>
                  <span>Active Issue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-emerald-600 shrink-0 block"></span>
                  <span>Resolved Node</span>
                </div>
              </div>

              {/* Live Ticker System feed */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#163832]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-[#10B981] font-mono uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block"></span>
                    Live Updates Feed
                  </span>
                  
                  {/* Toggle button */}
                  <button 
                    onClick={() => setIsLiveEnabled(!isLiveEnabled)}
                    className="text-[9px] font-bold font-mono text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    {isLiveEnabled ? "Disable Stream" : "Enable Stream"}
                  </button>
                </div>

                <div className="space-y-1.5 max-h-16 overflow-y-auto scrollbar-none">
                  {recentLiveUpdates.map((update, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      <span className="text-[#8EB69B] font-extrabold">›</span>
                      <span>{update}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
