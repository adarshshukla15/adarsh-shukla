import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER || '';
  const pass = process.env.EMAIL_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // Port 587 is secure: false (it upgrades to TLS via STARTTLS)
    auth: {
      user,
      pass
    }
  });
};

/**
 * Robust retry wrapper for Nodemailer sendMail.
 * Retries up to 3 times with a 2-second delay.
 */
const sendMailWithRetry = async (mailOptions: any, retries = 3, delay = 2000): Promise<any> => {
  const transporter = getTransporter();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      console.warn(`[SMTP Retry] Attempt ${attempt} failed. Retrying in ${delay}ms... Error:`, err);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Verify SMTP connection setup when the server starts.
 */
export const verifySMTP = async (): Promise<boolean> => {
  const transporter = getTransporter();
  try {
    await transporter.verify();
    console.log('✅ SMTP Connected Successfully');
    return true;
  } catch (error: any) {
    console.error('❌ SMTP Authentication Failed');
    console.error('SMTP Connection Detail:', error.message || error);
    return false;
  }
};

/**
 * Send inquiry detail alert to Admin.
 */
export const sendAdminInquiry = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services?: string[];
  budget?: string;
  timeline?: string;
  subject: string;
  message: string;
  ip: string;
  date: string;
  browser: string;
}): Promise<any> => {
  const adminEmail = (process.env.EMAIL_USER || 'a3services.inn@gmail.com').trim();
  const fromEmail = process.env.EMAIL_FROM || `"A3 Portal" <${process.env.EMAIL_USER}>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Inquiry Received</title>
    </head>
    <body style="background-color: #020203; padding: 20px; margin: 0;">
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050507; padding: 30px; border-radius: 16px; border: 1px solid #1a1a24; max-width: 600px; margin: 0 auto; color: #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="text-align: center; border-bottom: 1px solid #1a1a24; padding-bottom: 20px; margin-bottom: 25px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">
            A3 <span style="color: #00d2ff;">PORTAL</span>
          </h1>
          <h2 style="margin: 10px 0 0 0; color: #00d2ff; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 800;">
            🚀 New Inquiry Received
          </h2>
        </div>
        
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.5;">
          A visitor has submitted a new inquiry form on the website. The complete details are structured below:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; width: 140px; border-bottom: 1px solid #15151e;">Client Name</td>
            <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #15151e;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Email Address</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #15151e;"><a href="mailto:${data.email}" style="color: #00d2ff; text-decoration: none; font-weight: bold;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Phone Number</td>
            <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #15151e;">${data.phone || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Company</td>
            <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #15151e;">${data.company || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Requested Service</td>
            <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #15151e;">${data.services && data.services.length > 0 ? data.services.join(', ') : (data.subject || 'General Inquiry')}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Target Budget</td>
            <td style="padding: 10px 0; color: #10b981; font-weight: bold; border-bottom: 1px solid #15151e;">${data.budget || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Timeline</td>
            <td style="padding: 10px 0; color: #ffffff; border-bottom: 1px solid #15151e;">${data.timeline || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Client IP Address</td>
            <td style="padding: 10px 0; color: #94a3b8; font-family: monospace; border-bottom: 1px solid #15151e;">${data.ip}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Browser/Platform</td>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 11px; border-bottom: 1px solid #15151e; word-break: break-all;">${data.browser}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #8f9cae; border-bottom: 1px solid #15151e;">Submission Date</td>
            <td style="padding: 10px 0; color: #94a3b8; border-bottom: 1px solid #15151e;">${data.date}</td>
          </tr>
        </table>

        <div style="margin-top: 25px;">
          <span style="font-weight: bold; color: #ffffff; font-size: 13px; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Message Brief / Scope:</span>
          <div style="background-color: #111118; border: 1px solid #1c1c28; padding: 18px; border-radius: 10px; font-size: 13px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">
            ${data.message}
          </div>
        </div>

        <div style="text-align: center; margin-top: 35px; border-top: 1px solid #1a1a24; padding-top: 20px;">
          <a href="https://a3services.in.netlify.app/admin" style="display: inline-block; background: linear-gradient(135deg, #00d2ff 0%, #0066ff 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 13px; font-weight: bold; border-radius: 30px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);">
            Open Admin Dashboard
          </a>
        </div>

        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #4a5568;">
          This is an automated alert generated by the A3 Agency content management engine.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: fromEmail,
    to: adminEmail,
    subject: `🚀 New Inquiry Received | A3 Web & Software Services`,
    html
  };

  return sendMailWithRetry(mailOptions);
};

/**
 * Send receipt/thank you email to Visitor.
 */
export const sendCustomerConfirmation = async (data: {
  name: string;
  email: string;
  subject: string;
  services?: string[];
  budget?: string;
  timeline?: string;
}): Promise<any> => {
  const fromEmail = process.env.EMAIL_FROM || `"A3 Web & Software Services" <${process.env.EMAIL_USER}>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting A3 Agency</title>
    </head>
    <body style="background-color: #020203; padding: 20px; margin: 0;">
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050507; padding: 30px; border-radius: 16px; border: 1px solid #1a1a24; max-width: 600px; margin: 0 auto; color: #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="text-align: center; border-bottom: 1px solid #1a1a24; padding-bottom: 20px; margin-bottom: 25px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">
            A3 <span style="color: #00d2ff;">SERVICES</span>
          </h1>
          <h2 style="margin: 10px 0 0 0; color: #00d2ff; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 800;">
            Inquiry Received Successfully
          </h2>
        </div>

        <div style="text-align: left;">
          <p style="font-size: 15px; font-weight: bold; color: #ffffff; margin-bottom: 15px;">
            Dear ${data.name},
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 15px;">
            Thank you for reaching out to <strong>A3 Web & Software Services</strong>. We are excited about the opportunity to partner with you!
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 15px;">
            One of our senior software engineers is currently reviewing your briefs and technical requirements. <strong>You can expect a direct response from us within the next 24 hours</strong> to discuss estimates or schedule a diagnostic call.
          </p>
          
          <div style="margin: 25px 0; background-color: rgba(6,182,212,0.03); border: 1px solid rgba(6,182,212,0.15); padding: 18px; border-radius: 12px; font-size: 12px; color: #00d2ff; line-height: 1.6;">
            <strong style="color: #ffffff; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Your Submission Summary:</strong>
            • <strong>Subject:</strong> ${data.services && data.services.length > 0 ? `Inquiry: ${data.services.join(', ')}` : (data.subject || 'General Inquiry')}<br/>
            • <strong>Budget Goal:</strong> ${data.budget || 'To be discussed'}<br/>
            • <strong>Timeline:</strong> ${data.timeline || 'To be discussed'}
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 25px;">
            In the meantime, feel free to explore our case studies or portfolio of work. We look forward to building something extraordinary together!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-bottom: 20px;">
          <a href="https://a3services.in.netlify.app" style="display: inline-block; background: linear-gradient(135deg, #00d2ff 0%, #0066ff 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 13px; font-weight: bold; border-radius: 30px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);">
            Visit Our Website
          </a>
        </div>

        <div style="text-align: center; border-top: 1px solid #1a1a24; padding-top: 20px; margin-top: 20px; font-size: 11px; color: #4a5568; line-height: 1.5;">
          <strong>A3 Web & Software Services</strong><br/>
          North East Delhi, Delhi, India<br/>
          <a href="mailto:a3services.inn@gmail.com" style="color: #00d2ff; text-decoration: none;">a3services.inn@gmail.com</a> | +91 78271 74313<br/>
          <span style="display: block; margin-top: 10px; font-size: 9px; color: #334155;">Please do not reply directly to this automated receipt email.</span>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: fromEmail,
    to: data.email,
    subject: `Thank You for Contacting A3 Web & Software Services`,
    html
  };

  return sendMailWithRetry(mailOptions);
};
