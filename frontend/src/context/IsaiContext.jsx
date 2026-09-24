import React, { createContext, useContext, useState, useEffect } from 'react';

const IsaiContext = createContext();

export const useIsai = () => {
  const context = useContext(IsaiContext);
  if (!context) {
    throw new Error('useIsai must be used within an IsaiProvider');
  }
  return context;
};

export const IsaiProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    mood: '',
    genre: '',
    tone_description: '',
    selected_instruments: [],
    lyrical_context: '',
    actual_lyrics: '',
    lyrics: '',
    vocal_file: localStorage.getItem('isai_vocal_cache') || null,
    status: 'idle', // idle, generating, completed, error
    results: null
  });

  // Load project history on init
  useEffect(() => {
    const savedProjects = localStorage.getItem('isai_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const updateProjectMetadata = (metadata) => {
    if (metadata.vocal_file) {
      localStorage.setItem('isai_vocal_cache', metadata.vocal_file);
    }
    setCurrentProject(prev => ({ ...prev, ...metadata }));
  };

  const resetProject = () => {
    setCurrentProject({
      name: '',
      mood: '',
      genre: '',
      tone_description: '',
      selected_instruments: [],
      lyrical_context: '',
      actual_lyrics: '',
      lyrics: '',
      vocal_file: null,
      status: 'idle',
      results: null
    });
    localStorage.removeItem('isai_vocal_cache');
  };

  const saveToDashboard = (project) => {
    // Create a lightweight metadata-only version of the project to save to localStorage history
    const strippedProject = {
      ...project,
      id: Date.now().toString(),
      vocal_file: null, // Remove heavy base64
      createdAt: new Date().toISOString()
    };

    if (strippedProject.results) {
      // Strip results audio tracks too
      strippedProject.results = {
        ...project.results,
        music_track: null,
        vocal_track: null,
        master_track: null
      };
    }

    const updatedProjects = [strippedProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('isai_projects', JSON.stringify(updatedProjects));
  };

  const value = {
    projects,
    currentProject,
    setCurrentProject,
    updateProjectMetadata,
    resetProject,
    saveToDashboard
  };

  return (
    <IsaiContext.Provider value={value}>
      {children}
    </IsaiContext.Provider>
  );
};
