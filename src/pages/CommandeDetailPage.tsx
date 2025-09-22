import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Calendar, Euro, Edit, Plus, CreditCard } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { dbService } from '../services/database';
import { Commande, Client, Mesures, Paiement } from '../types';

export const CommandeDetailPage: React.FC = () => {
  const { commandeId } = useParams<{ commandeId: string }>();
  const navigate = useNavigate();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [mesures, setMesures] = useState<Mesures | null>(null);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (commandeId) {
      loadCommandeData();
    }
  }, [commandeId]);

  const loadCommandeData = async () => {
    if (!commandeId) return;

    try {
      const commandeData = await dbService.getCommande(commandeId);
      if (!commandeData) return;

      const [clientData, mesuresData, paiementsData] = await Promise.all([
        dbService.getClient(commandeData.clientId),
        dbService.getMesures(commandeData.mesuresId),
        dbService.getPaiementsByCommande(commandeId)
      ]);

      setCommande(commandeData);
      setClient(clientData || null);
      setMesures(mesuresData || null);
      setPaiements(paiementsData);
      setNewStatus(commandeData.statut);
    } catch (error) {
      console.error('Error loading commande data:', error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commande || !paymentAmount) return;

    try {
      const montant = parseFloat(paymentAmount);
      const nouveauReste = commande.reste - montant;

      await dbService.createPaiement({
        commandeId: commande.id,
        montant,
        type: nouveauReste <= 0 ? 'Solde' : 'Acompte',
        date: new Date()
      });

      await dbService.updateCommande(commande.id, {
        acompte: commande.acompte + montant,
        reste: Math.max(0, nouveauReste),
        statutPaiement: nouveauReste <= 0 ? 'Complet' : 'Partiel'
      });

      setShowPaymentModal(false);
      setPaymentAmount('');
      loadCommandeData();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commande || !newStatus) return;

    try {
      await dbService.updateCommande(commande.id, { statut: newStatus as any });
      setShowStatusModal(false);
      loadCommandeData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
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

  if (!commande || !client) {
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
      <Header title="Détails Commande" showBack />

      <div className="p-4 space-y-6">
        {/* Commande Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{commande.modele}</h2>
                <p className="text-sm text-gray-500">
                  Commande du {new Date(commande.dateCommande).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(commande.statut)}`}>
              {commande.statut}
            </span>
          </div>

          {commande.photo && (
            <div className="mb-4">
              <img
                src={commande.photo}
                alt={commande.modele}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Client</p>
              <p className="font-medium">{client.nom} {client.prenoms}</p>
            </div>
            <div>
              <p className="text-gray-500">Livraison prévue</p>
              <p className="font-medium">{new Date(commande.dateLivraisonPrevue).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Montant total</p>
              <p className="font-medium">{commande.montantTotal.toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-gray-500">Reste à payer</p>
              <p className={`font-medium ${commande.reste > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {commande.reste.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-6 h-6" />
            <span className="text-sm font-medium">Statut</span>
          </button>
          {commande.reste > 0 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-green-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-green-700 transition-colors"
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm font-medium">Paiement</span>
            </button>
          )}
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Informations client</span>
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>Nom:</strong> {client.nom} {client.prenoms}</p>
            <p><strong>Téléphone:</strong> {client.telephone}</p>
            {client.email && <p><strong>Email:</strong> {client.email}</p>}
            {client.adresse && <p><strong>Adresse:</strong> {client.adresse}</p>}
          </div>
          <button
            onClick={() => navigate(`/clients/${client.id}`)}
            className="mt-3 text-[#5082BE] text-sm hover:text-[#4070A0] transition-colors"
          >
            Voir le profil complet
          </button>
        </div>

        {/* Mesures Info */}
        {mesures && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Mesures utilisées</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Tour poitrine</p>
                <p className="font-medium">{mesures.tourPoitrine} cm</p>
              </div>
              <div>
                <p className="text-gray-500">Tour taille</p>
                <p className="font-medium">{mesures.tourTaille} cm</p>
              </div>
              <div>
                <p className="text-gray-500">Tour bassin</p>
                <p className="font-medium">{mesures.tourBassin} cm</p>
              </div>
              <div>
                <p className="text-gray-500">Longueur robe</p>
                <p className="font-medium">{mesures.longueurRobe} cm</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/clients/${client.id}/mesures/${mesures.id}`)}
              className="mt-3 text-[#5082BE] text-sm hover:text-[#4070A0] transition-colors"
            >
              Voir toutes les mesures
            </button>
          </div>
        )}

        {/* Paiements */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">Historique des paiements</h3>
            {commande.reste > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-[#5082BE] hover:text-[#4070A0] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="p-4">
            {paiements.length > 0 ? (
              <div className="space-y-3">
                {paiements.map((paiement) => (
                  <div key={paiement.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">{paiement.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(paiement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      +{paiement.montant.toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun paiement enregistré</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentAmount('');
        }}
        title="Nouveau paiement"
      >
        <form onSubmit={handlePayment} className="p-4 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <p><strong>Reste à payer:</strong> {commande.reste.toLocaleString()} FCFA</p>
          </div>

          <FormField
            label="Montant (FCFA)"
            type="number"
            value={paymentAmount}
            onChange={setPaymentAmount}
            placeholder="0"
            required
          />

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentAmount('');
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Modifier le statut"
      >
        <form onSubmit={handleStatusUpdate} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nouveau statut
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent"
            >
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Retouche">Retouche</option>
              <option value="Livrée">Livrée</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier
            </button>
          </div>
        </form>
      </Modal>

      <BottomNavigation />
    </div>
  );
};