import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface IProject {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  client: string;
  budget: string;
  timeline: string;
  tags: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  client: { type: String, required: true },
  budget: { type: String, required: true },
  timeline: { type: String, required: true },
  tags: [{ type: String }],
  thumbnail: { type: String, required: true },
  gallery: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String }
}, { timestamps: true });

let MongoProjectModel: any;
try {
  MongoProjectModel = model<IProject>('Project', ProjectSchema);
} catch (e) {
  MongoProjectModel = model('Project');
}

const LocalProjectRepo = new LocalRepo<IProject>('projects');

export const ProjectModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoProjectModel.find(query);
    return LocalProjectRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoProjectModel.findOne(query);
    return LocalProjectRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoProjectModel.findById(id);
    return LocalProjectRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoProjectModel.create(data);
    return LocalProjectRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoProjectModel.findByIdAndUpdate(id, update, { new: true });
    return LocalProjectRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoProjectModel.findByIdAndDelete(id);
    return LocalProjectRepo.findByIdAndDelete(id);
  }
};
