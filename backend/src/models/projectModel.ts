import { Schema, model } from 'mongoose';

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

export const ProjectModel = {
  find: async (query: any = {}) => MongoProjectModel.find(query),
  findOne: async (query: any) => MongoProjectModel.findOne(query),
  findById: async (id: string) => MongoProjectModel.findById(id),
  create: async (data: any) => MongoProjectModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoProjectModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoProjectModel.findByIdAndDelete(id)
};
