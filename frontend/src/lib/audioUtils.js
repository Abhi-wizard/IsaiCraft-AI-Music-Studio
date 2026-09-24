/**
 * Trims an AudioBuffer to a specific duration in seconds.
 */
export const trimAudioBuffer = (audioContext, buffer, maxDuration) => {
  if (buffer.duration <= maxDuration) return buffer;

  const sampleRate = buffer.sampleRate;
  const length = Math.floor(maxDuration * sampleRate);
  const trimmed = audioContext.createBuffer(
    buffer.numberOfChannels,
    length,
    sampleRate
  );

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    const trimmedData = trimmed.getChannelData(channel);
    trimmedData.set(channelData.subarray(0, length));
  }

  return trimmed;
};

/**
 * Encodes an AudioBuffer into a WAV Blob.
 */
export const bufferToWav = (buffer) => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;
  
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  
  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, dataLength, true);
  
  // Write interleaved data
  const offset = 44;
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  
  let index = 0;
  const len = buffer.length;
  for (let i = 0; i < len; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      // Inline clamping and scaling for speed
      if (sample > 1) sample = 1;
      else if (sample < -1) sample = -1;
      
      sample = sample < 0 ? sample * 32768 : sample * 32767;
      view.setInt16(offset + index, sample, true);
      index += 2;
    }
  }
  
  return new Blob([view], { type: 'audio/wav' });
};

const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

/**
 * Main function to process uploaded audio: decodes, trims if > 30s, and returns a Blob.
 */
export const processUploadedAudio = async (file, maxDuration = 35) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    if (audioBuffer.duration <= maxDuration) {
      return file; // Return original file if it's within duration
    }

    console.log(`Audio duration ${audioBuffer.duration}s exceeds ${maxDuration}s. Trimming...`);
    
    const trimmedBuffer = trimAudioBuffer(audioContext, audioBuffer, maxDuration);
    const wavBlob = bufferToWav(trimmedBuffer);
    
    // Create a new File object from the blob to maintain similar interface
    return new File([wavBlob], `trimmed_${file.name}`, { type: 'audio/wav' });
  } catch (error) {
    console.error('Error processing audio:', error);
    throw new Error('Failed to process audio file. Please ensure it is a valid audio format.');
  }
};
