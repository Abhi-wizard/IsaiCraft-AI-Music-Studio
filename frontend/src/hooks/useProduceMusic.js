import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsai } from '../context/IsaiContext';
import { generateMusicAPI } from '../lib/api';

const steps = [
  "Connecting to Neural Backend...",
  "Initializing GPU Clusters",
  "Segmenting Audio Samples...",
  "Synthesizing Bassline...",
  "Melody Harmonization...",
  "Rhythm Quantization...",
  "Layering Vocals...",
  "DSP Processing...",
  "Multi-band Mastering...",
  "Finalizing Master Node..."
];

export const useProduceMusic = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const { setCurrentProject, updateProjectMetadata } = useIsai();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const clearError = useCallback(() => {
    setError(null);
    setIsGenerating(false);
    setProgress(0);
    setCurrentStep(0);
  }, []);

  const generate = useCallback(async (projectData) => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(0);
    setError(null);

    const minDuration = 60000; // 60 seconds minimum
    const updateInterval = 100;
    const totalTicks = minDuration / updateInterval;
    
    let currentTicks = 0;
    let apiResults = null;
    let apiError = null;
    let isTimerDone = false;

    // Start API Call in background
    const apiCall = generateMusicAPI(projectData)
      .then(res => { apiResults = res; })
      .catch(err => { apiError = err; });

    return new Promise((resolve, reject) => {
      timerRef.current = setInterval(async () => {
        currentTicks++;
        
        // Error handling
        if (apiError) {
          clearInterval(timerRef.current);
          setError(apiError.message || "Production Node Failed");
          // Keep isGenerating(true) so the overlay remains to show the error
          updateProjectMetadata({ status: 'error' });
          reject(apiError);
          return;
        }

        // Progress Calculation
        // Cap visual progress at 99% if API isn't ready
        let visualProgress = (currentTicks / totalTicks) * 100;
        
        if (visualProgress >= 100) {
          isTimerDone = true;
          visualProgress = 99; // Hold at 99 until API is ready
        }

        // Complete the process if both are ready
        if (isTimerDone && apiResults) {
          clearInterval(timerRef.current);
          setProgress(100);
          setCurrentStep(steps.length - 1);
          
          updateProjectMetadata({ 
            status: 'completed', 
            results: apiResults 
          });
          
          // Delay briefly for visual satisfaction
          setTimeout(() => {
            setIsGenerating(false);
            navigate('/results');
            resolve(apiResults);
          }, 500);
          return;
        }

        setProgress(visualProgress);

        // Update steps text (distribute across minDuration)
        const stepIndex = Math.floor((currentTicks / totalTicks) * steps.length);
        if (stepIndex < steps.length && stepIndex !== currentStep) {
          setCurrentStep(stepIndex);
        }
      }, updateInterval);
    });
  }, [navigate, updateProjectMetadata, currentStep]);

  return {
    generate,
    isGenerating,
    currentStep: steps[currentStep] || steps[steps.length - 1],
    progress,
    error,
    clearError
  };
};
