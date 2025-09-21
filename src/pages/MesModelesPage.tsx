// src/pages/MesModelesPage.tsx
import React from "react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";

export const MesModelesPage: React.FC = () => {
  // Exemple d'images (tu pourras les remplacer par tes modèles)
  const modeles = [
    { id: 1, image: "https://i.ibb.co/B5VKQqLm/234ba09e63254ef46b27e1ad8a536d92.jpg" },
    { id: 2, image: "https://i.ibb.co/sdRbRhKG/333a6aa8c2de55250117f7dbdb31d6fe.jpg" },
    { id: 3, image: "https://i.ibb.co/ksH24R9x/bba8ae29aee80af0b4b0b06203b1eb8f.jpg" },
    { id: 4, image: "https://i.ibb.co/nsjLcz0t/b76553b27f295f7c1d3f43fcc0ab4a3b.jpg" },
    { id: 5, image: "https://via.placeholder.com/200x250?text=Chemise+1" },
    { id: 6, image: "https://via.placeholder.com/200x250?text=Robe+3" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Mes Modèles" showMenu />

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Galerie de modèles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {modeles.map((modele) => (
            <div
              key={modele.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={modele.image}
                alt={`Modèle ${modele.id}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation alertCount={0} />
    </div>
  );
};
