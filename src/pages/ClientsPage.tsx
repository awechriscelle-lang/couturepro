import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Phone, Mail, User } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { dbService } from '../services/database';
import { Client } from '../types';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone.includes(searchTerm)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const loadClients = async () => {
    try {
      const clientsList = await dbService.getAllClients();
      setClients(clientsList);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Clients" showBack />

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent"
          />
        </div>

        {/* Add Client Button */}
        <button
          onClick={() => navigate('/clients/new')}
          className="w-full bg-[#5082BE] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#4070A0] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un client</span>
        </button>

        {/* Clients List */}
        <div className="space-y-3">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {client.nom} {client.prenoms}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{client.telephone}</span>
                      </div>
                      
                      {client.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {client.adresse}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              {searchTerm ? (
                <div>
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
                  <p className="text-gray-600">
                    Aucun client trouvé pour "{searchTerm}"
                  </p>
                </div>
              ) : (
                <div>
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par ajouter votre premier client
                  </p>
                  <button
                    onClick={() => navigate('/clients/new')}
                    className="bg-[#5082BE] text-white px-6 py-2 rounded-lg hover:bg-[#4070A0] transition-colors"
                  >
                    Ajouter un client
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