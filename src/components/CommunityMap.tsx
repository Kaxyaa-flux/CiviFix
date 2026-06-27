import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

// Emergency Alerts Data (Using real LatLng around San Francisco)
const EMERGENCY_ALERTS = [
  {
    id: 'em-1',
    title: 'Water Main Rupture Flood Warning',
    desc: 'High-pressure flooding hazard surrounding 450 Elm Road. City Crews on-site.',
    location: 'Elm Road Corridor',
    coords: { lat: 37.7749, lng: -122.4194 },
    severity: 'critical'
  },
  {
    id: 'em-2',
    title: 'Severe Road Hazard Alert',
    desc: 'Deep pavement potholes at East intersection. Heavy damage reported. Slow down.',
    location: 'Civic Boulevard',
    coords: { lat: 37.7849, lng: -122.4094 },
    severity: 'high'
  },
  {
    id: 'em-3',
    title: 'Chemical Battery Dumping Hazard',
    desc: 'Hazardous chemicals near park north gate. Environmental squads active.',
    location: 'Green Park North gate corridor',
    coords: { lat: 37.7649, lng: -122.4294 },
    severity: 'high'
  }
];

const LIVE_STREAM_MOCK_UPDATES = [
  "Resident @Kanak verified Water Main Leakage",
  "AI upgraded Severity Score to 9/10 for Pothole",
  "City Power Crew completed Sunset light replacement",
  "Water Works Team dispatched to Sector C",
  "Local Citizen upvoted Pothole urgency",
  "Community peer-review confirmed Green Park battery pile cleanup is scheduled"
];

