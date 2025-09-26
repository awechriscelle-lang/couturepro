import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Eye, EyeOff, Shield } from 'lucide-react';
import { dbService } from '../services/database';

export const AuthPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated and session is valid
    const checkSession = async () => {
      const isAuthenticated = localStorage.getItem('coutupro_authenticated');
      if (isAuthenticated === 'true') {
        const isValidSession = await dbService.validateSession();
        if (isValidSession) {
          navigate('/dashboard');
        } else {
          // Invalid session, clear auth
          localStorage.removeItem('coutupro_authenticated');
          localStorage.removeItem('coutupro_browser_hash');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isValid = await dbService.validateAccessCode(code);
      if (isValid) {
        await dbService.createUser(code);
        localStorage.setItem('coutupro_authenticated', 'true');
        navigate('/dashboard');
      } else {
        setError('Code invalide ou déjà utilisé sur un autre navigateur');
      }
    } catch (err) {
      setError('Erreur lors de la vérification du code');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A3764] to-[#1a4a7a] flex items-center justify-center p-4">
      <div className="professional-card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#0A3764] rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">COUTUPRO</h1>
          <p className="text-gray-600">Votre assistant couture professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Code d'accès <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez votre code d'accès"
                required
                className="form-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <Shield className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="btn-primary w-full"
          >
            {isLoading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="professional-card p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-blue-800 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Sécurité renforcée</span>
            </div>
            <p className="text-sm text-blue-700">
              Chaque code est lié à votre navigateur pour une sécurité maximale
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Vous avez besoin d'un code d'accès ?<br />
            Contactez votre administrateur
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Développée par <strong>Rénato TCHOBO</strong>
        </div>
      </div>
    </div>
  );
};