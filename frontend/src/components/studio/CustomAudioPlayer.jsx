import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomAudioPlayer = ({ title, url, waves = [] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const forceDownload = async (e) => {
    // Prevent the click from triggering parent elements (like the play button)
    e.stopPropagation(); 
    
    console.log("1. Download button clicked! Source length:", url?.length);
    if (!url) {
      alert("No audio data found!");
      return;
    }

    try {
      console.log("2. Converting Base64 to Blob...");
      // Using fetch to convert the massive Data URI to a Blob
      const res = await fetch(url);
      const blob = await res.blob();
      console.log("3. Blob created! Size:", blob.size, "bytes");

      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = objectUrl;
      
      // Clean up the title for the filename
      const safeTitle = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'isaicraft_track';
      link.download = `${safeTitle}.wav`;

      console.log("4. Triggering browser download...");
      document.body.appendChild(link);
      link.click();

      // Cleanup after a short delay to ensure the browser registers the click
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
        console.log("5. Cleanup complete. Download should be in progress.");
      }, 100);
      
    } catch (error) {
      console.error("DOWNLOAD CRASH:", error);
      alert("Download failed. Check the developer console.");
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -mr-10 -mt-10 group-hover:bg-primary/20 transition-all duration-700" />
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-white" />
          ) : (
            <Play className="w-8 h-8 text-white translate-x-1 fill-white" />
          )}
        </motion.button>

        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-xl font-bold outfit tracking-tight uppercase">{title}</h4>
              <p className="text-slate-400 text-xs font-mono">24-bit • 48kHz • WAV</p>
            </div>
            <div className="flex gap-4">
               <button 
                onClick={forceDownload}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer relative z-50 p-2"
               >
                <Download className="w-4 h-4 pointer-events-none"/>
               </button>
               <button className="text-slate-400 hover:text-white transition-colors"><Share2 className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Waveform Visualization */}
          <div className="h-16 flex items-center gap-[2px]">
            {waves.length > 0 ? (
              waves.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 2 }}
                  animate={{ 
                    height: isPlaying ? [v * 40, v * 60, v * 40] : v * 40,
                    opacity: currentTime / duration > i / waves.length ? 1 : 0.4
                  }}
                  transition={isPlaying ? { 
                    duration: 0.5, 
                    repeat: Infinity,
                    delay: i * 0.02
                  } : { duration: 0.3 }}
                  className={`flex-1 rounded-full ${
                    currentTime / duration > i / waves.length 
                    ? 'bg-gradient-to-t from-primary to-secondary h-full' 
                    : 'bg-slate-700'
                  }`}
                />
              ))
            ) : (
              <div className="w-full h-1 bg-slate-800 rounded-full animate-pulse" />
            )}
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};
