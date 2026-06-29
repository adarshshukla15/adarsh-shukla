import { Schema, model } from 'mongoose';

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

export const ContactModel = {
  find: async (query: any = {}) => MongoContactModel.find(query),
  findOne: async (query: any) => MongoContactModel.findOne(query),
  findById: async (id: string) => MongoContactModel.findById(id),
  create: async (data: any) => MongoContactModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoContactModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoContactModel.findByIdAndDelete(id)
};
