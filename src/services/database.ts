import Dexie, { Table } from 'dexie';
import { 
  User, AccessCode, Client, Mesures, Modele, Commande, 
  Paiement, Retouche, Alerte, Settings, DashboardStats,
  BrowserFingerprint
} from '../types';

export class CoutuproDatabase extends Dexie {
  users!: Table<User>;
  accessCodes!: Table<AccessCode>;
  clients!: Table<Client>;
  mesures!: Table<Mesures>;
  modeles!: Table<Modele>;
  commandes!: Table<Commande>;
  paiements!: Table<Paiement>;
  retouches!: Table<Retouche>;
  alertes!: Table<Alerte>;
  settings!: Table<Settings>;

  constructor() {
    super('CoutuproDatabase');
    this.version(2).stores({
      users: 'id, code, createdAt, isActive',
      accessCodes: 'id, code, isUsed, usedAt, usedBy, createdAt',
      clients: 'id, nom, prenoms, telephone, email, createdAt, updatedAt',
      mesures: 'id, clientId, date, createdAt, updatedAt',
      modeles: 'id, nom, categorie, createdAt, updatedAt',
      commandes: 'id, clientId, mesuresId, modeleId, dateCommande, dateLivraisonPrevue, statut, statutPaiement, createdAt, updatedAt',
      paiements: 'id, commandeId, date, createdAt',
      retouches: 'id, commandeId, statut, datePrevue, createdAt, updatedAt',
      alertes: 'id, type, priorite, isRead, createdAt, expiresAt',
      settings: 'id, createdAt, updatedAt'
    });
  }
}

export const db = new CoutuproDatabase();

// Browser fingerprinting for secure code validation
const generateBrowserFingerprint = (): BrowserFingerprint => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Browser fingerprint', 2, 2);
  
  const fingerprint: BrowserFingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hash: btoa(canvas.toDataURL()).slice(0, 32)
  };
  
  return fingerprint;
};

const getBrowserHash = (): string => {
  const fp = generateBrowserFingerprint();
  return btoa(JSON.stringify(fp)).slice(0, 32);
};

