import { Schema, model } from 'mongoose';

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

export const QuoteModel = {
  find: async (query: any = {}) => MongoQuoteModel.find(query),
  findOne: async (query: any) => MongoQuoteModel.findOne(query),
  findById: async (id: string) => MongoQuoteModel.findById(id),
  create: async (data: any) => MongoQuoteModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoQuoteModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoQuoteModel.findByIdAndDelete(id)
};
