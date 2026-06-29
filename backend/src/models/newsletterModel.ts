import { Schema, model } from 'mongoose';

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

export const NewsletterModel = {
  find: async (query: any = {}) => MongoNewsletterModel.find(query),
  findOne: async (query: any) => MongoNewsletterModel.findOne(query),
  findById: async (id: string) => MongoNewsletterModel.findById(id),
  create: async (data: any) => MongoNewsletterModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoNewsletterModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoNewsletterModel.findByIdAndDelete(id)
};
