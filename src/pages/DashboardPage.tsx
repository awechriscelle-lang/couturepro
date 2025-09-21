import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Euro, AlertTriangle, Plus, CreditCard } from 'lucide-react';
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

  // ✅ 4 grosses cartes CTA (CDC)
  const dashboardCards = [
    {
      title: "Clients",
      icon: Users,
      bgColor: "bg-[#1B7F4D]",
      onClick: () => navigate('/clients')
    },
    {
      title: "Commandes",
      icon: ShoppingBag,
      bgColor: "bg-[#3EBE72]",
      onClick: () => navigate('/commandes')
    },
    {
      title: "Alertes & Notifications",
      icon: AlertTriangle,
      bgColor: "bg-red-500",
      onClick: () => navigate('/alertes')
    },
    {
      title: "Services & coûts",
      icon: Euro,
      bgColor: "bg-[#0C3A24]",
      onClick: () => navigate('/services')
    }
  ];

  // ✅ Actions rapides (ajout client, commande, paiement)
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
        <div className="bg-gradient-to-r from-[#1B7F4D] to-[#3EBE72] text-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-1">Bonjour 👋</h2>
          <p className="text-sm opacity-90">Gérez votre atelier de couture facilement</p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Clients"
            value={stats.totalClients}
            icon={Users}
            color="bg-[#1B7F4D]"
          />
          <StatCard
            title="Commandes"
            value={stats.commandesEnCours}
            icon={ShoppingBag}
            color="bg-[#3EBE72]"
          />
          <StatCard
            title="Revenus (mois)"
            value={`${stats.revenusMois.toLocaleString()}€`}
            icon={Euro}
            color="bg-[#0C3A24]"
          />
          <StatCard
            title="Alertes"
            value={stats.alertesCount}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* 4 CTA */}
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
                <action.icon className="w-6 h-6 text-[#1B7F4D]" />
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
