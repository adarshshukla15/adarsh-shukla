import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to generate a random 24-character hexadecimal string (mimics MongoDB ObjectId)
export const generateId = () => crypto.randomBytes(12).toString('hex');

interface Schema {
  users: any[];
  projects: any[];
  services: any[];
  contacts: any[];
  quotes: any[];
  newsletter: any[];
  testimonials: any[];
  blogs: any[];
  faqs: any[];
  team: any[];
  settings: any[];
}

const defaultDb: Schema = {
  users: [],
  projects: [],
  services: [],
  contacts: [],
  quotes: [],
  newsletter: [],
  testimonials: [],
  blogs: [],
  faqs: [],
  team: [],
  settings: []
};

// Ensure database file and directory exist
const initDb = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
  }
};

export const readDb = (): Schema => {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local JSON db, resetting to default', error);
    return defaultDb;
  }
};

export const writeDb = (data: Schema) => {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to local JSON db', error);
  }
};

// Generic Repository
export class LocalRepo<T extends { id?: string; _id?: string }> {
  private collectionName: keyof Schema;

  constructor(collectionName: keyof Schema) {
    this.collectionName = collectionName;
  }

  private normalize(item: any): T {
    if (item && item.id && !item._id) {
      item._id = item.id;
    } else if (item && item._id && !item.id) {
      item.id = item._id;
    }
    return item;
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    const db = readDb();
    const items = (db[this.collectionName] || []) as T[];
    
    return items
      .filter((item) => {
        return Object.entries(query).every(([key, val]) => {
          const itemVal = (item as any)[key];
          return itemVal === val;
        });
      })
      .map(this.normalize);
  }

  async findOne(query: Partial<T> = {}): Promise<T | null> {
    const items = await this.find(query);
    return items.length > 0 ? items[0] : null;
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.find();
    const found = items.find((item) => item.id === id || item._id === id);
    return found ? this.normalize(found) : null;
  }

  async create(data: Omit<T, 'id' | '_id'>): Promise<T> {
    const db = readDb();
    const id = generateId();
    const newItem = {
      ...data,
      id,
      _id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as T;

    db[this.collectionName].push(newItem);
    writeDb(db);
    return this.normalize(newItem);
  }

  async findByIdAndUpdate(id: string, updateData: Partial<T>): Promise<T | null> {
    const db = readDb();
    const collection = db[this.collectionName];
    const index = collection.findIndex((item: any) => item.id === id || item._id === id);
    if (index === -1) return null;

    const existing = collection[index];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    collection[index] = updated;
    writeDb(db);
    return this.normalize(updated as T);
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    const db = readDb();
    const collection = db[this.collectionName];
    const index = collection.findIndex((item: any) => item.id === id || item._id === id);
    if (index === -1) return null;

    const deleted = collection.splice(index, 1)[0];
    writeDb(db);
    return this.normalize(deleted as T);
  }
}
