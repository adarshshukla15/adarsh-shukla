import { Schema, model } from 'mongoose';

export interface ISocial {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface ISEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ISettings {
  id?: string;
  _id?: string;
  companyName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  googleMapsUrl?: string;
  socialLinks: ISocial;
  heroText: string;
  heroSubtitle: string;
  footerText: string;
  copyright: string;
  seo: ISEO;
  googleAnalyticsId?: string;
  logo?: string;
  favicon?: string;
  createdAt?: string;
  updatedAt?: string;
}

const SettingsSchema = new Schema<ISettings>({
  companyName: { type: String, default: 'A3 Web & Software Services' },
  email: { type: String, default: 'a3services.inn@gmail.com' },
  phone: { type: String, default: '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)' },
  whatsapp: { type: String, default: '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)' },
  address: { type: String, default: 'North East Delhi, Delhi, India' },
  googleMapsUrl: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: 'https://linkedin.com' },
    github: { type: String, default: 'https://github.com' },
    twitter: { type: String, default: 'https://twitter.com' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: 'https://instagram.com' }
  },
  heroText: { type: String, default: 'Engineering Digital Experiences That Inspire.' },
  heroSubtitle: { type: String, default: 'From websites to enterprise software, we design and develop scalable digital solutions that accelerate business growth.' },
  footerText: { type: String, default: 'Premium digital solutions for scaling businesses.' },
  copyright: { type: String, default: '© 2026 A3 Web & Software Services. All rights reserved.' },
  seo: {
    metaTitle: { type: String, default: 'A3 Web & Software Services | Premium Agency' },
    metaDescription: { type: String, default: 'Design, develop, and scale modern web, mobile apps, and custom software systems.' },
    keywords: [{ type: String, default: ['software agency', 'web development', 'custom software', 'react 19'] }]
  },
  googleAnalyticsId: { type: String, default: 'G-XXXXXXXXXX' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' }
}, { timestamps: true });

let MongoSettingsModel: any;
try {
  MongoSettingsModel = model<ISettings>('Settings', SettingsSchema);
} catch (e) {
  MongoSettingsModel = model('Settings');
}

export const SettingsModel = {
  get: async (): Promise<ISettings> => {
    let settings = await MongoSettingsModel.findOne({});
    if (!settings) {
      settings = await MongoSettingsModel.create({});
    }
    return settings;
  },
  update: async (data: Partial<ISettings>): Promise<ISettings> => {
    let settings = await MongoSettingsModel.findOne({});
    if (!settings) {
      settings = await MongoSettingsModel.create({});
    }
    return MongoSettingsModel.findByIdAndUpdate(settings._id, data, { new: true });
  }
};
