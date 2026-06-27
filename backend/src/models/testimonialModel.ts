import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

export interface ITestimonial {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  feedback: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatar: { type: String }
}, { timestamps: true });

let MongoTestimonialModel: any;
try {
  MongoTestimonialModel = model<ITestimonial>('Testimonial', TestimonialSchema);
} catch (e) {
  MongoTestimonialModel = model('Testimonial');
}

const LocalTestimonialRepo = new LocalRepo<ITestimonial>('testimonials');

export const TestimonialModel = {
  find: async (query: any = {}) => {
    if (isMongoDBActive()) return MongoTestimonialModel.find(query);
    return LocalTestimonialRepo.find(query);
  },
  findOne: async (query: any) => {
    if (isMongoDBActive()) return MongoTestimonialModel.findOne(query);
    return LocalTestimonialRepo.findOne(query);
  },
  findById: async (id: string) => {
    if (isMongoDBActive()) return MongoTestimonialModel.findById(id);
    return LocalTestimonialRepo.findById(id);
  },
  create: async (data: any) => {
    if (isMongoDBActive()) return MongoTestimonialModel.create(data);
    return LocalTestimonialRepo.create(data);
  },
  findByIdAndUpdate: async (id: string, update: any) => {
    if (isMongoDBActive()) return MongoTestimonialModel.findByIdAndUpdate(id, update, { new: true });
    return LocalTestimonialRepo.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: async (id: string) => {
    if (isMongoDBActive()) return MongoTestimonialModel.findByIdAndDelete(id);
    return LocalTestimonialRepo.findByIdAndDelete(id);
  }
};
