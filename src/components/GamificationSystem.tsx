import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Sparkles, Trophy, Users, Star, Gift, CheckCircle2, ChevronRight, 
  ArrowRight, ShieldCheck, Zap, Flame, Clock, Heart, Share2, Compass, 
  HelpCircle, UserCheck, Check, AlertTriangle, Coffee, Bus, Trees, Landmark
} from 'lucide-react';
import { User, CommunityHero } from '../types';

interface GamificationSystemProps {
  currentUser: User | null;
  onUpdateUserPoints?: (newPoints: number) => void;
  onNavigateToAuth?: (mode: 'signin' | 'signup') => void;
  onBack: () => void;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'reporting' | 'verification' | 'action' | 'special';
  unlocked: boolean;
  progressCurrent: number;
  progressTarget: number;
  pointValue: number;
}

interface RewardItem {
  id: string;
  title: string;
  cost: number;
  icon: React.ReactNode;
  description: string;
  category: 'transit' | 'dining' | 'nature' | 'civic';
  isClaimed: boolean;
  couponCode?: string;
}

const INITIAL_CHAMPIONS = [
  {
    month: 'May 2026',
    name: 'Sandro K.',
    points: 840,
    avatar: 'av1',
    accomplishment: 'Reported and verified 14 high-density road fractures and water leakages.'
  },
  {
    month: 'April 2026',
    name: 'Marcus Thorne',
    points: 920,
    avatar: 'av3',
    accomplishment: 'Led the Downtown clean-up campaign and conducted 45 validation audits.'
  }
];

