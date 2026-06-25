import React, { useState } from 'react';
import { Shield, Send, Check } from 'lucide-react';

interface FooterProps {
  onNavigateToAbout?: () => void;
  onNavigateToContact?: () => void;
}

export default function Footer({ onNavigateToAbout, onNavigateToContact }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-transparent text-slate-600 dark:text-slate-400 py-16 border-t border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top section: Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md shadow-[#051F20]/30">
                <img src="/logo.png" alt="CiviFix Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-slate-900 dark:text-white">
                Civi<span className="text-[#7C3AED]">Fix</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-sans">
              An award-winning decentralized civic-tech utility combining NLP model triage routing with localized community consensus verification nodes. Speeding up city action for happier, safer neighborhoods.
            </p>
          </div>

          {/* Links cols */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-xs text-slate-900 dark:text-slate-900 dark:text-white uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-600 dark:text-slate-400">
              <li><a href="#home" className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors">Hero Entry</a></li>
              <li><a href="#features" className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors">Core Features</a></li>
              <li><a href="#community-map" className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors">Verification Map</a></li>
              <li><a href="#dashboard" className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors">Hero Dashboard</a></li>
              <li><a href="#impact" className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors">Taxpayer Impact</a></li>
              {onNavigateToAbout && (
                <li>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToAbout();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-left font-sans text-xs"
                  >
                    About Us
                  </button>
                </li>
              )}
              {onNavigateToContact && (
                <li>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToContact();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-[#7C3AED] dark:hover:text-slate-900 dark:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-left font-sans text-xs"
                  >
                    Contact Us
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact / Newsletter col */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-semibold text-xs text-slate-900 dark:text-slate-900 dark:text-white uppercase tracking-widest">
              Municipal Newsletter
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Get weekly resolution digests and updates on when Community Hero is expanding to your municipality.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-transparent border border-white/10 focus:border-white/10 rounded-lg text-xs text-slate-900 dark:text-slate-900 dark:text-white outline-none transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#7C3AED] hover:bg-[#7C3AED] text-slate-900 dark:text-white font-sans text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                {subscribed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {subscribed ? 'Joined' : 'Join'}
              </button>
            </form>
          </div>

        </div>

        {/* Sleek Metadata & Mini Testimonial */}
        <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex gap-12 font-sans">
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold mb-1">Built For</p>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">Smart Cities Global 2026</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold mb-1">Civic Tech AI</p>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">v2.0 Stable Release</p>
            </div>
          </div>
          
          <div className="md:col-span-7 flex items-center gap-4 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90/50 border border-white/10 rounded-2xl px-4 py-3">
            <span className="text-lg">📢</span>
            <p className="text-xs italic text-slate-500 dark:text-slate-400 leading-normal font-sans">
              "The AI categorization cut response times by 60% in our ward." <span className="font-bold not-italic text-slate-800 dark:text-slate-900 dark:text-white ml-2">— Mayor Sarah Chen</span>
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-250 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          <span>
            © {new Date().getFullYear()} Community Hero Platform. All rights reserved. Built for Civic Co-creation.
          </span>
          <div className="flex gap-4">
            <span className="hover:text-[#7C3AED] dark:hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#7C3AED] dark:hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#7C3AED] dark:hover:text-slate-400 transition-colors cursor-pointer">Open Government Data</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
