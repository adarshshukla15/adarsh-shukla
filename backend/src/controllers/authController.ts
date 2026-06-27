import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'a3_agency_super_secret_key_12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'a3_agency_refresh_secret_key_54321';

// Seed default admin if no users exist
export const seedAdmin = async () => {
  try {
    const users = await UserModel.find({});
    if (users.length < 3) {
      console.log(`Found ${users.length} users. Ensuring all 3 roles (Super Admin, Admin, Editor) are seeded...`);
      
      // Clear out older seeding
      for (const u of users) {
        await UserModel.findByIdAndDelete(u.id || u._id);
      }

      // 1. Super Admin
      const hashSuper = await bcrypt.hash('superadminpassword123', 10);
      await UserModel.create({
        name: 'A3 Super Admin',
        email: 'superadmin@a3.agency',
        password: hashSuper,
        role: 'superadmin'
      });

      // 2. Admin
      const hashAdmin = await bcrypt.hash('adminpassword123', 10);
      await UserModel.create({
        name: 'A3 Administrator',
        email: 'admin@a3.agency',
        password: hashAdmin,
        role: 'admin'
      });

      // 3. Editor
      const hashEditor = await bcrypt.hash('editorpassword123', 10);
      await UserModel.create({
        name: 'A3 Editor',
        email: 'editor@a3.agency',
        password: hashEditor,
        role: 'editor'
      });

      console.log('Seeded default role credentials successfully.');
    }
  } catch (error) {
    console.error('Error seeding default admins:', error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Access and Refresh Tokens
    const token = jwt.sign(
      { id: user.id || user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      { id: user.id || user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      { id: user.id || user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token: newAccessToken
    });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Avoid enumerating users: return success but don't do anything
      return res.status(200).json({ success: true, message: 'If the email exists, a reset token was sent.' });
    }

    // Generate 6-digit numeric token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry

    await UserModel.findByIdAndUpdate(user.id || user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });

    // Simulate sending email
    console.log(`[SMTP SIMULATION] Password Reset Pin for ${email}: ${token}`);
    
    // Optional SMTP setup
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: `"A3 Agency Secure" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Verification Pin - A3 CMS',
        text: `Your password reset verification pin is: ${token}. It will expire in 1 hour.`,
        html: `<div style="font-family:sans-serif;padding:24px;background-color:#050505;color:#ffffff;border-radius:16px;">
                 <h2 style="color:#06b6d4;text-transform:uppercase;">Reset Admin Password</h2>
                 <p>Use the following 6-digit security code to reset your account password:</p>
                 <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(6,182,212,0.2);padding:16px;font-size:24px;font-weight:bold;letter-spacing:6px;text-align:center;color:#06b6d4;border-radius:8px;margin:24px 0;">
                   ${token}
                 </div>
                 <p style="font-size:11px;color:#666;">If you did not request this code, please ignore this email or harden your passwords.</p>
               </div>`
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) console.error('Error sending reset email SMTP:', err);
      });
    }

    return res.status(200).json({ success: true, message: 'Password reset pin generated successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating reset token' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Required fields: email, token, newPassword' });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    // Verify token & expiry
    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification pin' });
    }

    const expiryTime = new Date(user.resetPasswordExpires || '').getTime();
    if (Date.now() > expiryTime) {
      return res.status(400).json({ success: false, message: 'Verification pin has expired' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(user.id || user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return res.status(200).json({ success: true, message: 'Password updated successfully. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updated = await UserModel.findByIdAndUpdate(req.user.id, updateData);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
