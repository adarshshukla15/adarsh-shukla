import { Schema, model } from 'mongoose';

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

export const TeamModel = {
  find: async (query: any = {}) => MongoTeamModel.find(query),
  findOne: async (query: any) => MongoTeamModel.findOne(query),
  findById: async (id: string) => MongoTeamModel.findById(id),
  create: async (data: any) => MongoTeamModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoTeamModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoTeamModel.findByIdAndDelete(id)
};
