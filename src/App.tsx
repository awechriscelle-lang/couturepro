import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { ClientsPage } from './pages/ClientsPage';
import { NewClientPage } from './pages/NewClientPage';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CommandesPage } from './pages/CommandesPage';
import { NewCommandePage } from './pages/NewCommandePage';
import { CommandeDetailPage } from './pages/CommandeDetailPage';
import { NewMesuresPage } from './pages/NewMesuresPage';
import { MesuresDetailPage } from './pages/MesuresDetailPage';
import { MesModelesPage } from './pages/MesModelesPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { dbService } from './services/database';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check authentication status
      const authStatus = localStorage.getItem('coutupro_authenticated');
      
      if (authStatus === 'true') {
        // Validate session with browser fingerprinting
        const isValidSession = await dbService.validateSession();
        setIsAuthenticated(isValidSession);
        
        if (!isValidSession) {
          // Clear invalid session
          localStorage.removeItem('coutupro_authenticated');
          localStorage.removeItem('coutupro_browser_hash');
        }
      } else {
        setIsAuthenticated(false);
      }

      // Initialize settings and apply theme
      if (authStatus === 'true') {
        const settings = await dbService.getSettings();
        if (settings.couleurPrimaire) {
          document.documentElement.style.setProperty('--primary-color', settings.couleurPrimaire);
          document.documentElement.style.setProperty('--primary-hover', settings.couleurPrimaire + 'dd');
        }
      }

      // Register service worker for PWA
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
        } catch (registrationError) {
          console.log('SW registration failed: ', registrationError);
        }
      }

    } catch (error) {
      console.error('App initialization error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsInitialized(true);
    }
  };

  if (!isInitialized || isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin-secret" element={<AdminPage />} />

          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/new" element={<NewClientPage />} />
              <Route path="/clients/:clientId" element={<ClientDetailPage />} />
              <Route path="/clients/:clientId/mesures/new" element={<NewMesuresPage />} />
              <Route path="/clients/:clientId/mesures/:mesuresId" element={<MesuresDetailPage />} />
              <Route path="/commandes" element={<CommandesPage />} />
              <Route path="/commandes/new" element={<NewCommandePage />} />
              <Route path="/commandes/:commandeId" element={<CommandeDetailPage />} />
              <Route path="/mes-modeles" element={<MesModelesPage />} />
              <Route path="/alertes" element={<AlertsPage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;