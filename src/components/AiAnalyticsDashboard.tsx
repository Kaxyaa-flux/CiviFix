import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerToast } from '../lib/toast';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { 
  Sparkles, ShieldAlert, Droplets, Zap, Trash2, TrendingUp, AlertTriangle, 
  CheckCircle2, ArrowRight, BrainCircuit, Activity, RefreshCw, Layers, 
  MapPin, Gauge, ShieldCheck, Play, HelpCircle, FileText, ArrowUpRight, ArrowDownRight, Check, ChevronRight
} from 'lucide-react';

// Interfaces for our Predictive AI Core
interface RiskModel {
  id: string;
  name: string;
  category: 'infrastructure' | 'water' | 'electricity' | 'waste';
  riskScore: number; // 0 to 100
  trend: 'up' | 'down' | 'stable';
  probability: number; // probability percentage e.g. 92
  timeframe: string; // e.g. "Within 48 hours"
  location: string;
  affectedCustomers: number;
  aiConfidence: number; // e.g. 96
  anomalyFactor: number; // standard deviations from baseline e.g. 2.4
  sensorCount: number;
  primaryCause: string;
  historicalAnomalyChart: { day: string; level: number; predicted: number }[];
}

interface Recommendation {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Easy' | 'Medium' | 'Hard';
  description: string;
  costEstimate: string;
  targetModelId: string;
  status: 'pending' | 'executing' | 'completed';
}