// Custom map center controller
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function CommunityMap({ issues, onUpvote, selectedIssueId, onSelectIssue }: CommunityMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [activeLayer, setActiveLayer] = useState<'streets' | 'hybrid' | 'topological'>('streets');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRiskZones, setShowRiskZones] = useState(true);
  
  const defaultCenter: [number, number] = [37.7749, -122.4194]; // San Francisco
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(13);

  const [isLiveEnabled, setIsLiveEnabled] = useState(true);
  const [recentLiveUpdates, setRecentLiveUpdates] = useState<string[]>([
    "Water Works Team dispatched to Sector C",
    "Local Citizen upvoted Pothole urgency"
  ]);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveEnabled) return;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LIVE_STREAM_MOCK_UPDATES.length);
      const randomUpdate = LIVE_STREAM_MOCK_UPDATES[randomIndex];
      setRecentLiveUpdates(prev => [randomUpdate, ...prev].slice(0, 4));
    }, 7000);
    return () => clearInterval(interval);
  }, [isLiveEnabled]);

  const matchDate = (issueDate: string, filterVal: string) => {
    if (filterVal === 'all') return true;
    const normalized = issueDate.toLowerCase();
    if (filterVal === 'today') return normalized.includes('hour') || normalized.includes('min') || normalized.includes('now') || normalized.includes('today');
    if (filterVal === 'yesterday') return normalized.includes('1 day') || normalized.includes('yesterday') || normalized.includes('24 hours');
    if (filterVal === 'week') return normalized.includes('day') && !normalized.includes('15') && !normalized.includes('30');
    return true;
  };

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

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical': return 'bg-[#EF4444] text-slate-900 dark:text-white';
      case 'high': return 'bg-[#F97316] text-slate-900 dark:text-white';
      case 'medium': return 'bg-[#EAB308] text-slate-950';
      case 'low': return 'bg-[#10B981] text-slate-900 dark:text-white';
      default: return 'bg-[#163832] text-slate-900 dark:text-white';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-green-400 border border-green-500/20';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-white/10/20';
      case 'verified': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-500/20';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-500/20';
    }
  };

  const handleCenterOn = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(16);
  };

  const handleResetMap = () => {
    setMapCenter(defaultCenter);
    setMapZoom(13);
    onSelectIssue(null);
    setActiveAlertId(null);
  };

  // Helper for custom markers
  const createCustomIcon = (priority: string, status: string) => {
    const colorClass = status === 'resolved' ? '#10B981' :
                       priority === 'critical' ? '#EF4444' :
                       priority === 'high' ? '#F97316' :
                       priority === 'medium' ? '#EAB308' : '#163832';
                       
    return L.divIcon({
      html: `<div style="background-color: ${colorClass}; border: 2px solid white; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <section id="community-map" className="relative py-20 bg-slate-50 dark:bg-transparent border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163832]/10 border border-white/10/20 rounded-full text-xs font-semibold text-[#7C3AED] font-mono uppercase">
              <Layers className="w-3.5 h-3.5" />
              Advanced Geospatial Node Map
            </div>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
              Community Interactive Map
            </h2>
            <p className="max-w-2xl text-slate-600 dark:text-slate-400 font-sans text-sm sm:text-base">
              Explore localized high-density incident heatmaps, active emergency broadcasts, and resolution pipelines synced with city dispatch centers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 px-4 py-2.5 rounded-2xl shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {issues.length} Dispatch Nodes Live
              </span>
            </div>
            <button onClick={handleResetMap} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer">
              <Crosshair className="w-3.5 h-3.5" />
              Recenter Grid
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMERGENCY_ALERTS.map((alert) => (
            <div key={alert.id} onClick={() => { setActiveAlertId(alert.id); handleCenterOn(alert.coords.lat, alert.coords.lng); }} className={`p-4 rounded-2xl transition-all cursor-pointer border flex items-start gap-3.5 relative overflow-hidden group ${activeAlertId === alert.id ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-500/10' : 'bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90/60 border-red-500/20 hover:border-red-500/50 hover:bg-[#16161D]/90 backdrop-blur-md dark:hover:bg-slate-900'}`}>
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold font-mono uppercase bg-red-500 text-slate-900 dark:text-white px-1.5 py-0.5 rounded">EMERGENCY</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{alert.location}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-500 transition-colors">{alert.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed truncate max-w-[220px]">{alert.desc}</p>
              </div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
            </div>
          ))}
        </div>

        <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90/80 border border-white/10 p-5 rounded-3xl shadow-xl space-y-4 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title, department, or address..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-transparent/80 border border-slate-200 dark:border-white/5 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-white/10 focus:ring-1 focus:ring-[#8EB69B]/40 transition-all" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="lg:col-span-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">Category:</span>
              {['all', 'Water & Utilities', 'Road Safety & Forestry', 'Environmental & Sanitation', 'Street Maintenance'].map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 text-[11px] font-bold rounded-xl shrink-0 transition-all cursor-pointer border ${categoryFilter === cat ? 'bg-[#163832] text-slate-900 dark:text-white border-white/10' : 'bg-slate-50 dark:bg-transparent/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-850'}`}>
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-white/10/80">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Workflow Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-50 dark:bg-transparent/80 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs outline-none transition-all focus:border-white/10">
                <option value="all">All States</option>
                <option value="new">New Reports</option>
                <option value="verified">Verified Nodes</option>
                <option value="in-progress">In-Progress Repairs</option>
                <option value="resolved">Resolved / Complete</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Severity / Priority</label>
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-full bg-slate-50 dark:bg-transparent/80 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs outline-none transition-all focus:border-white/10">
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Severity</option>
                <option value="critical">Critical Severity</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Incident Date</label>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full bg-slate-50 dark:bg-transparent/80 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs outline-none transition-all focus:border-white/10">
                <option value="all">All History</option>
                <option value="today">Today / Recent</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Past 7 Days</option>
              </select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Geospatial Overlay Toggles</span>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setShowRiskZones(!showRiskZones)} className={`py-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${showRiskZones ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-slate-50 dark:bg-transparent/60 text-slate-500 border-slate-200 dark:border-white/5 hover:bg-slate-100'}`}>
                  <Flame className="w-3.5 h-3.5" /> Risk Zones
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-8 relative bg-slate-200 dark:bg-[#0A0A0F] border border-slate-300 dark:border-white/5 rounded-3xl h-[520px] overflow-hidden shadow-2xl flex items-center justify-center transition-all z-10">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              className="w-full h-full rounded-3xl"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapController center={mapCenter} zoom={mapZoom} />
              
              {showRiskZones && EMERGENCY_ALERTS.map(alert => (
                <Circle 
                  key={alert.id}
                  center={[alert.coords.lat, alert.coords.lng]} 
                  radius={400}
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
                />
              ))}

              {filteredIssues.map(issue => (
                <Marker 
                  key={issue.id} 
                  position={[Number(issue.coordinates.lat), Number(issue.coordinates.lng)]}
                  icon={createCustomIcon(issue.priority, issue.status)}
                  eventHandlers={{
                    click: () => {
                      onSelectIssue(issue.id);
                      setMapCenter([Number(issue.coordinates.lat), Number(issue.coordinates.lng)]);
                    },
                  }}
                >
                  <Popup>
                    <div className="text-sm font-sans">
                      <strong>{issue.title}</strong><br/>
                      <span className="text-gray-500 text-xs">{issue.status}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl p-6 shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {selectedIssue ? (
                  <motion.div key={selectedIssue.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4 flex-1 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold font-mono tracking-wider ${getPriorityColor(selectedIssue.priority)}`}>
                          {selectedIssue.priority.toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold font-mono ${getStatusColor(selectedIssue.status)}`}>
                          {selectedIssue.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-sans font-extrabold text-base text-slate-950 dark:text-slate-900 dark:text-white leading-snug">{selectedIssue.title}</h3>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" /> {selectedIssue.locationName}
                        </p>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{selectedIssue.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" /> <span>Reported {selectedIssue.reportedAt}</span> <span>•</span> <span>By {selectedIssue.reporterName}</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/10/80 pt-4 mt-4 flex items-center gap-2.5">
                      <button onClick={() => onUpvote(selectedIssue.id)} className="flex-1 py-3 bg-[#163832] hover:bg-[#0B2B26] text-slate-900 dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#051F20]/30 transition-all duration-200 transform active:scale-95 cursor-pointer">
                        <ArrowUp className="w-4 h-4" /> Upvote Priority ({selectedIssue.upvotes})
                      </button>
                      <button onClick={() => onSelectIssue(null)} className="px-4 py-3 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-[#16161D]/90 backdrop-blur-md dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer">
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="p-4 bg-[#163832]/10 text-[#7C3AED] rounded-2xl animate-pulse"><Layers className="w-8 h-8" /></div>
                    <div>
                      <h3 className="font-sans font-extrabold text-sm text-slate-900 dark:text-slate-900 dark:text-white">Civic Node Inspector</h3>
                      <p className="max-w-[220px] text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-sans leading-relaxed">Select any interactive coordinate pin or emergency alert to trigger granular agency dispatch reviews.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-5 rounded-3xl bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 shadow-xl space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">🗺️ Geospatial Map Legend</h4>
              <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-rose-700 shrink-0 block"></span><span>Critical Severity</span></div>
                <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 shrink-0 block"></span><span>High Priority</span></div>
                <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] border border-blue-700 shrink-0 block"></span><span>Active Issue</span></div>
                <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-emerald-600 shrink-0 block"></span><span>Resolved Node</span></div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-white/10/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-[#10B981] font-mono uppercase tracking-wider flex items-center gap-1 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-green-400 block"></span>Live Updates Feed</span>
                  <button onClick={() => setIsLiveEnabled(!isLiveEnabled)} className="text-[9px] font-bold font-mono text-slate-400 hover:text-slate-900 dark:text-white underline cursor-pointer">{isLiveEnabled ? "Disable Stream" : "Enable Stream"}</button>
                </div>
                <div className="space-y-1.5 max-h-16 overflow-y-auto scrollbar-none">
                  {recentLiveUpdates.map((update, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      <span className="text-[#7C3AED] font-extrabold">›</span><span>{update}</span>
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
