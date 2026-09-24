import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Music, Cpu, Layers, Radio, Sparkles } from 'lucide-react';

export const MultiStepLoading = ({ isProjectGenerating, progress, currentStep, error, onClose }) => {
  const statusMessages = [
    { threshold: 0, text: 'Establishing Secure Neural Link...' },
    { threshold: 17, text: 'AI Composing 30-Second Instrumental...' },
    { threshold: 42, text: 'Executing Spectral Noise Cancellation...' },
    { threshold: 67, text: 'Applying Highpass & Studio Reverb...' },
    { threshold: 92, text: 'Finalizing Master Mix...' }
  ];

  const currentMessage = [...statusMessages].reverse().find(m => progress >= m.threshold)?.text || statusMessages[0].text;

  return (
    <AnimatePresence>
      {isProjectGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-3xl p-6"
        >
          <div className="max-w-2xl w-full flex flex-col items-center">
            {error ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-red-500 font-bold">!</span>
                </div>
                <h2 className="text-3xl font-black outfit text-red-500 uppercase tracking-widest">
                  Neural Node Failure
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 font-mono text-sm max-w-md">
                  {error}
                </div>
                <p className="text-slate-400 text-sm italic">
                  The AI server encountered an unexpected error during synthesis.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={onClose}
                    className="btn-primary bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] font-bold px-10 py-4"
                  >
                    RETURN TO CONSOLE
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Holographic Icon container */}
                <div className="relative mb-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 20px rgba(249,115,22,0.2)",
                        "0 0 60px rgba(249,115,22,0.4)",
                        "0 0 20px rgba(249,115,22,0.2)"
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-40 h-40 rounded-full border-2 border-primary/30 flex items-center justify-center bg-slate-900/80 backdrop-blur-md"
                  >
                    <motion.div
                      animate={{ 
                        opacity: [0.4, 1, 0.4],
                        scale: [0.9, 1.1, 0.9]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="w-20 h-20 text-primary" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Glowing Rings */}
                  <motion.div
                    animate={{ rotate: 360, opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-6 border border-dashed border-secondary/40 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360, opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-12 border border-dotted border-primary/20 rounded-full"
                  />
                </div>
                
                <div className="w-full text-center mb-12 h-20 flex flex-col justify-center">
                  <h2 className="text-4xl font-black outfit neon-text-orange mb-3 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Neural Synthesis
                  </h2>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentMessage}
                      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5 }}
                      className="text-primary font-mono text-sm uppercase tracking-[0.3em] font-bold"
                    >
                      {currentMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-white/10 mb-8 p-[1px]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                   <StepIndicator icon={<Cpu className="w-4 h-4"/>} label="Neural Link" active={progress > 10}/>
                   <StepIndicator icon={<Music className="w-4 h-4"/>} label="AI Scoring" active={progress > 35}/>
                   <StepIndicator icon={<Radio className="w-4 h-4"/>} label="Synthesis" active={progress > 70}/>
                   <StepIndicator icon={<Sparkles className="w-4 h-4"/>} label="Mastering" active={progress > 90}/>
                </div>

                <div className="mt-16 text-center">
                  <p className="text-[10px] font-mono text-slate-500 max-w-md mx-auto uppercase tracking-widest leading-relaxed">
                    Our Secure Neural Core is currently processing 4.2B audio parameters. Output verified via <span className="text-secondary">Wave-Sync Protocol</span>. Do not disconnect session.
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StepIndicator = ({ icon, label, active }) => (
  <div className={`flex items-center gap-2 px-3 rounded-lg border transition-all duration-500 ${
    active ? 'border-primary/50 bg-primary/10 text-primary' : 'border-white/5 bg-slate-900/30 text-white/20'
  }`}>
    {active ? icon : <Loader2 className="w-3 h-3 animate-spin"/>}
    <span className="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{label}</span>
  </div>
);
