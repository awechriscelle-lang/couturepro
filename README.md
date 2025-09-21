# COUTUPRO - Application de Gestion Couture

## 📖 Description

COUTUPRO est une application web progressive (PWA) conçue spécialement pour les ateliers de couture. Elle permet de gérer efficacement les clients, mesures, commandes, paiements et retouches avec une interface mobile-first moderne et intuitive.

## ✨ Fonctionnalités Principales

### 🔒 Authentification Sécurisée
- Système d'authentification par codes uniques
- Codes à usage unique liés au navigateur
- Page d'administration cachée pour la gestion des codes

### 👥 Gestion des Clients
- Ajout et modification des informations clients
- Historique complet des commandes par client
- Recherche rapide et intuitive

### 📏 Gestion des Mesures
- Prise de mesures complète (20+ champs)
- Historique des mesures par client
- Possibilité de corrections et mises à jour

### 🛍️ Gestion des Commandes
- Création et suivi des commandes
- Statuts multiples (En attente, En cours, Retouche, Livrée)
- Association automatique avec les mesures client

### 💰 Gestion des Paiements
- Enregistrement des acomptes et soldes
- Calcul automatique des restes à payer
- Suivi du statut des paiements

### 🔧 Gestion des Retouches
- Planification et suivi des retouches
- Statuts dédiés pour le workflow
- Historique complet

### 🔔 Système d'Alertes
- Alertes automatiques pour les livraisons imminentes
- Notifications pour les paiements en retard
- Alertes pour les retouches en attente
- Badge de notifications dans la navigation

### 💾 Sauvegarde et Restauration
- Export/Import des données au format JSON
- Réinitialisation sécurisée
- Données stockées localement (IndexedDB)

## 🛠️ Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Styles**: Tailwind CSS
- **Routing**: React Router DOM
- **Base de données**: IndexedDB (via Dexie.js)
- **PWA**: Service Worker + Web App Manifest
- **Icons**: Lucide React
- **Date**: date-fns

## 🚀 Installation et Déploiement

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation Locale
```bash
# Cloner le projet
git clone [url-du-projet]
cd coutupro

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

### Déploiement

#### Vercel (Recommandé)
1. Connecter le repository GitHub à Vercel
2. Configuration automatique détectée
3. Deploy automatique

#### Netlify
1. Connecter le repository à Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

#### Hostinger ou autre hébergeur
1. `npm run build`
2. Uploader le contenu du dossier `dist/`
3. Configurer les redirections pour SPA

## 🔐 Gestion des Codes d'Accès

### Création de Codes
1. Accéder à `/admin-secret`
2. Utiliser le code maître: `ADMIN_COUTUPRO_2024`
3. Créer de nouveaux codes manuellement ou automatiquement

### Attribution aux Utilisateurs
1. Fournir un code unique à chaque couturière
2. Le code devient inutilisable après usage
3. Lié définitivement au navigateur de l'utilisatrice

### Sécurité
- Page admin invisible pour les utilisateurs normaux
- Codes à usage unique pour éviter le partage
- Stockage local pour la persistance

## 📱 Utilisation Mobile (PWA)

### Installation
1. Ouvrir l'app dans le navigateur mobile
2. Utiliser "Ajouter à l'écran d'accueil"
3. L'app fonctionne comme une application native

### Fonctionnalités PWA
- Installation sur l'écran d'accueil
- Fonctionnement hors ligne (partiel)
- Icônes et splash screen personnalisés
- Interface en mode plein écran

## 🎨 Personnalisation des Couleurs

### Palette Principale
- Bleu principal: `#5082BE`
- Vert foncé: `#1B7F4D`
- Vert clair: `#3EBE72`
- Noir profond: `#0C3A24`

### Couleurs CTA (Tableau de bord)
- Teal: `bg-teal-500`
- Rouge: `bg-red-500`
- Vert: `bg-green-600`
- Jaune: `bg-yellow-500`

## 📋 Guide d'Utilisation

### Premier Lancement
1. Saisir le code d'accès fourni
2. Explorer le tableau de bord
3. Ajouter le premier client

### Workflow Classique
1. **Ajouter un client** avec ses coordonnées
2. **Prendre les mesures** complètes
3. **Créer une commande** avec modèle et délais
4. **Enregistrer l'acompte** initial
5. **Suivre l'avancement** via les statuts
6. **Gérer les retouches** si nécessaire
7. **Finaliser le paiement** à la livraison

### Navigation
- **Bottom Navigation**: Toujours accessible
- **Accueil**: Tableau de bord et statistiques
- **Clients**: Gestion complète des clients
- **Commandes**: Suivi des commandes (à implémenter)
- **Alertes**: Notifications importantes
- **Profil**: Paramètres et sauvegarde

## 🔧 Développement

### Structure du Projet
```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages principales
├── services/      # Services (base de données)
├── types/         # Types TypeScript
└── ...
```

### Commandes de Développement
```bash
# Développement
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview
npm run preview
```

## 🐛 Dépannage

### Problèmes Courants
- **Données perdues**: Vérifier IndexedDB du navigateur
- **Code invalide**: Confirmer que le code n'a pas été utilisé
- **PWA non installable**: Vérifier HTTPS et service worker

### Support
Pour toute question ou problème:
- Vérifier les logs de la console
- Contrôler la connectivité
- Redémarrer l'application

## 📄 Licence

Développée par **Rénato TCHOBO**

---

*Application conçue spécialement pour les professionnels de la couture au Bénin et en Afrique.*