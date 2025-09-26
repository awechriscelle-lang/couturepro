import React from 'react';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  logo?: string;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false, 
  showSettings = false,
  logo,
  onSettingsClick 
}) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/settings');
    }
  };

  return (
    <header className="app-header">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors focus-visible"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        
        {logo && (
          <img 
            src={logo} 
            alt="Logo" 
            className="app-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      {showSettings && (
        <button
          onClick={handleSettingsClick}
          className="p-2 rounded-full hover:bg-white/20 transition-colors focus-visible"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      )}
    </header>
  );
};