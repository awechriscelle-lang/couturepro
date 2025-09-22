// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Euro, AlertTriangle, Plus, CreditCard, LogOut, Settings, Shirt } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { DashboardCard } from '../components/DashboardCard';
import { StatCard } from '../components/StatCard';
import { dbService } from '../services/database';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    commandesEnCours: 0,
    revenusMois: 0,
    alertesCount: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const clients = await dbService.getAllClients();
      const commandes = await dbService.getAllCommandes();
      const alertes = await dbService.getUnreadAlertesCount();
      
      const commandesEnCours = commandes.filter(c => 
        c.statut === 'En cours' || c.statut === 'En attente'
      ).length;

      // Revenus du mois en cours
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const revenusMois = commandes
        .filter(c => {
          const commandeDate = new Date(c.dateCommande);
          return commandeDate.getMonth() === currentMonth && 
                 commandeDate.getFullYear() === currentYear;
        })
        .reduce((sum, c) => sum + c.montantTotal, 0);

      setStats({
        totalClients: clients.length,
        commandesEnCours,
        revenusMois,
        alertesCount: alertes
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // ✅ Mise à jour des cartes du tableau de bord
  const dashboardCards = [
    {
      title: "Accéder à mon espace",
      icon: LogOut,
      bgColor: "bg-teal-500",
      onClick: () => navigate('/clients')
    },
    {
      title: "Vérifier un document",
      icon: Settings,
      bgColor: "bg-red-500",
      onClick: () => navigate('/commandes')
    },
    {
      title: "Clients",
      icon: Users,
      bgColor: "bg-green-600",
      onClick: () => navigate('/clients')
    },
    {
      title: "Mes Modèles", // 🔄 remplacé ici
      icon: Shirt,
      bgColor: "bg-yellow-500",
      onClick: () => navigate('/mes-modeles')
    }
  ];

  const quickActions = [
    {
      title: "Ajouter client",
      icon: Plus,
      onClick: () => navigate('/clients/new')
    },
    {
      title: "Nouvelle commande",
      icon: ShoppingBag,
      onClick: () => navigate('/commandes/new')
    },
    {
      title: "Paiement",
      icon: CreditCard,
      onClick: () => navigate('/paiements')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="COUTUPRO" showMenu />

      <div className="p-4 space-y-6">
        {/* Message de bienvenue */}
        <div className="bg-gradient-to-r from-[#5082BE] to-[#1B7F4D] text-white p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-1">Bonjour ! 👋</h2>
          <p className="text-sm opacity-90">Gérez votre atelier de couture facilement</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Commandes"
            value={stats.commandesEnCours}
            icon={ShoppingBag}
            color="bg-green-500"
          />
          <StatCard
            title="Revenus (mois)"
            value={`${stats.revenusMois.toLocaleString()} FCFA`}
            icon={Euro}
            color="bg-purple-500"
          />
          <StatCard
            title="Alertes"
            value={stats.alertesCount}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Opérations principales */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Choisissez votre opération</h3>
          <div className="grid grid-cols-2 gap-4">
            {dashboardCards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                icon={card.icon}
                bgColor={card.bgColor}
                onClick={card.onClick}
              />
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center space-y-2 min-w-[100px] hover:shadow-md transition-shadow"
              >
                <action.icon className="w-6 h-6 text-[#5082BE]" />
                <span className="text-sm font-medium text-gray-700 text-center">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation alertCount={stats.alertesCount} />
    </div>
  );
};