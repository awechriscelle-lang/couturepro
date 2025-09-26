# COUTUPRO - Plateforme de Gestion d'Atelier de Couture

## 📖 Description

COUTUPRO est une application web progressive (PWA) moderne et professionnelle conçue spécialement pour les ateliers de couture. Elle permet de gérer efficacement les clients, mesures, modèles, commandes, paiements et retouches avec une interface responsive et intuitive.

## ✨ Fonctionnalités Principales

### 🔒 Authentification Sécurisée Renforcée
- Système d'authentification par codes uniques liés au navigateur
- Empreinte digitale du navigateur pour sécurité maximale
- Codes à usage unique non transférables
- Page d'administration sécurisée pour la gestion des codes

### 🎨 Personnalisation Complète
- **Couleurs personnalisables** : Choisissez votre palette de couleurs
- **Logo personnalisé** : Importez et affichez votre logo sur toutes les pages
- **Nom d'atelier** : Personnalisez le nom affiché dans l'application
- **Thème adaptatif** : Interface qui s'adapte à vos couleurs

### 👥 Gestion Avancée des Clients
- Ajout, modification et suppression des clients
- Recherche rapide et filtres avancés
- Historique complet des commandes par client
- Informations détaillées et coordonnées

### 📐 Gestion Complète des Mesures
- Prise de mesures détaillée (20+ champs organisés par catégories)
- Historique des mesures par client avec dates
- Possibilité de corrections et mises à jour
- Impression des fiches de mesures

### 👗 Bibliothèque de Modèles
- **Création et gestion de modèles** personnalisés
- **Catégorisation** (Robe, Jupe, Pantalon, etc.)
- **Images et descriptions** détaillées
- **Prix et informations** techniques
- **Recherche et filtres** par catégorie

### 🛍️ Gestion Professionnelle des Commandes
- Création et suivi détaillé des commandes
- Statuts multiples (En attente, En cours, Retouche, Livrée, Annulée)
- Association automatique avec mesures et modèles
- Dates de livraison et suivi des délais

### 💰 Système de Paiement Complet
- **Paiements partiels et complets** avec historique
- **Méthodes de paiement** multiples (Espèces, Virement, Mobile Money, Chèque)
- **Calcul automatique** des restes à payer
- **Suivi du statut** des paiements en temps réel
- **Références et notes** pour chaque paiement

### 🔧 Gestion des Retouches
- Planification et suivi des retouches
- Statuts dédiés et dates prévues
- Coûts et notes détaillées
- Historique complet des interventions

### 🔔 Système d'Alertes Intelligent
- **Alertes automatiques** pour livraisons imminentes
- **Notifications** pour paiements en retard
- **Rappels** pour retouches en attente
- **Priorités** (basse, normale, haute, critique)
- **Badge de notifications** dans la navigation

### 📊 Tableau de Bord Dynamique
- **Statistiques en temps réel** synchronisées automatiquement
- **Métriques clés** : clients, commandes, revenus, alertes
- **Graphiques et indicateurs** visuels
- **Aperçu des performances** mensuelles et annuelles
- **Clients actifs** et tendances

### 💾 Sauvegarde et Restauration Avancées
- **Export/Import** des données au format JSON
- **Sauvegarde complète** de toutes les données
- **Réinitialisation sécurisée** avec confirmation
- **Versioning** des données exportées

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** + TypeScript pour une interface moderne
- **Tailwind CSS** pour un design professionnel
- **React Router DOM** pour la navigation
- **Lucide React** pour les icônes

### Base de Données
- **IndexedDB** via Dexie.js pour stockage local
- **Empreinte digitale navigateur** pour sécurité
- **Transactions ACID** pour intégrité des données

### PWA & Performance
- **Service Worker** pour fonctionnement hors ligne
- **Web App Manifest** pour installation native
- **Responsive Design** mobile-first
- **Optimisations** de performance

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

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

# Prévisualiser le build
npm run preview
```

### Configuration Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration de l'application
VITE_APP_NAME=COUTUPRO
VITE_APP_VERSION=2.0.0

# Configuration PWA
VITE_PWA_NAME=COUTUPRO
VITE_PWA_SHORT_NAME=COUTUPRO
VITE_PWA_DESCRIPTION=Plateforme de gestion d'atelier de couture

# Configuration de sécurité
VITE_ADMIN_CODE=ADMIN_COUTUPRO_2024
VITE_ENCRYPTION_KEY=your-encryption-key-here

# Configuration de déploiement
VITE_BASE_URL=/
```

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub à Vercel
2. Configuration automatique détectée
3. Variables d'environnement configurées
4. Deploy automatique à chaque push

### Netlify
1. Connecter le repository à Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configurer les redirections SPA

### Hostinger ou Hébergeur Classique
1. Exécuter `npm run build`
2. Uploader le contenu du dossier `dist/`
3. Configurer les redirections pour SPA :
   ```
   /*    /index.html   200
   ```

### Docker (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔐 Gestion Sécurisée des Codes d'Accès

### Création de Codes (Administrateur)
1. Accéder à `/admin-secret`
2. Utiliser le code maître: `ADMIN_COUTUPRO_2024`
3. Créer des codes manuellement ou automatiquement
4. Distribuer les codes aux utilisateurs

### Attribution aux Utilisateurs
1. Fournir un code unique à chaque couturière
2. Le code devient inutilisable après usage
3. Lié définitivement au navigateur de l'utilisatrice
4. Impossible de réutiliser sur un autre appareil

### Sécurité Renforcée
- **Empreinte digitale navigateur** unique
- **Codes à usage unique** non transférables
- **Validation de session** continue
- **Stockage sécurisé** des données

## 📱 Utilisation Mobile (PWA)

