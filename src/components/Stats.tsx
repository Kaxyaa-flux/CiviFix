import { motion } from 'motion/react';
import { FileText, CheckCircle2, Users, Award, ArrowUpRight } from 'lucide-react';
import { CivicStats } from '../types';

interface StatsProps {
  stats: CivicStats;
}

export default function Stats({ stats }: StatsProps) {
  const statsList = [
    {
      id: 'reported',
      name: 'Issues Reported',
      value: stats.issuesReported.toLocaleString(),
      change: '+14% this week',
      icon: FileText,
      color: 'text-[#2563EB]',
      bgColor: 'bg-[#2563EB]/10',
      borderColor: 'border-slate-200 dark:border-[#1E293B]'
    },
    {
      id: 'resolved',
      name: 'Issues Resolved',
      value: stats.issuesResolved.toLocaleString(),
      change: '98.2% Resolution Rate',
      icon: CheckCircle2,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
      borderColor: 'border-slate-200 dark:border-[#1E293B]'
    },
    {
      id: 'volunteers',
      name: 'Active Volunteers',
      value: stats.activeVolunteers.toLocaleString(),
      change: '+38 joined today',
      icon: Users,
      color: 'text-[#2563EB]',
      bgColor: 'bg-[#2563EB]/10',
      borderColor: 'border-slate-200 dark:border-[#1E293B]'
    },
    {
      id: 'score',
      name: 'Community Impact Score',
      value: `${stats.impactScore.toFixed(1)}%`,
      change: '+1.4% Monthly Gain',
      icon: Award,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
      borderColor: 'border-slate-200 dark:border-[#1E293B] border-b-2 border-b-[#10B981]'
    }
  ];

  return (
    <section className="relative py-12 bg-slate-50 dark:bg-[#020617] border-y border-slate-200 dark:border-[#1E293B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-6 bg-white dark:bg-[#0F172A] border ${stat.borderColor} rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Verified Metric
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </span>
                </div>

                <div className="mt-5 space-y-1">
                  <span className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {stat.name}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-mono font-bold text-[#10B981]">
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
