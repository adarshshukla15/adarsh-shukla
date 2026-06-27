import { Request, Response } from 'express';
import { NewsletterModel } from '../models/newsletterModel';

export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterModel.find({});
    return res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving subscribers' });
  }
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const existing = await NewsletterModel.findOne({ email });
    if (existing) {
      if (existing.active) {
        return res.status(400).json({ success: false, message: 'Email is already subscribed' });
      } else {
        const updated = await NewsletterModel.findByIdAndUpdate(existing.id || existing._id, { active: true });
        return res.status(200).json({ success: true, message: 'Subscription reactivated successfully', data: updated });
      }
    }

    const newSub = await NewsletterModel.create({
      email,
      active: true
    });

    console.log(`[Newsletter Subscribed] Email: ${email}`);

    return res.status(201).json({ success: true, message: 'Subscribed to newsletter successfully', data: newSub });
  } catch (error) {
    console.error('Subscribe newsletter error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing subscription' });
  }
};

export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const subscriber = await NewsletterModel.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    const updated = await NewsletterModel.findByIdAndUpdate(subscriber.id || subscriber._id, { active: false });
    return res.status(200).json({ success: true, message: 'Unsubscribed from newsletter successfully', data: updated });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing unsubscribe request' });
  }
};
