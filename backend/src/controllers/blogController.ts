import { Request, Response } from 'express';
import { BlogModel, IBlog } from '../models/blogModel';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    const blogs = await BlogModel.find(query);
    return res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    console.error('Get blogs error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving blogs' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const blog = await BlogModel.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, slug, category, tags, featuredImage, content, seoTitle, seoDescription, status } = req.body;

    if (!title || !slug || !category || !featuredImage || !content) {
      return res.status(400).json({ success: false, message: 'Required fields: title, slug, category, featuredImage, content' });
    }

    const existing = await BlogModel.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A blog post with this slug already exists' });
    }

    // Default author to admin or authenticated user's name
    const author = (req as any).user?.name || 'Administrator';

    const blog = await BlogModel.create({
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      category,
      tags: tags || [],
      featuredImage,
      content,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || '',
      status: status || 'draft',
      author
    });

    return res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { title, slug, category, tags, featuredImage, content, seoTitle, seoDescription, status } = req.body;
    
    const updateData: Partial<IBlog> = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;
    if (featuredImage) updateData.featuredImage = featuredImage;
    if (content) updateData.content = content;
    if (seoTitle) updateData.seoTitle = seoTitle;
    if (seoDescription) updateData.seoDescription = seoDescription;
    if (status) updateData.status = status;

    const updated = await BlogModel.findByIdAndUpdate(id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update blog error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await BlogModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting blog' });
  }
};
