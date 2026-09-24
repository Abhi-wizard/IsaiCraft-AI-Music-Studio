import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIsai } from '../context/IsaiContext';
import { RootLayout } from '../components/layout/RootLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { StudioPage } from '../pages/StudioPage';
import { ResultsPage } from '../pages/ResultsPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser: user, loading } = useAuth();
  
  if (loading) return null; // Or a global loader
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </RootLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
