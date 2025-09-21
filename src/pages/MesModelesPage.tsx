// src/pages/MesModelesPage.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { ModeleCard } from '../components/ModeleCard';
import { dbService } from '../services/database';

interface Modele {
  id: string;
  name: string;
  imageUrl: string;
}

export const MesModelesPage: React.FC = () => {
  const [modeles, setModeles] = useState<Modele[]>([]);

  useEffect(() => {
    loadModeles();
  }, []);

  const loadModeles = async () => {
    try {
      const saved = await dbService.getAllModeles();  // à définir dans ton service
      setModeles(saved);
    } catch (error) {
      console.error('Erreur en chargeant les modèles :', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Mes Modèles" showBack />

      <div className="p-4">
        {modeles.length === 0 ? (
          <div className="text-center text-gray-500">
            Aucun modèle pour le moment. Ajoutez un modèle pour qu’il s’affiche ici.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {modeles.map(modele => (
              <ModeleCard
                key={modele.id}
                name={modele.name}
                imageUrl={modele.imageUrl}
                onClick={() => {
                  // éventuellement : voir details ou modifier
                }}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation alertCount={0} />
    </div>
  );
};
