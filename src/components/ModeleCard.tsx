// src/components/ModeleCard.tsx
import React from 'react';

interface ModeleCardProps {
  name: string;
  imageUrl: string;
  onClick?: () => void;
}

export const ModeleCard: React.FC<ModeleCardProps> = ({
  name,
  imageUrl,
  onClick
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-40 object-cover"
      />
      <div className="p-2">
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
    </div>
  );
};
