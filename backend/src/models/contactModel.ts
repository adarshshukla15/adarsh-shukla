import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface IContact {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget?: string;
  timeline?: string;
  subject: string;
  message: string;
  status: string; // e.g. 'unread' | 'read' | 'replied'
  createdAt?: string;
  updatedAt?: string;
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  budget: { type: String },
  timeline: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' }
}, { timestamps: true });

let MongoContactModel: any;
try {
  MongoContactModel = model<IContact>('Contact', ContactSchema);
} catch (e) {
  MongoContactModel = model('Contact');
}

const LocalContactRepo = new LocalRepo<IContact>('contacts');

export const ContactModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoContactModel.find(query);
    return LocalContactRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoContactModel.findOne(query);
    return LocalContactRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoContactModel.findById(id);
    return LocalContactRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoContactModel.create(data);
    return LocalContactRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoContactModel.findByIdAndUpdate(id, update, { new: true });
    return LocalContactRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoContactModel.findByIdAndDelete(id);
    return LocalContactRepo.findByIdAndDelete(id);
  }
};
