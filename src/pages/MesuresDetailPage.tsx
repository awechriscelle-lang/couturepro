import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ruler, User, Calendar, Edit, Printer } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { dbService } from '../services/database';
import { Mesures, Client } from '../types';

export const MesuresDetailPage: React.FC = () => {
  const { clientId, mesuresId } = useParams<{ clientId: string; mesuresId: string }>();
  const navigate = useNavigate();
  const [mesures, setMesures] = useState<Mesures | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (mesuresId && clientId) {
      loadData();
    }
  }, [mesuresId, clientId]);

  const loadData = async () => {
    if (!mesuresId || !clientId) return;

    try {
      const [mesuresData, clientData] = await Promise.all([
        dbService.getMesures(mesuresId),
        dbService.getClient(clientId)
      ]);

      setMesures(mesuresData || null);
      setClient(clientData || null);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const mesuresFields = [
    { key: 'dos', label: 'Dos', category: 'Longueurs' },
    { key: 'longueurManche', label: 'Longueur manche', category: 'Longueurs' },
    { key: 'longueurRobe', label: 'Longueur robe', category: 'Longueurs' },
    { key: 'longueurJupe', label: 'Longueur jupe', category: 'Longueurs' },
    { key: 'longueurPantalon', label: 'Longueur pantalon', category: 'Longueurs' },
    { key: 'longueurTaille', label: 'Longueur taille', category: 'Longueurs' },
    { key: 'hauteurPoitrine', label: 'Hauteur poitrine', category: 'Hauteurs' },
    { key: 'hauteurSousSein', label: 'Hauteur sous-sein', category: 'Hauteurs' },
    { key: 'hauteurBassin', label: 'Hauteur bassin', category: 'Hauteurs' },
    { key: 'encolure', label: 'Encolure', category: 'Tours' },
    { key: 'carrure', label: 'Carrure', category: 'Tours' },
    { key: 'tourPoitrine', label: 'Tour poitrine', category: 'Tours' },
    { key: 'tourSousSein', label: 'Tour sous-sein', category: 'Tours' },
    { key: 'tourTaille', label: 'Tour taille', category: 'Tours' },
    { key: 'tourBassin', label: 'Tour bassin', category: 'Tours' },
    { key: 'tourManche', label: 'Tour manche', category: 'Tours' },
    { key: 'tourGenou', label: 'Tour genou', category: 'Tours' },
    { key: 'ceinture', label: 'Ceinture', category: 'Autres' },
    { key: 'basPantalon', label: 'Bas pantalon', category: 'Autres' }
  ];

  const categories = ['Longueurs', 'Hauteurs', 'Tours', 'Autres'];

  if (!mesures || !client) {
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
      <Header title="Détails Mesures" showBack />

      <div className="p-4 space-y-6">
        {/* Header Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{client.nom} {client.prenoms}</h2>
                <p className="text-sm text-gray-500 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Mesures du {new Date(mesures.date).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/clients/${clientId}/mesures/${mesuresId}/edit`)}
              className="p-2 text-gray-400 hover:text-[#5082BE] transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3 text-gray-700">
            <User className="w-5 h-5 text-[#5082BE]" />
            <span>{client.telephone}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/commandes/new?clientId=${clientId}&mesuresId=${mesuresId}`)}
            className="bg-green-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-green-700 transition-colors"
          >
            <Edit className="w-6 h-6" />
            <span className="text-sm font-medium">Nouvelle commande</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-6 h-6" />
            <span className="text-sm font-medium">Imprimer</span>
          </button>
        </div>

        {/* Mesures Details */}
        {categories.map(category => (
          <div key={category} className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">{category}</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {mesuresFields
                  .filter(field => field.category === category)
                  .map(field => {
                    const value = mesures[field.key as keyof Mesures] as number;
                    return (
                      <div key={field.key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600">{field.label}</span>
                        <span className="font-medium">{value || 0} cm</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}

        {/* Commentaires */}
        {mesures.commentaire && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Commentaires</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {mesures.commentaire}
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};