const INITIAL_RISK_MODELS: RiskModel[] = [
  {
    id: 'PRD-INF-01',
    name: 'Roadbed Structural Fracture Cascade',
    category: 'infrastructure',
    riskScore: 88,
    trend: 'up',
    probability: 91,
    timeframe: 'Next 36 hours',
    location: 'Oakwood Boulevard (Underpass Section)',
    affectedCustomers: 1400,
    aiConfidence: 94,
    anomalyFactor: 3.1,
    sensorCount: 14,
    primaryCause: 'Sub-surface water erosion combining with peak heavy freight cycles.',
    historicalAnomalyChart: [
      { day: 'Mon', level: 42, predicted: 45 },
      { day: 'Tue', level: 50, predicted: 52 },
      { day: 'Wed', level: 58, predicted: 62 },
      { day: 'Thu', level: 69, predicted: 74 },
      { day: 'Fri', level: 75, predicted: 81 },
      { day: 'Sat', level: 82, predicted: 88 },
      { day: 'Sun', level: 84, predicted: 91 },
    ]
  },
  {
    id: 'PRD-WTR-02',
    name: 'Subterranean Feed-Main Cavitation Burst',
    category: 'water',
    riskScore: 92,
    trend: 'up',
    probability: 96,
    timeframe: 'Next 12 hours',
    location: 'Pine Road Grid-Hub 4',
    affectedCustomers: 4500,
    aiConfidence: 98,
    anomalyFactor: 4.2,
    sensorCount: 22,
    primaryCause: 'Abrupt micro-pressure shocks detected upstream near Pump Station Alpha.',
    historicalAnomalyChart: [
      { day: 'Mon', level: 25, predicted: 30 },
      { day: 'Tue', level: 32, predicted: 35 },
      { day: 'Wed', level: 45, predicted: 48 },
      { day: 'Thu', level: 60, predicted: 65 },
      { day: 'Fri', level: 78, predicted: 82 },
      { day: 'Sat', level: 89, predicted: 92 },
      { day: 'Sun', level: 91, predicted: 96 },
    ]
  },
  {
    id: 'PRD-ZAP-03',
    name: 'Series-Fault Photocell Degradation',
    category: 'electricity',
    riskScore: 64,
    trend: 'down',
    probability: 68,
    timeframe: 'Next 5 days',
    location: 'Sunset Boulevard Corridor (West Lane)',
    affectedCustomers: 350,
    aiConfidence: 89,
    anomalyFactor: 1.9,
    sensorCount: 8,
    primaryCause: 'Cumulative thermal cyclical exhaustion of older LED controller capacitors.',
    historicalAnomalyChart: [
      { day: 'Mon', level: 72, predicted: 71 },
      { day: 'Tue', level: 71, predicted: 70 },
      { day: 'Wed', level: 70, predicted: 69 },
      { day: 'Thu', level: 68, predicted: 68 },
      { day: 'Fri', level: 66, predicted: 67 },
      { day: 'Sat', level: 65, predicted: 66 },
      { day: 'Sun', level: 64, predicted: 65 },
    ]
  },
  {
    id: 'PRD-WST-04',
    name: 'Sensor-Projected Refuse Blockage Saturation',
    category: 'waste',
    riskScore: 79,
    trend: 'up',
    probability: 82,
    timeframe: 'Next 48 hours',
    location: 'Green Park Conservation Woodlands (Gate 4 Access Path)',
    affectedCustomers: 920,
    aiConfidence: 91,
    anomalyFactor: 2.8,
    sensorCount: 11,
    primaryCause: 'Unplanned weekend festival residue coupled with mechanical compactor failure.',
    historicalAnomalyChart: [
      { day: 'Mon', level: 30, predicted: 32 },
      { day: 'Tue', level: 38, predicted: 41 },
      { day: 'Wed', level: 48, predicted: 50 },
      { day: 'Thu', level: 55, predicted: 60 },
      { day: 'Fri', level: 64, predicted: 70 },
      { day: 'Sat', level: 72, predicted: 78 },
      { day: 'Sun', level: 77, predicted: 82 },
    ]
  },
  {
    id: 'PRD-INF-05',
    name: 'Overhead Bridge Deck Joint Shear Strain',
    category: 'infrastructure',
    riskScore: 41,
    trend: 'stable',
    probability: 45,
    timeframe: 'Next 14 days',
    location: 'Broadway Viaduct (South Abutment)',
    affectedCustomers: 8500,
    aiConfidence: 84,
    anomalyFactor: 1.1,
    sensorCount: 18,
    primaryCause: 'Minor concrete expansion joint wear due to prolonged solar heat absorption.',
    historicalAnomalyChart: [
      { day: 'Mon', level: 40, predicted: 40 },
      { day: 'Tue', level: 41, predicted: 41 },
      { day: 'Wed', level: 41, predicted: 42 },
      { day: 'Thu', level: 40, predicted: 43 },
      { day: 'Fri', level: 42, predicted: 44 },
      { day: 'Sat', level: 41, predicted: 44 },
      { day: 'Sun', level: 41, predicted: 45 },
    ]
  },
  {
    id: 'PRD-WTR-06',
    name: 'Aqueduct Siphon Backflow Silt Intrusion',
    category: 'water',
    riskScore: 71,
    trend: 'up',
    probability: 77,
    timeframe: 'Next 3 days',
    location: 'River Canal Conduit Block 9',
    affectedCustomers: 12000,
    aiConfidence: 93,
    anomalyFactor: 2.5,
    sensorCount: 30,
    primaryCause: 'Upstream agricultural storm runoff surging into the low-pressure bypass siphon.',
    historicalAnomalyChart: [
      { day: 'Mon', level: 45, predicted: 48 },
      { day: 'Tue', level: 50, predicted: 52 },
      { day: 'Wed', level: 56, predicted: 60 },
      { day: 'Thu', level: 62, predicted: 66 },
      { day: 'Fri', level: 68, predicted: 72 },
      { day: 'Sat', level: 71, predicted: 75 },
      { day: 'Sun', level: 71, predicted: 77 },
    ]
  }
];

