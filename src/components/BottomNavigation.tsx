import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, ShoppingBag, Bell, User } from 'lucide-react';

interface BottomNavigationProps {
  alertCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ alertCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Accueil' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/commandes', icon: ShoppingBag, label: 'Commandes' },
    { path: '/alertes', icon: Bell, label: 'Alertes', badge: alertCount },
    { path: '/profil', icon: User, label: 'Profil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors relative ${
                isActive 
                  ? 'text-[#5082BE] bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};