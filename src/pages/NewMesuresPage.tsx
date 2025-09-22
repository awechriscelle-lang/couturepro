import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Ruler } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { FormField } from '../components/FormField';
import { dbService } from '../services/database';
import { Client } from '../types';

export const NewMesuresPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    dos: '',
    longueurManche: '',
    tourManche: '',
    longueurRobe: '',
    longueurJupe: '',
    longueurPantalon: '',
    longueurTaille: '',
    hauteurPoitrine: '',
    hauteurSousSein: '',
    encolure: '',
    carrure: '',
    tourPoitrine: '',
    tourSousSein: '',
    tourTaille: '',
    tourBassin: '',
    hauteurBassin: '',
    ceinture: '',
    basPantalon: '',
    tourGenou: '',
    commentaire: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadClient();
    }
  }, [clientId]);

  const loadClient = async () => {
    if (!clientId) return;
    try {
      const clientData = await dbService.getClient(clientId);
      setClient(clientData || null);
    } catch (error) {
      console.error('Error loading client:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    setIsLoading(true);
    try {
      const mesuresData = {
        clientId,
        dos: parseFloat(formData.dos) || 0,
        longueurManche: parseFloat(formData.longueurManche) || 0,
        tourManche: parseFloat(formData.tourManche) || 0,
        longueurRobe: parseFloat(formData.longueurRobe) || 0,
        longueurJupe: parseFloat(formData.longueurJupe) || 0,
        longueurPantalon: parseFloat(formData.longueurPantalon) || 0,
        longueurTaille: parseFloat(formData.longueurTaille) || 0,
        hauteurPoitrine: parseFloat(formData.hauteurPoitrine) || 0,
        hauteurSousSein: parseFloat(formData.hauteurSousSein) || 0,
        encolure: parseFloat(formData.encolure) || 0,
        carrure: parseFloat(formData.carrure) || 0,
        tourPoitrine: parseFloat(formData.tourPoitrine) || 0,
        tourSousSein: parseFloat(formData.tourSousSein) || 0,
        tourTaille: parseFloat(formData.tourTaille) || 0,
        tourBassin: parseFloat(formData.tourBassin) || 0,
        hauteurBassin: parseFloat(formData.hauteurBassin) || 0,
        ceinture: parseFloat(formData.ceinture) || 0,
        basPantalon: parseFloat(formData.basPantalon) || 0,
        tourGenou: parseFloat(formData.tourGenou) || 0,
        commentaire: formData.commentaire.trim(),
        date: new Date()
      };

      const newMesures = await dbService.createMesures(mesuresData);
      navigate(`/clients/${clientId}/mesures/${newMesures.id}`);
    } catch (error) {
      console.error('Error creating mesures:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <Header title="Nouvelles Mesures" showBack />

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Prendre les mesures</h2>
              <p className="text-sm text-gray-600">{client.nom} {client.prenoms}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {categories.map(category => (
              <div key={category} className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {mesuresFields
                    .filter(field => field.category === category)
                    .map(field => (
                      <FormField
                        key={field.key}
                        label={`${field.label} (cm)`}
                        type="number"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(value) => updateField(field.key as keyof typeof formData, value)}
                        placeholder="0"
                      />
                    ))}
                </div>
              </div>
            ))}

            <FormField
              label="Commentaires"
              value={formData.commentaire}
              onChange={(value) => updateField('commentaire', value)}
              placeholder="Notes particulières, observations..."
              rows={3}
            />

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5082BE] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#4070A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Enregistrement...' : 'Enregistrer les mesures'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};