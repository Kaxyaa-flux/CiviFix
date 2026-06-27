import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, UploadCloud, FileText, MapPin, Sparkles, 
  Trash2, Image as ImageIcon, Video as VideoIcon, Compass, 
  Calendar, Clock, Check, AlertTriangle, ShieldCheck, HelpCircle, 
  Activity, ArrowUp, AlertOctagon, RefreshCw
} from 'lucide-react';
import { CivicIssue } from '../types';

interface ReportPageProps {
  onBack: () => void;
  onSubmit: (newIssue: Omit<CivicIssue, 'id' | 'reportedAt' | 'upvotes' | 'timeline'>) => void;
}

// Pre-defined sectors for the Interactive Location Preview Map
const SECTORS = [
  { name: "Oakwood District Sector A", lat: 37.7749, lng: -122.4194, address: "122 Oakwood Blvd, Near Central Park" },
  { name: "Pine Street Crossing Sector B", lat: 37.7849, lng: -122.4094, address: "448 Pine St, Junction 5th Ave" },
  { name: "Elm Road Library Sector C", lat: 37.7649, lng: -122.4294, address: "450 Elm Road (Opposite Public Library)" },
  { name: "Sunset Boulevard Sector D", lat: 37.7949, lng: -122.3994, address: "Sunset Blvd Alley, Close to 3rd Ave" },
  { name: "Civic Center Sector E", lat: 37.7549, lng: -122.4394, address: "Civic Boulevard East Intersection" },
  { name: "Green Park North Corridor Sector F", lat: 37.7700, lng: -122.4100, address: "Green Park North Gate Corridor" }
];

