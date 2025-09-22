import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { DashboardPage } from './pages/DashboardPage';
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
import { LoadingSpinner } from './components/LoadingSpinner';
import { MesModelesPage } from "./pages/MesModelesPage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('coutupro_authenticated');
    setIsAuthenticated(authStatus === 'true');

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  if (isAuthenticated === null) {
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
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/new" element={<NewClientPage />} />
              <Route path="/clients/:clientId" element={<ClientDetailPage />} />
              <Route path="/clients/:clientId/mesures/new" element={<NewMesuresPage />} />
              <Route path="/clients/:clientId/mesures/:mesuresId" element={<MesuresDetailPage />} />
              <Route path="/commandes" element={<CommandesPage />} />
              <Route path="/commandes/new" element={<NewCommandePage />} />
              <Route path="/commandes/:commandeId" element={<CommandeDetailPage />} />
              <Route path="/alertes" element={<AlertsPage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/mes-modeles" element={<MesModelesPage />} />
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