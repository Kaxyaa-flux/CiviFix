import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertTriangle, Cpu, ShieldCheck, MapPin, 
  Sparkles, Send, UploadCloud, Users, HelpCircle 
} from 'lucide-react';
import { CivicIssue, User } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newIssue: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'timeline'> & { images?: File[] }) => void;
  currentUser?: User | null;
}

export default function ReportModal({ isOpen, onClose, onSubmit, currentUser }: ReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('Auto-Detect');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [coords, setCoords] = useState({ lat: 37.7749, lng: -122.4194 }); // default to SF
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    detectedCategory: string;
    suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    department: string;
    volunteersAvailable: number;
  } | null>(null);

  const startAiAnalysis = async () => {
    if (!title || !description || !locationName) return;
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAiAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      setAnalysisStep(2);
      const data = await response.json();
      setAnalysisStep(4);
      
      let prio: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (data.severity >= 9) prio = 'critical';
      else if (data.severity >= 7) prio = 'high';
      else if (data.severity >= 4) prio = 'medium';

      setCategory(data.category);
      setPriority(prio);

      setAiAnalysisResult({
        detectedCategory: data.category,
        suggestedPriority: prio,
        confidence: Math.round(data.confidence),
        department: data.department,
        volunteersAvailable: Math.floor(Math.random() * 5) + 1,
      });
    } catch (err) {
      console.error(err);
      // fallback
      setCategory('General Civic');
      setPriority('medium');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description || !locationName) return;

    onSubmit({
      title,
      description,
      locationName,
      category: category === 'Auto-Detect' ? 'General Civic' : category,
      priority,
      status: 'verified',
      coordinates: coords,
      reporterName: currentUser ? currentUser.fullName : "Guest Citizen",
      images: uploadedFiles,
    });

    setTitle('');
    setDescription('');
    setLocationName('');
    setCategory('Auto-Detect');
    setPriority('medium');
    setUploadedFiles([]);
    setAiAnalysisResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-3xl max-h-[90vh] bg-slate-50 dark:bg-[#0A0A0F] rounded-2xl shadow-2xl border border-white/10 overflow-y-auto z-10">
        <div className="sticky top-0 bg-slate-50 dark:bg-[#0A0A0F] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-[#7C3AED] rounded-lg"><Sparkles className="w-5 h-5" /></div>
            <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white">AI-Powered Civic Incident Reporter</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Incident Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 focus:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Detailed Description *</label>
                  <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 focus:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location / Landmark Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="text" required value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-[#16161D]/90 backdrop-blur-md dark:bg-[#16161D]/90 border border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                    <input type="number" step="0.000001" value={coords.lat} onChange={(e) => setCoords({...coords, lat: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-[#16161D]/90 dark:bg-slate-900 border border-white/10 rounded-xl text-slate-900 dark:text-white text-xs outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                    <input type="number" step="0.000001" value={coords.lng} onChange={(e) => setCoords({...coords, lng: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-[#16161D]/90 dark:bg-slate-900 border border-white/10 rounded-xl text-slate-900 dark:text-white text-xs outline-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-4 flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Attach Photo Evidence (Optional)</label>
                  <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${uploadedFiles.length > 0 ? 'border-green-500 bg-emerald-50/20' : 'border-slate-300 dark:border-white/10'}`}>
                    <UploadCloud className={`w-8 h-8 mb-2 ${uploadedFiles.length > 0 ? 'text-green-500' : 'text-slate-400'}`} />
                    {uploadedFiles.length > 0 ? (
                      <span className="text-sm font-semibold text-emerald-600 block">{uploadedFiles.length} file(s) selected</span>
                    ) : (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Drag & Drop or Click to Upload</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  {!aiAnalysisResult && !isAnalyzing && (
                    <button type="button" disabled={!title || !description || !locationName} onClick={startAiAnalysis} className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-[#7C3AED] dark:hover:bg-[#7C3AED] text-slate-900 dark:text-white font-sans text-sm font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer"><Sparkles className="w-4 h-4 animate-bounce" /> Verify Report with Community AI</button>
                  )}
                  {isAnalyzing && (
                    <div className="bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#7C3AED]"><span className="flex items-center gap-2"><Cpu className="w-4 h-4 animate-spin" /> RUNNING NEURAL MODEL</span></div>
                    </div>
                  )}
                  {aiAnalysisResult && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-200/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-600"><span className="flex items-center gap-1.5"><ShieldCheck className="w-4.5 h-4.5" /> AI PRE-VERIFICATION COMPLETE</span></div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <div><span className="text-[10px] text-slate-400 block uppercase font-semibold">Auto-Category</span><span className="font-semibold text-slate-900 dark:text-white">{aiAnalysisResult.detectedCategory}</span></div>
                        <div><span className="text-[10px] text-slate-400 block uppercase font-semibold">Suggested Severity</span><span className="font-bold capitalize">{aiAnalysisResult.suggestedPriority}</span></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-5 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> Validators filter fake items.</div>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2.5 border border-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-sans text-sm cursor-pointer">Cancel</button>
                <button type="submit" disabled={!title || !description || !locationName || isAnalyzing} className="px-5 py-2.5 bg-[#163832] hover:bg-[#0B2B26] text-slate-900 dark:text-white font-sans text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"><Send className="w-4 h-4" /> Submit Official Incident</button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
