import { Schema, model } from 'mongoose';

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

export const FaqModel = {
  find: async (query: any = {}) => MongoFaqModel.find(query).sort({ displayOrder: 1 }),
  findOne: async (query: any) => MongoFaqModel.findOne(query),
  findById: async (id: string) => MongoFaqModel.findById(id),
  create: async (data: any) => MongoFaqModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoFaqModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoFaqModel.findByIdAndDelete(id)
};
