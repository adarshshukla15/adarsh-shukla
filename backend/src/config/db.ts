import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('FATAL: MONGO_URI is not set in environment variables. MongoDB is REQUIRED for production.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000 // 30s timeout for Render cold starts
    });
    console.log('Successfully connected to MongoDB.');
    return true;
  } catch (error) {
    console.error('FATAL: MongoDB connection failed. Error:', (error as Error).message);
    console.error('The server cannot start without a working MongoDB connection.');
    process.exit(1);
  }
};

// Always true — MongoDB is now required
export const isMongoDBActive = () => true;
export { mongoose };
