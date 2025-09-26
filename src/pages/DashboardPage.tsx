import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ShoppingBag, Euro, AlertTriangle, Plus, 
  CreditCard, TrendingUp, Clock, CheckCircle, Settings
} from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { dbService } from '../services/database';
import { DashboardStats, Settings as SettingsType } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    commandesEnCours: 0,
    commandesEnAttente: 0,
    commandesLivrees: 0,
    revenusMois: 0,
    revenusAnnee: 0,
    alertesCount: 0,
    paiementsEnAttente: 0,
    retouchesEnCours: 0,
    clientsActifs: 0
  });
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, appSettings] = await Promise.all([
        dbService.getDashboardStats(),
        dbService.getSettings()
      ]);
      setStats(dashboardStats);
      setSettings(appSettings);

      if (appSettings.couleurPrimaire) {
        document.documentElement.style.setProperty('--primary-color', appSettings.couleurPrimaire);
        document.documentElement.style.setProperty('--primary-hover', appSettings.couleurPrimaire + 'dd');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Ajouter client",
      icon: Users,
      color: "bg-blue-600",
      onClick: () => navigate('/clients/new')
    },
    {
      title: "Mes modèles",
      icon: ShoppingBag,
      color: "bg-purple-600",
      onClick: () => navigate('/mes-modeles')
    },
    {
      title: "Clients",
      icon: Users,
      color: "bg-indigo-600",
      onClick: () => navigate('/clients')
    },
    {
      title: "Nouvelle commande & Paiement",
      icon: CreditCard,
      color: "bg-orange-600",
      onClick: () => navigate('/commandes/new')
    }
  ];

  const mainStats = [
    {
      title: "Clients",
      value: stats.totalClients,
      icon: Users,
      color: "bg-blue-500",
      trend: `${stats.clientsActifs} actifs`
    },
    {
      title: "En cours",
      value: stats.commandesEnCours,
      icon: Clock,
      color: "bg-orange-500",
      trend: `${stats.commandesEnAttente} en attente`
    },
    {
      title: "Revenus (mois)",
      value: `${stats.revenusMois.toLocaleString()}`,
      icon: Euro,
      color: "bg-green-500",
      trend: settings?.devise || 'FCFA'
    },
    {
      title: "Alertes",
      value: stats.alertesCount,
      icon: AlertTriangle,
      color: stats.alertesCount > 0 ? "bg-red-500" : "bg-gray-400",
      trend: stats.alertesCount > 0 ? 'À traiter' : 'Aucune'
    }
  ];

  const secondaryStats = [
    {
      title: "Livrées",
      value: stats.commandesLivrees,
      icon: CheckCircle,
      color: "bg-emerald-500"
    },
    {
      title: "Paiements dus",
      value: stats.paiementsEnAttente,
      icon: CreditCard,
      color: stats.paiementsEnAttente > 0 ? "bg-red-500" : "bg-gray-400"
    },
    {
      title: "Retouches",
      value: stats.retouchesEnCours,
      icon: Settings,
      color: stats.retouchesEnCours > 0 ? "bg-yellow-500" : "bg-gray-400"
    },
    {
      title: "CA Année",
      value: `${(stats.revenusAnnee / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: "bg-indigo-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="COUTUPRO" />
        <div className="p-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md h-24 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-md h-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title={settings?.nomAtelier || "COUTUPRO"} 
        logo={settings?.logo}
        showSettings
      />

      <div className="p-4 space-y-8 fade-in">
        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Bonjour ! 👋
              </h2>
              <p className="text-gray-600">
                Gérez votre atelier de couture facilement
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Aujourd'hui</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-2 gap-4">
          {mainStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                {stat.trend && <p className="text-xs text-gray-400">{stat.trend}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-4 gap-6 text-center">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col items-center space-y-2 focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${action.color} shadow-md`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Statistics */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Aperçu détaillé
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {secondaryStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        {stats.alertesCount > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {stats.alertesCount} alerte{stats.alertesCount > 1 ? 's' : ''} en attente
                  </h4>
                  <p className="text-sm text-gray-600">
                    Vérifiez vos notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/alertes')}
                className="text-sm font-medium text-yellow-700 underline"
              >
                Voir
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation alertCount={stats.alertesCount} />
    </div>
  );
};
