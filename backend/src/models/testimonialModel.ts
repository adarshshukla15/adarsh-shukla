import { Schema, model } from 'mongoose';

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

export const TestimonialModel = {
  find: async (query: any = {}) => MongoTestimonialModel.find(query),
  findOne: async (query: any) => MongoTestimonialModel.findOne(query),
  findById: async (id: string) => MongoTestimonialModel.findById(id),
  create: async (data: any) => MongoTestimonialModel.create(data),
  findByIdAndUpdate: async (id: string, update: any) => MongoTestimonialModel.findByIdAndUpdate(id, update, { new: true }),
  findByIdAndDelete: async (id: string) => MongoTestimonialModel.findByIdAndDelete(id)
};
