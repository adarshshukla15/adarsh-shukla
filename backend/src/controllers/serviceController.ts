import { Request, Response } from 'express';
import { ServiceModel } from '../models/serviceModel';

export const seedServices = async () => {
  try {
    const count = await ServiceModel.find({});
    if (count.length < 12) {
      console.log(`Found ${count.length} services. Re-seeding to ensure all 12 premium services are available...`);
      // Clear out older seeding
      for (const srv of count) {
        await ServiceModel.findByIdAndDelete(srv.id || srv._id);
      }
      const defaultServices = [
        {
          title: 'Website Development',
          category: 'Development',
          description: 'Develop blazing-fast responsive websites using modern technologies and premium transitions.',
          details: [
            'Next.js 15 & React 19 architecture',
            'Fluid animations & sub-100ms LCP',
            'Headless CMS & structured content API',
            'Advanced SEO & core web vitals optimization'
          ],
          tags: ['React', 'TypeScript', 'Tailwind', 'GSAP'],
          icon: 'FiGlobe',
          accentColor: 'from-cyan-500 via-blue-500 to-indigo-500',
          glowColor: 'rgba(6, 182, 212, 0.25)',
          canvasType: 'web'
        },
        {
          title: 'Premium Website Design',
          category: 'Design',
          description: 'Design modern, conversion-focused interfaces with exceptional UX, micro-interactions and stunning visual flow.',
          details: [
            'Interactive Figma prototypes',
            'Custom web animations planning',
            'Design systems & UI components library',
            'Atomic UX design frameworks'
          ],
          tags: ['Figma', 'Vercel', 'Tailwind', 'Three.js'],
          icon: 'FiLayout',
          accentColor: 'from-pink-500 to-purple-500',
          glowColor: 'rgba(236, 72, 153, 0.2)',
          canvasType: 'design'
        },
        {
          title: 'AI Integration',
          category: 'Innovation',
          description: 'Integrate cutting-edge AI chatbots, assistants, agentic workflows and LLM engines to automate operations.',
          details: [
            'RAG systems & document retrieval',
            'Custom LLM agent logic integrations',
            'Semantic vector search structures',
            'Process & pipeline automation bots'
          ],
          tags: ['Three.js', 'REST API', 'Node.js', 'Python'],
          icon: 'FiZap',
          accentColor: 'from-purple-500 via-indigo-500 to-cyan-500',
          glowColor: 'rgba(168, 85, 247, 0.2)',
          canvasType: 'ai'
        },
        {
          title: 'CRM Development',
          category: 'Business',
          description: 'Develop custom CRM platforms to manage customers, pipelines and leads efficiently.',
          details: [
            'Lead pipelines visual boards',
            'Automated sales communications triggers',
            'Custom analytics & tracking reports',
            'Third-party software hookups'
          ],
          tags: ['React', 'TypeScript', 'Node.js', 'REST API'],
          icon: 'FiLayers',
          accentColor: 'from-blue-500 to-indigo-500',
          glowColor: 'rgba(59, 130, 246, 0.2)',
          canvasType: 'crm'
        },
        {
          title: 'ERP Systems',
          category: 'Business',
          description: 'Enterprise resource planning software engineered for total business management and workflow alignment.',
          details: [
            'Multi-warehouse inventory systems',
            'HR workflow & attendance tracking',
            'Integrated accounting and billing books',
            'Granular role-based user management'
          ],
          tags: ['TypeScript', 'Node.js', 'Docker', 'AWS'],
          icon: 'FiCpu',
          accentColor: 'from-emerald-500 to-teal-500',
          glowColor: 'rgba(16, 185, 129, 0.2)',
          canvasType: 'erp'
        },
        {
          title: 'API Development',
          category: 'Development',
          description: 'Build ultra-secure REST & GraphQL APIs and reliable third-party integrations with robust caching.',
          details: [
            'JWT/OAuth2 credentials systems',
            'Redis in-memory query caching',
            'Swagger docs & automatic sandboxes',
            'Elastic load-balancing setups'
          ],
          tags: ['Node.js', 'Express', 'JWT', 'REST API'],
          icon: 'FiDatabase',
          accentColor: 'from-cyan-500 to-blue-500',
          glowColor: 'rgba(6, 182, 212, 0.2)',
          canvasType: 'api'
        },
        {
          title: 'SaaS Development',
          category: 'Development',
          description: 'Build scalable subscription-based SaaS applications with robust multi-tenant security architecture.',
          details: [
            'Stripe billing, tax & invoice logic',
            'Multi-tenant database models',
            'Dynamic usage-based metrics tracking',
            'Real-time team workspaces configuration'
          ],
          tags: ['React', 'TypeScript', 'Tailwind', 'MongoDB'],
          icon: 'FiLayers',
          accentColor: 'from-violet-500 to-purple-500',
          glowColor: 'rgba(139, 92, 246, 0.25)',
          canvasType: 'saas'
        },
        {
          title: 'Mobile App Development',
          category: 'Development',
          description: 'Create Android and iOS apps with native feel, premium interfaces, and scalable architectures.',
          details: [
            'Cross-platform React Native builds',
            'Native modules bridging (Swift/Kotlin)',
            'Push notification automation hubs',
            'Offline caching & background data syncing'
          ],
          tags: ['React', 'Firebase', 'REST API', 'TypeScript'],
          icon: 'FiSmartphone',
          accentColor: 'from-rose-500 to-red-500',
          glowColor: 'rgba(244, 63, 94, 0.2)',
          canvasType: 'mobile'
        },
        {
          title: 'E-Commerce Solutions',
          category: 'Business',
          description: 'Develop secure, blazing-fast online stores with rich animations and checkout conversion triggers.',
          details: [
            'Sub-second cart and search index',
            'Global multi-currency support systems',
            'Apple Pay / Google Pay checkouts',
            'Webhooks inventory syncing'
          ],
          tags: ['React', 'TypeScript', 'Cloudinary', 'REST API'],
          icon: 'FiShoppingBag',
          accentColor: 'from-pink-500 to-rose-500',
          glowColor: 'rgba(236, 72, 153, 0.2)',
          canvasType: 'ecommerce'
        },
        {
          title: 'Cloud Deployment',
          category: 'Infrastructure',
          description: 'Deploy highly-available scalable systems with secure auto-healing infrastructure and auto CI/CD.',
          details: [
            'Multi-zone AWS cluster maps',
            'Dockerized auto-scaling task agents',
            'GitHub Actions CI/CD workflows',
            'Advanced Cloudflare DDoS filters'
          ],
          tags: ['AWS', 'Docker', 'REST API', 'Node.js'],
          icon: 'FiCloud',
          accentColor: 'from-sky-500 to-indigo-500',
          glowColor: 'rgba(14, 165, 233, 0.2)',
          canvasType: 'cloud'
        },
        {
          title: 'Maintenance & Support',
          category: 'Infrastructure',
          description: 'Provide continuous updates, automated health monitoring, security patches and SLA bug resolution.',
          details: [
            '24/7 downtime checks and logs',
            'Automated core code upgrades',
            'Security patches and package fixes',
            'Dedicated Slack instant response team'
          ],
          tags: ['AWS', 'Docker', 'Firebase', 'Node.js'],
          icon: 'FiSettings',
          accentColor: 'from-teal-500 to-emerald-500',
          glowColor: 'rgba(20, 184, 166, 0.2)',
          canvasType: 'support'
        },
        {
          title: 'Custom Software Development',
          category: 'Development',
          description: 'Build robust enterprise-grade backend engines and web systems tailored to business operations.',
          details: [
            'High-performance backend thread pools',
            'Secure internal portal layouts',
            'Distributed event message systems',
            'Custom database structures'
          ],
          tags: ['Node.js', 'Express', 'MongoDB', 'TypeScript'],
          icon: 'FiCpu',
          accentColor: 'from-amber-500 to-orange-500',
          glowColor: 'rgba(245, 158, 11, 0.25)',
          canvasType: 'software'
        }
      ];

      for (const service of defaultServices) {
        await ServiceModel.create(service);
      }
      console.log('Seeded default services database records.');
    }
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await ServiceModel.find({});
    return res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { title, description, category, details, tags, icon, accentColor, glowColor, canvasType } = req.body;
    if (!title || !description || !category || !icon) {
      return res.status(400).json({ success: false, message: 'Required fields: title, description, category, icon' });
    }

    const service = await ServiceModel.create({
      title,
      description,
      category,
      details: details || [],
      tags: tags || [],
      icon,
      accentColor: accentColor || 'from-cyan-500 to-blue-500',
      glowColor: glowColor || 'rgba(6,182,212,0.2)',
      canvasType: canvasType || 'web'
    });

    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedService = await ServiceModel.findByIdAndUpdate(id, req.body);
    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedService = await ServiceModel.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting service' });
  }
};
