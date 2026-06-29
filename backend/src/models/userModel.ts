import { Schema, model } from 'mongoose';

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

let MongoUserModel: any;
try {
  MongoUserModel = model<IUser>('User', UserSchema);
} catch (e) {
  // If model already compiled, reuse it
  MongoUserModel = model('User');
}

export const UserModel = {
  find: async (query: any = {}) => MongoUserModel.find(query),
  findOne: async (query: any) => MongoUserModel.findOne(query),
  findById: async (id: string) => MongoUserModel.findById(id),
  create: async (data: any) => MongoUserModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoUserModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoUserModel.findByIdAndDelete(id)
};