export default function GamificationSystem({ 
  currentUser, 
  onUpdateUserPoints, 
  onNavigateToAuth,
  onBack 
}: GamificationSystemProps) {
  // Local state for user's interactive points if not logged in
  const [localPoints, setLocalPoints] = useState<number>(() => {
    if (currentUser) return currentUser.reputationPoints;
    const saved = localStorage.getItem('civic_demo_points');
    return saved ? parseInt(saved, 10) : 135;
  });

  // Sync point updates to parent if user is authenticated
  useEffect(() => {
    if (currentUser) {
      setLocalPoints(currentUser.reputationPoints);
    }
  }, [currentUser]);

  const updatePoints = (newVal: number) => {
    setLocalPoints(newVal);
    if (currentUser && onUpdateUserPoints) {
      onUpdateUserPoints(newVal);
    } else {
      localStorage.setItem('civic_demo_points', newVal.toString());
    }
  };

  // State for leaderboards (Monthly vs Lifetime)
  const [leaderboardTab, setLeaderboardTab] = useState<'monthly' | 'lifetime'>('monthly');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    const saved = localStorage.getItem('civic_daily_claimed_date');
    const today = new Date().toISOString().split('T')[0];
    return saved === today;
  });

  // Animate point additions
  const [showPointPulse, setShowPointPulse] = useState(false);
  const [addedPointsAmount, setAddedPointsAmount] = useState<number | null>(null);

  // Rewards list state
  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: 'RWD-01',
      title: '7-Day Metro Transit Voucher',
      cost: 150,
      icon: <Bus className="w-5 h-5 text-blue-500" />,
      description: 'Free unlimited transit across all municipal metro and electric tramway networks.',
      category: 'transit',
      isClaimed: false
    },
    {
      id: 'RWD-02',
      title: 'Craft Cafe Coffee Token',
      cost: 45,
      icon: <Coffee className="w-5 h-5 text-amber-500" />,
      description: 'One complimentary artisanal warm beverage at any participating local bakery.',
      category: 'dining',
      isClaimed: false
    },
    {
      id: 'RWD-03',
      title: 'Annual Municipal Nature Park Pass',
      cost: 300,
      icon: <Trees className="w-5 h-5 text-emerald-500" />,
      description: 'Exclusive vehicle access and campsite reservations at local forest preserves.',
      category: 'nature',
      isClaimed: false
    },
    {
      id: 'RWD-04',
      title: 'Civic Hall VIP Forum Seating',
      cost: 90,
      icon: <Landmark className="w-5 h-5 text-purple-500" />,
      description: 'Guaranteed front-row reserved seating and speaking priority at town halls.',
      category: 'civic',
      isClaimed: false
    }
  ]);

  // Selected reward details for redemption model
  const [redeemedReward, setRedeemedReward] = useState<RewardItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Badge list data
  const badges: Badge[] = [
    {
      id: 'BDG-01',
      title: 'Civic Pioneer',
      description: 'Submit your first community issue report.',
      icon: <Compass className="w-5 h-5 text-blue-500" />,
      category: 'reporting',
      unlocked: true,
      progressCurrent: 1,
      progressTarget: 1,
      pointValue: 25
    },
    {
      id: 'BDG-02',
      title: 'Shield Guardian',
      description: 'Verify 5 pending alerts via the AI Verification Center.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
      category: 'verification',
      unlocked: localPoints >= 120, // unlock automatically for high progress
      progressCurrent: localPoints >= 120 ? 5 : 3,
      progressTarget: 5,
      pointValue: 50
    },
    {
      id: 'BDG-03',
      title: 'Street Ranger',
      description: 'Upvote or witness 10 infrastructure hazards.',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      category: 'action',
      unlocked: localPoints >= 150,
      progressCurrent: localPoints >= 150 ? 10 : 7,
      progressTarget: 10,
      pointValue: 40
    },
    {
      id: 'BDG-04',
      title: 'Community Pillar',
      description: 'Achieve a reputation level of 5.',
      icon: <Star className="w-5 h-5 text-emerald-500" />,
      category: 'special',
      unlocked: localPoints >= 250,
      progressCurrent: Math.min(5, Math.floor(localPoints / 50)),
      progressTarget: 5,
      pointValue: 100
    },
    {
      id: 'BDG-05',
      title: 'Hydro Defender',
      description: 'Report or flag 3 critical hydraulic/water leakages.',
      icon: <Flame className="w-5 h-5 text-cyan-500" />,
      category: 'reporting',
      unlocked: false,
      progressCurrent: 1,
      progressTarget: 3,
      pointValue: 60
    }
  ];

  // Simulated Leaderboard Data including User if logged in
  const leaderboardData: CommunityHero[] = [
    { id: 'usr-ch-1', name: 'Marcus Thorne', rank: 1, points: 920, avatar: 'av3', resolvedCount: 34, badges: ['BDG-01', 'BDG-02', 'BDG-03', 'BDG-04'] },
    { id: 'usr-ch-2', name: 'Sandro K.', rank: 2, points: 840, avatar: 'av1', resolvedCount: 28, badges: ['BDG-01', 'BDG-02', 'BDG-03'] },
    { id: 'usr-ch-3', name: 'Diana Prince', rank: 3, points: 650, avatar: 'av5', resolvedCount: 19, badges: ['BDG-01', 'BDG-03'] },
    { id: 'usr-ch-4', name: 'Clara J. (Gov Moderator)', rank: 4, points: 480, avatar: 'av2', resolvedCount: 15, badges: ['BDG-02'] },
    { id: 'usr-ch-5', name: 'Julian Finch', rank: 5, points: 310, avatar: 'av4', resolvedCount: 11, badges: ['BDG-01'] }
  ];

  // Append user's live points to a mock competitor list for the leaderboard
  const liveLeaderboard = useMemo(() => {
    const defaultUserObj: CommunityHero = {
      id: currentUser?.id || 'demo-guest',
      name: currentUser?.fullName || 'You (Preview Profile)',
      rank: 0,
      points: localPoints,
      avatar: currentUser?.avatar || 'av6',
      resolvedCount: currentUser?.role === 'moderator' ? 12 : 4,
      badges: badges.filter(b => b.unlocked).map(b => b.id)
    };

    // Filter out guest/user duplicates from static list
    const filteredBase = leaderboardData.filter(item => {
      if (currentUser && item.name.includes(currentUser.fullName.split(' ')[0])) return false;
      return true;
    });

    const combined = [...filteredBase, defaultUserObj];
    
    // Sort and recalculate ranks
    const sorted = combined.sort((a, b) => b.points - a.points);
    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [currentUser, localPoints, badges]);

  // Handle claim daily points
  const handleClaimDailyPoints = () => {
    if (dailyClaimed) return;
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('civic_daily_claimed_date', today);
    setDailyClaimed(true);

    const rewardPoints = 25;
    setAddedPointsAmount(rewardPoints);
    setShowPointPulse(true);
    
    updatePoints(localPoints + rewardPoints);

    setTimeout(() => {
      setShowPointPulse(false);
      setAddedPointsAmount(null);
    }, 2500);
  };

  // Handle reward redemption
  const handleRedeemReward = (rewardId: string) => {
    setErrorMsg(null);
    const target = rewards.find(r => r.id === rewardId);
    
    if (!target) return;
    if (localPoints < target.cost) {
      setErrorMsg(`Insufficient reputation points. You need ${target.cost - localPoints} more points to unlock this voucher.`);
      return;
    }

    // Deduct points
    updatePoints(localPoints - target.cost);

    // Generate unique mock voucher code
    const generatedCode = `MUNI-${target.id}-${Math.random().toString(36).substring(3, 8).toUpperCase()}`;

    // Mark as claimed locally
    setRewards(prev => prev.map(r => {
      if (r.id === rewardId) {
        return { 
          ...r, 
          isClaimed: true, 
          couponCode: generatedCode 
        };
      }
      return r;
    }));

    // Trigger unlock modal/state
    setRedeemedReward({
      ...target,
      isClaimed: true,
      couponCode: generatedCode
    });
  };

  // Level thresholds configuration
  const currentLevel = Math.floor(localPoints / 100) + 1;
  const currentLevelProgress = localPoints % 100;
  const levelNames: Record<number, string> = {
    1: 'Novice Reporter',
    2: 'Civic Scout',
    3: 'Community Guardian',
    4: 'Urban Defender',
    5: 'Metropolitan Hero',
    6: 'Supreme Steward'
  };

  const getAvatarColor = (avatarId: string) => {
    const colors: Record<string, string> = {
      av1: 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white',
      av2: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white',
      av3: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white',
      av4: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white',
      av5: 'bg-gradient-to-tr from-purple-500 to-violet-600 text-white',
      av6: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white',
    };
    return colors[avatarId] || 'bg-blue-600 text-white';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-mono cursor-pointer"
            >
              ← RETURN TO LANDING
            </button>
            <h1 className="text-3.5xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white flex flex-wrap items-center gap-3">
              <Award className="w-9 h-9 text-blue-600 animate-pulse" />
              Civic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600">Rewards & Achievements</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
              Earn reputation points by resolving community hazards, performing verification sweeps, and claiming official municipal vouchers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Daily check-in button */}
            <button
              onClick={handleClaimDailyPoints}
              disabled={dailyClaimed}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-300 transform active:scale-98 border ${
                dailyClaimed 
                  ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-transparent'
              }`}
            >
              <Flame className={`w-4 h-4 ${dailyClaimed ? 'text-slate-400' : 'text-white animate-bounce'}`} />
              {dailyClaimed ? 'DAILY CHECK-IN CLAIMED' : 'CLAIM DAILY REPUTATION (+25 PTS)'}
            </button>
          </div>
        </div>

        {/* Floating XP Animation Feed */}
        <AnimatePresence>
          {showPointPulse && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1.1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              className="fixed bottom-10 right-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-amber-400/20 font-sans"
            >
              <div className="bg-white/20 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold font-mono tracking-wide uppercase">REPUTATION DEPOSITED</p>
                <p className="text-lg font-black font-sans">+{addedPointsAmount} Points Unlocked!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Current Stats & User ranking profile + Badge Collection (Col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* User Level Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md ${
                    currentUser ? getAvatarColor(currentUser.avatar) : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                  }`}>
                    {currentUser ? currentUser.fullName.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-950 dark:text-white">
                        {currentUser ? currentUser.fullName : 'Guest Explorer (Demo Profile)'}
                      </h2>
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15 px-2 py-0.5 rounded-full font-mono uppercase font-extrabold">
                        LEVEL {currentLevel}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400">
                      {levelNames[Math.min(6, currentLevel)] || 'Community Advocate'} • Joined Municipal Network
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">Total Reputation Balance</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{localPoints} PTS</p>
                </div>
              </div>

              {/* Progress Bar to Next Level */}
              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">XP Progress to Level {currentLevel + 1}</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{currentLevelProgress} / 100 PTS</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-250 dark:border-slate-850">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevelProgress}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 h-full rounded-full"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono text-right">Earn {100 - currentLevelProgress} more points to level up!</p>
              </div>

              {/* Guest banner warning */}
              {!currentUser && (
                <div className="bg-amber-500/5 border border-amber-500/15 p-3 rounded-2xl mt-5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Your demo stats are currently saved to browser storage. Create an account to lock in your score!</span>
                  </div>
                  <button 
                    onClick={() => onNavigateToAuth?.('signup')}
                    className="text-xs text-blue-500 hover:text-blue-600 font-bold shrink-0 cursor-pointer flex items-center gap-0.5 font-mono"
                  >
                    SIGN UP <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Badge Collection Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" />
                  Your Badge Collection ({badges.filter(b => b.unlocked).length} / {badges.length})
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Municipal medals awarded based on active community efforts and auditing contributions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((badge) => {
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex items-start gap-3.5 ${
                        badge.unlocked 
                          ? 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800' 
                          : 'bg-slate-100/40 dark:bg-slate-950/5 border-slate-200/50 dark:border-slate-850/60 opacity-60'
                      }`}
                    >
                      {/* Badge Icon circle with glow */}
                      <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center relative border shadow-xs ${
                        badge.unlocked 
                          ? 'bg-white dark:bg-slate-900 border-indigo-500/30 text-indigo-500' 
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}>
                        {badge.icon}
                        {badge.unlocked && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black truncate text-slate-950 dark:text-white">{badge.title}</h4>
                          <span className="text-[9px] font-mono font-bold text-amber-500">+{badge.pointValue} PTS</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed leading-tight line-clamp-2">
                          {badge.description}
                        </p>

                        {/* Progress inside badge if locked */}
                        {!badge.unlocked && (
                          <div className="space-y-1 pt-1.5">
                            <div className="flex justify-between text-[9px] font-mono text-slate-400">
                              <span>Progress</span>
                              <span>{badge.progressCurrent} / {badge.progressTarget}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full" 
                                style={{ width: `${(badge.progressCurrent / badge.progressTarget) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Champions Showcase Section */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 relative overflow-hidden border border-blue-800/20 shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none" />
              <div className="absolute top-2 right-2 bg-yellow-500/10 text-[9px] font-mono text-yellow-400 px-2.5 py-0.5 rounded-full border border-yellow-500/20 z-10 flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-yellow-500 animate-bounce" />
                MUNICIPAL HALL OF CHAMPIONS
              </div>

              <div className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-sm font-black tracking-wider uppercase font-mono text-slate-300">Monthly Citizen Champions</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    Highly active citizens whose outstanding contributions in reporting and auditing saved municipal resources.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INITIAL_CHAMPIONS.map((champ, idx) => (
                    <div 
                      key={idx}
                      className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 hover:border-white/20 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">{champ.month}</span>
                        <span className="text-[10px] font-mono text-amber-400">{champ.points} Points</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${getAvatarColor(champ.avatar)}`}>
                          {champ.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white leading-tight">{champ.name}</h4>
                          <p className="text-[9px] text-slate-400">Citizen Champion Award</p>
                        </div>
                      </div>

                      <p className="text-[10.5px] text-slate-300 font-sans italic leading-relaxed">
                        "{champ.accomplishment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Live Leaderboard Index + Volunteer Rewards Market (Col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Leaderboard */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-850">
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  Live Hero Leaderboard
                </h3>

                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-850">
                  <button
                    onClick={() => setLeaderboardTab('monthly')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      leaderboardTab === 'monthly'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setLeaderboardTab('lifetime')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      leaderboardTab === 'lifetime'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    Lifetime
                  </button>
                </div>
              </div>

              {/* Competitors List */}
              <div className="space-y-2.5">
                {liveLeaderboard.map((item, idx) => {
                  const isCurrentUser = item.id === (currentUser?.id || 'demo-guest');
                  
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrentUser 
                          ? 'bg-blue-500/10 border-blue-500/55 shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank indicator */}
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                          idx === 0 ? 'bg-amber-500/20 text-amber-600' :
                          idx === 1 ? 'bg-slate-300/30 text-slate-600 dark:text-slate-400' :
                          idx === 2 ? 'bg-amber-700/20 text-amber-700' : 'text-slate-400'
                        }`}>
                          #{item.rank}
                        </div>

                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-extrabold text-sm ${getAvatarColor(item.avatar)}`}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="space-y-0.5 truncate">
                          <h4 className="text-xs font-extrabold text-slate-950 dark:text-white truncate flex items-center gap-1">
                            {item.name}
                            {isCurrentUser && (
                              <span className="text-[8px] bg-blue-500 text-white font-mono uppercase px-1.5 py-0.2 rounded">YOU</span>
                            )}
                          </h4>
                          <p className="text-[9px] font-mono text-slate-400 truncate">
                            {item.resolvedCount} updates resolved
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black font-sans text-slate-900 dark:text-slate-100">{item.points} PTS</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Volunteer Rewards Market */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-500" />
                  Volunteer Rewards Market
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Exchange your reputation points for actual local business rewards and transit vouchers.
                </p>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl flex items-center gap-2 mb-2 font-sans">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Rewards vouchers cards */}
              <div className="space-y-3">
                {rewards.map((reward) => {
                  const canAfford = localPoints >= reward.cost;
                  
                  return (
                    <div 
                      key={reward.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                        reward.isClaimed 
                          ? 'bg-emerald-500/5 border-emerald-500/30' 
                          : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                            {reward.icon}
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">{reward.id}</span>
                            <h4 className="text-xs font-black text-slate-950 dark:text-white leading-tight">{reward.title}</h4>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black font-sans text-amber-500">{reward.cost} PTS</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {reward.description}
                      </p>

                      {/* Claim Action */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-850/60 text-[10px] font-mono">
                        <span className="text-slate-400">Claim Code: <span className="font-bold text-slate-600 dark:text-slate-300">{reward.isClaimed ? reward.couponCode : '••••••••'}</span></span>
                        
                        {reward.isClaimed ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Redeemed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRedeemReward(reward.id)}
                            className={`font-bold font-mono px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                              canAfford 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Redeem Voucher
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

        {/* Redemption Success Dialog overlay */}
        <AnimatePresence>
          {redeemedReward && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 text-center relative"
              >
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setRedeemedReward(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-mono text-xs cursor-pointer"
                  >
                    ✕ CLOSE
                  </button>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-9 h-9 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-emerald-500 uppercase font-black tracking-widest">REDEMPTION SECURED</span>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">{redeemedReward.title}</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Your municipal voucher has been issued successfully. Present this unique voucher code to standard personnel or scan at terminal lines.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-dashed border-emerald-500/30 font-mono">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">PROMOTION VOUCHER CODE</p>
                  <p className="text-lg font-black text-emerald-500 tracking-wider select-all">{redeemedReward.couponCode}</p>
                </div>

                <button
                  onClick={() => setRedeemedReward(null)}
                  className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 rounded-xl font-black text-xs font-mono transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
