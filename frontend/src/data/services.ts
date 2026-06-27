export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  tags: string[];
  icon: string;
  colSpan: string; // Desktop (lg), Tablet (md), Mobile column span classes
  rowSpan: string; // Desktop row span
  accentColor: string; // Tailwind gradient classes
  glowColor: string; // RGBA shadow glow color
  canvasType:
    | 'design'
    | 'web'
    | 'mobile'
    | 'software'
    | 'ai'
    | 'crm'
    | 'erp'
    | 'saas'
    | 'ecommerce'
    | 'api'
    | 'cloud'
    | 'support';
}

export const servicesData: ServiceItem[] = [
  {
    id: 'web-dev',
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
    colSpan: 'lg:col-span-8 md:col-span-2 col-span-12',
    rowSpan: 'lg:row-span-2',
    accentColor: 'from-cyan-500 via-blue-500 to-indigo-500',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    canvasType: 'web'
  },
  {
    id: 'ui-ux-design',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-pink-500 to-purple-500',
    glowColor: 'rgba(236, 72, 153, 0.2)',
    canvasType: 'design'
  },
  {
    id: 'ai-solutions',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-purple-500 via-indigo-500 to-cyan-500',
    glowColor: 'rgba(168, 85, 247, 0.2)',
    canvasType: 'ai'
  },
  {
    id: 'crm-dev',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-blue-500 to-indigo-500',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    canvasType: 'crm'
  },
  {
    id: 'erp-systems',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    canvasType: 'erp'
  },
  {
    id: 'api-dev',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-cyan-500 to-blue-500',
    glowColor: 'rgba(6, 182, 212, 0.2)',
    canvasType: 'api'
  },
  {
    id: 'saas-dev',
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
    colSpan: 'lg:col-span-8 md:col-span-2 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-violet-500 to-purple-500',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    canvasType: 'saas'
  },
  {
    id: 'mobile-app-dev',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-rose-500 to-red-500',
    glowColor: 'rgba(244, 63, 94, 0.2)',
    canvasType: 'mobile'
  },
  {
    id: 'ecommerce-solutions',
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
    colSpan: 'lg:col-span-6 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-pink-500 to-rose-500',
    glowColor: 'rgba(236, 72, 153, 0.2)',
    canvasType: 'ecommerce'
  },
  {
    id: 'cloud-deployment',
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
    colSpan: 'lg:col-span-6 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-sky-500 to-indigo-500',
    glowColor: 'rgba(14, 165, 233, 0.2)',
    canvasType: 'cloud'
  },
  {
    id: 'maintenance-support',
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
    colSpan: 'lg:col-span-4 md:col-span-1 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-teal-500 to-emerald-500',
    glowColor: 'rgba(20, 184, 166, 0.2)',
    canvasType: 'support'
  },
  {
    id: 'custom-software',
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
    colSpan: 'lg:col-span-8 md:col-span-2 col-span-12',
    rowSpan: 'lg:row-span-1',
    accentColor: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    canvasType: 'software'
  }
];
