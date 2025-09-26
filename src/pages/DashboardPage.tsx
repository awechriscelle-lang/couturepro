// src/pages/DashboardPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Euro,
  AlertTriangle,
  Plus,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Scissors
} from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { dbService } from '../services/database';
import { DashboardStats, Settings as SettingsType } from '../types';

/**
 * DashboardPage adapté au style "cards colorées" (mobile app-like)
 * - Banner carousel (10 images)
 * - Résumé récapitulatif (Clients / En cours / Revenus / Alertes)
 * - Actions rapides (cartes colorées)
 *
 * Remarques :
 * - Place tes images dans public/assets/banner1.jpg ... banner10.jpg,
 *   ou renseigne settings.bannerImages (array de URLs).
 * - Ce composant utilise Tailwind classes (JIT). Si tu n'as pas Tailwind,
 *   adapte les classes CSS.
 */

const DEFAULT_BANNERS = [
  '/assets/banner1.jpg',
  '/assets/banner2.jpg',
  '/assets/banner3.jpg',
  '/assets/banner4.jpg',
  '/assets/banner5.jpg',
  '/assets/banner6.jpg',
  '/assets/banner7.jpg',
  '/assets/banner8.jpg',
  '/assets/banner9.jpg',
  '/assets/banner10.jpg'
];

const SlideCarousel: React.FC<{
  images: string[];
  heightClass?: string; // ex: 'h-36' or 'h-44'
}> = ({ images, heightClass = 'h-40' }) => {
  const [index, setIndex] = useState(0);
  const autoRef = useRef<number | null>(null);
  const isHovering = useRef(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  function startAuto() {
    stopAuto();
    autoRef.current = window.setInterval(() => {
      if (!isHovering.current) {
        setIndex(i => (i + 1) % images.length);
      }
    }, 4500);
  }
  function stopAuto() {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${heightClass} bg-gray-100`}
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches?.[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const endX = e.changedTouches?.[0]?.clientX ?? null;
        if (touchStartX.current != null && endX != null) {
          const dx = touchStartX.current - endX;
          if (Math.abs(dx) > 40) {
            if (dx > 0) next();
            else prev();
          }
        }
        touchStartX.current = null;
      }}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div
        className="absolute inset-0 flex transition-transform duration-600"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${(index * 100) / images.length}%)`
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="w-full flex-shrink-0 bg-center bg-cover"
            style={{
              backgroundImage: `url('${src}')`,
              width: `${100 / images.length}%`
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${images.length}`}
          />
        ))}
      </div>

      {/* Left / Right controls */}
      <button
        aria-label="Précédent"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        aria-label="Suivant"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à la diapositive ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

const SmallStatTile: React.FC<{
  title: string;
  value: string | number;
  badge?: string;
  icon?: React.ElementType;
}> = ({ title, value, badge, icon: Icon }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="flex flex-col items-end space-y-2">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#0A3764]" />
          </div>
        )}
        {badge && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    commandesEnCours: 0,
    commandesEnAttente: 0,
    commandesLivrees: 0,
    revenusMois: 0,
    revenusAnnee: 0,
    alertesCount: 0,
    paiementsEnAttente: 0,
    retouchesEnCours: 0,
    clientsActifs: 0
  });
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [banners, setBanners] = useState<string[]>(DEFAULT_BANNERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [dashboardStats, appSettings] = await Promise.all([
          dbService.getDashboardStats(),
          dbService.getSettings()
        ]);
        setStats(dashboardStats);
        setSettings(appSettings);

        // load banners either from settings or fallback
        if (appSettings?.bannerImages && appSettings.bannerImages.length > 0) {
          setBanners(appSettings.bannerImages.slice(0, 10));
        } else {
          setBanners(DEFAULT_BANNERS);
        }

        // apply primary color if present
        if (appSettings?.couleurPrimaire) {
          document.documentElement.style.setProperty('--primary-color', appSettings.couleurPrimaire);
          document.documentElement.style.setProperty('--primary-hover', appSettings.couleurPrimaire + 'dd');
        } else {
          document.documentElement.style.setProperty('--primary-color', '#0A3764');
          document.documentElement.style.setProperty('--primary-hover', '#0A3764dd');
        }
      } catch (err) {
        console.error('Erreur load dashboard :', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const quickActions = [
    {
      title: 'Ajouter client',
      icon: Users,
      color: 'bg-[#0A3764]',
      onClick: () => navigate('/clients/new')
    },
    {
      title: 'Mes modèles',
      icon: Scissors,
      color: 'bg-violet-600',
      onClick: () => navigate('/mes-modeles')
    },
    {
      title: 'Clients',
      icon: Users,
      color: 'bg-blue-600',
      onClick: () => navigate('/clients')
    },
    {
      title: 'Nouvelle commande & Paiement',
      icon: CreditCard,
      color: 'bg-orange-500',
      onClick: () => navigate('/commandes/new')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28">
        <Header title={settings?.nomAtelier || 'COUTUPRO'} logo={settings?.logo} showSettings />
        <div className="p-4 space-y-6">
          <div className="rounded-2xl bg-gray-100 h-40 animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-white h-24 animate-pulse shadow-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title={settings?.nomAtelier || 'COUTUPRO'} logo={settings?.logo} showSettings />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Bienvenue dans votre atelier</h2>
          <p className="text-sm text-gray-500">Gérez vos clients, commandes et modèles</p>
        </div>

        {/* Banner carousel (small) */}
        <SlideCarousel images={banners} heightClass="h-40" />

        {/* Résumé récapitulatif */}
        <div className="grid grid-cols-2 gap-4">
          <SmallStatTile
            title="Clients"
            value={stats.totalClients}
            badge={`${stats.clientsActifs} actifs`}
            icon={Users}
          />
          <SmallStatTile
            title="En cours"
            value={stats.commandesEnCours}
            badge={`${stats.commandesEnAttente} en attente`}
            icon={ShoppingBag}
          />
          <SmallStatTile
            title="Revenus (mois)"
            value={`${stats.revenusMois.toLocaleString()}`}
            badge={settings?.devise || 'FCFA'}
            icon={Euro}
          />
          <SmallStatTile
            title="Alertes"
            value={stats.alertesCount}
            badge={stats.alertesCount > 0 ? 'À traiter' : 'Aucune'}
            icon={AlertTriangle}
          />
        </div>

        {/* Quick actions - colored cards (2 columns on mobile / 4 on desktop) */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Actions rapides</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <button
                  key={i}
                  onClick={a.onClick}
                  className={`${a.color} text-white rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 shadow-md transform hover:scale-105 transition`}
                  aria-label={a.title}
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-center">{a.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNavigation alertCount={stats.alertesCount} />
    </div>
  );
};

export default DashboardPage;
