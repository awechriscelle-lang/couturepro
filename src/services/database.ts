import Dexie, { Table } from 'dexie';
import { User, AccessCode, Client, Mesures, Commande, Paiement, Retouche, Alerte } from '../types';

export class CoutuproDatabase extends Dexie {
  users!: Table<User>;
  accessCodes!: Table<AccessCode>;
  clients!: Table<Client>;
  mesures!: Table<Mesures>;
  commandes!: Table<Commande>;
  paiements!: Table<Paiement>;
  retouches!: Table<Retouche>;
  alertes!: Table<Alerte>;

  constructor() {
    super('CoutuproDatabase');
    this.version(1).stores({
      users: 'id, code, createdAt, isActive',
      accessCodes: 'id, code, isUsed, usedAt, createdAt',
      clients: 'id, nom, prenoms, telephone, email, createdAt',
      mesures: 'id, clientId, date',
      commandes: 'id, clientId, mesuresId, dateCommande, dateLivraisonPrevue, statut',
      paiements: 'id, commandeId, date',
      retouches: 'id, commandeId, statut, datePrevue',
      alertes: 'id, type, isRead, createdAt'
    });
  }
}

export const db = new CoutuproDatabase();

// Service functions
export const dbService = {
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

  // Access Codes
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

    await db.accessCodes.update(accessCode.id, {
      isUsed: true,
      usedAt: new Date()
    });
    return true;
  },

  async getAllAccessCodes(): Promise<AccessCode[]> {
    return await db.accessCodes.orderBy('createdAt').reverse().toArray();
  },

  // Clients
  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await db.clients.add(newClient);
    return newClient;
  },

  async getAllClients(): Promise<Client[]> {
    return await db.clients.orderBy('createdAt').reverse().toArray();
  },

  async getClient(id: string): Promise<Client | undefined> {
    return await db.clients.get(id);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<void> {
    await db.clients.update(id, updates);
  },

  async deleteClient(id: string): Promise<void> {
    await db.clients.delete(id);
  },

  // Mesures
  async createMesures(mesures: Omit<Mesures, 'id'>): Promise<Mesures> {
    const newMesures: Mesures = {
      ...mesures,
      id: crypto.randomUUID()
    };
    await db.mesures.add(newMesures);
    return newMesures;
  },

  async getMesuresByClient(clientId: string): Promise<Mesures[]> {
    return await db.mesures.where('clientId').equals(clientId).toArray();
  },

  async getMesures(id: string): Promise<Mesures | undefined> {
    return await db.mesures.get(id);
  },

  // Commandes
  async createCommande(commande: Omit<Commande, 'id'>): Promise<Commande> {
    const newCommande: Commande = {
      ...commande,
      id: crypto.randomUUID()
    };
    await db.commandes.add(newCommande);
    return newCommande;
  },

  async getAllCommandes(): Promise<Commande[]> {
    return await db.commandes.orderBy('dateCommande').reverse().toArray();
  },

  async getCommandesByClient(clientId: string): Promise<Commande[]> {
    return await db.commandes.where('clientId').equals(clientId).toArray();
  },

  async updateCommande(id: string, updates: Partial<Commande>): Promise<void> {
    await db.commandes.update(id, updates);
  },

  async getCommande(id: string): Promise<Commande | undefined> {
    return await db.commandes.get(id);
  },

  // Paiements
  async createPaiement(paiement: Omit<Paiement, 'id'>): Promise<Paiement> {
    const newPaiement: Paiement = {
      ...paiement,
      id: crypto.randomUUID()
    };
    await db.paiements.add(newPaiement);
    return newPaiement;
  },

  async getPaiementsByCommande(commandeId: string): Promise<Paiement[]> {
    return await db.paiements.where('commandeId').equals(commandeId).toArray();
  },

  // Retouches
  async createRetouche(retouche: Omit<Retouche, 'id' | 'createdAt'>): Promise<Retouche> {
    const newRetouche: Retouche = {
      ...retouche,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await db.retouches.add(newRetouche);
    return newRetouche;
  },

  async getAllRetouches(): Promise<Retouche[]> {
    return await db.retouches.orderBy('createdAt').reverse().toArray();
  },

  async updateRetouche(id: string, updates: Partial<Retouche>): Promise<void> {
    await db.retouches.update(id, updates);
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

  // Backup & Restore
  async exportData(): Promise<string> {
    const data = {
      clients: await db.clients.toArray(),
      mesures: await db.mesures.toArray(),
      commandes: await db.commandes.toArray(),
      paiements: await db.paiements.toArray(),
      retouches: await db.retouches.toArray(),
      alertes: await db.alertes.toArray()
    };
    return JSON.stringify(data, null, 2);
  },

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    await db.transaction('rw', [db.clients, db.mesures, db.commandes, db.paiements, db.retouches, db.alertes], async () => {
      if (data.clients) await db.clients.bulkAdd(data.clients);
      if (data.mesures) await db.mesures.bulkAdd(data.mesures);
      if (data.commandes) await db.commandes.bulkAdd(data.commandes);
      if (data.paiements) await db.paiements.bulkAdd(data.paiements);
      if (data.retouches) await db.retouches.bulkAdd(data.retouches);
      if (data.alertes) await db.alertes.bulkAdd(data.alertes);
    });
  },

  async clearAllData(): Promise<void> {
    await db.transaction('rw', [db.clients, db.mesures, db.commandes, db.paiements, db.retouches, db.alertes], async () => {
      await db.clients.clear();
      await db.mesures.clear();
      await db.commandes.clear();
      await db.paiements.clear();
      await db.retouches.clear();
      await db.alertes.clear();
    });
  }
};