const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'REC-01',
    title: 'Preemptive Micro-Flow Bypass Lockout',
    impact: 'High',
    effort: 'Easy',
    description: 'Reroute water flow through Secondary Valve 12-B to reduce downstream pressure surges at Pine Road Grid-Hub 4.',
    costEstimate: '$850 (Internal Labor Only)',
    targetModelId: 'PRD-WTR-02',
    status: 'pending'
  },
  {
    id: 'REC-02',
    title: 'Freight Restriction and Micro-Resurfacing',
    impact: 'High',
    effort: 'Medium',
    description: 'Impose immediate vehicle weight limit alerts on Oakwood Boulevard and dispatch a micro-seal sealant crew to avoid total roadbed fracture.',
    costEstimate: '$4,200',
    targetModelId: 'PRD-INF-01',
    status: 'pending'
  },
  {
    id: 'REC-03',
    title: 'Ad-hoc Collector Dispatch Rotation',
    impact: 'Medium',
    effort: 'Easy',
    description: 'Add an emergency sanitation collector run to Gate 4 Access Path to empty overflowing hoppers ahead of morning rush.',
    costEstimate: '$240',
    targetModelId: 'PRD-WST-04',
    status: 'pending'
  },
  {
    id: 'REC-04',
    title: 'Capacitor Cluster Upgrade Scheduled',
    impact: 'Low',
    effort: 'Hard',
    description: 'Queue replacement of ancient photocells with solid-state IoT smart switches during regular monthly lighting service cycle.',
    costEstimate: '$1,800',
    targetModelId: 'PRD-ZAP-03',
    status: 'pending'
  }
];

// Predictive simulation over future 24-hour cycle for general municipal sectors
const MUNICIPAL_AI_FORECAST_DATA = [
  { time: '08:00', infrastructure: 40, water: 45, energy: 30, waste: 25 },
  { time: '10:00', infrastructure: 42, water: 52, energy: 32, waste: 38 },
  { time: '12:00', infrastructure: 48, water: 65, energy: 38, waste: 46 },
  { time: '14:00', infrastructure: 55, water: 82, energy: 44, waste: 55 },
  { time: '16:00', infrastructure: 68, water: 94, energy: 50, waste: 68 },
  { time: '18:00', infrastructure: 84, water: 96, energy: 52, waste: 75 },
  { time: '20:00', infrastructure: 88, water: 96, energy: 60, waste: 81 },
  { time: '22:00', infrastructure: 86, water: 90, energy: 62, waste: 83 },
  { time: '00:00', infrastructure: 82, water: 75, energy: 64, waste: 79 },
  { time: '02:00', infrastructure: 74, water: 58, energy: 63, waste: 64 },
  { time: '04:00', infrastructure: 62, water: 42, energy: 63, waste: 50 },
  { time: '06:00', infrastructure: 50, water: 38, energy: 60, waste: 35 },
];

interface AiAnalyticsDashboardProps {
  onBack: () => void;
}

