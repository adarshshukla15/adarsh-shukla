import { Request, Response } from 'express';
import { SettingsModel } from '../models/settingsModel';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SettingsModel.get();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SettingsModel.update(req.body);
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};
