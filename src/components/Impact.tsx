import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Zap, DollarSign, Hourglass, TrendingUp } from 'lucide-react';

export default function Impact() {
  const [population, setPopulation] = useState(150000); // default 150k citizens

  // Calculate simulated savings based on population size
  const calculateSavings = () => {
    const monthlyReports = Math.round(population * 0.008); // 0.8% of citizens report something per month
    const hoursSavedPerReport = 42; // legacy 44 hours vs modern 2 hours
    const staffHoursSaved = monthlyReports * hoursSavedPerReport;
    const dollarsSaved = Math.round(staffHoursSaved * 35); // $35/hr labor cost

    return {
      monthlyReports,
      staffHoursSaved: staffHoursSaved.toLocaleString(),
      dollarsSaved: dollarsSaved.toLocaleString(),
      speedFactor: "18x Faster"
    };
  };

  const savings = calculateSavings();

  return (
    <section 
      id="impact" 
      className="relative py-24 bg-[#DAF1DE]/20 dark:bg-[#051F20] border-b border-slate-200 dark:border-slate-900 transition-colors duration-300"
    >
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8EB69B]/5 dark:bg-[#8EB69B]/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-[#163832]/10 border border-blue-200/50 dark:border-[#235347]/20 rounded-full text-xs font-semibold text-blue-700 dark:text-[#8EB69B] font-mono uppercase">
            <TrendingUp className="w-3.5 h-3.5" />
            Quantifiable Citizen Impact
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
            Unprecedented Operational Performance
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 font-sans text-sm sm:text-base">
            See the direct, measurable speedup in civic response and municipal financial savings. Community Hero bypasses structural friction to solve real issues.
          </p>
        </div>

        {/* Visual Comparisons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Comparison speed meters */}
          <div className="bg-[#DAF1DE]/30 dark:bg-[#0B2B26]/60 border border-slate-200/60 dark:border-[#163832]/60 p-8 rounded-3xl space-y-8 shadow-xs">
            <h3 className="font-display font-bold text-xl text-slate-950 dark:text-white">
              Resolution Speed Breakdown
            </h3>

            {/* Legacy meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-red-400" />
                  Legacy Municipal Hotline (311 / Emails)
                </span>
                <span className="font-mono text-sm font-bold text-red-500">14 Days Avg</span>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-400/85 dark:bg-red-500/80 rounded-full w-full"></div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Includes: Manual triage desk routing, duplicate reviews, pending budget assignments, backlogs.
              </p>
            </div>

            {/* Community Hero meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-500 animate-bounce" />
                  Community Hero AI Routing
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-500">12.4 Hours Avg</span>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  whileInView={{ width: '4.5%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full min-w-[20px]"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Includes: Instant NLP routing classification, decentralized citizen validation networks, live GPS responder dispatches.
              </p>
            </div>
          </div>

          {/* Interactive Savings Calculator */}
          <div className="bg-[#DAF1DE]/30 dark:bg-[#0B2B26]/60 border border-slate-200/60 dark:border-[#163832]/60 p-8 rounded-3xl space-y-6 shadow-xs">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-950 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-[#8EB69B]" />
                Municipal Savings Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Drag the slider to match your target municipality's citizen population and witness the automated savings index:
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-400 dark:text-slate-500">POPULATION SIZE</span>
                <span className="text-[#8EB69B] dark:text-blue-400">{population.toLocaleString()} Citizens</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Calculator Outputs */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Dollar savings */}
              <div className="p-4 bg-[#DAF1DE]/20 dark:bg-[#051F20] border border-slate-100 dark:border-slate-850 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Estimated Taxpayer Saving</span>
                <div className="flex items-center gap-0.5 mt-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-xl font-display font-extrabold text-slate-950 dark:text-white">
                    {savings.dollarsSaved}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono block mt-1">dollars saved per month</span>
              </div>

              {/* Hours Saved */}
              <div className="p-4 bg-[#DAF1DE]/20 dark:bg-[#051F20] border border-slate-100 dark:border-slate-850 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Operational Hours Saved</span>
                <div className="flex items-center gap-1 mt-1">
                  <Hourglass className="w-4 h-4 text-[#8EB69B]" />
                  <span className="text-xl font-display font-extrabold text-slate-950 dark:text-white">
                    {savings.staffHoursSaved}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono block mt-1">staff hours saved per month</span>
              </div>

            </div>

            <div className="text-center font-mono text-xs text-[#8EB69B] bg-blue-50 dark:bg-[#163832]/10 py-2.5 rounded-xl border border-blue-100/50 dark:border-blue-800/60 font-bold">
              ⚡ Resolution Speed Up Index: {savings.speedFactor}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
