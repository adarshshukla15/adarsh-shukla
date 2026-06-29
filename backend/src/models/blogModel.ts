import { Schema, model } from 'mongoose';

export interface IBlog {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  featuredImage: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published';
  author: string;
  createdAt?: string;
  updatedAt?: string;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  featuredImage: { type: String, required: true },
  content: { type: String, required: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  author: { type: String, required: true }
}, { timestamps: true });

let MongoBlogModel: any;
try {
  MongoBlogModel = model<IBlog>('Blog', BlogSchema);
} catch (e) {
  MongoBlogModel = model('Blog');
}

export const BlogModel = {
  find: async (query: any = {}) => MongoBlogModel.find(query).sort({ createdAt: -1 }),
  findOne: async (query: any) => MongoBlogModel.findOne(query),
  findById: async (id: string) => MongoBlogModel.findById(id),
  create: async (data: any) => MongoBlogModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoBlogModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoBlogModel.findByIdAndDelete(id)
};
