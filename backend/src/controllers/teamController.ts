import { Request, Response } from 'express';
import { TeamModel } from '../models/teamModel';

export const seedTeam = async () => {
  try {
    const count = await TeamModel.find({});
    if (count.length === 0) {
      const defaultTeam = [
        {
          name: 'Adarsh Shukla',
          role: 'Principal Software Architect',
          bio: '15+ years experience in enterprise cloud architectures, database design, and high-performance Node.js microservices.',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com',
            twitter: 'https://twitter.com'
          }
        },
        {
          name: 'Sarah Connor',
          role: 'Lead UI/UX Architect',
          bio: 'Awwwards-winning product designer specialized in futuristic dark aesthetics, high-impact animations, and spatial UI systems.',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            github: 'https://github',
            twitter: 'https://twitter.com'
          }
        },
        {
          name: 'Marcus Wright',
          role: 'Senior WebGL & Frontend Dev',
          bio: 'Three.js expert dedicated to crafting interactive 3D landscapes, shader effects, and ultra-responsive React 19 pages.',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com',
            twitter: 'https://twitter.com'
          }
        }
      ];

      for (const member of defaultTeam) {
        await TeamModel.create(member);
      }
      console.log('Seeded default team members database records.');
    }
  } catch (error) {
    console.error('Error seeding team:', error);
  }
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await TeamModel.find({});
    return res.status(200).json({ success: true, count: team.length, data: team });
  } catch (error) {
    console.error('Get team error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving team members' });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, role, bio, photo, socialLinks } = req.body;
    if (!name || !role || !bio || !photo) {
      return res.status(400).json({ success: false, message: 'Required fields: name, role, bio, photo' });
    }

    const member = await TeamModel.create({
      name,
      role,
      bio,
      photo,
      socialLinks: socialLinks || {}
    });

    return res.status(201).json({ success: true, data: member });
  } catch (error) {
    console.error('Create team member error:', error);
    return res.status(500).json({ success: false, message: 'Server error adding team member' });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await TeamModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update team member error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating team member' });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await TeamModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    return res.status(200).json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting team member' });
  }
};
