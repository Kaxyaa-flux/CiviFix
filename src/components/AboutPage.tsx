import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Eye, Cpu, Zap, Sparkles, TrendingUp, Users, Award, 
  Leaf, Sprout, ShieldCheck, Heart, Github, Linkedin, Twitter, 
  Mail, ArrowLeft, Building2, HelpCircle, ChevronRight, CheckCircle2,
  Globe, Trees, Landmark
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mission' | 'ai' | 'impact' | 'sustainability'>('all');

  const impactGoals = [
    {
      id: 'ig-1',
      title: '60% Faster Dispatches',
      description: 'Redirecting critical incidents from weeks of red-tape to instantaneous routing within minutes.',
      metric: '60%',
      subMetric: 'Speed Improvement',
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-900/30'
    },
    {
      id: 'ig-2',
      title: '1M+ Automated Audits',
      description: 'Aiming to process, verify, and resolve over 1 million neighborhood service requests globally.',
      metric: '1.2M',
      subMetric: 'Reports Audited',
      icon: Cpu,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/30'
    },
    {
      id: 'ig-3',
      title: 'Resilient Ecosystems',
      description: 'Clearing trash corridor runoffs and illegal waste dumps to preserve wildlife greenways.',
      metric: '150+',
      subMetric: 'Hectares Saved',
      icon: Leaf,
      color: 'text-green-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/30'
    },
    {
      id: 'ig-4',
      title: 'Empowered Neighbors',
      description: 'Unlocking municipal-level reputation badges and civic rewards for community audit members.',
      metric: '50K+',
      subMetric: 'Active Heroes',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-900/30'
    }
  ];

  const aiAids = [
    {
      title: 'Semantic NLP Routing',
      description: 'Analyzes messy user descriptions of potholes, pipe leaks, or broken lights, translating them instantly into structured spatial-dispatch parameters.',
      icon: Sparkles,
      tag: 'Triage'
    },
    {
      title: 'Smart Location Grouping',
      description: 'Deduplicates incoming community reports. Avoids municipal double-spending by bundling overlapping complaints into unified tasks.',
      icon: Cpu,
      tag: 'Optimization'
    },
    {
      title: 'Peer Trust Algorithms',
      description: 'Authenticates reports automatically by cross-referencing user reputation, proximity, and historical peer verification sweeps.',
      icon: ShieldCheck,
      tag: 'Consensus'
    }
  ];

  const sustainabilityInits = [
    {
      title: 'Eco-Smart Travel Optimizer',
      description: 'Reduces heavy city diesel vehicle emissions by calculating dynamic, unified routes for municipal repair teams.',
      icon: Sprout,
      benefits: ['Consolidates utility dispatches', 'Saves up to 4.2 tons of monthly fleet CO2', 'Adapts dynamically to traffic/priority']
    },
    {
      title: 'Zero-Paper Civic Audits',
      description: 'Replaces legacy manual reporting clipboards with structured, peer-reviewed, digital ledger-based municipal coordination.',
      icon: Trees,
      benefits: ['Cuts administrative waste', 'Instant open-data verification API', '99.8% physical paper reduction']
    },
    {
      title: 'Decentralized Cleanups',
      description: 'Fosters neighborhood-led micro-cleanups of parks and water bodies by rewarding green-space restorations with civic reputation.',
      icon: Globe,
      benefits: ['Peer-verified cleaning events', 'Direct volunteer notifications', 'Local wildlife greenway restoration']
    }
  ];

  const teamMembers = [
    {
      name: 'Marcus Vance',
      role: 'Co-Founder & Chief Civic Officer',
      bio: 'Former urban planner and Smart Cities Advisor for metropolitan development boards. Dedicated to putting citizens back in the driver seat.',
      image: 'https://picsum.photos/seed/marcus/300/300',
      linkedin: '#',
      twitter: '#',
      github: '#'
    },
    {
      name: 'Dr. Elara Sterling',
      role: 'Chief of AI & Automation',
      bio: 'PhD in Natural Language Processing and deep modeling. Developed custom NLP-routing models to bridge civic gaps and municipal software.',
      image: 'https://picsum.photos/seed/elara/300/300',
      linkedin: '#',
      twitter: '#',
      github: '#'
    },
    {
      name: 'Siddharth Naidu',
      role: 'Head of Community Relations',
      bio: 'Grassroots advocate and expert in decentralized peer networks. Siddhartha coordinates partnerships across over 45 urban municipal boards.',
      image: 'https://picsum.photos/seed/sid/300/300',
      linkedin: '#',
      twitter: '#',
      github: '#'
    },
    {
      name: 'Clara Novak',
      role: 'Director of Sustainability Design',
      bio: 'Environmental systems designer specializing in green urban infrastructure. Spearheads smart-dispatch routing and paperless tracking integrations.',
      image: 'https://picsum.photos/seed/clara/300/300',
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  ];

  const partners = [
    { name: 'Smart Cities Council', icon: Landmark, type: 'Municipal Policy' },
    { name: 'Urban Green Foundation', icon: Trees, type: 'Sustainability Support' },
    { name: 'City Tech Alliance', icon: Cpu, type: 'Open Government Software' },
    { name: 'Metropolitan Water Board', icon: ShieldCheck, type: 'Infrastructure Partner' },
    { name: 'Clean Green Coalition', icon: Sprout, type: 'Grassroots Cleanups' },
    { name: 'Civic Software League', icon: Globe, type: 'Decentralized Tech' }
  ];

  return (
    <div className="pt-32 pb-20 bg-slate-50 dark:bg-transparent transition-colors duration-300 min-h-screen">
      {/* Outer wrapper to contain bento designs & maintain responsiveness */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1.5">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
              className="group inline-flex items-center gap-2 px-3 py-1.5 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-slate-250 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-blue-400 hover:border-white/10/30 hover:shadow-sm transition-all duration-200 cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </button>
            <h1 className="font-display font-extrabold text-4xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
              About Community Hero
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl font-sans">
              Learn about our decentralized civic-tech engine combining machine intelligence with volunteer audits to build smarter, safer, cleaner neighborhoods.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-200/50 dark:bg-[#16161D]/90 p-1 rounded-xl border border-slate-300/40 dark:border-white/10/80">
            {(['all', 'mission', 'ai', 'impact', 'sustainability'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#163832] text-slate-900 dark:text-white shadow-md shadow-[#051F20]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-900 dark:text-white'
                }`}
              >
                {tab === 'all' ? 'View All' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: HERO BANNER / CORE VISION */}
        <AnimatePresence mode="popLayout">
          {(activeTab === 'all' || activeTab === 'mission') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Mission Bento Card */}
              <div className="lg:col-span-7 p-8 sm:p-10 bg-gradient-to-tr from-blue-600 to-indigo-700 text-slate-900 dark:text-white rounded-3xl relative overflow-hidden shadow-2xl shadow-[#051F20]/30 flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Target className="w-48 h-48" />
                </div>
                
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#16161D]/90 backdrop-blur-md/10 border border-white/20 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider">
                    <Target className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    Our Core Mission
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none">
                    Empowering Neighbors to Co-Create Safe Smart Cities.
                  </h2>
                  <p className="text-sm sm:text-base text-blue-100 font-sans leading-relaxed">
                    Community Hero bridges the critical gap between neighborhood issues and slow municipal operations. By putting an AI incident routing assistant and peer validation directly in the hands of the community, we shorten typical city resolution cycles from weeks to minutes.
                  </p>
                </div>

                <div className="pt-8 border-t border-white/15 grid grid-cols-2 gap-4 mt-8 sm:mt-12">
                  <div className="space-y-1">
                    <p className="text-2xl font-black font-display text-amber-300">2 Hours</p>
                    <p className="text-xs text-blue-100">Average Dispatched Lead Time</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black font-display text-emerald-300">4.3K+</p>
                    <p className="text-xs text-blue-100">Active Peer Auditors</p>
                  </div>
                </div>
              </div>

              {/* Vision Bento Card */}
              <div className="lg:col-span-5 p-8 sm:p-10 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-3xl flex flex-col justify-between hover:shadow-xl dark:hover:shadow-[#051F20]/30 transition-all duration-300">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 rounded-full text-[10px] font-extrabold text-emerald-700 dark:text-green-400 uppercase font-mono tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    Our Vision
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight leading-tight">
                    Zero Bureaucracy, Pure Civic Collaboration
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    We envision decentralized municipal ecosystems where city officials, dispatch teams, and active residents cooperate on a single synchronized ledger of truth. 
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    No phone queues, no paper forms, no delayed decisions. Instead, neighborhoods leverage automated routing engines and rewards to restore public parks, fix broken mains, and map safety in real-time.
                  </p>
                </div>

                <div className="pt-6 flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 bg-green-500/10 text-green-500 dark:text-green-400 rounded-xl flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-900 dark:text-white">Citizen-Led Governance</p>
                    <p className="text-[10px] text-slate-400">Decentralized municipal action & civic rewards</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION: HOW AI HELPS */}
        <AnimatePresence mode="popLayout">
          {(activeTab === 'all' || activeTab === 'ai') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* AI Sub-header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/30 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-400 font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Machine Intelligence
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
                  How AI Accelerates Our Communities
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
                  By utilizing sophisticated processing models, Community Hero transforms raw civic feedback into actionable dispatches without human bottlenecks.
                </p>
              </div>

              {/* AI Features grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiAids.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-6 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-2xl space-y-4 hover:shadow-lg hover:border-purple-500/20 dark:hover:border-purple-500/10 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <span className="inline-block px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[9px] font-black uppercase rounded">
                          {item.tag}
                        </span>
                        <h3 className="font-display font-bold text-lg text-slate-950 dark:text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                      <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                        <span className="text-[10px] text-slate-400 font-mono uppercase">ENGINE v2.4</span>
                        <Icon className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION: IMPACT GOALS */}
        <AnimatePresence mode="popLayout">
          {(activeTab === 'all' || activeTab === 'impact') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Impact Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/30 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 font-mono uppercase">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Impact Goals
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
                    Our Direct 2026 Objectives
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg font-sans">
                    We track tangible, measurable milestones. Every automated report triage, municipal dispatch optimization, and peer audit count directly towards these global civic milestones.
                  </p>
                </div>
              </div>

              {/* Goals Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {impactGoals.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <div
                      key={goal.id}
                      className={`p-6 border rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md ${goal.bgColor}`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-3xl font-black font-display tracking-tight text-slate-950 dark:text-slate-900 dark:text-white">
                            {goal.metric}
                          </span>
                          <Icon className={`w-5 h-5 ${goal.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-0.5">{goal.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200/30 dark:border-white/10/30 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                        <span>TARGET: Q4 2026</span>
                        <span className="font-extrabold">{goal.subMetric}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION: SUSTAINABILITY INITIATIVES */}
        <AnimatePresence mode="popLayout">
          {(activeTab === 'all' || activeTab === 'sustainability') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Sustainability Header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 rounded-full text-xs font-semibold text-emerald-700 dark:text-green-400 font-mono uppercase">
                  <Leaf className="w-3.5 h-3.5" />
                  Eco-Friendly Civic-Tech
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
                  Sustainability Initiatives
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
                  Civic repair is environmental conservation. Our smart dispatch model cuts vehicle emissions, streamlines trash management, and reduces administrative waste.
                </p>
              </div>

              {/* Sustainability Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {sustainabilityInits.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:border-green-500/20 dark:hover:border-green-500/10 transition-all duration-300"
                    >
                      <div className="space-y-6">
                        <div className="w-12 h-12 bg-green-500/10 text-emerald-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-display font-bold text-lg text-slate-950 dark:text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 space-y-2">
                        <p className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider">Benefits & Outcomes</p>
                        <ul className="space-y-1.5">
                          {item.benefits.map((benefit, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION: TEAM SECTION */}
        <AnimatePresence mode="popLayout">
          {activeTab === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Team Header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-400 font-mono uppercase">
                  <Users className="w-3.5 h-3.5" />
                  Civic Creators
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
                  Meet the Innovators Behind Community Hero
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
                  A multi-disciplinary group of civic advocates, AI developers, and urban planning advisors building modern government technology.
                </p>
              </div>

              {/* Team Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-[#051F20]/30 hover:border-blue-300 dark:hover:border-blue-900 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Member image with dark zoom overlay */}
                    <div className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-[#0A0A0F]">
                      <img
                        src={member.image}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60"></div>
                      
                      {/* Floating social card inside image hover */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-300 font-medium truncate">{member.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans flex-1">
                        {member.bio}
                      </p>
                      
                      {/* Socials Link Row */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3">
                        <a href={member.linkedin} className="text-slate-400 hover:text-[#7C3AED] dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a href={member.twitter} className="text-slate-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a href={member.github} className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white transition-colors" aria-label="GitHub">
                          <Github className="w-4 h-4" />
                        </a>
                        <a href={`mailto:hello@example.com`} className="text-slate-400 hover:text-red-500 transition-colors ml-auto" aria-label="Email">
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION: COMMUNITY PARTNERS */}
        <AnimatePresence mode="popLayout">
          {activeTab === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Partners Header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 rounded-full text-xs font-semibold text-emerald-700 dark:text-green-400 font-mono uppercase">
                  <HandshakeIcon className="w-3.5 h-3.5" />
                  Civic Network
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
                  Trusted by Forward-Thinking Partners
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
                  We collaborate directly with smart municipalities, green infrastructure alliances, and civic engineering networks to implement verified resolution channels.
                </p>
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {partners.map((partner, idx) => {
                  const Icon = partner.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-2xl flex flex-col items-center text-center justify-center hover:border-green-500/30 dark:hover:border-green-500/20 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-slate-50 dark:bg-transparent text-slate-450 dark:text-slate-500 group-hover:text-green-500 dark:group-hover:text-green-400 group-hover:bg-green-500/10 rounded-xl flex items-center justify-center transition-all duration-350 mb-3 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100 line-clamp-1 mb-0.5">{partner.name}</p>
                      <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{partner.type}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Banner Section */}
        <div className="p-8 sm:p-12 bg-slate-900 dark:bg-[#0A0A0F] border border-slate-850 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#163832]/10 rounded-full blur-3xl opacity-50 -z-10 translate-y-[-50%] translate-x-[-50%]"></div>
          <div className="space-y-3 max-w-xl">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              Ready to restore your neighborhood?
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Join thousands of active volunteers, municipal crews, and neighborhood advocates who use Community Hero every day to speed up city action and clean streets.
            </p>
          </div>
          <button
            onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
            className="px-6 py-3 bg-[#163832] hover:bg-[#7C3AED] text-slate-900 dark:text-white font-sans text-sm font-bold rounded-xl shadow-lg shadow-[#051F20]/30 transition-all duration-200 transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
          >
            Explore Active Reports
          </button>
        </div>

      </div>
    </div>
  );
}

// Temporary SVG helper for Handshake since standard Lucide has it as Handshake
function HandshakeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4l-2-2" />
      <path d="m18 10.1 2.9-2.9a1 1 0 0 0 0-1.4l-4-4a1 1 0 0 0-1.4 0L12.6 5" />
      <path d="m9.7 12.5-4.8-4.8a1 1 0 0 0-1.4 0l-1 1a1 1 0 0 0 0 1.4l4.8 4.8" />
      <path d="m5 17 2 2a1 1 0 0 0 1.4 0l3-3" />
      <path d="m14 12 1.5 1.5" />
      <path d="m17 11-1.5-1.5" />
    </svg>
  );
}
