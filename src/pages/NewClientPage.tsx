import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { FormField } from '../components/FormField';
import { dbService } from '../services/database';

export const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    telephone: '',
    email: '',
    adresse: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.prenoms.trim() || !formData.telephone.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const newClient = await dbService.createClient({
        nom: formData.nom.trim(),
        prenoms: formData.prenoms.trim(),
        telephone: formData.telephone.trim(),
        email: formData.email.trim() || undefined,
        adresse: formData.adresse.trim()
      });
      
      navigate(`/clients/${newClient.id}`);
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Nouveau Client" showBack />

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Informations client</h2>
              <p className="text-sm text-gray-600">Remplissez les informations du nouveau client</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Nom"
              value={formData.nom}
              onChange={(value) => updateField('nom', value)}
              placeholder="Nom de famille"
              required
            />

            <FormField
              label="Prénoms"
              value={formData.prenoms}
              onChange={(value) => updateField('prenoms', value)}
              placeholder="Prénoms"
              required
            />

            <FormField
              label="Téléphone"
              type="tel"
              value={formData.telephone}
              onChange={(value) => updateField('telephone', value)}
              placeholder="Numéro de téléphone"
              required
            />

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              placeholder="Adresse email (optionnel)"
            />

            <FormField
              label="Adresse"
              value={formData.adresse}
              onChange={(value) => updateField('adresse', value)}
              placeholder="Adresse complète"
              rows={3}
            />

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !formData.nom.trim() || !formData.prenoms.trim() || !formData.telephone.trim()}
                className="w-full bg-[#5082BE] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#4070A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Création...' : 'Créer le client'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};