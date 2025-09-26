import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Shirt, Tag } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { dbService } from '../services/database';
import { Modele } from '../types';

export const MesModelesPage: React.FC = () => {
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [filteredModeles, setFilteredModeles] = useState<Modele[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingModele, setEditingModele] = useState<Modele | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    image: '',
    prix: '',
    categorie: 'Robe'
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Robe', 'Jupe', 'Pantalon', 'Chemise', 'Veste', 
    'Ensemble', 'Accessoire', 'Autre'
  ];

  useEffect(() => {
    loadModeles();
  }, []);

  useEffect(() => {
    filterModeles();
  }, [searchTerm, selectedCategorie, modeles]);

  const loadModeles = async () => {
    try {
      const modelesList = await dbService.getAllModeles();
      setModeles(modelesList);
    } catch (error) {
      console.error('Error loading modeles:', error);
    }
  };

  const filterModeles = () => {
    let filtered = modeles;

    if (selectedCategorie !== 'all') {
      filtered = filtered.filter(modele => modele.categorie === selectedCategorie);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(modele =>
        modele.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modele.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modele.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredModeles(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const modeleData = {
        nom: formData.nom.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        prix: formData.prix ? parseFloat(formData.prix) : undefined,
        categorie: formData.categorie
      };

      if (editingModele) {
        await dbService.updateModele(editingModele.id, modeleData);
      } else {
        await dbService.createModele(modeleData);
      }

      resetForm();
      loadModeles();
    } catch (error) {
      console.error('Error saving modele:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (modele: Modele) => {
    setEditingModele(modele);
    setFormData({
      nom: modele.nom,
      description: modele.description || '',
      image: modele.image || '',
      prix: modele.prix?.toString() || '',
      categorie: modele.categorie
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (modele: Modele) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${modele.nom}" ?`)) {
      try {
        await dbService.deleteModele(modele.id);
        loadModeles();
      } catch (error) {
        console.error('Error deleting modele:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      image: '',
      prix: '',
      categorie: 'Robe'
    });
    setEditingModele(null);
    setShowCreateModal(false);
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uniqueCategories = Array.from(new Set(modeles.map(m => m.categorie)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Mes Modèles" showBack />

      <div className="p-4 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            className="form-input"
          >
            <option value="all">Toutes les catégories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Add Model Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un modèle</span>
        </button>

        {/* Models Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredModeles.length > 0 ? (
            filteredModeles.map((modele) => (
              <div key={modele.id} className="professional-card p-4">
                {modele.image && (
                  <div className="mb-3">
                    <img
                      src={modele.image}
                      alt={modele.nom}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {modele.nom}
                    </h3>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleEdit(modele)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(modele)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Tag className="w-3 h-3" />
                    <span>{modele.categorie}</span>
                  </div>

                  {modele.prix && (
                    <p className="text-sm font-semibold text-green-600">
                      {modele.prix.toLocaleString()} FCFA
                    </p>
                  )}

                  {modele.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {modele.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              {searchTerm || selectedCategorie !== 'all' ? (
                <div>
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
                  <p className="text-gray-600">
                    Aucun modèle trouvé avec ces critères
                  </p>
                </div>
              ) : (
                <div>
                  <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun modèle</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par ajouter vos premiers modèles
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary px-6 py-2"
                  >
                    Ajouter un modèle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Statistics */}
        {modeles.length > 0 && (
          <div className="professional-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total modèles</p>
                <p className="font-semibold text-lg">{modeles.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Catégories</p>
                <p className="font-semibold text-lg">{uniqueCategories.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={resetForm}
        title={editingModele ? 'Modifier le modèle' : 'Nouveau modèle'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <FormField
            label="Nom du modèle"
            value={formData.nom}
            onChange={(value) => updateField('nom', value)}
            placeholder="Ex: Robe de soirée élégante"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categorie}
              onChange={(e) => updateField('categorie', e.target.value)}
              required
              className="form-input"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <FormField
            label="Description"
            value={formData.description}
            onChange={(value) => updateField('description', value)}
            placeholder="Description détaillée du modèle..."
            rows={3}
          />

          <FormField
            label="Prix (FCFA)"
            type="number"
            value={formData.prix}
            onChange={(value) => updateField('prix', value)}
            placeholder="0"
          />

          <FormField
            label="Image (URL)"
            value={formData.image}
            onChange={(value) => updateField('image', value)}
            placeholder="https://exemple.com/image.jpg"
          />

          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="Aperçu"
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.nom.trim()}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Sauvegarde...' : editingModele ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      <BottomNavigation />
    </div>
  );
};