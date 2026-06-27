import { Schema, model } from 'mongoose';
import { isMongoDBActive } from '../config/db';
import { LocalRepo } from '../utils/localDb';

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

const LocalSettingsRepo = new LocalRepo<ISettings>('settings');

export const SettingsModel = {
  get: async (): Promise<ISettings> => {
    if (isMongoDBActive()) {
      let settings = await MongoSettingsModel.findOne({});
      if (!settings) {
        settings = await MongoSettingsModel.create({});
      }
      return settings;
    }
    
    const settingsList = await LocalSettingsRepo.find({});
    if (settingsList.length === 0) {
      const defaultSettings = {
        companyName: 'A3 Web & Software Services',
        email: 'a3services.inn@gmail.com',
        phone: '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)',
        whatsapp: '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)',
        address: 'North East Delhi, Delhi, India',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          twitter: 'https://twitter.com',
          facebook: '',
          instagram: 'https://instagram.com'
        },
        heroText: 'Engineering Digital Experiences That Inspire.',
        heroSubtitle: 'From websites to enterprise software, we design and develop scalable digital solutions that accelerate business growth.',
        footerText: 'Premium digital solutions for scaling businesses.',
        copyright: '© 2026 A3 Web & Software Services. All rights reserved.',
        seo: {
          metaTitle: 'A3 Web & Software Services | Premium Agency',
          metaDescription: 'Design, develop, and scale modern web, mobile apps, and custom software systems.',
          keywords: ['software agency', 'web development', 'custom software', 'react 19']
        }
      };
      return LocalSettingsRepo.create(defaultSettings);
    }
    return settingsList[0];
  },
  update: async (data: Partial<ISettings>): Promise<ISettings> => {
    if (isMongoDBActive()) {
      let settings = await MongoSettingsModel.findOne({});
      if (!settings) {
        settings = await MongoSettingsModel.create({});
      }
      return MongoSettingsModel.findByIdAndUpdate(settings._id, data, { new: true });
    }
    
    const settingsList = await LocalSettingsRepo.find({});
    let settingsId = '';
    if (settingsList.length === 0) {
      const defaultSettings = {
        companyName: 'A3 Web & Software Services',
        email: 'a3services.inn@gmail.com',
        phone: '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)',
        whatsapp: '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)',
        address: 'North East Delhi, Delhi, India',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          twitter: 'https://twitter.com',
          facebook: '',
          instagram: 'https://instagram.com'
        },
        heroText: 'Engineering Digital Experiences That Inspire.',
        heroSubtitle: 'From websites to enterprise software, we design and develop scalable digital solutions that accelerate business growth.',
        footerText: 'Premium digital solutions for scaling businesses.',
        copyright: '© 2026 A3 Web & Software Services. All rights reserved.',
        seo: {
          metaTitle: 'A3 Web & Software Services | Premium Agency',
          metaDescription: 'Design, develop, and scale modern web, mobile apps, and custom software systems.',
          keywords: ['software agency', 'web development', 'custom software', 'react 19']
        }
      };
      const created = await LocalSettingsRepo.create(defaultSettings);
      settingsId = created.id || created._id || '';
    } else {
      settingsId = settingsList[0].id || settingsList[0]._id || '';
    }
    return (await LocalSettingsRepo.findByIdAndUpdate(settingsId, data)) as ISettings;
  }
};
