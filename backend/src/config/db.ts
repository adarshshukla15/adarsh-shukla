import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let useMongoDB = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI is not set in environment. Falling back to local JSON database.');
    useMongoDB = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000 // Fast fail-over to local JSON database if not running
    });
    console.log('Successfully connected to MongoDB.');
    useMongoDB = true;
    return true;
  } catch (error) {
    console.error('MongoDB connection failed. Falling back to local JSON database. Error:', (error as Error).message);
    useMongoDB = false;
    return false;
  }
};

export const isMongoDBActive = () => useMongoDB;
export { mongoose };
