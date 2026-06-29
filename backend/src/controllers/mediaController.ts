import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { MediaModel } from '../models/mediaModel';

// Validate Cloudinary configuration at startup
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('WARNING: Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not set. Image uploads will fail.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer with MEMORY storage (no local file writes — Render-safe)
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpeg, jpg, png, webp, gif, svg)'));
  }
}).single('file'); // Matches 'file' key in dropzone

/**
 * Upload a buffer directly to Cloudinary (no local file system usage).
 */
const uploadBufferToCloudinary = (buffer: Buffer, originalname: string): Promise<{ url: string; public_id: string }> => {
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

/**
 * Reusable helper to upload to Cloudinary from a file path (used by project controller for multer disk fallback).
 * Now uses Cloudinary only — no local fallback.
 */
export const uploadToCloudinaryOrLocal = async (localPath: string, filename: string): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'a3_agency_cms'
    });
    // Delete temporary file saved locally
    try {
      const fs = await import('fs');
      fs.unlinkSync(localPath);
    } catch (err) {
      console.error('Error deleting temp upload file:', err);
    }
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed. Please check Cloudinary configuration.');
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  try {
    // Upload directly from buffer to Cloudinary
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
    
    // Save to Database
    const media = await MediaModel.create({
      url: uploadResult.url,
      public_id: uploadResult.public_id
    });

    return res.status(200).json({
      success: true,
      url: media.url,
      public_id: media.public_id,
      _id: media._id
    });
  } catch (error) {
    console.error('Upload image route error:', error);
    return res.status(500).json({ success: false, message: 'Server error during upload. Ensure Cloudinary is configured.' });
  }
};

export const getMediaFiles = async (req: Request, res: Response) => {
  try {
    const media = await MediaModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: media.length, data: media });
  } catch (error) {
    console.error('Get media files error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving media' });
  }
};

export const deleteMediaFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const media = await MediaModel.findById(id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media file not found' });
    }

    const { public_id } = media;

    // Delete from Cloudinary
    if (public_id && !public_id.startsWith('local_')) {
      try {
        await cloudinary.uploader.destroy(public_id);
      } catch (err) {
        console.error('Error deleting from Cloudinary:', err);
      }
    }

    // Delete database document reference
    await MediaModel.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('Delete media file error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting media file' });
  }
};

// Configure Multer for project fields (thumbnail + gallery) — also uses memory storage
export const projectUploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpeg, jpg, png, webp)'));
  }
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 20 }
]);
