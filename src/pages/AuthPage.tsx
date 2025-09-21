import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Eye, EyeOff } from 'lucide-react';
import { dbService } from '../services/database';

export const AuthPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
        setError('Code invalide ou déjà utilisé');
      }
    } catch (err) {
      setError('Erreur lors de la vérification du code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5082BE] to-[#1B7F4D] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#5082BE] rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">COUTUPRO</h1>
          <p className="text-gray-600">Votre assistant couture professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Code d'accès
            </label>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez votre code d'accès"
                required
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5082BE] focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full bg-[#5082BE] text-white py-3 rounded-lg font-semibold hover:bg-[#4070A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Vous avez besoin d'un code d'accès ?<br />
            Contactez votre administrateur
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Développée par Rénato TCHOBO
        </div>
      </div>
    </div>
  );
};