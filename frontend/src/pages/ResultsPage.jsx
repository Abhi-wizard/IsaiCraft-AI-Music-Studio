import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Share2, Download, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsai } from '../context/IsaiContext';
import { CustomAudioPlayer } from '../components/studio/CustomAudioPlayer';
import { GlassCard } from '../components/ui/GlassCard';

export const ResultsPage = () => {
  const { currentProject, saveToDashboard } = useIsai();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentProject.results) {
      navigate('/studio');
    }
  }, [currentProject, navigate]);

  const handleSave = () => {
    saveToDashboard(currentProject);
    alert('Project saved to your dashboard successfully!');
    navigate('/');
  };

  const handleBackToStudio = () => {
    navigate('/studio');
  };

  // Helper to ensure base64 is a valid data URL
  const formatAudioUrl = (base64) => {
    if (!base64) return null;
    if (base64.startsWith('data:')) return base64;
    return `data:audio/mp3;base64,${base64}`;
  };

  // Helper to generate a consistent wave for visualization
  const generateWaves = (seed = 1) => {
    const waves = [];
    for (let i = 0; i < 40; i++) {
      // Use a deterministic-ish pattern for visual stability
      const val = Math.abs(Math.sin(i * 0.5 * seed)) * 0.6 + 0.2;
      waves.push(val);
    }
    return waves;
  };

  const results = currentProject.results || {};

  if (!currentProject.results) return null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={handleBackToStudio}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-bold outfit tracking-widest text-sm"
        >
          <ChevronLeft className="w-5 h-5" /> RE-EDIT SESSION
        </motion.button>

        <div className="flex gap-4">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" /> Save Result
          </button>
        </div>
      </header>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold outfit uppercase tracking-[0.2em] mb-4">
          <CheckCircle2 className="w-3 h-3" /> Master Output Verified
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black outfit tracking-tighter leading-none uppercase">
          {currentProject.name || 'SESSION MASTER'}
        </h1>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto outfit text-lg">
          Your production is now finalized with <span className="text-primary italic">Neuro-Sync™</span> technology. 
          Review individual components and the final mix below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Final Mix - Featured */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.4)]">
               <Zap className="w-5 h-5 text-white" />
             </div>
             <h3 className="text-2xl font-black outfit tracking-tight uppercase">Master Mix</h3>
          </div>
          <CustomAudioPlayer 
            title="FINAL MASTER" 
            url={formatAudioUrl(results.master_track)} 
            waves={generateWaves(1.5)}
          />
        </section>

        {/* Components Stacks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h3 className="text-xl font-bold outfit tracking-tight uppercase text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Stems: Raw Beat
            </h3>
            <CustomAudioPlayer 
              title="SYNTH & DRUM STEM" 
              url={formatAudioUrl(results.music_track)} 
              waves={generateWaves(0.8)}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold outfit tracking-tight uppercase text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Stems: Vocals
            </h3>
            <CustomAudioPlayer 
              title="HARMONIZED VOCALS" 
              url={formatAudioUrl(results.vocal_track)} 
              waves={generateWaves(2.2)}
            />
          </section>
        </div>
      </div>

      <GlassCard className="mt-12 bg-primary/5 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
         <div className="flex items-center gap-6 text-center md:text-left">
           <div className="w-16 h-16 rounded-full bg-slate-900 border border-primary/40 flex items-center justify-center">
             <Sparkles className="w-8 h-8 text-primary" />
           </div>
           <div>
             <h4 className="text-xl font-bold outfit uppercase tracking-tight">AI Insights</h4>
             <p className="text-slate-400 text-sm max-w-md">Our neural analyzer detected "High Emotional Resonance" in your vocal performance. Recommended for streaming platforms.</p>
           </div>
         </div>
         <button className="btn-primary px-8 whitespace-nowrap text-sm">Review Analytics</button>
      </GlassCard>
    </div>
  );
};
