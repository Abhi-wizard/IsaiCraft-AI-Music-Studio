import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music, Mic, Wand2, Type, CloudRain, Flame, Wind, MessageSquareText, Loader2 } from 'lucide-react';
import { useIsai } from '../context/IsaiContext';
import { useProduceMusic } from '../hooks/useProduceMusic';
import { GlassCard } from '../components/ui/GlassCard';
import { VocalBooth } from '../components/studio/VocalBooth';
import { MultiStepLoading } from '../components/studio/MultiStepLoading';
import { vocalGuideAPI } from '../lib/api';

const Teleprompter = ({ guide, keyInfo, bpm }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-black/90 border-2 border-primary/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(249,115,22,0.15)] relative overflow-hidden h-full min-h-[400px] flex flex-col"
  >
    <div className="absolute top-4 right-8 flex items-center gap-2 z-10">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Neural Script Reader • {bpm || 70} BPM</span>
    </div>

    {/* Notation Legend */}
    {keyInfo && keyInfo.length > 0 && (
      <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" /> Notation Guide
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keyInfo.map((k, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-xs font-black text-primary outfit uppercase">{k.symbol}</span>
              <span className="text-[9px] text-slate-400 font-medium leading-tight">{k.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar py-4">
      {guide.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0.3 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          className="group cursor-default border-l-2 border-white/5 pl-4 hover:border-primary/40 transition-all"
        >
          <div className="space-y-2 mb-4">
            <p className="text-[10px] font-bold italic text-secondary uppercase tracking-[0.2em] outfit">
              🎤 Emotion: {item.emotion || item.emotion_cue || "Natural Flow"}
            </p>
            {(item.lyric || item.original) && (
              <p className="text-[11px] text-slate-500 font-medium outfit italic uppercase opacity-50">
                Original: {item.lyric || item.original}
              </p>
            )}
          </div>
          <p className="text-2xl md:text-4xl font-black outfit tracking-tighter leading-tight text-white group-hover:text-primary transition-all duration-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {item.breakdown || item.guide || item.lyric || "Wait for cue..."}
          </p>
          <div className="h-0.5 w-12 group-hover:w-full bg-primary/40 transition-all duration-700 mt-4 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
        </motion.div>
      ))}
    </div>
    
    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center shrink-0">
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.1em]">Neural Voice Pattern: Speak-Sing Mode Active</p>
      <div className="flex gap-1.5">
        <div className="w-1 h-3 bg-secondary/40 rounded-full" />
        <div className="w-1 h-5 bg-primary/60 rounded-full" />
        <div className="w-1 h-3 bg-secondary/40 rounded-full" />
      </div>
    </div>
  </motion.div>
);

export const StudioPage = () => {
  const { currentProject, updateProjectMetadata } = useIsai();
  const { generate, isGenerating, progress, currentStep, error, clearError } = useProduceMusic();
  const [activeStep, setActiveStep] = useState(1); // 1: Pre-Production, 2: Vocal Booth
  const [vocalGuide, setVocalGuide] = useState(null);
  const [loadingGuide, setLoadingGuide] = useState(false);

  const tonePresets = [
    'Cinematic orchestral build-up',
    'Aggressive dark trap beat',
    'Uplifting acoustic pop',
    'Melancholic piano and strings',
    'High-energy cyberpunk synthwave',
    'Relaxing late-night Lo-Fi',
    'Heavy rock with distorted guitars',
    'Ethereal ambient dreamscape',
    'Upbeat Bollywood dance rhythm',
    'Minimalist acoustic indie'
  ];

  const instruments = [
    'Acoustic Guitar', 'Grand Piano', '808 Bass', 'Synthesizer', 
    'Violin', 'Saxophone', 'Drum Machine', 'Electric Guitar', 'Flute', 'Cello'
  ];

  const [showToneDropdown, setShowToneDropdown] = useState(false);

  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleLyricsChange = (e) => {
    const text = e.target.value;
    const wordCount = getWordCount(text);
    
    if (wordCount > 72) { // Allowing a tiny buffer
        return;
    }
    
    updateProjectMetadata({ actual_lyrics: text });
  };

  const toggleInstrument = (inst) => {
    const current = currentProject.selected_instruments || [];
    if (current.includes(inst)) {
        updateProjectMetadata({ selected_instruments: current.filter(i => i !== inst) });
    } else {
        updateProjectMetadata({ selected_instruments: [...current, inst] });
    }
  };
  const handleGenerateGuide = async () => {
    if (!currentProject.actual_lyrics) {
      alert("Please enter your actual lyrics to generate a vocal guide.");
      return;
    }
    setLoadingGuide(true);
    try {
      // Combine genre and context for a richer AI understanding of the vibe
      const combinedVibe = `${currentProject.tone_description} - ${currentProject.lyrical_context || 'Standard performance'}`;
      
      const data = await vocalGuideAPI(
        currentProject.actual_lyrics,
        currentProject.reference_song,
        combinedVibe
      );
      setVocalGuide(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingGuide(false);
    }
  };

  const handleProduce = async () => {
    if (!currentProject.name || !currentProject.tone_description) {
      alert('Please enter session name and describe the musical tone in Step 1.');
      setActiveStep(1);
      return;
    }
    // Ensure final synthesis uses the actual lyrics
    await generate({
      ...currentProject,
      lyrics: currentProject.actual_lyrics
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold outfit uppercase tracking-[0.2em] mb-2">
          <Sparkles className="w-3 h-3" /> Neural Studio Activated
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black outfit tracking-tighter leading-none uppercase">
          ISAICRAFT <span className="text-primary italic">STUDIO</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto outfit text-base">
          {activeStep === 1 
            ? "Initialize your session's sonic architecture."
            : "Capture your vocal performance for neural analysis."}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* Step 1: Pre-Production Phase */}
        {activeStep === 1 && (
          <section className="transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold outfit bg-primary text-white">1</span>
                <h2 className="text-xl font-black outfit uppercase tracking-tight">Pre-Production Phase</h2>
            </div>

            <GlassCard className="border-white/5 space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold outfit uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <Type className="w-4 h-4" /> 01. Session Initials
                    </label>
                    <input
                      type="text"
                      placeholder="PROD_SESSION_X..."
                      value={currentProject.name}
                      onChange={(e) => updateProjectMetadata({ name: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary/50 text-xl font-bold outfit transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold outfit uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <Music className="w-4 h-4" /> 02. Reference Song (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Song Name / Artist Link..."
                      value={currentProject.reference_song || ''}
                      onChange={(e) => updateProjectMetadata({ reference_song: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary/50 text-slate-300 font-medium outfit transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold outfit uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <Wand2 className="w-4 h-4" /> 03. Musical Tone Description
                    </label>
                    
                    <div className="relative">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., Aggressive dark trap beat..."
                          value={currentProject.tone_description || ''}
                          onChange={(e) => updateProjectMetadata({ tone_description: e.target.value })}
                          className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary/50 text-slate-300 font-medium outfit transition-all outline-none"
                        />
                        <button 
                          onClick={() => setShowToneDropdown(!showToneDropdown)}
                          className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-primary"
                        >
                          <Wand2 className="w-5 h-5 transition-transform duration-300" style={{ transform: showToneDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </button>
                      </div>

                      {showToneDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 py-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {tonePresets.map((preset, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                updateProjectMetadata({ tone_description: preset });
                                setShowToneDropdown(false);
                              }}
                              className="w-full text-left px-6 py-3 text-xs font-bold outfit text-slate-400 hover:text-white hover:bg-primary/20 transition-all text-shadow-sm"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 space-y-4">
                      <label className="text-xs font-bold outfit uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                        <Music className="w-4 h-4" /> 04. Instrument Palette
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {instruments.map((inst) => (
                          <button
                            key={inst}
                            onClick={() => toggleInstrument(inst)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold outfit border transition-all ${
                              currentProject.selected_instruments?.includes(inst)
                                ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                                : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/30'
                            }`}
                          >
                            {inst}
                          </button>
                        ))}
                      </div>
                      {currentProject.selected_instruments?.length > 0 && (
                        <div className="p-4 bg-black/20 border border-white/5 rounded-xl">
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            Selected: {currentProject.selected_instruments.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold outfit uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <MessageSquareText className="w-4 h-4" /> 05. Lyrical Context
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., A sad romantic song about waiting."
                      value={currentProject.lyrical_context || ''}
                      onChange={(e) => updateProjectMetadata({ lyrical_context: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 focus:border-primary/50 text-slate-300 font-medium outfit transition-all outline-none"
                    />
                    
                    <div className="pt-2 space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold outfit uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                          <Type className="w-4 h-4" /> 06. Actual Lyrics
                        </label>
                        <span className={`text-[10px] font-mono font-bold tracking-widest ${getWordCount(currentProject.actual_lyrics || '') > 70 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                          {getWordCount(currentProject.actual_lyrics || '')} / 70 WORDS
                        </span>
                      </div>
                      <textarea
                        placeholder="Enter the exact words for your 35-second track..."
                        value={currentProject.actual_lyrics || ''}
                        onChange={handleLyricsChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-6 py-4 h-[120px] focus:border-primary/50 text-slate-300 font-medium outfit transition-all outline-none resize-none custom-scrollbar"
                      />
                      {getWordCount(currentProject.actual_lyrics || '') >= 70 && (
                        <p className="absolute -bottom-6 left-0 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                          Max 70 words for a 35-second track.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <button 
                    onClick={handleGenerateGuide}
                    disabled={loadingGuide}
                    className="flex-1 btn-secondary py-5 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loadingGuide ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-primary" />}
                      {loadingGuide ? 'Analyzing Lyrics...' : 'Generate Vocal Guide'}
                    </button>
                    <button 
                    onClick={() => setActiveStep(2)}
                    className="flex-1 btn-primary py-5 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                    >
                      Ready to Record <Mic className="w-5 h-5" />
                    </button>
                </div>

                {vocalGuide && (
                  <div className="mt-8">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Neural Script Preview:</p>
                    <div className="max-h-[250px] overflow-y-auto border border-white/5 rounded-2xl p-6 bg-black/40 custom-scrollbar">
                      {vocalGuide.guide.map((g, i) => (
                        <div key={i} className="mb-4 last:mb-0 border-l border-primary/20 pl-4">
                          <p className="text-[9px] text-secondary uppercase font-bold tracking-widest mb-1 italic">
                            🎤 {g.emotion || g.emotion_cue || "Natural Flow"}
                          </p>
                          <p className="text-sm text-white font-bold outfit">
                            {g.breakdown || g.guide || g.lyric || "Wait for cue..."}
                          </p>
                          {(g.lyric || g.original) && (
                            <p className="text-[10px] text-slate-500 italic mt-1 uppercase opacity-40">
                              {g.lyric || g.original}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </GlassCard>
          </section>
        )}

        {/* Step 2: Unified Recording View */}
        {activeStep === 2 && (
          <section className="transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold outfit bg-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]">2</span>
                <h2 className="text-xl font-black outfit uppercase tracking-tight">The Recording Zone</h2>
                <button 
                  onClick={() => setActiveStep(1)}
                  className="ml-auto text-xs font-bold text-slate-500 hover:text-primary transition-colors underline underline-offset-4"
                >
                  BACK TO PRE-PROD
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch h-[550px] max-h-[65vh]">
              {/* Left Column: Teleprompter */}
              <div className="md:col-span-7 h-full overflow-hidden">
                {vocalGuide ? (
                  <Teleprompter 
                    guide={vocalGuide.guide} 
                    keyInfo={vocalGuide.key} 
                    bpm={vocalGuide.recommended_bpm} 
                  />
                ) : (
                  <GlassCard className="h-full min-h-[300px] flex flex-col justify-center items-center border-dashed border-white/10 border-2">
                    <Type className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Vocal Guide Generated</p>
                  </GlassCard>
                )}
              </div>

              {/* Right Column: Vocal Booth (Parallel to Teleprompter) */}
              <div className="md:col-span-5 h-full overflow-hidden">
                <GlassCard className="h-full border-white/5 py-8 flex flex-col justify-center items-center">
                  <VocalBooth 
                    existingVocal={currentProject.vocal_file}
                    onVocalProcessed={(base64) => updateProjectMetadata({ vocal_file: base64 })} 
                  />
                  
                  <div className="mt-4 px-5 py-2.5 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 leading-relaxed text-center">
                        Neural Gain: +22dB • Cleanse: Active<br/>Time Limit: 35s
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className={`flex flex-col items-center gap-4 pt-6 transition-all duration-500 ${activeStep === 1 ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        {!currentProject.vocal_file && (
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest animate-pulse">
            Vocal Node Required: Record or Upload to Synthesize
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
          <motion.button
            whileHover={currentProject.vocal_file ? { scale: 1.05, boxShadow: '0 0 50px rgba(249, 115, 22, 0.5)' } : {}}
            whileTap={currentProject.vocal_file ? { scale: 0.95 } : {}}
            disabled={!currentProject.vocal_file}
            onClick={handleProduce}
            className={`min-w-[280px] px-8 py-4 text-lg font-black tracking-[0.2em] outfit flex items-center justify-center gap-4 transition-all ${
              currentProject.vocal_file 
              ? 'btn-primary bg-gradient-to-r from-primary to-secondary' 
              : 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed grayscale'
            }`}
          >
            <Wand2 className="w-5 h-5" />
            PRODUCE TRACK
          </motion.button>

          {currentProject.vocal_file && (
            <button
              onClick={() => updateProjectMetadata({ vocal_file: null })}
              className="flex items-center gap-2 px-8 py-6 text-xs font-bold text-red-500/80 hover:text-red-500 outfit uppercase tracking-widest border border-red-500/10 hover:border-red-500/30 rounded-xl bg-red-500/5 transition-all"
            >
              🗑️ Retake
            </button>
          )}
        </div>
      </div>

      <MultiStepLoading 
        isProjectGenerating={isGenerating} 
        progress={progress} 
        currentStep={currentStep}
        error={error}
        onClose={clearError}
      />
    </div>
  );
};
