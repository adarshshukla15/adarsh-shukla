import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

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

const LocalBlogRepo = new LocalRepo<IBlog>('blogs');

export const BlogModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoBlogModel.find(query).sort({ createdAt: -1 });
    return (await LocalBlogRepo.find(query)).sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoBlogModel.findOne(query);
    return LocalBlogRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoBlogModel.findById(id);
    return LocalBlogRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoBlogModel.create(data);
    return LocalBlogRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoBlogModel.findByIdAndUpdate(id, update, { new: true });
    return LocalBlogRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoBlogModel.findByIdAndDelete(id);
    return LocalBlogRepo.findByIdAndDelete(id);
  }
};
