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

// Static assets upload folder setup
app.use('/uploads', express.static('uploads'));

// Primary API Router
app.use('/api', apiRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Seed additional collections
const seedExtraData = async () => {
  try {
    // Seed settings if empty or containing old credentials
    const settings = await SettingsModel.get();
    if (settings && (
      settings.email.includes('gamail.com') ||
      settings.email.includes('info@a3.agency') ||
      settings.phone.includes('1234') ||
      !settings.email.includes('a3services.inn@gmail.com') ||
      !settings.phone.includes('78271')
    )) {
      await SettingsModel.update({
        email: 'a3services.inn@gmail.com',
        phone: '+91 78271 74313, +91 76784 51381',
        address: 'North East Delhi, Delhi, India',
        copyright: '© 2026 A3 Web & Software Services. All rights reserved.'
      });
      console.log('Successfully updated database settings to Delhi Office contact details.');
    }

    // Seed blogs if empty
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
    }

    // Seed FAQs if empty
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
    }
  } catch (error) {
    console.error('Error seeding extra CMS data:', error);
  }
};

// Start-up routine
const startServer = async () => {
  // Initialize DB (MongoDB or Local JSON Database fallback)
  await connectDB();

  // Seed default data if not present
  await seedAdmin();
  await seedServices();
  await seedProjects();
  await seedTestimonials();
  await seedTeam();
  await seedExtraData();

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
