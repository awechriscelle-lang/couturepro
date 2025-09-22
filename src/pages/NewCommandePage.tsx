import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ShoppingBag, Calendar, Euro, User } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { FormField } from '../components/FormField';
import { dbService } from '../services/database';
import { Client, Mesures } from '../types';

export const NewCommandePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get('clientId');

  const [clients, setClients] = useState<Client[]>([]);
  const [mesures, setMesures] = useState<Mesures[]>([]);
  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    mesuresId: '',
    modele: '',
    dateLivraisonPrevue: '',
    montantTotal: '',
    acompte: '',
    photo: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (formData.clientId) {
      loadMesuresForClient(formData.clientId);
    }
  }, [formData.clientId]);

  const loadClients = async () => {
    try {
      const clientsList = await dbService.getAllClients();
      setClients(clientsList);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadMesuresForClient = async (clientId: string) => {
    try {
      const mesuresList = await dbService.getMesuresByClient(clientId);
      setMesures(mesuresList);
      if (mesuresList.length > 0) {
        setFormData(prev => ({ ...prev, mesuresId: mesuresList[0].id }));
      }
    } catch (error) {
      console.error('Error loading mesures:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.mesuresId || !formData.modele || !formData.montantTotal) {
      return;
    }

    setIsLoading(true);
    try {
      const montantTotal = parseFloat(formData.montantTotal);
      const acompte = parseFloat(formData.acompte) || 0;
      const reste = montantTotal - acompte;

      const newCommande = await dbService.createCommande({
        clientId: formData.clientId,
        mesuresId: formData.mesuresId,
        modele: formData.modele.trim(),
        photo: formData.photo.trim() || undefined,
        dateCommande: new Date(),
        dateLivraisonPrevue: new Date(formData.dateLivraisonPrevue),
        statut: 'En attente',
        montantTotal,
        acompte,
        reste,
        statutPaiement: acompte >= montantTotal ? 'Complet' : acompte > 0 ? 'Partiel' : 'En attente'
      });

      // Créer le paiement de l'acompte si nécessaire
      if (acompte > 0) {
        await dbService.createPaiement({
          commandeId: newCommande.id,
          montant: acompte,
          type: 'Acompte',
          date: new Date()
        });
      }

      navigate(`/commandes/${newCommande.id}`);
    } catch (error) {
      console.error('Error creating commande:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.nom} ${client.prenoms}` : '';
  };

  const getMesureDate = (mesureId: string) => {
    const mesure = mesures.find(m => m.id === mesureId);
    return mesure ? new Date(mesure.date).toLocaleDateString() : '';
  };

  // Date minimum (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Nouvelle Commande" showBack />

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Nouvelle commande</h2>
              <p className="text-sm text-gray-600">Créez une nouvelle commande pour un client</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => updateField('clientId', e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenoms}
                  </option>
                ))}
              </select>
              {!formData.clientId && clients.length === 0 && (
                <p className="text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => navigate('/clients/new')}
                    className="text-[#5082BE] hover:text-[#4070A0]"
                  >
                    Créer un nouveau client
                  </button>
                </p>
              )}
            </div>

            {/* Mesures Selection */}
            {formData.clientId && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mesures <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.mesuresId}
                  onChange={(e) => updateField('mesuresId', e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent"
                >
                  <option value="">Sélectionner des mesures</option>
                  {mesures.map(mesure => (
                    <option key={mesure.id} value={mesure.id}>
                      Mesures du {new Date(mesure.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {mesures.length === 0 && (
                  <p className="text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => navigate(`/clients/${formData.clientId}/mesures/new`)}
                      className="text-[#5082BE] hover:text-[#4070A0]"
                    >
                      Prendre les mesures de ce client
                    </button>
                  </p>
                )}
              </div>
            )}

            <FormField
              label="Modèle"
              value={formData.modele}
              onChange={(value) => updateField('modele', value)}
              placeholder="Nom du modèle ou description"
              required
            />

            <FormField
              label="Date de livraison prévue"
              type="date"
              value={formData.dateLivraisonPrevue}
              onChange={(value) => updateField('dateLivraisonPrevue', value)}
              required
            />

            <FormField
              label="Montant total (FCFA)"
              type="number"
              value={formData.montantTotal}
              onChange={(value) => updateField('montantTotal', value)}
              placeholder="0"
              required
            />

            <FormField
              label="Acompte (FCFA)"
              type="number"
              value={formData.acompte}
              onChange={(value) => updateField('acompte', value)}
              placeholder="0"
            />

            {formData.montantTotal && formData.acompte && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Reste à payer:</strong> {' '}
                  {(parseFloat(formData.montantTotal) - parseFloat(formData.acompte)).toLocaleString()} FCFA
                </p>
              </div>
            )}

            <FormField
              label="Photo (URL)"
              value={formData.photo}
              onChange={(value) => updateField('photo', value)}
              placeholder="URL de la photo du modèle (optionnel)"
            />

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !formData.clientId || !formData.mesuresId || !formData.modele || !formData.montantTotal}
                className="w-full bg-[#5082BE] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#4070A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Création...' : 'Créer la commande'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};