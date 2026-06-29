import { Schema, model } from 'mongoose';

export interface IService {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  details: string[];
  tags?: string[];
  icon: string;
  accentColor?: string;
  glowColor?: string;
  canvasType?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  details: [{ type: String }],
  tags: [{ type: String }],
  icon: { type: String, required: true },
  accentColor: { type: String },
  glowColor: { type: String },
  canvasType: { type: String }
}, { timestamps: true });

let MongoServiceModel: any;
try {
  MongoServiceModel = model<IService>('Service', ServiceSchema);
} catch (e) {
  MongoServiceModel = model('Service');
}

export const ServiceModel = {
  find: async (query: any = {}) => MongoServiceModel.find(query),
  findOne: async (query: any) => MongoServiceModel.findOne(query),
  findById: async (id: string) => MongoServiceModel.findById(id),
  create: async (data: any) => MongoServiceModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoServiceModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoServiceModel.findByIdAndDelete(id)
};