// Service functions
export const dbService = {
  // Settings
  async getSettings(): Promise<Settings> {
    let settings = await db.settings.orderBy('createdAt').last();
    if (!settings) {
      settings = {
        id: crypto.randomUUID(),
        nomAtelier: 'Mon Atelier de Couture',
        couleurPrimaire: '#0A3764',
        devise: 'FCFA',
        fuseau: 'Africa/Porto-Novo',
        notifications: {
          email: false,
          push: true,
          alertesLivraison: true,
          alertesPaiement: true,
          alertesRetouche: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.settings.add(settings);
    }
    return settings;
  },

  async updateSettings(updates: Partial<Settings>): Promise<void> {
    const settings = await this.getSettings();
    await db.settings.update(settings.id, {
      ...updates,
      updatedAt: new Date()
    });
    
    // Apply theme changes
    if (updates.couleurPrimaire) {
      document.documentElement.style.setProperty('--primary-color', updates.couleurPrimaire);
    }
  },

  // Users
  async createUser(code: string): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      code,
      createdAt: new Date(),
      isActive: true
    };
    await db.users.add(user);
    return user;
  },

  async getCurrentUser(): Promise<User | undefined> {
    return await db.users.orderBy('createdAt').last();
  },

  // Access Codes with browser fingerprinting
  async createAccessCode(code: string): Promise<AccessCode> {
    const accessCode: AccessCode = {
      id: crypto.randomUUID(),
      code,
      isUsed: false,
      createdAt: new Date()
    };
    await db.accessCodes.add(accessCode);
    return accessCode;
  },

  async validateAccessCode(code: string): Promise<boolean> {
    const accessCode = await db.accessCodes.where('code').equals(code).first();
    if (!accessCode || accessCode.isUsed) {
      return false;
    }

    const browserHash = getBrowserHash();
    await db.accessCodes.update(accessCode.id, {
      isUsed: true,
      usedAt: new Date(),
      usedBy: browserHash
    });
    
    // Store browser hash in localStorage for session validation
    localStorage.setItem('coutupro_browser_hash', browserHash);
    return true;
  },

  async validateSession(): Promise<boolean> {
    const storedHash = localStorage.getItem('coutupro_browser_hash');
    if (!storedHash) return false;
    
    const currentHash = getBrowserHash();
    return storedHash === currentHash;
  },

  async getAllAccessCodes(): Promise<AccessCode[]> {
    return await db.accessCodes.orderBy('createdAt').reverse().toArray();
  },

  // Clients
  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.clients.add(newClient);
    await this.createAlerte({
      type: 'general',
      titre: 'Nouveau client',
      message: `${newClient.nom} ${newClient.prenoms} a été ajouté`,
      clientId: newClient.id,
      priorite: 'normale',
      isRead: false
    });
    return newClient;
  },

  async getAllClients(): Promise<Client[]> {
    return await db.clients.orderBy('createdAt').reverse().toArray();
  },

  async getClient(id: string): Promise<Client | undefined> {
    return await db.clients.get(id);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<void> {
    await db.clients.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteClient(id: string): Promise<void> {
    // Delete related data
    const mesures = await db.mesures.where('clientId').equals(id).toArray();
    const commandes = await db.commandes.where('clientId').equals(id).toArray();
    
    for (const commande of commandes) {
      await db.paiements.where('commandeId').equals(commande.id).delete();
      await db.retouches.where('commandeId').equals(commande.id).delete();
    }
    
    await db.mesures.where('clientId').equals(id).delete();
    await db.commandes.where('clientId').equals(id).delete();
    await db.alertes.where('clientId').equals(id).delete();
    await db.clients.delete(id);
  },

  async searchClients(query: string): Promise<Client[]> {
    const allClients = await this.getAllClients();
    return allClients.filter(client =>
      client.nom.toLowerCase().includes(query.toLowerCase()) ||
      client.prenoms.toLowerCase().includes(query.toLowerCase()) ||
      client.telephone.includes(query) ||
      (client.email && client.email.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // Modeles
  async createModele(modele: Omit<Modele, 'id' | 'createdAt' | 'updatedAt'>): Promise<Modele> {
    const newModele: Modele = {
      ...modele,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.modeles.add(newModele);
    return newModele;
  },

  async getAllModeles(): Promise<Modele[]> {
    return await db.modeles.orderBy('createdAt').reverse().toArray();
  },

  async getModele(id: string): Promise<Modele | undefined> {
    return await db.modeles.get(id);
  },

  async updateModele(id: string, updates: Partial<Modele>): Promise<void> {
    await db.modeles.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteModele(id: string): Promise<void> {
    await db.modeles.delete(id);
  },

  async getModelesByCategorie(categorie: string): Promise<Modele[]> {
    return await db.modeles.where('categorie').equals(categorie).toArray();
  },

  // Mesures
  async createMesures(mesures: Omit<Mesures, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mesures> {
    const newMesures: Mesures = {
      ...mesures,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.mesures.add(newMesures);
    
    const client = await this.getClient(mesures.clientId);
    if (client) {
      await this.createAlerte({
        type: 'general',
        titre: 'Nouvelles mesures',
        message: `Mesures prises pour ${client.nom} ${client.prenoms}`,
        clientId: client.id,
        priorite: 'normale',
        isRead: false
      });
    }
    
    return newMesures;
  },

  async getMesuresByClient(clientId: string): Promise<Mesures[]> {
    return await db.mesures.where('clientId').equals(clientId).orderBy('date').reverse().toArray();
  },

  async getMesures(id: string): Promise<Mesures | undefined> {
    return await db.mesures.get(id);
  },

  async updateMesures(id: string, updates: Partial<Mesures>): Promise<void> {
    await db.mesures.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Commandes
  async createCommande(commande: Omit<Commande, 'id' | 'createdAt' | 'updatedAt'>): Promise<Commande> {
    const newCommande: Commande = {
      ...commande,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.commandes.add(newCommande);
    
    const client = await this.getClient(commande.clientId);
    if (client) {
      await this.createAlerte({
        type: 'general',
        titre: 'Nouvelle commande',
        message: `Commande "${commande.modele}" créée pour ${client.nom} ${client.prenoms}`,
        commandeId: newCommande.id,
        clientId: client.id,
        priorite: 'normale',
        isRead: false
      });
    }
    
    return newCommande;
  },

  async getAllCommandes(): Promise<Commande[]> {
    return await db.commandes.orderBy('dateCommande').reverse().toArray();
  },

  async getCommandesByClient(clientId: string): Promise<Commande[]> {
    return await db.commandes.where('clientId').equals(clientId).orderBy('dateCommande').reverse().toArray();
  },

  async updateCommande(id: string, updates: Partial<Commande>): Promise<void> {
    await db.commandes.update(id, {
      ...updates,
      updatedAt: new Date()
    });
    
    // Create alert for status changes
    if (updates.statut) {
      const commande = await this.getCommande(id);
      const client = commande ? await this.getClient(commande.clientId) : null;
      
      if (commande && client) {
        let message = '';
        let priorite: 'basse' | 'normale' | 'haute' | 'critique' = 'normale';
        
        switch (updates.statut) {
          case 'En cours':
            message = `Commande "${commande.modele}" en cours de réalisation`;
            break;
          case 'Retouche':
            message = `Commande "${commande.modele}" nécessite des retouches`;
            priorite = 'haute';
            break;
          case 'Livrée':
            message = `Commande "${commande.modele}" livrée à ${client.nom} ${client.prenoms}`;
            priorite = 'basse';
            break;
        }
        
        if (message) {
          await this.createAlerte({
            type: 'general',
            titre: 'Statut commande',
            message,
            commandeId: id,
            clientId: client.id,
            priorite,
            isRead: false
          });
        }
      }
    }
  },

  async getCommande(id: string): Promise<Commande | undefined> {
    return await db.commandes.get(id);
  },

  async searchCommandes(query: string): Promise<Commande[]> {
    const allCommandes = await this.getAllCommandes();
    const clients = await this.getAllClients();
    
    return allCommandes.filter(commande => {
      const client = clients.find(c => c.id === commande.clientId);
      const clientName = client ? `${client.nom} ${client.prenoms}` : '';
      
      return (
        commande.modele.toLowerCase().includes(query.toLowerCase()) ||
        clientName.toLowerCase().includes(query.toLowerCase()) ||
        commande.statut.toLowerCase().includes(query.toLowerCase())
      );
    });
  },

  // Paiements
  async createPaiement(paiement: Omit<Paiement, 'id' | 'createdAt'>): Promise<Paiement> {
    const newPaiement: Paiement = {
      ...paiement,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await db.paiements.add(newPaiement);
    
    const commande = await this.getCommande(paiement.commandeId);
    const client = commande ? await this.getClient(commande.clientId) : null;
    
    if (commande && client) {
      await this.createAlerte({
        type: 'paiement',
        titre: 'Nouveau paiement',
        message: `Paiement de ${paiement.montant.toLocaleString()} FCFA reçu pour "${commande.modele}"`,
        commandeId: commande.id,
        clientId: client.id,
        priorite: 'normale',
        isRead: false
      });
    }
    
    return newPaiement;
  },

  async getPaiementsByCommande(commandeId: string): Promise<Paiement[]> {
    return await db.paiements.where('commandeId').equals(commandeId).orderBy('date').reverse().toArray();
  },

  // Retouches
  async createRetouche(retouche: Omit<Retouche, 'id' | 'createdAt' | 'updatedAt'>): Promise<Retouche> {
    const newRetouche: Retouche = {
      ...retouche,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.retouches.add(newRetouche);
    
    const commande = await this.getCommande(retouche.commandeId);
    const client = commande ? await this.getClient(commande.clientId) : null;
    
    if (commande && client) {
      await this.createAlerte({
        type: 'retouche',
        titre: 'Nouvelle retouche',
        message: `Retouche programmée pour "${commande.modele}" - ${retouche.description}`,
        commandeId: commande.id,
        clientId: client.id,
        priorite: 'haute',
        isRead: false
      });
    }
    
    return newRetouche;
  },

  async getAllRetouches(): Promise<Retouche[]> {
    return await db.retouches.orderBy('createdAt').reverse().toArray();
  },

  async updateRetouche(id: string, updates: Partial<Retouche>): Promise<void> {
    await db.retouches.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Alertes
  async createAlerte(alerte: Omit<Alerte, 'id' | 'createdAt'>): Promise<Alerte> {
    const newAlerte: Alerte = {
      ...alerte,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await db.alertes.add(newAlerte);
    return newAlerte;
  },

  async getAllAlertes(): Promise<Alerte[]> {
    return await db.alertes.orderBy('createdAt').reverse().toArray();
  },

  async markAlerteAsRead(id: string): Promise<void> {
    await db.alertes.update(id, { isRead: true });
  },

  async getUnreadAlertesCount(): Promise<number> {
    return await db.alertes.where('isRead').equals(false).count();
  },

  async cleanExpiredAlertes(): Promise<void> {
    const now = new Date();
    await db.alertes.where('expiresAt').below(now).delete();
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const [clients, commandes, alertes] = await Promise.all([
      this.getAllClients(),
      this.getAllCommandes(),
      this.getAllAlertes()
    ]);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfYear = new Date(currentYear, 0, 1);

    const commandesEnCours = commandes.filter(c => c.statut === 'En cours').length;
    const commandesEnAttente = commandes.filter(c => c.statut === 'En attente').length;
    const commandesLivrees = commandes.filter(c => c.statut === 'Livrée').length;

    const revenusMois = commandes
      .filter(c => new Date(c.dateCommande) >= startOfMonth)
      .reduce((sum, c) => sum + (c.montantTotal - c.reste), 0);

    const revenusAnnee = commandes
      .filter(c => new Date(c.dateCommande) >= startOfYear)
      .reduce((sum, c) => sum + (c.montantTotal - c.reste), 0);

    const alertesCount = alertes.filter(a => !a.isRead).length;
    const paiementsEnAttente = commandes.filter(c => c.reste > 0).length;

    const retouches = await this.getAllRetouches();
    const retouchesEnCours = retouches.filter(r => r.statut !== 'Terminée').length;

    // Clients actifs (avec commande dans les 3 derniers mois)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const clientsActifs = new Set(
      commandes
        .filter(c => new Date(c.dateCommande) >= threeMonthsAgo)
        .map(c => c.clientId)
    ).size;

    return {
      totalClients: clients.length,
      commandesEnCours,
      commandesEnAttente,
      commandesLivrees,
      revenusMois,
      revenusAnnee,
      alertesCount,
      paiementsEnAttente,
      retouchesEnCours,
      clientsActifs
    };
  },

  // Auto-generate alerts
  async generateAutoAlertes(): Promise<void> {
    const commandes = await this.getAllCommandes();
    const clients = await this.getAllClients();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    for (const commande of commandes) {
      const client = clients.find(c => c.id === commande.clientId);
      if (!client) continue;

      const livraisonDate = new Date(commande.dateLivraisonPrevue);
      
      // Alerte livraison imminente (demain)
      if (livraisonDate <= tomorrow && livraisonDate >= now && commande.statut !== 'Livrée') {
        const existingAlert = await db.alertes
          .where('commandeId').equals(commande.id)
          .and(alert => alert.type === 'livraison' && !alert.isRead)
          .first();
          
        if (!existingAlert) {
          await this.createAlerte({
            type: 'livraison',
            titre: 'Livraison demain',
            message: `Livraison prévue demain pour "${commande.modele}" - ${client.nom} ${client.prenoms}`,
            commandeId: commande.id,
            clientId: client.id,
            priorite: 'haute',
            isRead: false
          });
        }
      }

      // Alerte paiement en retard
      if (commande.reste > 0 && livraisonDate < now) {
        const existingAlert = await db.alertes
          .where('commandeId').equals(commande.id)
          .and(alert => alert.type === 'paiement' && !alert.isRead)
          .first();
          
        if (!existingAlert) {
          await this.createAlerte({
            type: 'paiement',
            titre: 'Paiement en retard',
            message: `Reste ${commande.reste.toLocaleString()} FCFA à payer pour "${commande.modele}"`,
            commandeId: commande.id,
            clientId: client.id,
            priorite: 'critique',
            isRead: false
          });
        }
      }
    }
  },

  // Backup & Restore
  async exportData(): Promise<string> {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      clients: await db.clients.toArray(),
      mesures: await db.mesures.toArray(),
      modeles: await db.modeles.toArray(),
      commandes: await db.commandes.toArray(),
      paiements: await db.paiements.toArray(),
      retouches: await db.retouches.toArray(),
      alertes: await db.alertes.toArray(),
      settings: await db.settings.toArray()
    };
    return JSON.stringify(data, null, 2);
  },

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    await db.transaction('rw', [
      db.clients, db.mesures, db.modeles, db.commandes, 
      db.paiements, db.retouches, db.alertes, db.settings
    ], async () => {
      if (data.clients) await db.clients.bulkAdd(data.clients);
      if (data.mesures) await db.mesures.bulkAdd(data.mesures);
      if (data.modeles) await db.modeles.bulkAdd(data.modeles);
      if (data.commandes) await db.commandes.bulkAdd(data.commandes);
      if (data.paiements) await db.paiements.bulkAdd(data.paiements);
      if (data.retouches) await db.retouches.bulkAdd(data.retouches);
      if (data.alertes) await db.alertes.bulkAdd(data.alertes);
      if (data.settings) await db.settings.bulkAdd(data.settings);
    });
  },

  async clearAllData(): Promise<void> {
    await db.transaction('rw', [
      db.clients, db.mesures, db.modeles, db.commandes, 
      db.paiements, db.retouches, db.alertes
    ], async () => {
      await db.clients.clear();
      await db.mesures.clear();
      await db.modeles.clear();
      await db.commandes.clear();
      await db.paiements.clear();
      await db.retouches.clear();
      await db.alertes.clear();
    });
  }
};

// Initialize auto-alerts generation
setInterval(() => {
  dbService.generateAutoAlertes().catch(console.error);
  dbService.cleanExpiredAlertes().catch(console.error);
}, 60000); // Check every minute