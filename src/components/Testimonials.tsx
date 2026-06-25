import { motion } from 'motion/react';
import { MessageSquare, Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Mayor Olivia Vance',
    role: 'City of Westville Council President',
    quote: "Community Hero has transformed our city operations. By letting AI pre-classify and prioritize incidents, we eliminated over 85% of redundant clerical paperwork and sped up sewer/utilities dispatch from weeks to hours.",
    rating: 5,
    avatar: '🏛️',
  },
  {
    id: 't2',
    name: 'Raymond Gomez',
    role: 'Certified Volunteer Captain',
    quote: "Being a volunteer was frustrating before when we didn't know which reports were real. With Community Hero, neighbors verify each other's reports directly, so when my team goes out, we have 100% confidence.",
    rating: 5,
    avatar: '👷‍♂️',
  },
  {
    id: 't3',
    name: 'Jane Diaz',
    role: 'Oak Street Neighborhood Parent',
    quote: "I reported a giant water main crack right outside the elementary school gate using the AI camera. The system auto-routed the repair within minutes and it was fixed before school let out the next morning. It's magic!",
    rating: 5,
    avatar: '👩',
  }
];

export default function Testimonials() {
  return (
    <section 
      id="testimonials" 
      className="relative py-24 bg-slate-50 dark:bg-transparent border-b border-slate-200 dark:border-slate-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-[#10B981]/10 border border-emerald-200/50 dark:border-[#10B981]/20 rounded-full text-xs font-semibold text-emerald-700 dark:text-[#10B981] font-mono uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            Vetted Community Voice
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-slate-900 dark:text-white tracking-tight">
            Loved by Citizens & Governments
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 font-sans text-sm sm:text-base">
            Read first-hand experiences from community advocates, neighborhood volunteers, and municipal leadership working in harmony.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-slate-200/60 dark:border-white/10/60 rounded-3xl relative flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Decorator icon */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#7C3AED]/10 dark:text-blue-400/5 select-none" />

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans italic">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/10/60 flex items-center gap-3">
                <span className="text-3xl bg-slate-100 dark:bg-[#0A0A0F] p-2.5 rounded-2xl">
                  {testimonial.avatar}
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-950 dark:text-slate-900 dark:text-white leading-none">
                    {testimonial.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mt-1.5 font-sans">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
