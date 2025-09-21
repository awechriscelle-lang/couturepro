import React, { useEffect, useState } from 'react';
import { Bell, Clock, Euro, Scissors, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { dbService } from '../services/database';
import { Alerte } from '../types';

export const AlertsPage: React.FC = () => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);

  useEffect(() => {
    loadAlertes();
  }, []);

  const loadAlertes = async () => {
    try {
      const alertesList = await dbService.getAllAlertes();
      setAlertes(alertesList);
    } catch (error) {
      console.error('Error loading alertes:', error);
    }
  };

  const markAsRead = async (alerteId: string) => {
    try {
      await dbService.markAlerteAsRead(alerteId);
      setAlertes(prev => 
        prev.map(alerte => 
          alerte.id === alerteId ? { ...alerte, isRead: true } : alerte
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'livraison':
        return Clock;
      case 'paiement':
        return Euro;
      case 'retouche':
        return Scissors;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'livraison':
        return 'text-blue-600 bg-blue-100';
      case 'paiement':
        return 'text-red-600 bg-red-100';
      case 'retouche':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const unreadCount = alertes.filter(alerte => !alerte.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Alertes" showBack />

      <div className="p-4 space-y-6">
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount} nouvelle{unreadCount !== 1 ? 's' : ''} alerte{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#5082BE] rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alertes.length > 0 ? (
            alertes.map((alerte) => {
              const IconComponent = getAlertIcon(alerte.type);
              const colorClass = getAlertColor(alerte.type);
              
              return (
                <div
                  key={alerte.id}
                  className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
                    !alerte.isRead 
                      ? 'border-[#5082BE] bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className={`font-medium ${!alerte.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {alerte.message}
                        </p>
                        
                        {!alerte.isRead && (
                          <button
                            onClick={() => markAsRead(alerte.id)}
                            className="text-[#5082BE] hover:text-[#4070A0] transition-colors ml-2"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          {new Date(alerte.createdAt).toLocaleDateString()} à{' '}
                          {new Date(alerte.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alerte.type === 'livraison' ? 'bg-blue-100 text-blue-800' :
                          alerte.type === 'paiement' ? 'bg-red-100 text-red-800' :
                          alerte.type === 'retouche' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alerte.type === 'livraison' ? 'Livraison' :
                           alerte.type === 'paiement' ? 'Paiement' :
                           alerte.type === 'retouche' ? 'Retouche' : 'Général'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
              <p className="text-gray-600">
                Vous n'avez actuellement aucune notification
              </p>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {unreadCount > 0 && (
          <button
            onClick={async () => {
              try {
                const unreadAlertes = alertes.filter(alerte => !alerte.isRead);
                for (const alerte of unreadAlertes) {
                  await dbService.markAlerteAsRead(alerte.id);
                }
                loadAlertes();
              } catch (error) {
                console.error('Error marking all alerts as read:', error);
              }
            }}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Marquer toutes comme lues
          </button>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};