import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Zap, Users, MessageSquareCode, BarChart3 } from 'lucide-react';

const FEATURE_LIST = [
  {
    id: 'f1',
    title: 'AI Incident Classifier',
    description: 'Instantly processes text and imagery reports. Employs advanced NLP models to calculate confidence ratings, identify categories, and coordinate dispatch.',
    icon: Cpu,
    color: 'text-[#8B5CF6]',
    bgColor: 'bg-[#8B5CF6]/10',
  },
  {
    id: 'f2',
    title: 'Crowdsourced Trust Network',
    description: 'Avoids duplicates and invalid reports through a secure peer-to-peer validation mechanism that rewards active neighbors with civic badges.',
    icon: ShieldCheck,
    color: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
  },
  {
    id: 'f3',
    title: 'Automated Smart Dispatch',
    description: 'Bypasses legacy municipal backlogs. Connects hazardous reports directly to active city road crews and water maintenance technicians.',
    icon: Zap,
    color: 'text-[#8EB69B]',
    bgColor: 'bg-[#163832]/10',
  },
  {
    id: 'f4',
    title: 'Community Mobilization',
    description: 'Broadcasts urgent location alerts to nearby volunteer circles, allowing citizens to self-organize for small debris clearance.',
    icon: Users,
    color: 'text-[#8EB69B]',
    bgColor: 'bg-[#163832]/10',
  },
  {
    id: 'f5',
    title: 'Predictive Analytics Node',
    description: 'Employs AI algorithms to study historical defect data, predicting utility failure nodes and advising preventive infrastructure upkeep.',
    icon: MessageSquareCode,
    color: 'text-[#8B5CF6]',
    bgColor: 'bg-[#8B5CF6]/10',
  },
  {
    id: 'f6',
    title: 'Impact Auditing & Statistics',
    description: 'Tracks precise resolution timelines and public budget conservation. Generates visual compliance audits for municipal agencies.',
    icon: BarChart3,
    color: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
  },
];

export default function Features() {
  return (
    <section 
      id="features" 
      className="relative py-24 bg-[#DAF1DE]/20 dark:bg-[#051F20] border-b border-[#E2E8F0] dark:border-[#1E293B] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#163832]/10 border border-[#235347]/20 rounded-full text-xs font-semibold text-[#8EB69B] font-mono uppercase">
            <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Cutting-Edge Civic Tech
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Designed to Scale Municipal Action
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 font-sans text-sm sm:text-base">
            Engineered to overcome bureaucratic overhead. CiviFix leverages advanced AI classification and community consensus to accelerate local civic response by over 90%.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURE_LIST.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl flex flex-col justify-between hover:shadow-xl dark:hover:shadow-[#051F20]/30 hover:border-[#235347]/50 dark:hover:border-[#235347]/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
