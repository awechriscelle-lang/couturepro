import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Ruler, ShoppingBag, Plus, Edit } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Modal } from '../components/Modal';
import { dbService } from '../services/database';
import { Client, Mesures, Commande } from '../types';

export const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [mesures, setMesures] = useState<Mesures[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [showMesuresModal, setShowMesuresModal] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
    if (!clientId) return;

    try {
      const [clientData, mesuresData, commandesData] = await Promise.all([
        dbService.getClient(clientId),
        dbService.getMesuresByClient(clientId),
        dbService.getCommandesByClient(clientId)
      ]);

      setClient(clientData || null);
      setMesures(mesuresData);
      setCommandes(commandesData);
    } catch (error) {
      console.error('Error loading client data:', error);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5082BE] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Détails Client" showBack />

      <div className="p-4 space-y-6">
        {/* Client Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-[#5082BE] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {client.nom} {client.prenoms}
              </h2>
              <p className="text-sm text-gray-500">
                Client depuis le {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => navigate(`/clients/${client.id}/edit`)}
              className="p-2 text-gray-400 hover:text-[#5082BE] transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="w-5 h-5 text-[#5082BE]" />
              <span>{client.telephone}</span>
            </div>
            
            {client.email && (
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="w-5 h-5 text-[#5082BE]" />
                <span>{client.email}</span>
              </div>
            )}
            
            {client.adresse && (
              <div className="flex items-start space-x-3 text-gray-700">
                <MapPin className="w-5 h-5 text-[#5082BE] mt-0.5" />
                <span>{client.adresse}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Prendre mesures */}
          <button
            onClick={() => navigate(`/clients/${client.id}/mesures/new`)}
            className="bg-green-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-green-700 transition-colors"
          >
            <Ruler className="w-6 h-6" />
            <span className="text-sm font-medium">Prendre mesures</span>
          </button>

          {/* Voir mesures existantes */}
          <button
            onClick={() => setShowMesuresModal(true)}
            className="bg-gray-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-gray-700 transition-colors"
          >
            <Ruler className="w-6 h-6" />
            <span className="text-sm font-medium">Voir mesures</span>
          </button>

          {/* Créer commande */}
          <button
            onClick={() => navigate(`/commandes/new?clientId=${client.id}`)}
            className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Commande</span>
          </button>
        </div>

        {/* Mesures Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Ruler className="w-5 h-5" />
              <span>Mesures ({mesures.length})</span>
            </h3>
            <button
              onClick={() => navigate(`/clients/${client.id}/mesures/new`)}
              className="text-[#5082BE] hover:text-[#4070A0] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            {mesures.length > 0 ? (
              <div className="space-y-3">
                {mesures.slice(0, 2).map((mesure) => (
                  <div
                    key={mesure.id}
                    onClick={() => navigate(`/clients/${client.id}/mesures/${mesure.id}`)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {new Date(mesure.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">Tour poitrine: {mesure.tourPoitrine}cm</span>
                    </div>
                    {mesure.commentaire && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{mesure.commentaire}</p>
                    )}
                  </div>
                ))}
                {mesures.length > 2 && (
                  <button
                    onClick={() => setShowMesuresModal(true)}
                    className="text-[#5082BE] text-sm hover:text-[#4070A0] transition-colors"
                  >
                    Voir toutes les mesures ({mesures.length})
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Ruler className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune mesure enregistrée</p>
                <button
                  onClick={() => navigate(`/clients/${client.id}/mesures/new`)}
                  className="text-[#5082BE] text-sm mt-2 hover:text-[#4070A0] transition-colors"
                >
                  Ajouter des mesures
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Commandes Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Commandes ({commandes.length})</span>
            </h3>
            <button
              onClick={() => navigate(`/commandes/new?clientId=${client.id}`)}
              className="text-[#5082BE] hover:text-[#4070A0] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            {commandes.length > 0 ? (
              <div className="space-y-3">
                {commandes.slice(0, 3).map((commande) => (
                  <div
                    key={commande.id}
                    onClick={() => navigate(`/commandes/${commande.id}`)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{commande.modele}</span>
                        <p className="text-sm text-gray-500">
                          {new Date(commande.dateCommande).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          commande.statut === 'Livrée' ? 'bg-green-100 text-green-800' :
                          commande.statut === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          commande.statut === 'Retouche' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {commande.statut}
                        </span>
                        <p className="text-sm font-medium mt-1">{commande.montantTotal.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </div>
                ))}
                {commandes.length > 3 && (
                  <button
                    onClick={() => navigate('/commandes')}
                    className="text-[#5082BE] text-sm hover:text-[#4070A0] transition-colors"
                  >
                    Voir toutes les commandes ({commandes.length})
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune commande</p>
                <button
                  onClick={() => navigate(`/commandes/new?clientId=${client.id}`)}
                  className="text-[#5082BE] text-sm mt-2 hover:text-[#4070A0] transition-colors"
                >
                  Créer une commande
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mesures Modal */}
      <Modal
        isOpen={showMesuresModal}
        onClose={() => setShowMesuresModal(false)}
        title="Toutes les mesures"
        maxWidth="max-w-2xl"
      >
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {mesures.map((mesure) => (
            <div
              key={mesure.id}
              onClick={() => {
                setShowMesuresModal(false);
                navigate(`/clients/${client.id}/mesures/${mesure.id}`);
              }}
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {new Date(mesure.date).toLocaleDateString()}
                </span>
                <span className="text-sm text-[#5082BE]">Voir détails</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <span>Tour poitrine: {mesure.tourPoitrine}cm</span>
                <span>Tour taille: {mesure.tourTaille}cm</span>
                <span>Tour bassin: {mesure.tourBassin}cm</span>
                <span>Longueur robe: {mesure.longueurRobe}cm</span>
              </div>
              {mesure.commentaire && (
                <p className="text-sm text-gray-600 mt-2 italic line-clamp-2">
                  {mesure.commentaire}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      <BottomNavigation />
    </div>
  );
};
