import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import apiRouter from './routes/api';
import { verifySMTP } from './services/emailService';

import { seedAdmin } from './controllers/authController';
import { seedServices } from './controllers/serviceController';
import { seedProjects } from './controllers/projectController';
import { seedTestimonials } from './controllers/testimonialController';
import { seedTeam } from './controllers/teamController';
import { SettingsModel } from './models/settingsModel';
import { BlogModel } from './models/blogModel';
import { FaqModel } from './models/faqModel';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading assets/images on frontend if needed
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Primary API Router
app.use('/api', apiRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    env: {
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'MISSING',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
    }
  });
});

// Seed additional collections ONLY if they are completely empty (first-time setup)
const seedExtraData = async () => {
  try {
    // Seed default settings if none exist
    const settings = await SettingsModel.get();
    if (settings) {
      console.log('Settings already exist. Skipping settings seed.');
    }

    // Seed blogs only if completely empty
    const blogs = await BlogModel.find({});
    if (blogs.length === 0) {
      await BlogModel.create({
        title: 'The Future of Web Engineering in 2026',
        slug: 'future-of-web-engineering-2026',
        category: 'Engineering',
        tags: ['React 19', 'Next.js', 'Vite'],
        featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        content: 'Web development is undergoing a paradigm shift with React 19, compiler integrations, and edge-native architectures. High-fidelity glassmorphic designs and custom shaders are defining modern user experiences.',
        seoTitle: 'The Future of Web Engineering in 2026 | A3 Agency',
        seoDescription: 'Discover the latest web engineering trends including React 19, Vite, and custom shaders.',
        status: 'published',
        author: 'A3 Administrator'
      });
      console.log('Seeded default blog article.');
    } else {
      console.log(`Found ${blogs.length} existing blog(s). Skipping blog seed.`);
    }

    // Seed FAQs only if completely empty
    const faqs = await FaqModel.find({});
    if (faqs.length === 0) {
      await FaqModel.create({
        question: 'What is your core engineering stack?',
        answer: 'We build high-performance software systems using React 19, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB, deployed on scalable AWS/Docker containers.',
        displayOrder: 1
      });
      await FaqModel.create({
        question: 'Do you offer post-deployment technical support?',
        answer: 'Yes, we provide 24/7 automated monitoring, security patches, SLA bug resolutions, and continuous updates via our maintenance retainers.',
        displayOrder: 2
      });
      console.log('Seeded default FAQ items.');
    } else {
      console.log(`Found ${faqs.length} existing FAQ(s). Skipping FAQ seed.`);
    }
  } catch (error) {
    console.error('Error seeding extra CMS data:', error);
  }
};

// Start-up routine
const startServer = async () => {
  // Initialize DB — MongoDB is REQUIRED (no JSON fallback)
  await connectDB();

  // Seed default admin ONLY if no users exist at all (first-time setup / recovery check)
  await seedAdmin();

  // Gate default content seeding to run only on first startup
  const settings = await SettingsModel.get();
  if (!settings.hasSeeded) {
    console.log('[Startup] First-time database seeding initiated...');
    await seedServices();
    await seedProjects();
    await seedTestimonials();
    await seedTeam();
    await seedExtraData();

    await SettingsModel.update({ hasSeeded: true });
    console.log('[Startup] First-time database seeding successfully completed and flag set.');
  } else {
    console.log('[Startup] Database already seeded. Skipping default content seeders.');
  }

  // Create HTTP server wrapper for Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  });

  // Save Socket.IO instance to app settings for access in controllers
  app.set('io', io);

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Admin Dashboard client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Admin Dashboard client disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`[A3 Backend Server] Running on http://localhost:${PORT}`);
    verifySMTP();
  });
};

startServer().catch((error) => {
  console.error('Fatal server startup error:', error);
  process.exit(1);
});
