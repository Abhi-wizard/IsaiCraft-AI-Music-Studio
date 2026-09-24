import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Activity, Upload, Play, Trash2, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAudioRecorder, blobToBase64 } from '../../hooks/useAudioRecorder';
import { processUploadedAudio } from '../../lib/audioUtils';

export const VocalBooth = ({ onVocalProcessed, existingVocal }) => {
  const { isRecording, startRecording, stopRecording, vocalUrl, recordingBlob, clearRecording, setVocalUrl } = useAudioRecorder();
  const [timeLeft, setTimeLeft] = useState(35);
  const fileInputRef = useRef(null);
  const audioPreviewRef = useRef(null);
  const timerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load existing vocal if provided
  useEffect(() => {
    if (existingVocal && !vocalUrl) {
      setVocalUrl(existingVocal);
    }
  }, [existingVocal, vocalUrl, setVocalUrl]);

  // Handle Recording Stop
  useEffect(() => {
    if (recordingBlob) {
      handleVocalReady(recordingBlob);
    }
  }, [recordingBlob]);

  // Timer Logic
  useEffect(() => {
    if (isRecording) {
      setTimeLeft(35);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, stopRecording]);

  const handleVocalReady = async (blobOrFile) => {
    const base64 = await blobToBase64(blobOrFile);
    onVocalProcessed(base64);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // Increased limit slightly for raw formats if needed, but still reasonable
        alert('File too large. Max 15MB for local storage.');
        return;
      }
      
      setIsProcessing(true);
      try {
        const processedFile = await processUploadedAudio(file);
        const url = URL.createObjectURL(processedFile);
        setVocalUrl(url);
        handleVocalReady(processedFile);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      clearRecording();
      setTimeLeft(35);
      startRecording();
    }
  };

  const formatTimer = (seconds) => {
    return `00:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-md">
      <div className="relative">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.4, 1.8], 
                opacity: [0.6, 0.3, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full bg-red-400/20 border-2 border-red-500/40"
            />
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleRecord}
          className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
            isRecording 
            ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]' 
            : vocalUrl 
              ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
              : 'bg-primary shadow-[0_0_30px_rgba(249,115,22,0.4)]'
          }`}
        >
          {isRecording ? (
            <>
              <Activity className="w-12 h-12 text-white mb-2" />
              <span className="text-xl font-black font-mono text-white">{formatTimer(timeLeft)}</span>
            </>
          ) : vocalUrl ? (
            <CheckCircle2 className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </motion.button>
      </div>
      
      <div className="text-center space-y-4 w-full">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight outfit uppercase">
            {isRecording ? 'Capturing Session...' : vocalUrl ? 'Vocal Node Ready' : 'Vocal Input Node'}
          </h3>
          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase opacity-70">
            {isRecording ? 'Broadcasting to Neural Core' : vocalUrl ? 'Analysis Complete' : 'Awaiting Signal'}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="audio/*" 
            className="hidden" 
          />
          
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs font-bold outfit hover:bg-slate-800 transition-all text-slate-400 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
          >
            <Upload className="w-4 h-4" /> {isProcessing ? 'TRIMMING...' : 'UPLOAD MP3'}
          </button>

          {vocalUrl && (
            <>
              <button
                onClick={() => {
                  const audio = new Audio(vocalUrl);
                  audio.play();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-xs font-bold text-primary outfit hover:bg-primary/30 transition-all"
              >
                <Play className="w-4 h-4" /> PREVIEW
              </button>
              
              <button
                onClick={() => {
                  clearRecording();
                  onVocalProcessed(null);
                }}
                className="p-2 bg-red-400/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-400/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
