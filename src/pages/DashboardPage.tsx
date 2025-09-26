import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ShoppingBag, Euro, AlertTriangle, Plus, 
  CreditCard, TrendingUp, Clock, CheckCircle, Settings
} from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { DashboardCard } from '../components/DashboardCard';
import { StatCard } from '../components/StatCard';
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
    
    // Auto-refresh every 30 seconds
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
      
      // Apply theme
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
      icon: Plus,
      color: "bg-green-600",
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
      color: "bg-blue-600",
      onClick: () => navigate('/clients')
    },
    {
      title: "Nouvelle commande",
      icon: Plus,
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
          {/* Loading skeletons */}
          <div className="bg-white rounded-xl p-6 loading-skeleton h-24"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 loading-skeleton h-24"></div>
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

      <div className="p-4 space-y-6 fade-in">
        {/* Welcome Message */}
        <div className="professional-card primary p-6">
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
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              onClick={() => {
                if (stat.title === 'Clients') navigate('/clients');
                else if (stat.title === 'En cours') navigate('/commandes');
                else if (stat.title === 'Alertes') navigate('/alertes');
              }}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Choisissez votre opération
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <DashboardCard
                key={index}
                title={action.title}
                icon={action.icon}
                bgColor={action.color}
                onClick={action.onClick}
              />
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
              <div key={index} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Preview */}
        {stats.alertesCount > 0 && (
          <div className="professional-card warning p-4">
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
                className="btn-primary text-sm px-4 py-2"
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