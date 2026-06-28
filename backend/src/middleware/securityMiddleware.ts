import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

// 1. Memory-based rate limiter to protect endpoints from abuse
const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
const rateLimitMaxRequests = process.env.NODE_ENV === 'production' ? 10 : 100;
const ipCache = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const cached = ipCache.get(ip);
  if (!cached || now > cached.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + rateLimitWindowMs });
    return next();
  }

  cached.count += 1;
  if (cached.count > rateLimitMaxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many submissions from this IP. Please try again after 15 minutes.'
    });
  }

  next();
};

// 2. Input validation and sanitization for contact/inquiry API
export const validateContactInputs = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('budget')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('timeline')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters')
    .escape(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must describe requirements (min 10 characters)')
    .escape()
];

// 3. Input validation and sanitization for estimator/quote API
export const validateQuoteInputs = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('services')
    .optional()
    .isArray().withMessage('Services must be an array of strings'),
  body('budget')
    .trim()
    .notEmpty().withMessage('Budget range is required')
    .escape(),
  body('timeline')
    .trim()
    .notEmpty().withMessage('Timeline is required')
    .escape(),
  body('projectDetails')
    .trim()
    .notEmpty().withMessage('Project scope details are required')
    .isLength({ min: 10, max: 1000 }).withMessage('Project scope details must describe requirements (min 10 characters)')
    .escape()
];
