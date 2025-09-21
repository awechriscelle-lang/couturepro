import React, { useState } from 'react';
import { Download, Upload, Trash2, LogOut, Settings, FileText, Shield } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Modal } from '../components/Modal';
import { dbService } from '../services/database';

export const ProfilePage: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const data = await dbService.exportData();
      setExportData(data);
      setShowExportModal(true);
    } catch (error) {
      setMessage('Erreur lors de l\'export');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) return;
    
    setIsLoading(true);
    try {
      await dbService.importData(importData);
      setMessage('Données importées avec succès');
      setShowImportModal(false);
      setImportData('');
    } catch (error) {
      setMessage('Erreur lors de l\'import - Vérifiez le format des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await dbService.clearAllData();
      setMessage('Toutes les données ont été supprimées');
      setShowResetModal(false);
    } catch (error) {
      setMessage('Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExport = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coutupro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    setMessage('Fichier de sauvegarde téléchargé');
  };

  const handleLogout = () => {
    localStorage.removeItem('coutupro_authenticated');
    window.location.href = '/auth';
  };

  const menuItems = [
    {
      title: 'Sauvegarder les données',
      subtitle: 'Exporter toutes vos données',
      icon: Download,
      onClick: handleExport,
      color: 'text-blue-600'
    },
    {
      title: 'Restaurer les données',
      subtitle: 'Importer des données sauvegardées',
      icon: Upload,
      onClick: () => setShowImportModal(true),
      color: 'text-green-600'
    },
    {
      title: 'Réinitialiser',
      subtitle: 'Supprimer toutes les données',
      icon: Trash2,
      onClick: () => setShowResetModal(true),
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Profil" showBack />

      <div className="p-4 space-y-6">
        {/* App Info */}
        <div className="bg-gradient-to-r from-[#5082BE] to-[#1B7F4D] text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">COUTUPRO</h2>
              <p className="text-sm opacity-90">Gestion d'atelier de couture</p>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-4">Version 1.0.0</p>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              disabled={isLoading}
              className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow disabled:opacity-50"
            >
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Documentation</span>
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Sauvegarde :</strong> Exporte toutes vos données en format JSON</p>
            <p>• <strong>Restauration :</strong> Importe des données depuis un fichier de sauvegarde</p>
            <p>• <strong>Réinitialisation :</strong> Supprime définitivement toutes les données</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Se déconnecter</span>
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Développée par <strong>Rénato TCHOBO</strong></p>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Données exportées"
        maxWidth="max-w-2xl"
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Vos données ont été exportées avec succès. Vous pouvez copier le contenu ou télécharger le fichier.
          </p>
          <textarea
            value={exportData}
            readOnly
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50"
            placeholder="Données exportées..."
          />
          <div className="flex space-x-3">
            <button
              onClick={downloadExport}
              className="flex-1 bg-[#5082BE] text-white py-2 rounded-lg hover:bg-[#4070A0] transition-colors"
            >
              Télécharger
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(exportData);
                setMessage('Données copiées dans le presse-papier');
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Copier
            </button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Importer des données"
        maxWidth="max-w-2xl"
      >
        <div className="p-4 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
            <Shield className="w-4 h-4 inline mr-1" />
            <strong>Attention :</strong> Cette action ajoutera les données à celles existantes. 
            Les doublons peuvent être créés.
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Données JSON à importer
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Collez ici le contenu JSON de votre sauvegarde..."
              className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs font-mono"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowImportModal(false);
                setImportData('');
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              disabled={!importData.trim() || isLoading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Import...' : 'Importer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Réinitialiser toutes les données"
      >
        <div className="p-4 space-y-4">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Trash2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Action irréversible</h4>
                <p className="text-sm">
                  Cette action supprimera définitivement toutes vos données :
                  clients, mesures, commandes, paiements et retouches.
                </p>
                <p className="text-sm font-semibold mt-2">
                  Assurez-vous d'avoir fait une sauvegarde avant de continuer.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowResetModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Suppression...' : 'Tout supprimer'}
            </button>
          </div>
        </div>
      </Modal>

      <BottomNavigation />
    </div>
  );
};