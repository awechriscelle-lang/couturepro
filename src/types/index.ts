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
}

export interface Commande {
  id: string;
  clientId: string;
  mesuresId: string;
  modele: string;
  photo?: string;
  dateCommande: Date;
  dateLivraisonPrevue: Date;
  statut: 'En attente' | 'En cours' | 'Retouche' | 'Livrée';
  montantTotal: number;
  acompte: number;
  reste: number;
  statutPaiement: 'En attente' | 'Partiel' | 'Complet';
}

export interface Paiement {
  id: string;
  commandeId: string;
  montant: number;
  type: 'Acompte' | 'Solde';
  date: Date;
}

export interface Retouche {
  id: string;
  commandeId: string;
  description: string;
  datePrevue: Date;
  statut: 'En attente' | 'En cours' | 'Terminée';
  createdAt: Date;
}

export interface Alerte {
  id: string;
  type: 'livraison' | 'paiement' | 'retouche';
  message: string;
  commandeId?: string;
  isRead: boolean;
  createdAt: Date;
}