export interface User {
  id: string;
  code: string;
  createdAt: Date;
  isActive: boolean;
}

export interface AccessCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedAt?: Date;
  usedBy?: string; // Browser fingerprint
  createdAt: Date;
}

export interface Client {
  id: string;
  nom: string;
  prenoms: string;
  telephone: string;
  email?: string;
  adresse: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mesures {
  id: string;
  clientId: string;
  dos: number;
  longueurManche: number;
  tourManche: number;
  longueurRobe: number;
  longueurJupe: number;
  longueurPantalon: number;
  longueurTaille: number;
  hauteurPoitrine: number;
  hauteurSousSein: number;
  encolure: number;
  carrure: number;
  tourPoitrine: number;
  tourSousSein: number;
  tourTaille: number;
  tourBassin: number;
  hauteurBassin: number;
  ceinture: number;
  basPantalon: number;
  tourGenou: number;
  commentaire?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Modele {
  id: string;
  nom: string;
  description?: string;
  image?: string;
  prix?: number;
  categorie: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commande {
  id: string;
  clientId: string;
  mesuresId: string;
  modeleId?: string;
  modele: string;
  photo?: string;
  dateCommande: Date;
  dateLivraisonPrevue: Date;
  dateLivraisonReelle?: Date;
  statut: 'En attente' | 'En cours' | 'Retouche' | 'Livrée' | 'Annulée';
  montantTotal: number;
  acompte: number;
  reste: number;
  statutPaiement: 'En attente' | 'Partiel' | 'Complet';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Paiement {
  id: string;
  commandeId: string;
  montant: number;
  type: 'Acompte' | 'Solde' | 'Remboursement';
  methodePaiement: 'Espèces' | 'Virement' | 'Mobile Money' | 'Chèque';
  reference?: string;
  date: Date;
  createdAt: Date;
}

export interface Retouche {
  id: string;
  commandeId: string;
  description: string;
  datePrevue: Date;
  dateRealisee?: Date;
  statut: 'En attente' | 'En cours' | 'Terminée';
  cout?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alerte {
  id: string;
  type: 'livraison' | 'paiement' | 'retouche' | 'stock' | 'general';
  titre: string;
  message: string;
  commandeId?: string;
  clientId?: string;
  priorite: 'basse' | 'normale' | 'haute' | 'critique';
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Settings {
  id: string;
  nomAtelier: string;
  couleurPrimaire: string;
  logo?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  devise: string;
  fuseau: string;
  notifications: {
    email: boolean;
    push: boolean;
    alertesLivraison: boolean;
    alertesPaiement: boolean;
    alertesRetouche: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalClients: number;
  commandesEnCours: number;
  commandesEnAttente: number;
  commandesLivrees: number;
  revenusMois: number;
  revenusAnnee: number;
  alertesCount: number;
  paiementsEnAttente: number;
  retouchesEnCours: number;
  clientsActifs: number;
}

export interface SearchFilters {
  query?: string;
  statut?: string;
  dateDebut?: Date;
  dateFin?: Date;
  clientId?: string;
  montantMin?: number;
  montantMax?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BrowserFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  hash: string;
}