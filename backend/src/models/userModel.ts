import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin' | 'editor';
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt?: string;
  updatedAt?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: String }
}, { timestamps: true });

// We try to register the schema with mongoose
let MongoUserModel: any;
try {
  MongoUserModel = model<IUser>('User', UserSchema);
} catch (e) {
  // If model already compiled, reuse it
  MongoUserModel = model('User');
}

const LocalUserRepo = new LocalRepo<IUser>('users');

export const UserModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoUserModel.find(query);
    return LocalUserRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoUserModel.findOne(query);
    return LocalUserRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoUserModel.findById(id);
    return LocalUserRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoUserModel.create(data);
    return LocalUserRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoUserModel.findByIdAndUpdate(id, update, { new: true });
    return LocalUserRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoUserModel.findByIdAndDelete(id);
    return LocalUserRepo.findByIdAndDelete(id);
  }
};
