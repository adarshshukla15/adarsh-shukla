import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ContactModel } from '../models/contactModel';
import { sendAdminInquiry, sendCustomerConfirmation } from '../services/emailService';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await ContactModel.find({});
    return res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving messages' });
  }
};

export const createContact = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { name, email, phone, company, budget, timeline, subject, message } = req.body;

    // Save inquiry to MongoDB first
    const contact = await ContactModel.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      budget: budget || '',
      timeline: timeline || '',
      subject,
      message,
      status: 'unread'
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('newContact', contact);
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
        phone,
        company,
        budget,
        timeline,
        subject,
        message,
        ip,
        date,
        browser
      });

      // Send confirmation to customer
      await sendCustomerConfirmation({
        name,
        email,
        subject,
        budget,
        timeline
      });

      console.log(`[Contact SMTP] Inquiry notifications sent successfully for client: ${email}`);
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
    console.error('Create contact error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting inquiry' });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await ContactModel.findByIdAndUpdate(id, { status });
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update contact status error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await ContactModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    return res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting message' });
  }
};
