import { Request, Response } from 'express';
import { FaqModel } from '../models/faqModel';

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await FaqModel.find({});
    return res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    console.error('Get faqs error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving FAQs' });
  }
};

export const createFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer, displayOrder } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Required fields: question, answer' });
    }

    const faq = await FaqModel.create({
      question,
      answer,
      displayOrder: displayOrder || 0
    });
    return res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating FAQ' });
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await FaqModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update FAQ error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating FAQ' });
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await FaqModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    return res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting FAQ' });
  }
};
