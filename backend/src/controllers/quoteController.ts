import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { QuoteModel } from '../models/quoteModel';
import { sendAdminInquiry, sendCustomerConfirmation } from '../services/emailService';

export const getQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await QuoteModel.find({});
    return res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving project estimations' });
  }
};

export const createQuote = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { name, email, company, services, budget, timeline, projectDetails } = req.body;
    
    // Save to DB first
    const quote = await QuoteModel.create({
      name,
      email,
      company: company || '',
      services: services || [],
      budget,
      timeline,
      projectDetails,
      status: 'pending'
    });

    // Real-time Socket.IO trigger
    const io = req.app.get('io');
    if (io) {
      io.emit('newQuote', quote);
    }

    // Extract diagnostic info
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const browser = req.headers['user-agent'] || 'unknown';
    const date = new Date().toLocaleString();

    let emailDeliveryFailed = false;
    try {
      // Send alert to admin
      await sendAdminInquiry({
        name,
        email,
        phone: 'Not specified',
        company: company || 'Not specified',
        services: services || [],
        budget,
        timeline,
        subject: `Project Estimation Request: ${services ? services.join(', ') : 'Custom Service'}`,
        message: projectDetails,
        ip,
        date,
        browser
      });

      // Send confirmation to customer
      await sendCustomerConfirmation({
        name,
        email,
        subject: `Estimate Request Received - A3 Web & Software Services`,
        services: services || [],
        budget,
        timeline
      });

      console.log(`[Quote SMTP] Inquiry notifications sent successfully for client: ${email}`);
    } catch (smtpError: any) {
      console.error('[SMTP Delivery Failed] Detailed Stack Trace Below:');
      console.error(smtpError.stack || smtpError.message || smtpError);
      emailDeliveryFailed = true;
    }

    if (emailDeliveryFailed) {
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has been saved successfully. Email delivery failed.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully.'
    });

  } catch (error) {
    console.error('Create quote error:', error);
    return res.status(500).json({ success: false, message: 'Server error requesting estimation' });
  }
};

export const updateQuoteStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await QuoteModel.findByIdAndUpdate(id, { status });
    if (!updated) return res.status(404).json({ success: false, message: 'Quote not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update quote status error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

export const deleteQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await QuoteModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Quote not found' });
    return res.status(200).json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Delete quote error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting quote' });
  }
};
