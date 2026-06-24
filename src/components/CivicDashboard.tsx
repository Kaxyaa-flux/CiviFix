import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Trophy, CheckSquare, ShieldAlert, Sparkles, Send, 
  MapPin, Check, Plus, Star, BellRing, ChevronRight 
} from 'lucide-react';
import { CommunityHero, Activity } from '../types';

interface DashboardProps {
  onVerifyIssue: () => void;
  onFlagIssue: () => void;
}

const HEROES_LEADERBOARD: CommunityHero[] = [
  { id: '1', name: 'Elena Rostova', rank: 1, points: 2480, avatar: '👩‍💻', resolvedCount: 34, badges: ['Validator', 'Alpha Citizen'] },
  { id: '2', name: 'Marcus Chen', rank: 2, points: 2150, avatar: '👨‍🔧', resolvedCount: 29, badges: ['First Responder', 'Super Hero'] },
  { id: '3', name: 'Zarah Patel', rank: 3, points: 1980, avatar: '👩‍⚕️', resolvedCount: 24, badges: ['Park Ranger', 'Verificator'] },
  { id: '4', name: 'Sarah Miller', rank: 4, points: 1720, avatar: '👩‍🎨', resolvedCount: 19, badges: ['Elite Hero'] },
  { id: '5', name: 'David Kim', rank: 5, points: 1510, avatar: '👨‍💻', resolvedCount: 15, badges: ['Local Advocate'] },
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'report', title: 'Water Main Pipe burst', user: 'citizen_104', time: '2 mins ago', details: 'Automated dispatch sent to Public Works Department.' },
  { id: 'a2', type: 'verification', title: 'Broken streetlight verified', user: 'elena_rostova', time: '12 mins ago', details: 'Added to scheduled work order list.' },
  { id: 'a3', type: 'resolution', title: 'Removed fallen oak branch', user: 'forestry_division', time: '34 mins ago', details: 'Oak Ave lane reopened.' },
  { id: 'a4', type: 'upvote', title: 'Illegal trash pile reported', user: 'community_upvote_bot', time: '1 hour ago', details: 'Upvotes reached priority dispatch threshold.' },
];

const QUEUE_INCIDENTS = [
  {
    id: 'q1',
    title: "Heavy trash debris blocking fire hydrant",
    description: "Someone left four wood pallets and construction concrete waste right in front of the active fire hydrant on Sunset Court. It prevents fire trucks from reaching it if needed.",
    locationName: "124 Sunset Court, Sector 3",
    category: "Sanitation & Fire Safety",
    evidence: "construction_debris.jpg",
  },
  {
    id: 'q2',
    title: "Missing sewer grate on cycling path",
    description: "The metal sewer cover/grate is completely missing on the designated bike lane of River Boulevard. It's a deep hole, extremely dangerous for cyclists, especially at night.",
    locationName: "River Boulevard (North cycle Lane)",
    category: "Street Infrastructure",
    evidence: "grate_missing.png",
  },
  {
    id: 'q3',
    title: "Grafitti coverup needed on historic monument",
    description: "Spray paint vandalism has been sprayed over the bronze historic plaque in the old town square park. It needs special solvent removal.",
    locationName: "Town Square Park Central Plaque",
    category: "Parks & Culture",
    evidence: "vandalism_evidence.jpg",
  }
];

