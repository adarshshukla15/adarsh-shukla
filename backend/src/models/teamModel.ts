import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface ITeam {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  socialLinks: ISocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  photo: { type: String, required: true },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String }
  }
}, { timestamps: true });

let MongoTeamModel: any;
try {
  MongoTeamModel = model<ITeam>('Team', TeamSchema);
} catch (e) {
  MongoTeamModel = model('Team');
}

const LocalTeamRepo = new LocalRepo<ITeam>('team');

export const TeamModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoTeamModel.find(query);
    return LocalTeamRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoTeamModel.findOne(query);
    return LocalTeamRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoTeamModel.findById(id);
    return LocalTeamRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoTeamModel.create(data);
    return LocalTeamRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoTeamModel.findByIdAndUpdate(id, update, { new: true });
    return LocalTeamRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoTeamModel.findByIdAndDelete(id);
    return LocalTeamRepo.findByIdAndDelete(id);
  }
};
