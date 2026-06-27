import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

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

const LocalServiceRepo = new LocalRepo<IService>('services');

export const ServiceModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoServiceModel.find(query);
    return LocalServiceRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoServiceModel.findOne(query);
    return LocalServiceRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoServiceModel.findById(id);
    return LocalServiceRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoServiceModel.create(data);
    return LocalServiceRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoServiceModel.findByIdAndUpdate(id, update, { new: true });
    return LocalServiceRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoServiceModel.findByIdAndDelete(id);
    return LocalServiceRepo.findByIdAndDelete(id);
  }
};