export default function AiAnalyticsDashboard({ onBack }: AiAnalyticsDashboardProps) {
  const [riskModels, setRiskModels] = useState<RiskModel[]>(INITIAL_RISK_MODELS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  
  // Real stats from DB
  const [realStats, setRealStats] = useState({ issuesReported: 0, issuesResolved: 0, activeVolunteers: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setRealStats(data))
      .catch(console.error);
  }, []);
  
  // Interactive filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedModelId, setSelectedModelId] = useState<string>('PRD-WTR-02');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulation control trigger
  const [isSimulating, setIsSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  // Active risk model details
  const activeModel = useMemo(() => {
    return riskModels.find(m => m.id === selectedModelId) || riskModels[0];
  }, [riskModels, selectedModelId]);

  // Filtered risk models
  const filteredRiskModels = useMemo(() => {
    return riskModels.filter(m => {
      const matchesCategory = selectedCategoryFilter === 'all' || m.category === selectedCategoryFilter;
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [riskModels, selectedCategoryFilter, searchQuery]);

  // Executive summary analytics computed metrics
  const summaryMetrics = useMemo(() => {
    const totalModels = riskModels.length;
    const criticalCount = riskModels.filter(m => m.riskScore >= 80).length;
    const averageConfidence = Math.round(riskModels.reduce((sum, curr) => sum + curr.aiConfidence, 0) / totalModels);
    
    // Weighted Average Risk Score
    const averageRiskScore = Math.round(riskModels.reduce((sum, curr) => sum + curr.riskScore, 0) / totalModels);

    return { totalModels, criticalCount, averageConfidence, averageRiskScore };
  }, [riskModels]);

  // Recommendation engine actions
  const handleExecuteRecommendation = (recId: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === recId) {
        return { ...rec, status: 'executing' };
      }
      return rec;
    }));

    triggerToast(`Deploying mitigation protocol: ${recId}...`, 'info');

    // Trigger beautiful interactive completion state
    setTimeout(() => {
      setRecommendations(prev => prev.map(rec => {
        if (rec.id === recId) {
          // Find associated model and lower its risk score as a feedback result!
          const targetModel = rec.targetModelId;
          setRiskModels(currentModels => currentModels.map(model => {
            if (model.id === targetModel) {
              const newScore = Math.max(10, model.riskScore - 25);
              const newProb = Math.max(15, model.probability - 22);
              return { 
                ...model, 
                riskScore: newScore, 
                probability: newProb,
                trend: 'down',
                primaryCause: `[AI Mitigated] ${model.primaryCause}`
              };
            }
            return model;
          }));

          triggerToast(`Mitigation playbook ${recId} successfully executed! Risk mitigated.`, 'success');
          return { ...rec, status: 'completed' };
        }
        return rec;
      }));
    }, 1800);
  };

  // Run dynamic AI predictive scanner (simulates real-time telemetry sweep)
  const handleRunPredictiveSweep = () => {
    setIsSimulating(true);
    setSimMessage('Syncing IoT telemetry streams and calculating shear vectors...');
    triggerToast('Initiating telemetry stream sync...', 'info');
    
    setTimeout(() => {
      setSimMessage('Compiling anomaly matrices through Deep-Bayesian predictive models...');
    }, 1000);

    setTimeout(() => {
      setRiskModels(prev => prev.map(model => {
        // Random slight updates to make dashboard feel alive and futuristic
        const deviation = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const newScore = Math.min(99, Math.max(15, model.riskScore + deviation));
        const newProb = Math.min(99, Math.max(10, model.probability + deviation));
        const newTrend = deviation > 1 ? 'up' : deviation < -1 ? 'down' : model.trend;
        
        return {
          ...model,
          riskScore: newScore,
          probability: newProb,
          trend: newTrend,
          aiConfidence: Math.min(100, Math.max(80, model.aiConfidence + (Math.random() > 0.5 ? 1 : -1)))
        };
      }));

      setIsSimulating(false);
      setSimMessage(null);
      triggerToast('AI Predictive Sweep complete. Municipal risk indices re-calculated.', 'success');
    }, 2200);
  };

  // Helper styles for Category tags
  const getCategoryTheme = (category: RiskModel['category']) => {
    const styles = {
      infrastructure: {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        icon: <Layers className="w-3.5 h-3.5" />
      },
      water: {
        text: 'text-[#7C3AED] dark:text-blue-400',
        bg: 'bg-[#7C3AED]/10 border-white/10/20',
        icon: <Droplets className="w-3.5 h-3.5" />
      },
      electricity: {
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-red-500/10 border-red-500/20',
        icon: <Zap className="w-3.5 h-3.5" />
      },
      waste: {
        text: 'text-emerald-600 dark:text-green-400',
        bg: 'bg-green-500/10 border-green-500/20',
        icon: <Trash2 className="w-3.5 h-3.5" />
      }
    };
    return styles[category];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-50 pt-[7rem] pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header section with telemetry indicators */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1.5">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#7C3AED] transition-colors font-mono cursor-pointer"
            >
              ← RETURN TO LANDING
            </button>
            <h1 className="text-3.5xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-900 dark:text-white flex flex-wrap items-center gap-3">
              <BrainCircuit className="w-9 h-9 text-[#7C3AED] animate-pulse" />
              Futuristic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">AI Analytics Dashboard</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
              Real-time predictive core analyzing municipal infrastructure stress variables, hydraulic pressure forecasts, thermal grid failures, and waste sensor telemetry.
            </p>
            <div className="flex gap-4 mt-2">
              <div className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-mono font-bold border border-[#10B981]/20">
                DB Incidents: {realStats.issuesReported}
              </div>
              <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-mono font-bold border border-blue-500/20">
                Volunteers Online: {realStats.activeVolunteers}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunPredictiveSweep}
              disabled={isSimulating}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-slate-900 dark:text-white px-5 py-3 rounded-2xl text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all duration-300 transform active:scale-98"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'RE-COMPILING MODELS...' : 'RUN PREDICTIVE SWEEP'}
            </button>
          </div>
        </div>

        {/* Global predictive notification overlay during active simulation */}
        <AnimatePresence>
          {simMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#7C3AED]/10 border border-white/10/20 text-blue-700 dark:text-blue-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-mono"
            >
              <Activity className="w-5 h-5 text-[#7C3AED] animate-pulse" />
              <span>{simMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Statistics Cards Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-wider">Weighted Municipal Risk</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-slate-950 dark:text-slate-900 dark:text-white">{summaryMetrics.averageRiskScore}%</span>
              <span className="text-xs font-mono text-green-500 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> -3.5%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Average stress coefficient across sectors</p>
          </div>

          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-wider">Critical Risk Anomalies</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-amber-500">{summaryMetrics.criticalCount} / {summaryMetrics.totalModels}</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono uppercase font-bold">Triage Active</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Thresholds exceeding 80% likelihood</p>
          </div>

          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-wider">Model Scan Confidence</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-purple-500">{summaryMetrics.averageConfidence}%</span>
              <span className="text-xs font-mono text-purple-400 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" /> High
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Weighted validation accuracy bounds</p>
          </div>

          <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-5 rounded-2xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase font-bold tracking-wider">Mitigations Deployed</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3.5xl font-black text-green-500">
                {recommendations.filter(r => r.status === 'completed').length} / {recommendations.length}
              </span>
              <span className="text-xs font-mono text-green-500 flex items-center">
                <Check className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Risk offset from executed dispatches</p>
          </div>

        </div>

        {/* 2. Primary Layout: Predictive Core (Col-span 7) & Model Detailed Inspect/Recommendation Engine (Col-span 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: Predictive Core & Global AI Forecast charts */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Sector Integrated AI 24h Forecast Line Chart */}
            <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#7C3AED]" />
                    AI Sector Volatility 24-Hour Forecast
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    Multi-parameter anomaly tracking curves based on active weather patterns & usage load spikes
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <span className="w-2.5 h-2.5 rounded bg-[#7C3AED] inline-block"></span> Water
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block ml-2"></span> Roads
                  <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block ml-2"></span> Energy
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MUNICIPAL_AI_FORECAST_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaWater" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="areaRoads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fontFamily: 'monospace' }} stroke="#64748B" />
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
                    <ReferenceLine y={80} stroke="#FF5A5F" strokeDasharray="3 3" label={{ value: 'CRITICAL ZONE', fill: '#FF5A5F', fontSize: 9, position: 'top' }} />
                    <Area type="monotone" name="Hydraulic Stress" dataKey="water" stroke="#22D3EE" strokeWidth={2.5} fillOpacity={1} fill="url(#areaWater)" />
                    <Area type="monotone" name="Roadbed Joint Shear" dataKey="infrastructure" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#areaRoads)" />
                    <Line type="monotone" name="Power Grid Load" dataKey="energy" stroke="#FF5A5F" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Risk Heatmap Visualizer */}
            <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-950 dark:text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  AI Infrastructure Risk Matrix Grid
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Visual sensor arrays grouped by municipal zones. Hover/select to load specialized telemetry channels.
                </p>
              </div>

              {/* Grid representation mimicking geographic heatmap cells */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {riskModels.map((model) => {
                  const isSelected = model.id === selectedModelId;
                  const catTheme = getCategoryTheme(model.category);
                  
                  // Color rating based on risk score
                  const getHeatColor = (score: number) => {
                    if (score >= 85) return 'border-red-500/40 bg-red-500/5 text-red-500 hover:bg-red-500/10';
                    if (score >= 70) return 'border-amber-500/40 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10';
                    return 'border-white/10/30 bg-[#7C3AED]/5 text-[#7C3AED] hover:bg-[#7C3AED]/10';
                  };

                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${getHeatColor(model.riskScore)} ${
                        isSelected ? 'ring-2 ring-blue-600 scale-102 border-transparent shadow-md' : 'scale-98'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono opacity-80">{model.id}</span>
                        <div className="flex items-center gap-1">
                          {catTheme.icon}
                          <span className="text-[9px] font-mono font-bold capitalize">{model.category}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-black truncate mt-2 text-slate-900 dark:text-slate-100 group-hover:text-[#7C3AED] dark:group-hover:text-blue-400 transition-colors">
                        {model.name}
                      </h4>

                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <p className="text-[8px] font-mono opacity-70 uppercase">Risk Level</p>
                          <p className="text-lg font-black tracking-tight">{model.riskScore}%</p>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          model.trend === 'up' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {model.trend === 'up' ? '▲ ASC' : model.trend === 'down' ? '▼ MIT' : '■ STB'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Model Search & Detailed List */}
            <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                  Predictive Model Index ({filteredRiskModels.length})
                </h3>

                <div className="flex gap-2 text-xs">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-white/5 p-2 rounded-xl focus:outline-hidden text-xs"
                  >
                    <option value="all">All Sectors</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="water">Water & Flow</option>
                    <option value="electricity">Electric Grid</option>
                    <option value="waste">Sanitation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {filteredRiskModels.map((m) => {
                  const isSelected = m.id === selectedModelId;
                  const theme = getCategoryTheme(m.category);
                  
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#7C3AED]/10 border-white/10' 
                          : 'bg-slate-50 dark:bg-transparent/40 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-950'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-slate-200 dark:bg-[#16161D]/90 px-1.5 py-0.5 rounded border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400">
                            {m.id}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1 uppercase">
                            {theme.icon}
                            {m.category}
                          </span>
                          <span className="text-xs text-slate-400">• {m.location.split('(')[0]}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-950 dark:text-slate-900 dark:text-white">{m.name}</h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[9px] font-mono text-slate-400 uppercase">PROBABILITY</p>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-slate-900 dark:text-white">{m.probability}%</p>
                        </div>

                        <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${m.riskScore >= 80 ? 'bg-red-500' : 'bg-[#7C3AED]'}`}
                            style={{ width: `${m.probability}%` }}
                          />
                        </div>

                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-[#7C3AED]' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT AREA: Selected Model detailed telemetry inspection and dynamic AI recommendations action centre */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Telemetry Inspection Panel */}
            <div className="bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <span className="text-xs font-mono font-black text-[#7C3AED] uppercase flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#7C3AED]" />
                  Telemetry Inspect Node
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-[#0A0A0F] border border-white/10 px-2 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400 uppercase font-black">
                  {activeModel.id}
                </span>
              </div>

              {/* Core stress dials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-transparent p-4 rounded-2xl border border-slate-250 dark:border-white/5/60">
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase font-black">AI Stress Level</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2.5xl font-black text-slate-950 dark:text-slate-900 dark:text-white">{activeModel.riskScore}%</span>
                    <span className="text-[10px] font-mono text-red-500 font-bold">CRIT</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-transparent p-4 rounded-2xl border border-slate-250 dark:border-white/5/60">
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase font-black">AI Confidence</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2.5xl font-black text-slate-950 dark:text-slate-900 dark:text-white">{activeModel.aiConfidence}%</span>
                    <span className="text-[10px] font-mono text-green-500 font-bold">SCAN</span>
                  </div>
                </div>
              </div>

              {/* Mini Projected Trend Chart */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">Historical Trend vs Prediction Arc</h4>
                <div className="h-32 bg-slate-50 dark:bg-transparent/40 p-2 rounded-2xl border border-white/10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeModel.historicalAnomalyChart} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} opacity={0.1} />
                      <XAxis dataKey="day" tick={{ fontSize: 8, fontFamily: 'monospace' }} stroke="#64748B" />
                      <YAxis tick={{ fontSize: 8, fontFamily: 'monospace' }} stroke="#64748B" />
                      <Area type="monotone" name="Anomalies" dataKey="level" stroke="#22D3EE" strokeWidth={1.5} fill="#22D3EE" fillOpacity={0.05} />
                      <Line type="monotone" name="Projected" dataKey="predicted" stroke="#EC4899" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Meta stats */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400 font-mono">Location Sector:</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {activeModel.location}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400 font-mono">Imminent Impact Timeframe:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-500/15">
                    {activeModel.timeframe}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400 font-mono">IoT Micro-Sensors Polled:</span>
                  <span className="font-bold font-mono text-[#7C3AED]">{activeModel.sensorCount} active nodes</span>
                </div>

                <div className="space-y-1 bg-slate-50 dark:bg-transparent p-3.5 rounded-xl border border-slate-250 dark:border-white/5/60 mt-3 text-xs">
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 text-purple-500">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> AI Synthesis Root Cause
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
                    {activeModel.primaryCause}
                  </p>
                </div>
              </div>

            </div>

            {/* AI Premium Recommendation Engine */}
            <div className="bg-slate-950 text-slate-900 dark:text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
              <div className="absolute top-2 right-2 bg-purple-500/10 text-[9px] font-mono text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 z-10 animate-pulse flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                INTELLIGENT DECISION ENGINE
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black tracking-wider uppercase font-mono text-slate-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4.5 h-4.5 text-blue-400" />
                  Prescriptive Dispatches
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Actionable mitigation playbooks calculated to neutralize active infrastructure shear variables.
                </p>
              </div>

              {/* Dynamic recommendation dispatches queue */}
              <div className="space-y-3 pt-3">
                {recommendations.map((rec) => {
                  const associatedModel = riskModels.find(m => m.id === rec.targetModelId);
                  
                  return (
                    <div 
                      key={rec.id}
                      className="bg-[#16161D]/90 backdrop-blur-md/5 border border-white/10 p-4 rounded-2xl relative space-y-3 hover:border-white/20 transition-all text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-blue-400 font-bold uppercase">{rec.id}</span>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{rec.title}</h4>
                        </div>
                        
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          rec.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-[#7C3AED]/20 text-blue-400'
                        }`}>
                          {rec.impact} Impact
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                        {rec.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                        <span>Cost: <span className="font-bold text-slate-900 dark:text-white">{rec.costEstimate}</span></span>
                        
                        {rec.status === 'completed' ? (
                          <span className="text-green-400 font-bold flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full uppercase">
                            <Check className="w-3.5 h-3.5" /> Mitigated
                          </span>
                        ) : rec.status === 'executing' ? (
                          <span className="text-blue-400 font-bold flex items-center gap-1 animate-pulse uppercase">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Deploying...
                          </span>
                        ) : (
                          <button
                            onClick={() => handleExecuteRecommendation(rec.id)}
                            className="bg-[#7C3AED] hover:bg-[#0B2B26] text-slate-900 dark:text-white font-bold font-mono px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            Execute Dispatch
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
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
  );
}
