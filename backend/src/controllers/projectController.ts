import { Request, Response } from 'express';
import { ProjectModel } from '../models/projectModel';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Upload a buffer directly to Cloudinary (no local file system usage).
 */
const uploadBufferToCloudinary = (buffer: Buffer): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'a3_agency_cms', resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result!.secure_url,
          public_id: result!.public_id
        });
      }
    );
    uploadStream.end(buffer);
  });
};

export const seedProjects = async () => {
  try {
    const count = await ProjectModel.find({});
    if (count.length === 0) {
      console.log('No projects found. Seeding default projects (first-time setup)...');
      const defaultProjects = [
        {
          title: 'Quantum Analytics Dashboard',
          description: 'A Stripe-inspired real-time financial tracking dashboard featuring sub-millisecond chart updates, dark-themed glassmorphism, and responsive drag-and-drop metrics layout.',
          category: 'Web App',
          client: 'Quantum Inc.',
          budget: '$75,000',
          timeline: '12 Weeks',
          tags: ['React 19', 'Zustand', 'Framer Motion', 'Express', 'Tailwind CSS'],
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          gallery: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
          ],
          liveUrl: 'https://quantum-dash.a3.agency',
          githubUrl: 'https://github.com/a3-agency/quantum-dash'
        },
        {
          title: 'Orbital Mesh Wireframe Globe',
          description: 'An Apple-comparable interactive landing page featuring custom WebGL shaders, particle simulations, and cursor magnet tracking. Smooth scroll engineered using Lenis and GSAP ScrollTrigger.',
          category: 'Three.js / WebGL',
          client: 'Aether Labs',
          budget: '$45,000',
          timeline: '8 Weeks',
          tags: ['Three.js', 'React Three Fiber', 'GSAP', 'Lenis', 'Vite'],
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
          gallery: [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'
          ],
          liveUrl: 'https://orbital.a3.agency',
          githubUrl: 'https://github.com/a3-agency/orbital-globe'
        },
        {
          title: 'Synapse AI Assistant',
          description: 'An AI-powered automation hub integrated with custom LLMs, vector database embeddings, and automated Slack/Discord notification routines. Designed with complete microservices infrastructure.',
          category: 'AI & Automation',
          client: 'Synapse Technologies',
          budget: '$110,000',
          timeline: '16 Weeks',
          tags: ['Node.js', 'LangChain', 'OpenAI API', 'MongoDB', 'React Router'],
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
          gallery: [
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'
          ],
          liveUrl: 'https://synapse.a3.agency',
          githubUrl: 'https://github.com/a3-agency/synapse-ai'
        }
      ];

      for (const project of defaultProjects) {
        await ProjectModel.create(project);
      }
      console.log('Seeded default projects database records.');
    } else {
      console.log(`Found ${count.length} existing project(s). Skipping projects seed.`);
    }
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.find({});
    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Get project by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, category, client, budget, timeline, liveUrl, githubUrl } = req.body;
    
    if (!title || !description || !category || !client || !budget || !timeline) {
      return res.status(400).json({ success: false, message: 'Required fields: title, description, category, client, budget, timeline' });
    }

    let thumbnail = req.body.thumbnail || '';
    let gallery: string[] = [];

    if (req.body.gallery) {
      if (typeof req.body.gallery === 'string') {
        try {
          gallery = JSON.parse(req.body.gallery);
        } catch (e) {
          gallery = req.body.gallery.split(',').map((g: string) => g.trim()).filter((g: string) => g);
        }
      } else if (Array.isArray(req.body.gallery)) {
        gallery = req.body.gallery;
      }
    }

    let parsedTags: string[] = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        try {
          parsedTags = JSON.parse(req.body.tags);
        } catch (e) {
          parsedTags = req.body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
        }
      } else if (Array.isArray(req.body.tags)) {
        parsedTags = req.body.tags;
      }
    }

    // Process uploaded files if available (memory buffer → Cloudinary)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        const thumbUpload = await uploadBufferToCloudinary(files.thumbnail[0].buffer);
        thumbnail = thumbUpload.url;
      }
      
      if (files.gallery && files.gallery.length > 0) {
        const galleryUrls: string[] = [];
        for (const file of files.gallery) {
          const fileUpload = await uploadBufferToCloudinary(file.buffer);
          galleryUrls.push(fileUpload.url);
        }
        gallery = [...gallery, ...galleryUrls];
      }
    }

    if (!thumbnail) {
      thumbnail = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800';
    }

    const project = await ProjectModel.create({
      title,
      description,
      category,
      client,
      budget,
      timeline,
      tags: parsedTags,
      thumbnail,
      gallery,
      liveUrl,
      githubUrl
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existingProject = await ProjectModel.findById(id);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, category, client, budget, timeline, liveUrl, githubUrl } = req.body;

    let thumbnail = req.body.thumbnail !== undefined ? req.body.thumbnail : existingProject.thumbnail;
    let gallery: string[] = [];

    if (req.body.gallery) {
      if (typeof req.body.gallery === 'string') {
        try {
          gallery = JSON.parse(req.body.gallery);
        } catch (e) {
          gallery = req.body.gallery.split(',').map((g: string) => g.trim()).filter((g: string) => g);
        }
      } else if (Array.isArray(req.body.gallery)) {
        gallery = req.body.gallery;
      }
    } else if (req.body.gallery === null || req.body.gallery === undefined) {
      gallery = existingProject.gallery || [];
    }

    let parsedTags = existingProject.tags || [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        try {
          parsedTags = JSON.parse(req.body.tags);
        } catch (e) {
          parsedTags = req.body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
        }
      } else if (Array.isArray(req.body.tags)) {
        parsedTags = req.body.tags;
      }
    }

    // Process uploaded files if available (memory buffer → Cloudinary)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        const thumbUpload = await uploadBufferToCloudinary(files.thumbnail[0].buffer);
        thumbnail = thumbUpload.url;
      }
      
      if (files.gallery && files.gallery.length > 0) {
        const galleryUrls: string[] = [];
        for (const file of files.gallery) {
          const fileUpload = await uploadBufferToCloudinary(file.buffer);
          galleryUrls.push(fileUpload.url);
        }
        gallery = [...gallery, ...galleryUrls];
      }
    }

    const updatePayload = {
      title: title !== undefined ? title : existingProject.title,
      description: description !== undefined ? description : existingProject.description,
      category: category !== undefined ? category : existingProject.category,
      client: client !== undefined ? client : existingProject.client,
      budget: budget !== undefined ? budget : existingProject.budget,
      timeline: timeline !== undefined ? timeline : existingProject.timeline,
      liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
      githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
      tags: parsedTags,
      thumbnail,
      gallery
    };

    const updatedProject = await ProjectModel.findByIdAndUpdate(id, updatePayload);
    return res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedProject = await ProjectModel.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting project' });
  }
};
