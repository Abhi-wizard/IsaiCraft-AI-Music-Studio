import { auth } from './firebase';

const VOCAL_GUIDE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const GPU_ENGINE_BASE_URL = import.meta.env.VITE_GPU_ENGINE_URL || 'http://localhost:8000';


export const vocalGuideAPI = async (lyrics, referenceSong, vibe) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : "";

  const response = await fetch(`${VOCAL_GUIDE_BASE_URL}/api/vocal-guide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({
      lyrics: lyrics || "",
      reference_song: referenceSong || "None",
      vibe: vibe || "None"
    })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please sign in to continue.");
    }
    throw new Error(`Neural Node Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Calls the Colab GPU engine to synthesize the final music track.
 */
export const generateMusicAPI = async (projectData) => {
  const formData = new FormData();
  formData.append("project_name", projectData.name || "Unnamed");

  const toneDescription = projectData.tone_description || "Dynamic performance";
  const instrumentsStr = projectData.selected_instruments?.length > 0
    ? `Featuring these instruments: ${projectData.selected_instruments.join(', ')}.`
    : "";
  const superPrompt = `${toneDescription}. ${instrumentsStr}`;

  formData.append("mood", superPrompt);
  formData.append("genre", projectData.genre || "Unknown");
  formData.append("lyrics", projectData.lyrics || "");

  if (projectData.vocal_file) {
    try {
      const audioResponse = await fetch(projectData.vocal_file);
      const audioBlob = await audioResponse.blob();
      formData.append("vocal_file", audioBlob, "vocals.wav");
    } catch (error) {
      throw new Error("Failed to process the recorded audio data.");
    }
  } else {
    throw new Error("No vocals detected! Please record audio first.");
  }

  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : "";

  const response = await fetch(`${GPU_ENGINE_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Authorization': token ? `Bearer ${token}` : ""
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Production Node Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
