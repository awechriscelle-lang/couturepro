import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingBag, Calendar, Euro } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { dbService } from '../services/database';
import { Commande, Client } from '../types';

export const CommandesPage: React.FC = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommandes, setFilteredCommandes] = useState<Commande[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCommandes();
  }, [searchTerm, commandes, filterStatus]);

  const loadData = async () => {
    try {
      const [commandesData, clientsData] = await Promise.all([
        dbService.getAllCommandes(),
        dbService.getAllClients()
      ]);
      setCommandes(commandesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filterCommandes = () => {
    let filtered = commandes;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(commande => commande.statut === filterStatus);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(commande => {
        const client = clients.find(c => c.id === commande.clientId);
        const clientName = client ? `${client.nom} ${client.prenoms}` : '';
        return (
          commande.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clientName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredCommandes(filtered);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.nom} ${client.prenoms}` : 'Client inconnu';
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En attente':
        return 'bg-gray-100 text-gray-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Retouche':
        return 'bg-yellow-100 text-yellow-800';
      case 'Livrée':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'En attente', label: 'En attente' },
    { value: 'En cours', label: 'En cours' },
    { value: 'Retouche', label: 'Retouche' },
    { value: 'Livrée', label: 'Livrée' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Commandes" showBack />

      <div className="p-4 space-y-6">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Command Button */}
        <button
          onClick={() => navigate('/commandes/new')}
          className="w-full bg-[#5082BE] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#4070A0] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle commande</span>
        </button>

        {/* Commands List */}
        <div className="space-y-3">
          {filteredCommandes.length > 0 ? (
            filteredCommandes.map((commande) => (
              <div
                key={commande.id}
                onClick={() => navigate(`/commandes/${commande.id}`)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {commande.modele}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getClientName(commande.clientId)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(commande.statut)}`}>
                    {commande.statut}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(commande.dateCommande).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Euro className="w-4 h-4" />
                      <span>{commande.montantTotal.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">Livraison prévue</p>
                    <p className="font-medium">
                      {new Date(commande.dateLivraisonPrevue).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {commande.reste > 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    Reste à payer: {commande.reste.toLocaleString()} FCFA
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              {searchTerm || filterStatus !== 'all' ? (
                <div>
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
                  <p className="text-gray-600">
                    Aucune commande trouvée avec ces critères
                  </p>
                </div>
              ) : (
                <div>
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par créer votre première commande
                  </p>
                  <button
                    onClick={() => navigate('/commandes/new')}
                    className="bg-[#5082BE] text-white px-6 py-2 rounded-lg hover:bg-[#4070A0] transition-colors"
                  >
                    Nouvelle commande
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};