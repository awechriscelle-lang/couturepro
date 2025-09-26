import React, { useState, useEffect } from 'react';
import { Save, Upload, Palette, Building, Download } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { FormField } from '../components/FormField';
import { Modal } from '../components/Modal';
import { dbService } from '../services/database';
import { Settings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState({
    nomAtelier: '',
    couleurPrimaire: '#0A3764',
    logo: '',
    adresse: '',
    telephone: '',
    email: '',
    devise: 'FCFA'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const predefinedColors = [
    { name: 'Bleu Marine', value: '#0A3764' },
    { name: 'Vert Émeraude', value: '#10b981' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const appSettings = await dbService.getSettings();
      setSettings(appSettings);
      setFormData({
        nomAtelier: appSettings.nomAtelier,
        couleurPrimaire: appSettings.couleurPrimaire,
        logo: appSettings.logo || '',
        adresse: appSettings.adresse || '',
        telephone: appSettings.telephone || '',
        email: appSettings.email || '',
        devise: appSettings.devise
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await dbService.updateSettings({
        nomAtelier: formData.nomAtelier,
        couleurPrimaire: formData.couleurPrimaire,
        logo: formData.logo || undefined,
        adresse: formData.adresse || undefined,
        telephone: formData.telephone || undefined,
        email: formData.email || undefined,
        devise: formData.devise
      });
      
      setMessage('Paramètres sauvegardés avec succès !');
      setTimeout(() => setMessage(''), 3000);
      
      // Apply theme immediately
      document.documentElement.style.setProperty('--primary-color', formData.couleurPrimaire);
      
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorSelect = (color: string) => {
    updateField('couleurPrimaire', color);
    setShowColorPicker(false);
    
    // Apply theme immediately for preview
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateField('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3764] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Paramètres" showBack />

      <div className="p-4 space-y-6">
        {/* Message */}
        {message && (
          <div className={`professional-card ${message.includes('succès') ? 'success' : 'danger'} p-4`}>
            <p className="text-center font-medium">{message}</p>
          </div>
        )}

        {/* Personnalisation */}
        <div className="professional-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Personnalisation</h2>
              <p className="text-sm text-gray-600">Personnalisez l'apparence de votre atelier</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Nom de l'atelier"
              value={formData.nomAtelier}
              onChange={(value) => updateField('nomAtelier', value)}
              placeholder="Mon Atelier de Couture"
              required
            />

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Couleur principale
              </label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: formData.couleurPrimaire }}
                  onClick={() => setShowColorPicker(true)}
                />
                <input
                  type="text"
                  value={formData.couleurPrimaire}
                  onChange={(e) => updateField('couleurPrimaire', e.target.value)}
                  className="form-input flex-1"
                  placeholder="#0A3764"
                />
                <button
                  type="button"
                  onClick={() => setShowColorPicker(true)}
                  className="btn-secondary px-4 py-2"
                >
                  Choisir
                </button>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Logo de l'atelier
              </label>
              <div className="flex items-center space-x-3">
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="w-12 h-12 object-cover rounded-lg border-2 border-gray-300"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="btn-secondary px-4 py-2 cursor-pointer flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choisir une image</span>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Format recommandé: PNG ou JPG, taille max: 2MB
              </p>
            </div>

            <FormField
              label="Devise"
              value={formData.devise}
              onChange={(value) => updateField('devise', value)}
              placeholder="FCFA"
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Informations de l'atelier */}
        <div className="professional-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Informations</h2>
              <p className="text-sm text-gray-600">Coordonnées de votre atelier</p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              label="Adresse"
              value={formData.adresse}
              onChange={(value) => updateField('adresse', value)}
              placeholder="Adresse complète de l'atelier"
              rows={2}
            />

            <FormField
              label="Téléphone"
              type="tel"
              value={formData.telephone}
              onChange={(value) => updateField('telephone', value)}
              placeholder="Numéro de téléphone"
            />

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              placeholder="Adresse email"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="professional-card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu</h3>
          <div className="space-y-3">
            <div 
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: formData.couleurPrimaire }}
            >
              <div className="flex items-center space-x-3">
                {formData.logo && (
                  <img src={formData.logo} alt="Logo" className="w-8 h-8 object-cover rounded" />
                )}
                <h4 className="font-bold">{formData.nomAtelier}</h4>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Couleur: {formData.couleurPrimaire}</p>
              <p>Devise: {formData.devise}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      <Modal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        title="Choisir une couleur"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-gray-600 text-center">{color.name}</span>
              </button>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur personnalisée
            </label>
            <input
              type="color"
              value={formData.couleurPrimaire}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </Modal>

      <BottomNavigation />
    </div>
  );
};