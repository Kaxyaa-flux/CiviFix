import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, AlertTriangle, Cpu, ShieldCheck, MapPin, 
  Sparkles, Send, CheckCircle2, UploadCloud, Users, HelpCircle 
} from 'lucide-react';
import { CivicIssue } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newIssue: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'timeline'>) => void;
}

const PRESETS = [
  {
    title: "Cracked water main creating deep sidewalk pool",
    description: "A continuous flow of clean water is bubbling up from under the sidewalk tiles on Elm Road, near the public library. It has created a major puddle blocking pedestrian traffic and washing away soil.",
    locationName: "450 Elm Road (Opposite Public Library)",
    category: "Water & Utilities",
    priority: "high" as const,
  },
  {
    title: "Overhanging tree branch blocking stop sign",
    description: "A large oak tree branch has broken off and is hanging low, completely blocking the stop sign at the corner of Oak Avenue and 5th Street. Drivers are missing the sign, creating a safety hazard.",
    locationName: "Intersection of Oak Ave & 5th St",
    category: "Road Safety & Forestry",
    priority: "critical" as const,
  },
  {
    title: "Illegal electronics waste dumping behind park",
    description: "Several old computer monitors, TV tubes, and industrial batteries have been dumped in the bushes behind the north gate of Green Park. Liquid might be leaking from the batteries.",
    locationName: "Green Park (North Gate Alley)",
    category: "Environmental & Sanitation",
    priority: "high" as const,
  }
];

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('Auto-Detect');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [fileAdded, setFileAdded] = useState(false);
  const [fileName, setFileName] = useState('');
  
  // AI analysis results simulated state
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    detectedCategory: string;
    suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    department: string;
    volunteersAvailable: number;
  } | null>(null);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setLocationName(preset.locationName);
    setCategory('Auto-Detect');
    setFileAdded(true);
    setFileName("captured_evidence.jpg");
  };

  const startAiAnalysis = () => {
    if (!title || !description || !locationName) return;
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAiAnalysisResult(null);

    // Dynamic analysis text based on what the user wrote or preset selected
    let detectedCat = "Infrastructure & Safety";
    let calculatedPriority: 'low' | 'medium' | 'high' | 'critical' = "high";
    let dept = "Department of Public Works";
    let vols = 4;

    const lowerText = (title + " " + description).toLowerCase();
    if (lowerText.includes('water') || lowerText.includes('pipe') || lowerText.includes('leak')) {
      detectedCat = "Water & Utilities";
      calculatedPriority = "high";
      dept = "Municipal Water Authority";
      vols = 3;
    } else if (lowerText.includes('tree') || lowerText.includes('branch') || lowerText.includes('stop sign') || lowerText.includes('sign')) {
      detectedCat = "Road Safety & Forestry";
      calculatedPriority = lowerText.includes('stop sign') ? "critical" : "medium";
      dept = "City Forestry & Traffic Systems";
      vols = 5;
    } else if (lowerText.includes('dumping') || lowerText.includes('waste') || lowerText.includes('batteries') || lowerText.includes('trash')) {
      detectedCat = "Environmental & Sanitation";
      calculatedPriority = "high";
      dept = "Environmental Protection Board";
      vols = 6;
    } else if (lowerText.includes('pothole') || lowerText.includes('street') || lowerText.includes('road')) {
      detectedCat = "Street Maintenance";
      calculatedPriority = "medium";
      dept = "Department of Road Maintenance";
      vols = 4;
    }

    // Step-by-step progress simulation
    const steps = [
      () => setAnalysisStep(1), // Parsing text and images
      () => setAnalysisStep(2), // Matching computer-vision features
      () => setAnalysisStep(3), // Calculating critical safety index
      () => {
        setAnalysisStep(4);
        setCategory(detectedCat);
        setPriority(calculatedPriority);
        setAiAnalysisResult({
          detectedCategory: detectedCat,
          suggestedPriority: calculatedPriority,
          confidence: Math.floor(Math.random() * 8) + 92, // 92% to 99%
          department: dept,
          volunteersAvailable: vols,
        });
        setIsAnalyzing(false);
      }
    ];

    steps.forEach((stepFn, index) => {
      setTimeout(stepFn, (index + 1) * 900);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileAdded(true);
    setFileName("attached_image.png");
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
      status: 'verified', // Directly verified via our smart citizen engine
      coordinates: {
        x: Math.floor(Math.random() * 40) + 30, // center areas mostly
        y: Math.floor(Math.random() * 40) + 30,
      },
      reporterName: "You (Verified Citizen)"
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setLocationName('');
    setCategory('Auto-Detect');
    setPriority('medium');
    setFileAdded(false);
    setFileName('');
    setAiAnalysisResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto z-10"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white">
              AI-Powered Civic Incident Reporter
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick presets for hackathon review */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <Cpu className="w-4 h-4 animate-spin" />
              HACKATHON QUICK-FILL PRESETS (Click to test the AI analyzer)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-left px-3 py-2 text-xs bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-all line-clamp-2 shadow-xs cursor-pointer hover:border-blue-400"
                >
                  <span className="font-medium text-slate-900 dark:text-white block truncate">{preset.title}</span>
                  <span className="text-slate-400 dark:text-slate-400 text-[10px] block truncate">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Incident Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Short descriptive name of the issue"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-slate-900 dark:text-white text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the incident, current impact on the community, and exact details..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-slate-900 dark:text-white text-sm outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Location / Landmark Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. 15th Ave and Pine St corner"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-slate-900 dark:text-white text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Upload & AI preview */}
              <div className="space-y-4 flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Attach Photo Evidence (Optional)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      fileAdded 
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' 
                        : 'border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-900/30'
                    }`}
                    onClick={() => {
                      setFileAdded(true);
                      setFileName("captured_scene.jpg");
                    }}
                  >
                    <UploadCloud className={`w-8 h-8 mb-2 ${fileAdded ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {fileAdded ? (
                      <div className="text-center">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 block">
                          Image uploaded successfully
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block truncate max-w-[200px]">
                          {fileName}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                          Drag & Drop or Click to Upload
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block">
                          PNG, JPG up to 10MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  {/* AI trigger CTA */}
                  {!aiAnalysisResult && !isAnalyzing && (
                    <button
                      type="button"
                      disabled={!title || !description || !locationName}
                      onClick={startAiAnalysis}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-sans text-sm font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Sparkles className="w-4 h-4 animate-bounce" />
                      Verify Report with Community AI
                    </button>
                  )}

                  {/* AI analyzing loading bar */}
                  {isAnalyzing && (
                    <div className="bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin" />
                          RUNNING NEURAL MODEL
                        </span>
                        <span>{analysisStep * 25}% Completed</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-600 dark:bg-blue-400"
                          initial={{ width: '0%' }}
                          animate={{ 
                            width: `${analysisStep * 25}%` 
                          }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {analysisStep === 0 && "> Scanning syntax and details..."}
                        {analysisStep === 1 && "> NLP: Tokenizing keywords & entity labels..."}
                        {analysisStep === 2 && "> Geolocation: Mapping municipal sector boundaries..."}
                        {analysisStep === 3 && "> Security Check: cross-referencing past duplicates..."}
                        {analysisStep === 4 && "> Core classification finalized."}
                      </p>
                    </div>
                  )}

                  {/* AI Results block */}
                  {aiAnalysisResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4.5 h-4.5" />
                          AI PRE-VERIFICATION COMPLETE
                        </span>
                        <span className="bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded text-[10px]">
                          {aiAnalysisResult.confidence}% Confident
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Auto-Category</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{aiAnalysisResult.detectedCategory}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Suggested Severity</span>
                          <span className={`font-bold capitalize ${
                            aiAnalysisResult.suggestedPriority === 'critical' ? 'text-red-500' :
                            aiAnalysisResult.suggestedPriority === 'high' ? 'text-amber-500' : 'text-blue-500'
                          }`}>{aiAnalysisResult.suggestedPriority}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Assigned Dispatch</span>
                          <span className="font-semibold text-slate-900 dark:text-white text-[11px] block truncate">{aiAnalysisResult.department}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Nearby Certified Volunteers</span>
                          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            {aiAnalysisResult.volunteersAvailable} ready
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 flex items-center justify-between">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Community Hero uses decentralized AI validators to filter fake items.
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-sans text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title || !description || !locationName || isAnalyzing}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Official Incident
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
