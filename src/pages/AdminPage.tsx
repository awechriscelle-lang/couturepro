import React, { useState, useEffect } from 'react';
import { Shield, Plus, List, Check, X } from 'lucide-react';
import { dbService } from '../services/database';
import { AccessCode } from '../types';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';

export const AdminPage: React.FC = () => {
  const [masterCode, setMasterCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState('');

  const MASTER_CODE = 'ADMIN_COUTUPRO_2024';

  useEffect(() => {
    if (isAuthenticated) {
      loadAccessCodes();
    }
  }, [isAuthenticated]);

  const loadAccessCodes = async () => {
    try {
      const codes = await dbService.getAllAccessCodes();
      setAccessCodes(codes);
    } catch (err) {
      console.error('Error loading access codes:', err);
    }
  };

  const handleMasterCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterCode === MASTER_CODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Code maître incorrect');
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      await dbService.createAccessCode(newCode);
      setNewCode('');
      setShowCreateModal(false);
      loadAccessCodes();
    } catch (err) {
      setError('Erreur lors de la création du code');
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(result);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 mt-2">Zone réservée au développeur</p>
          </div>

          <form onSubmit={handleMasterCodeSubmit} className="space-y-4">
            <FormField
              label="Code Maître"
              type="password"
              value={masterCode}
              onChange={setMasterCode}
              placeholder="Entrez le code maître"
              required
              error={error}
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Accéder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header title="Administration" />

      <div className="p-4 space-y-6">
        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-green-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Créer un code</span>
          </button>

          <button
            onClick={loadAccessCodes}
            className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-blue-700 transition-colors"
          >
            <List className="w-6 h-6" />
            <span className="text-sm font-medium">Actualiser</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">{accessCodes.length}</div>
            <div className="text-sm text-gray-600">Total codes</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {accessCodes.filter(code => code.isUsed).length}
            </div>
            <div className="text-sm text-gray-600">Utilisés</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {accessCodes.filter(code => !code.isUsed).length}
            </div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Codes d'accès</h2>
          </div>
          <div className="divide-y">
            {accessCodes.map((code) => (
              <div key={code.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-lg">{code.code}</div>
                  <div className="text-sm text-gray-500">
                    Créé le {code.createdAt.toLocaleDateString()}
                    {code.usedAt && ` • Utilisé le ${code.usedAt.toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex items-center">
                  {code.isUsed ? (
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-1" />
                      <span className="text-sm">Utilisé</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600">
                      <X className="w-5 h-5 mr-1" />
                      <span className="text-sm">Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Code Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewCode('');
        }}
        title="Créer un nouveau code"
      >
        <form onSubmit={handleCreateCode} className="p-4 space-y-4">
          <FormField
            label="Code d'accès"
            value={newCode}
            onChange={setNewCode}
            placeholder="Entrez le code ou générez-en un"
            required
          />

          <button
            type="button"
            onClick={generateRandomCode}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Générer un code aléatoire
          </button>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setNewCode('');
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};