export default function CivicDashboard({ onVerifyIssue, onFlagIssue }: DashboardProps) {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [queueIndex, setQueueIndex] = useState(0);
  const [userScore, setUserScore] = useState(340);
  const [showScorePulse, setShowScorePulse] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Rotate simulated activity feed
  useEffect(() => {
    const feedInterval = setInterval(() => {
      const logs = [
        { id: Math.random().toString(), type: 'report' as const, title: 'Road damage on Oak St', user: 'citizen_901', time: 'Just now', details: 'AI assigned: Medium Priority' },
        { id: Math.random().toString(), type: 'verification' as const, title: 'Utility failure confirmed', user: 'marcus_chen', time: 'Just now', details: 'Dispatched to Power grid team' },
        { id: Math.random().toString(), type: 'resolution' as const, title: 'Sewer clog cleared', user: 'sanitation_bot', time: 'Just now', details: 'Water flow fully restored' },
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setActivities(prev => [randomLog, ...prev.slice(0, 4)]);
    }, 9000);

    return () => clearInterval(feedInterval);
  }, []);

  const handleAction = (isVerify: boolean) => {
    // Increment points
    setUserScore(prev => prev + 25);
    setShowScorePulse(true);
    setTimeout(() => setShowScorePulse(false), 800);

    if (isVerify) {
      onVerifyIssue();
      setFeedbackMsg("✅ Verified! +25 Reputation Points. Community alerted.");
    } else {
      onFlagIssue();
      setFeedbackMsg("🚨 Flagged! +25 Reputation Points. Routed for moderation review.");
    }

    // Go to next queue item
    setTimeout(() => {
      setFeedbackMsg(null);
      setQueueIndex((prev) => (prev + 1) % QUEUE_INCIDENTS.length);
    }, 2000);
  };

  const currentQueueItem = QUEUE_INCIDENTS[queueIndex];

  return (
    <section 
      id="dashboard" 
      className="relative py-20 bg-[#F8FAFC] dark:bg-[#020617] border-b border-[#E2E8F0] dark:border-[#1E293B] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-[#2563EB]/10 border border-[#E2E8F0] dark:border-[#1E293B] rounded-full text-xs font-semibold text-[#2563EB] font-mono uppercase">
            <Trophy className="w-3.5 h-3.5" />
            Civic Action Hub
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Co-Creation Dashboard
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 font-sans text-sm sm:text-base">
            Participate in real-time community validation. Act as a certified civic moderator, verify pending neighborhood issues, and climb the public leaderboard.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Verification Queue Mini-Game (Col-span 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl p-6 relative overflow-hidden shadow-md">
            
            {/* Corner floating badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Your Score:</span>
              <motion.span 
                animate={showScorePulse ? { scale: [1, 1.3, 1], color: ['#10B981', '#10B981', ''] } : {}}
                className="font-display font-bold text-sm text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-lg"
              >
                {userScore} PTS
              </motion.span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] font-mono uppercase tracking-wider mb-5">
              <CheckSquare className="w-4 h-4" />
              PENDING VERIFICATION QUEUE
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={queueIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Simulated photo evidence */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-[#E2E8F0] dark:border-[#1E293B]">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent z-10" />
                  <span className="text-slate-400 dark:text-slate-600 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 z-20">
                    📷 [Simulated Photo Evidence: {currentQueueItem.evidence}]
                  </span>
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="bg-[#EF4444] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Needs Verification
                    </span>
                  </div>
                </div>

                {/* Queue Incident Details */}
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-[#0F172A] dark:text-[#F8FAFC]">
                    {currentQueueItem.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                    {currentQueueItem.locationName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {currentQueueItem.description}
                  </p>
                </div>

                {/* Action Choices */}
                {feedbackMsg ? (
                  <div className="py-4 text-center font-mono text-xs font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl">
                    {feedbackMsg}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleAction(true)}
                      className="py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200"
                    >
                      <Check className="w-4 h-4" />
                      Verify Incident
                    </button>
                    <button
                      onClick={() => handleAction(false)}
                      className="py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                      Flag Spam
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Column 2: Live Activity Feed (Col-span 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl p-6 shadow-md h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] font-mono uppercase tracking-wider">
                <BellRing className="w-4 h-4 text-[#EF4444]" />
                MUNICIPAL DISPATCH LOGS
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                Live Pulse
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 border-l-2 border-[#2563EB] bg-slate-50 dark:bg-slate-950 rounded-r-xl space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                        {activity.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      User: @{activity.user}
                    </p>
                    {activity.details && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans leading-tight">
                        {activity.details}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Column 3: Leaderboard (Col-span 3) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] font-mono uppercase tracking-wider mb-5">
              <Trophy className="w-4 h-4 text-amber-500" />
              TOP HERO LEADERBOARD
            </div>

            <div className="space-y-3.5">
              {HEROES_LEADERBOARD.map((hero) => (
                <div 
                  key={hero.id} 
                  className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-950/50 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-display font-bold text-xs text-slate-400 dark:text-slate-500 w-4">
                      #{hero.rank}
                    </span>
                    <span className="text-xl">{hero.avatar}</span>
                    <div>
                      <h4 className="font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                        {hero.name}
                      </h4>
                      <div className="flex gap-1 mt-0.5">
                        {hero.badges.slice(0, 1).map((b, i) => (
                          <span key={i} className="bg-blue-50 dark:bg-[#2563EB]/10 text-[9px] text-[#2563EB] px-1.5 py-0.2 rounded font-semibold">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                    {hero.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
