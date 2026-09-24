import React from 'react';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <AppRouter />
    </div>
  );
}

export default App;
