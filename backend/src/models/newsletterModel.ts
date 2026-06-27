import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface INewsletter {
  id?: string;
  _id?: string;
  email: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

let MongoNewsletterModel: any;
try {
  MongoNewsletterModel = model<INewsletter>('Newsletter', NewsletterSchema);
} catch (e) {
  MongoNewsletterModel = model('Newsletter');
}

const LocalNewsletterRepo = new LocalRepo<INewsletter>('newsletter');

export const NewsletterModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoNewsletterModel.find(query);
    return LocalNewsletterRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoNewsletterModel.findOne(query);
    return LocalNewsletterRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoNewsletterModel.findById(id);
    return LocalNewsletterRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoNewsletterModel.create(data);
    return LocalNewsletterRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoNewsletterModel.findByIdAndUpdate(id, update, { new: true });
    return LocalNewsletterRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoNewsletterModel.findByIdAndDelete(id);
    return LocalNewsletterRepo.findByIdAndDelete(id);
  }
};
