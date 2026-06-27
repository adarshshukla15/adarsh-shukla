import { Request, Response } from 'express';
import { TestimonialModel } from '../models/testimonialModel';

export const seedTestimonials = async () => {
  try {
    const count = await TestimonialModel.find({});
    if (count.length === 0) {
      const defaultTestimonials = [
        {
          name: 'Sarah Jenkins',
          role: 'VP of Engineering',
          company: 'Acme Corp',
          feedback: 'A3 delivered a custom React application that completely revolutionized our internally managed pipeline. Their mastery of animations and high performance is visible in every single pixel.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        },
        {
          name: 'David Chen',
          role: 'Founder & CEO',
          company: 'Scribe AI',
          feedback: 'Integrating complex OpenAI models and vector searches was completed in record time. A3 is not just an agency, they are technical partners that deeply understand modern software product cycles.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        },
        {
          name: 'Elena Rostova',
          role: 'Chief Product Officer',
          company: 'Apex Designs',
          feedback: 'The Three.js interactivity and custom GSAP scroll transitions created a digital experience that directly increased our customer engagement metrics by 40%. Brilliant architecture.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        }
      ];

      for (const testimonial of defaultTestimonials) {
        await TestimonialModel.create(testimonial);
      }
      console.log('Seeded default testimonials database records.');
    }
  } catch (error) {
    console.error('Error seeding testimonials:', error);
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await TestimonialModel.find({});
    return res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving testimonials' });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, company, feedback, rating, avatar } = req.body;
    if (!name || !role || !company || !feedback) {
      return res.status(400).json({ success: false, message: 'Required fields: name, role, company, feedback' });
    }

    const testimonial = await TestimonialModel.create({
      name,
      role,
      company,
      feedback,
      rating: rating || 5,
      avatar: avatar || ''
    });

    return res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating testimonial' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await TestimonialModel.findByIdAndUpdate(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating testimonial' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await TestimonialModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting testimonial' });
  }
};
