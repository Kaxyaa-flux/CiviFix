import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MapPin, Globe, Send, MessageSquare, HelpCircle, 
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, Building2, 
  ExternalLink, ArrowLeft, Twitter, Linkedin, Github, LifeBuoy,
  Clock, ShieldAlert, Sparkles, BookOpen
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  message?: string;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { value: 'report', label: 'Report Dispatch Issue' },
    { value: 'auth', label: 'Authority Partnerships' },
    { value: 'feedback', label: 'General Feedback & Ideas' },
    { value: 'sponsorship', label: 'Sponsorship & Eco-Incentives' },
    { value: 'technical', label: 'Technical Bug Report' },
  ];

  const officeInfo = [
    {
      city: 'San Francisco Headquarters',
      address: '424 Mission St, San Francisco, CA 94105',
      phone: '+1 (415) 555-0192',
      email: 'sf@communityhero.org',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM PST',
    },
    {
      city: 'London Regional Hub',
      address: '80 Old Street, London, EC1V 9HX, UK',
      phone: '+44 20 7946 0958',
      email: 'london@communityhero.org',
      hours: 'Mon - Fri: 9:00 AM - 5:30 PM GMT',
    }
  ];

  const faqs = [
    {
      question: 'How does Community Hero integrate with municipal dispatch teams?',
      answer: 'Our Semantic NLP Engine translates verified peer reports directly into legacy municipal work-order formats (APIs, email dispatches, or structured JSON). We coordinate directly with 45+ city boards to ensure zero redundant processing.'
    },
    {
      question: 'Can any user authenticate incoming incident reports?',
      answer: 'Only peer auditors who have unlocked the "Civic Reputation Level 2" badge can officially vote on validation pools. This preserves high-quality dispatches and completely eliminates fake reports.'
    },
    {
      question: 'Is my personal data shared with government officials when I submit a report?',
      answer: 'No. Community Hero prioritizes user privacy. Reports are dispatched anonymously or pseudonymously, utilizing only aggregated location and metadata unless you explicitly opt to share your contact info for direct follow-up.'
    },
    {
      question: 'How do civic reward credits translate into physical benefits?',
      answer: 'Reputation points and badges unlock micro-grants for local cleanups, direct discounts with green-energy sponsors, and official certificates of civic honors recognized by participating municipalities.'
    },
    {
      question: 'Can I request custom features or sponsor a specific cleanup greenway?',
      answer: 'Yes! Please select "Sponsorship & Eco-Incentives" or "Authority Partnerships" in the contact form, and our regional development leads will schedule a discovery meeting.'
    }
  ];

  const helpCenterCards = [
    {
      title: 'Auditor Documentation',
      description: 'Review our step-by-step handbook on how reports are peer-voted, geotagged, and dispatched.',
      icon: BookOpen,
      actionText: 'View Guides',
      link: '#'
    },
    {
      title: 'Developer Portal',
      description: 'Explore the Open-Data JSON API schemas, Webhook dispatches, and municipality syncing guidelines.',
      icon: LifeBuoy,
      actionText: 'API Docs',
      link: '#'
    },
    {
      title: 'Emergency Services',
      description: 'If you are facing an active emergency or immediate hazard to life, please contact national emergency services immediately.',
      icon: ShieldAlert,
      actionText: 'Urgent Care Info',
      link: '#'
    }
  ];

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    
    // Name validation
    if (!formState.name.trim()) {
      tempErrors.name = 'Full name is required';
    } else if (formState.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formState.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional, but if filled, must resemble standard phone)
    if (formState.phone.trim()) {
      const phoneRegex = /^[+]?[0-9\s-()]{7,15}$/;
      if (!phoneRegex.test(formState.phone)) {
        tempErrors.phone = 'Please enter a valid phone number (7-15 digits)';
      }
    }

    // Category validation
    if (!formState.category) {
      tempErrors.category = 'Please select an inquiry category';
    }

    // Message validation
    if (!formState.message.trim()) {
      tempErrors.message = 'Message content is required';
    } else if (formState.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on write
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-blue-400 hover:border-blue-500/30 hover:shadow-sm transition-all duration-200 cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </button>
            <h1 className="font-display font-extrabold text-4xl text-slate-950 dark:text-white tracking-tight">
              Get in Touch
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl font-sans">
              Connect with our development squad, municipal integration leads, or sustainability team. We usually respond within 24 hours.
            </p>
          </div>
        </div>

        {/* SECTION: TWO COLUMN LAYOUT (Form & Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMN 1: FORM SECTION (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-blue-500/5">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 space-y-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-black uppercase rounded-md tracking-wider">
                      <Sparkles className="w-3 h-3" /> Secure Sync Portal
                    </span>
                    <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                      Send a Secure Message
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                      All communications are protected under zero-trust metadata schemas.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans block">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="Jane Doe"
                          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all ${
                            errors.name 
                              ? 'border-rose-500/60 dark:border-rose-500/40 focus:border-rose-500' 
                              : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.name && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans block">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="jane.doe@example.com"
                          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all ${
                            errors.email 
                              ? 'border-rose-500/60 dark:border-rose-500/40 focus:border-rose-500' 
                              : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.email && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans block">
                          Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formState.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 0192"
                          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all ${
                            errors.phone 
                              ? 'border-rose-500/60 dark:border-rose-500/40 focus:border-rose-500' 
                              : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
                          }`}
                        />
                        {errors.phone && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.phone}
                          </span>
                        )}
                      </div>

                      {/* Category Selection dropdown */}
                      <div className="space-y-1.5">
                        <label htmlFor="category" className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans block">
                          Inquiry Category *
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formState.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all appearance-none ${
                            errors.category 
                              ? 'border-rose-500/60 dark:border-rose-500/40 focus:border-rose-500' 
                              : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
                          }`}
                        >
                          <option value="">Choose category...</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        {errors.category && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message body input */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans block">
                        Message Body *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Please elaborate on your civic request, partnership proposal, or questions..."
                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all resize-none ${
                          errors.message 
                            ? 'border-rose-500/60 dark:border-rose-500/40 focus:border-rose-500' 
                            : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
                        }`}
                      />
                      {errors.message && (
                        <span className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit action button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2563EB] hover:bg-blue-600 disabled:bg-blue-600/70 text-white rounded-xl text-sm font-bold font-sans tracking-wide transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Secure Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="submit-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                      Message Geodispatched!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans max-w-sm mx-auto">
                      Thank you for contributing to your neighborhood. Our regional leads have received your request and will address it promptly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 font-sans text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COLUMN 2: OFFICE INFO, HELP CENTER & SOCIALS (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Box 1: Office Information */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white">
                  Regional Offices
                </h3>
              </div>
              
              <div className="space-y-6 divider-y divide-slate-100 dark:divide-slate-800">
                {officeInfo.map((office, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'pt-6 border-t border-slate-100 dark:border-slate-800/60' : ''} space-y-3.5`}>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase font-mono">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {office.city}
                    </p>
                    <div className="space-y-2 text-xs font-sans text-slate-600 dark:text-slate-400">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{office.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{office.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{office.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{office.hours}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Help Center Portal */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white">
                  Help Center Guides
                </h3>
              </div>

              <div className="space-y-4">
                {helpCenterCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div 
                      key={idx} 
                      className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 hover:border-emerald-500/20 transition-all flex items-start gap-3.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{card.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">{card.description}</p>
                        <a 
                          href={card.link}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-1 hover:underline"
                        >
                          <span>{card.actionText}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box 3: Social Media Links */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="font-display font-bold text-base text-slate-950 dark:text-white">
                  Join our Civic Dialogue
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Help shape our decentralized roadmap across standard community spaces.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <a 
                  href="#" 
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-blue-500/5 hover:border-blue-500/25 border border-slate-150 dark:border-slate-850 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-500"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-[10px] font-bold font-mono uppercase">Twitter</span>
                </a>
                <a 
                  href="#" 
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-blue-600/5 hover:border-blue-600/25 border border-slate-150 dark:border-slate-850 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-[10px] font-bold font-mono uppercase">LinkedIn</span>
                </a>
                <a 
                  href="#" 
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-900/5 hover:border-slate-500/25 border border-slate-150 dark:border-slate-850 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-[10px] font-bold font-mono uppercase">GitHub</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION: FAQ ACCORDION */}
        <div className="space-y-8 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30 rounded-full text-xs font-semibold text-[#2563EB] font-mono uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Answered
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
              Community FAQ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-lg mx-auto">
              Got general inquiries about our dispatch architecture, reputation calculations, or data compliance laws? We have assembled some fast insights.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpened = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-250 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <button
                    onClick={() => setOpenFaq(isOpened ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-sans font-extrabold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {isOpened ? (
                      <ChevronUp className="w-5 h-5 text-[#2563EB] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpened && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans border-t border-slate-100 dark:border-slate-850">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
