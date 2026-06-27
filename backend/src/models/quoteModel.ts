import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface IQuote {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget: string;
  timeline: string;
  projectDetails: string;
  status: string; // e.g. 'pending' | 'processed'
  createdAt?: string;
  updatedAt?: string;
}

const QuoteSchema = new Schema<IQuote>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  services: [{ type: String }],
  budget: { type: String, required: true },
  timeline: { type: String, required: true },
  projectDetails: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

let MongoQuoteModel: any;
try {
  MongoQuoteModel = model<IQuote>('Quote', QuoteSchema);
} catch (e) {
  MongoQuoteModel = model('Quote');
}

const LocalQuoteRepo = new LocalRepo<IQuote>('quotes');

export const QuoteModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoQuoteModel.find(query);
    return LocalQuoteRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoQuoteModel.findOne(query);
    return LocalQuoteRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoQuoteModel.findById(id);
    return LocalQuoteRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoQuoteModel.create(data);
    return LocalQuoteRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoQuoteModel.findByIdAndUpdate(id, update, { new: true });
    return LocalQuoteRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoQuoteModel.findByIdAndDelete(id);
    return LocalQuoteRepo.findByIdAndDelete(id);
  }
};
