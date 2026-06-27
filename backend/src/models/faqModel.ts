import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface IFaq {
  id?: string;
  _id?: string;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

const FaqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

let MongoFaqModel: any;
try {
  MongoFaqModel = model<IFaq>('Faq', FaqSchema);
} catch (e) {
  MongoFaqModel = model('Faq');
}

const LocalFaqRepo = new LocalRepo<IFaq>('faqs');

export const FaqModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoFaqModel.find(query).sort({ displayOrder: 1 });
    return (await LocalFaqRepo.find(query)).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoFaqModel.findOne(query);
    return LocalFaqRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoFaqModel.findById(id);
    return LocalFaqRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoFaqModel.create(data);
    return LocalFaqRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoFaqModel.findByIdAndUpdate(id, update, { new: true });
    return LocalFaqRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoFaqModel.findByIdAndDelete(id);
    return LocalFaqRepo.findByIdAndDelete(id);
  }
};