### Installation sur Mobile
1. Ouvrir l'application dans le navigateur mobile
2. Utiliser "Ajouter à l'écran d'accueil"
3. L'app fonctionne comme une application native
4. Icône personnalisée sur l'écran d'accueil

### Fonctionnalités PWA
- **Installation native** sur tous appareils
- **Fonctionnement hors ligne** (partiel)
- **Notifications push** (si activées)
- **Interface plein écran** sans barre d'adresse
- **Mise à jour automatique** en arrière-plan

## 🎨 Personnalisation de l'Interface

### Couleurs et Thème
1. Aller dans **Paramètres** → **Personnalisation**
2. Choisir une couleur prédéfinie ou personnalisée
3. L'interface s'adapte instantanément
4. Sauvegarde automatique des préférences

### Logo et Branding
1. Importer votre logo (PNG/JPG, max 2MB)
2. Le logo apparaît dans l'en-tête de toutes les pages
3. Redimensionnement automatique
4. Fallback gracieux si image indisponible

### Nom d'Atelier
1. Personnaliser le nom affiché
2. Apparaît dans le titre et l'en-tête
3. Utilisé dans les exports et impressions

## 📋 Guide d'Utilisation Rapide

### Premier Lancement
1. **Authentification** : Saisir le code d'accès fourni
2. **Personnalisation** : Configurer couleurs, logo et nom
3. **Premier client** : Ajouter votre premier client
4. **Exploration** : Découvrir le tableau de bord

### Workflow Classique
1. **📝 Ajouter un client** avec coordonnées complètes
2. **📏 Prendre les mesures** détaillées et organisées
3. **👗 Choisir/créer un modèle** dans la bibliothèque
4. **🛍️ Créer une commande** avec délais et prix
5. **💰 Enregistrer l'acompte** initial
6. **📊 Suivre l'avancement** via les statuts
7. **🔧 Gérer les retouches** si nécessaire
8. **✅ Finaliser le paiement** à la livraison

### Navigation Intuitive
- **Bottom Navigation** : Toujours accessible sur mobile
- **Tableau de bord** : Vue d'ensemble et statistiques
- **Clients** : Gestion complète de la clientèle
- **Commandes** : Suivi des commandes en cours
- **Modèles** : Bibliothèque de créations
- **Alertes** : Notifications importantes
- **Paramètres** : Personnalisation et sauvegarde

## 🔧 Développement et Contribution

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx      # En-tête avec logo
│   ├── BottomNavigation.tsx
│   ├── Modal.tsx       # Modales réutilisables
│   └── ...
├── pages/              # Pages principales
│   ├── DashboardPage.tsx
│   ├── SettingsPage.tsx
│   ├── ClientsPage.tsx
│   └── ...
├── services/           # Services (base de données)
│   └── database.ts     # Gestion IndexedDB
├── types/              # Types TypeScript
│   └── index.ts        # Définitions des interfaces
└── index.css          # Styles globaux et thème
```

### Commandes de Développement
```bash
# Développement avec hot reload
npm run dev

# Build optimisé pour production
npm run build

# Linting et vérification du code
npm run lint

# Prévisualisation du build
npm run preview

# Tests (si configurés)
npm run test
```

### Standards de Code
- **TypeScript strict** pour la sécurité des types
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- **Composants fonctionnels** avec hooks
- **CSS-in-JS** avec Tailwind CSS

## 🐛 Dépannage et Support

### Problèmes Courants

#### Données Perdues
- Vérifier IndexedDB dans les outils développeur
- Utiliser la fonction d'export/import pour récupération
- Vérifier l'espace de stockage disponible

#### Code d'Accès Invalide
- Confirmer que le code n'a pas été utilisé
- Vérifier qu'il s'agit du bon navigateur
- Contacter l'administrateur pour un nouveau code

#### PWA Non Installable
- Vérifier que le site est servi en HTTPS
- Contrôler que le service worker fonctionne
- Vider le cache et recharger la page

#### Problèmes de Performance
- Vider le cache du navigateur
- Vérifier la connectivité internet
- Redémarrer l'application

### Logs et Débogage
- Ouvrir les outils développeur (F12)
- Vérifier la console pour les erreurs
- Examiner l'onglet Application → Storage
- Contrôler le service worker

### Support Technique
Pour toute question ou problème :
1. Vérifier ce README
2. Consulter les logs de la console
3. Tester sur un autre navigateur
4. Contacter le développeur avec détails

## 📄 Licence et Crédits

**Développée par Rénato TCHOBO**

### Licence
Ce projet est sous licence propriétaire. Tous droits réservés.

### Crédits
- **Framework** : React + TypeScript
- **UI/UX** : Tailwind CSS + Lucide Icons
- **Base de données** : Dexie.js (IndexedDB)
- **PWA** : Service Worker + Web App Manifest

### Remerciements
Merci à tous les professionnels de la couture qui ont contribué aux spécifications et tests de cette application.

---

## 🚀 Roadmap Future

### Version 2.1 (Prochaine)
- [ ] Synchronisation cloud optionnelle
- [ ] Notifications push avancées
- [ ] Mode sombre/clair
- [ ] Export PDF des commandes
- [ ] Statistiques avancées avec graphiques

### Version 2.2
- [ ] Multi-utilisateurs avec rôles
- [ ] API REST pour intégrations
- [ ] Sauvegarde automatique cloud
- [ ] Templates de modèles prédéfinis

### Version 3.0
- [ ] Version desktop (Electron)
- [ ] Synchronisation multi-appareils
- [ ] Gestion des stocks de tissus
- [ ] Facturation automatisée

---

*Application conçue spécialement pour les professionnels de la couture au Bénin et en Afrique.*

**Version actuelle : 2.0.0**  
**Dernière mise à jour : Décembre 2024**