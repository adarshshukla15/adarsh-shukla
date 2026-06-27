import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { MediaModel } from '../models/mediaModel';

// Configure Multer local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Reusable helper to upload a local file to Cloudinary, falling back to local static file path.
 */
export const uploadToCloudinaryOrLocal = async (localPath: string, filename: string): Promise<{ url: string; public_id: string }> => {
  const hasCloudinary = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'a3_agency_cms'
      });
      // Delete temporary file saved locally
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.error('Error deleting temp upload file:', err);
      }
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error, falling back to local file path:', error);
    }
  }

  // Fallback: serve local file link
  const baseUrl = process.env.BASE_URL || 'https://adarsh-shukla.onrender.com';
  const fileUrl = `${baseUrl}/uploads/${filename}`;
  return {
    url: fileUrl,
    public_id: `local_${filename.split('-')[0] || 'file'}`
  };
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  try {
    const uploadResult = await uploadToCloudinaryOrLocal(req.file.path, req.file.filename);
    
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
    return res.status(500).json({ success: false, message: 'Server error during upload' });
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

    const { public_id, url } = media;

    // 1. Delete file asset from Cloudinary or local uploads
    const hasCloudinary = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary && !public_id.startsWith('local_')) {
      try {
        await cloudinary.uploader.destroy(public_id);
      } catch (err) {
        console.error('Error deleting from Cloudinary:', err);
      }
    } else {
      try {
        const filename = path.basename(url);
        const filePath = path.join('./uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }

    // 2. Delete database document reference
    await MediaModel.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('Delete media file error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting media file' });
  }
};

// Configure Multer for project fields (thumbnail + gallery)
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
