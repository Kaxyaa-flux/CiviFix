import { motion } from 'motion/react';
import { Sparkles, MapPin, CheckCircle, Shield, FileText, ArrowRight, Activity, BellRing, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenReportModal: () => void;
  onExploreMap: () => void;
}

export default function Hero({ onOpenReportModal, onExploreMap }: HeroProps) {
  // Stagger configurations for entrance animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 16 },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] pt-40 pb-20 flex items-center justify-center overflow-hidden text-[#F8FAFC] aurora-bg"
    >
      {/* Background Gradient Mesh */}
      <div 
        className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.35) 0%, transparent 50%)'
        }}
      />

      {/* Stunning Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating background elements */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-24 left-[10%] w-32 h-32 bg-gradient-to-tr from-[#7C3AED]/40 to-[#22D3EE]/30 rounded-full blur-2xl pointer-events-none"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-[15%] w-48 h-48 bg-gradient-to-br from-[#EC4899]/30 to-[#7C3AED]/40 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating Civic Glass Elements */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-40 right-[10%] hidden xl:flex items-center gap-3 glass-card-aurora p-3 rounded-2xl pointer-events-none z-20"
      >
        <div className="w-8 h-8 rounded-full bg-[#22C55E]/15 flex items-center justify-center text-[#22C55E]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-mono">RESOLVED YESTERDAY</p>
          <p className="text-xs font-bold font-sans text-slate-100">Pothole fixed on Oak Ave</p>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-32 left-[8%] hidden xl:flex items-center gap-3 glass-card-aurora p-3 rounded-2xl pointer-events-none z-20"
      >
        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/15 flex items-center justify-center text-[#7C3AED]">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-mono">AI DESPATCH CONSENSUS</p>
          <p className="text-xs font-bold font-sans text-slate-100">98.4% Confidence Score</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card-aurora text-xs font-semibold w-fit mx-auto lg:mx-0 shadow-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
              </span>
              <span className="font-mono tracking-wider text-slate-300">CiviFix • Next-Gen Response</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tighter"
            >
              See It. Report It. <br />
              <span className="text-gradient-aurora drop-shadow-md pb-2">
                Fix It Faster.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal"
            >
              The premier AI-powered community problem solving platform. Empowering citizens to flag safety hazards and infrastructure failures with instant routing to municipal dispatch crews.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={onOpenReportModal}
                className="w-full sm:w-auto px-8 py-4 btn-aurora-glow font-sans font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Report An Issue
              </button>

              <button
                onClick={onExploreMap}
                className="w-full sm:w-auto px-8 py-4 glass-card-aurora hover:border-[#22D3EE]/50 hover:text-[#22D3EE] text-white font-sans font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Explore Live Map
              </button>
            </motion.div>

            {/* Success Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                Government-Grade
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <Shield className="w-4 h-4 text-[#22D3EE]" />
                AI Dispatch Integration
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Showcase (Premium Aurora Card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.3 }}
            className="lg:col-span-5 relative w-full h-[480px] flex items-center justify-center"
          >
            {/* The Stunning Gradient Backdrop Card */}
            <div 
              className="absolute inset-0 rounded-[2.5rem] opacity-40 blur-2xl transform scale-95"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)'
              }}
            />

            {/* Main Holographic Interactive Mockup Container */}
            <div 
              className="relative w-full max-w-sm rounded-3xl p-[1px] overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.6), rgba(236, 72, 153, 0.4))'
              }}
            >
              <div className="bg-[#0A0A0F]/95 backdrop-blur-2xl rounded-[23px] p-6 space-y-6">
                
                {/* Window Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#FF5A5F] rounded-full inline-block"></span>
                    <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full inline-block"></span>
                    <span className="w-2.5 h-2.5 bg-[#22C55E] rounded-full inline-block"></span>
                    <span className="ml-2 font-mono text-[9px] text-slate-500 uppercase tracking-widest">CIVIFIX CORE</span>
                  </div>
                  <span className="text-[10px] bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-ping"></span>
                    LIVE FEED
                  </span>
                </div>

                {/* Simulated AI Action Card */}
                <div className="bg-[#16161D]/90 border border-[#7C3AED]/20 rounded-2xl p-4.5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#7C3AED]/20 to-transparent pointer-events-none" />

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl flex items-center justify-center text-[#7C3AED]">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-100">Hazard Verified</h3>
                      <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        Aurora District
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-[#7C3AED]/20 text-[#D8B4FE] border border-[#7C3AED]/40 text-[9px] px-2 py-0.5 rounded-md font-mono">
                      AI Categorized
                    </span>
                    <span className="bg-[#EC4899]/20 text-[#F9A8D4] border border-[#EC4899]/40 text-[9px] px-2 py-0.5 rounded-md font-mono">
                      Critical Priority
                    </span>
                  </div>

                  <div className="border-t border-[#7C3AED]/20 pt-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">Confidence Score</span>
                      <span className="font-mono text-[#22D3EE] font-bold">99.9%</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0A0F] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "99.9%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]"
                      />
                    </div>
                  </div>
                </div>

                {/* Dispatch card */}
                <div className="glass-card-aurora rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-100">Crews Dispatched</h4>
                      <p className="text-[10px] text-slate-400">Response Team Alpha</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    EN ROUTE
                  </span>
                </div>

                {/* Performance stats summary */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="glass-card-aurora p-3 rounded-xl text-center">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">Avg ETA</span>
                    <span className="text-sm font-display font-black text-slate-900 dark:text-white">12 Mins</span>
                  </div>
                  <div className="glass-card-aurora p-3 rounded-xl text-center">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">Impact Score</span>
                    <span className="text-sm font-display font-black text-[#22D3EE]">94.2k</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Glowing background halo of colors */}
            <div className="absolute -z-10 w-72 h-72 bg-gradient-to-r from-[#7C3AED]/20 to-[#EC4899]/20 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