export default function ReportPage({ onBack, onSubmit }: ReportPageProps) {
  // Main form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Street Maintenance');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [address, setAddress] = useState(SECTORS[0].address);
  const [gps, setGps] = useState({ lat: SECTORS[0].lat, lng: SECTORS[0].lng });
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportTime, setReportTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  
  // File Upload states
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<{ id: string; name: string; size: string; file: File }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Custom interactive map coordinates state (San Francisco area)
  const [mapPin, setMapPin] = useState({ lat: SECTORS[0].lat, lng: SECTORS[0].lng });
  
  // AI analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<{
    category: string;
    severity: number;
    confidence: number;
    department: string;
    reasoning: string;
    suggestedTitle: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect location preset when clicking sector points
  const selectSector = (sector: typeof SECTORS[0], index: number) => {
    setAddress(sector.address);
    setGps({ lat: sector.lat, lng: sector.lng });
    setMapPin({ lat: sector.lat, lng: sector.lng });
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files: FileList) => {
    const images: typeof uploadedImages = [];
    const videos: typeof uploadedVideos = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        images.push({
          id: Math.random().toString(36).substring(2, 9),
          url: URL.createObjectURL(file),
          file
        });
      } else if (file.type.startsWith('video/')) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        videos.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: `${sizeInMb} MB`,
          file
        });
      }
    });

    if (images.length > 0) setUploadedImages(prev => [...prev, ...images]);
    if (videos.length > 0) setUploadedVideos(prev => [...prev, ...videos]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const removeVideo = (id: string) => {
    setUploadedVideos(prev => prev.filter(vid => vid.id !== id));
  };

  // Call our newly compiled server-side AI endpoint
  const handleAiAnalysis = async () => {
    if (!title || !description) {
      setAnalysisError("Please provide an Issue Title and Description first so the AI can analyze the context.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed. Please verify connection.');
      }

      const data = await response.json();
      setAiReport(data);
      
      // Auto-populate Category based on AI suggestion
      setCategory(data.category);
      
      // Map AI Severity Score (1-10) to low/medium/high/critical priority
      if (data.severity >= 9) {
        setPriority('critical');
      } else if (data.severity >= 7) {
        setPriority('high');
      } else if (data.severity >= 4) {
        setPriority('medium');
      } else {
        setPriority('low');
      }

      // Auto-apply polished title if user accepts it
      if (data.suggestedTitle && !title.includes('[AI Polished]')) {
        setTitle(data.suggestedTitle);
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Error occurred during AI processing.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) return;

    // Package the new report
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category,
      priority: priority,
      status: 'verified', // Pre-verified via automated dispatching
      locationName: address.trim(),
      coordinates: mapPin,
      reporterName: 'Resident Advocate (You)',
      images: uploadedImages.map(img => img.file)
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 pt-[7rem] pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link / Breadcrumb */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 dark:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Civic Dashboard
          </button>
          
          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            MUNICIPAL NODE v2.0 CONNECTED
          </div>
        </div>

        {/* Title Block */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163832]/10 border border-white/10/20 text-[#7C3AED] text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            AI-DRIVEN MUNICIPAL ROUTING
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Report Civic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#10B981]">Incidents</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
            Upload environmental files, tag GPS locations, and trigger our instant municipal neural dispatcher. Peer-validated in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Form & Uploads (Glassmorphic Card) */}
          <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-2xl space-y-6">
              
              {/* Row 1: Issue Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center justify-between">
                  <span>Issue Title <span className="text-red-500">*</span></span>
                  <span className="text-xs text-slate-500 font-mono">Max 100 chars</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value.substring(0, 100))}
                    placeholder="E.g., High pressure water leakage onto pedestrian walk"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-white/10/80 focus:ring-1 focus:ring-[#8EB69B]/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm transition-all outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the depth, exact visible hazards, and surrounding context. The municipal dispatcher processes this text for automatic agency classification."
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-white/10/80 focus:ring-1 focus:ring-[#8EB69B]/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm transition-all outline-none resize-none leading-relaxed"
                />
              </div>

              {/* AI Auto-Analysis Quick Assist Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#163832]/5 border border-white/10/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#163832]/10 text-[#7C3AED]">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">AI Intelligent Classification Assist</h4>
                    <p className="text-[11px] text-slate-400">Instantly generate suggested category, severity metrics, and responsible city agency.</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isAnalyzing || !title || !description}
                  onClick={handleAiAnalysis}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#10B981] hover:from-blue-600 hover:to-emerald-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-900 dark:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Analyze & Suggest
                    </>
                  )}
                </button>
              </div>

              {analysisError && (
                <div className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-rose-400 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Row 3: Category & Priority (Two Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-white/10/80 rounded-xl px-3 py-2.5 text-slate-100 text-sm transition-all outline-none"
                  >
                    <option value="Street Maintenance">Street Maintenance</option>
                    <option value="Water & Utilities">Water & Utilities</option>
                    <option value="Environmental & Sanitation">Environmental & Sanitation</option>
                    <option value="Road Safety & Forestry">Road Safety & Forestry</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Priority Level</label>
                  <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                    {(['low', 'medium', 'high', 'critical'] as const).map((lvl) => {
                      const colors = {
                        low: 'text-slate-400 hover:bg-slate-900',
                        medium: 'text-amber-400 hover:bg-amber-500/10',
                        high: 'text-[#7C3AED] hover:bg-[#7C3AED]/10',
                        critical: 'text-[#10B981] hover:bg-green-500/10'
                      };
                      const activeColors = {
                        low: 'bg-slate-850 text-slate-900 dark:text-white font-semibold',
                        medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold',
                        high: 'bg-[#163832]/20 text-[#7C3AED] border border-white/10/30 font-semibold',
                        critical: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-semibold'
                      };

                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPriority(lvl)}
                          className={`py-1.5 text-xs rounded-lg uppercase tracking-wider text-center cursor-pointer transition-all ${
                            priority === lvl ? activeColors[lvl] : colors[lvl]
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Row 4: File drag and drop upload block */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300">Upload Media Evidence (Images / Videos)</label>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-white/10 bg-[#163832]/10' 
                      : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/60'
                  }`}
                  onClick={triggerImageUpload}
                >
                  <input 
                    type="file" 
                    multiple
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <input 
                    type="file" 
                    multiple
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Drag & Drop files here, or <span className="text-[#7C3AED] underline">browse files</span></p>
                      <p className="text-[11px] text-slate-500 mt-1">Supports high-res photographs, incident evidence, and MP4 video recordings.</p>
                    </div>
                  </div>
                </div>

                {/* File input helpers */}
                <div className="flex justify-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <button type="button" onClick={triggerImageUpload} className="hover:text-slate-900 dark:text-white flex items-center gap-1 cursor-pointer">
                    <ImageIcon className="w-3.5 h-3.5 text-[#7C3AED]" /> Add Images
                  </button>
                  <span className="text-slate-700">|</span>
                  <button type="button" onClick={triggerVideoUpload} className="hover:text-slate-900 dark:text-white flex items-center gap-1 cursor-pointer">
                    <VideoIcon className="w-3.5 h-3.5 text-[#10B981]" /> Add Videos
                  </button>
                </div>

                {/* Uploaded Files Previews Grid */}
                <AnimatePresence>
                  {(uploadedImages.length > 0 || uploadedVideos.length > 0) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3"
                    >
                      {/* Image Preview Cards */}
                      {uploadedImages.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 h-28 flex items-center justify-center">
                          <img src={img.url} alt="Evidence Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => removeImage(img.id)}
                              className="p-1.5 rounded-full bg-red-500/80 hover:bg-rose-600 text-slate-900 dark:text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1.5 px-2 py-0.5 bg-slate-950/90 border border-slate-800/80 rounded text-[9px] font-mono text-slate-300">
                            IMAGE
                          </span>
                        </div>
                      ))}

                      {/* Video Item Cards */}
                      {uploadedVideos.map((vid) => (
                        <div key={vid.id} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 h-28 p-3 flex flex-col justify-between">
                          <div className="flex justify-center items-center h-12 bg-slate-900 rounded-lg text-[#10B981]">
                            <VideoIcon className="w-6 h-6" />
                          </div>
                          <div className="space-y-0.5 text-center">
                            <p className="text-[10px] font-semibold text-slate-200 truncate">{vid.name}</p>
                            <p className="text-[9px] text-slate-500 font-mono">{vid.size}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeVideo(vid.id)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/80 text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1.5 px-2 py-0.5 bg-slate-950/90 border border-slate-800/80 rounded text-[9px] font-mono text-slate-300">
                            VIDEO
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Row 5: Date and Time Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#7C3AED]" />
                    Date of Occurrence
                  </label>
                  <input 
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-white/10/80 rounded-xl px-3 py-2 text-slate-100 text-sm outline-none font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#10B981]" />
                    Time of Occurrence
                  </label>
                  <input 
                    type="time"
                    value={reportTime}
                    onChange={(e) => setReportTime(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-white/10/80 rounded-xl px-3 py-2 text-slate-100 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!title || !description || !address}
                className="w-full py-4 rounded-xl font-bold font-sans text-sm bg-gradient-to-r from-[#7C3AED] to-[#10B981] hover:from-blue-600 hover:to-emerald-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 text-slate-900 dark:text-white transition-all transform active:scale-[0.98] shadow-lg shadow-[#051F20]/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                Submit Official Incident Report
              </button>

            </div>

          </form>

          {/* RIGHT COLUMN: AI Live Diagnosis Reports & Location Preview Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Location Preview Map Container */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7C3AED] font-mono uppercase tracking-wider">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  Interactive Location Preview Map
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Click Sectors to Tag GPS</span>
              </div>

              {/* Animated Interactive Map Grid */}
              <div className="relative w-full h-56 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group select-none flex items-center justify-center">
                
                {/* SVG background grid lines */}
                <svg className="absolute inset-0 w-full h-full text-slate-900/40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <div className="text-center z-10 flex flex-col items-center gap-2">
                   <MapPin className="w-12 h-12 text-[#10B981] animate-bounce" />
                   <p className="font-mono text-slate-400 text-xs">GPS Locked to Address</p>
                </div>
                
                {/* Clickable Sector overlay buttons on the map */}
                <div className="absolute inset-0 flex flex-wrap content-start gap-1 p-2 opacity-0 hover:opacity-100 transition-opacity bg-black/80">
                  {SECTORS.map((sec, i) => {
                    return (
                      <button
                        key={sec.name}
                        type="button"
                        onClick={() => selectSector(sec, i)}
                        className="p-1 text-[9px] font-semibold text-slate-400 hover:text-slate-900 dark:text-white bg-slate-900/90 hover:bg-[#163832] border border-slate-800 rounded-md transition-all cursor-pointer"
                      >
                        {sec.name.replace(" Sector ", " ")}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom coordinates status display */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400 z-20">
                  <div className="flex gap-4">
                    <span>LAT: {gps.lat.toFixed(4)}° N</span>
                    <span>LNG: {gps.lng.toFixed(4)}° W</span>
                  </div>
                  <span className="text-[#10B981] font-bold">GRID SYNC</span>
                </div>

              </div>

              {/* Physical Location Input Details */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Verify Address</label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street name, landmark, municipal quadrant..."
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-white/10/80 focus:ring-1 focus:ring-[#8EB69B]/50 rounded-xl px-3 py-2 text-xs text-slate-100 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* 2. Glassmorphic AI Diagnostic Live Feed */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] font-mono uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-[#10B981]" />
                  Neural AI Dispatch Report
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase font-bold">
                  Diagnostic State
                </div>
              </div>

              {/* Dynamic AI Analysis Details */}
              {aiReport ? (
                <div className="space-y-4 animate-fade-in text-sm">
                  
                  {/* Suggesed category block */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono">SUGGESTED CATEGORY</p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5">{aiReport.category}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#163832]/10 text-[#7C3AED] text-[10px] font-extrabold rounded-lg border border-white/10/20">
                      AUTO-ROUTED
                    </span>
                  </div>

                  {/* Severity & Confidence Dual Indicator Gauge */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Severity Score Metric */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">SEVERITY INDEX</span>
                      <div className="flex items-baseline gap-1 mt-1.5">
                        <span className="text-3xl font-extrabold text-[#10B981]">{aiReport.severity}</span>
                        <span className="text-xs text-slate-500">/ 10</span>
                      </div>
                      
                      {/* Interactive Visual Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#10B981] to-[#EC4899] h-full rounded-full"
                          style={{ width: `${aiReport.severity * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Confidence percentage */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">CONFIDENCE INDEX</span>
                      <div className="flex items-baseline gap-0.5 mt-1.5">
                        <span className="text-3xl font-extrabold text-[#7C3AED]">{aiReport.confidence}</span>
                        <span className="text-xs text-slate-500">%</span>
                      </div>
                      
                      {/* Interactive Visual Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#7C3AED] to-[#10B981] h-full rounded-full"
                          style={{ width: `${aiReport.confidence}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>

                  {/* Responsible Department & Reasoning */}
                  <div className="space-y-2">
                    <div className="p-3.5 bg-[#163832]/5 rounded-xl border border-white/10/25 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#7C3AED] font-bold uppercase font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        AGENCY DISPATCH ASSIGNED
                      </div>
                      <p className="text-xs font-bold text-slate-200">{aiReport.department}</p>
                    </div>

                    <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400 italic leading-relaxed">
                      " {aiReport.reasoning} "
                    </div>
                  </div>

                  {/* Micro validation checklist */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block mb-1">Pre-Verification Standards</span>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Heuristic Natural Language Categorized</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>GPS Grid Geo-Coordinates Synced</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Validation score safe for public maps</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-2 font-sans flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-slate-800/80 flex items-center justify-center text-slate-600 mb-2">
                    <AlertTriangle className="w-6 h-6 text-slate-700" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">Waiting for Incident Parameters</p>
                  <p className="text-[11px] text-slate-500 max-w-xs px-4">Provide title and description details, then press "Analyze & Suggest" to trigger neural parsing.</p>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
