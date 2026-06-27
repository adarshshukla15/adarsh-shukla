/**
 * SMTP Test Script — tests Gmail App Password connectivity
 * Run from backend folder: node test_smtp.js
 */
require('dotenv').config();
const nodemailer = require('nodemailer');

const user = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim();

console.log('='.repeat(60));
console.log('SMTP DIAGNOSTIC TEST');
console.log('='.repeat(60));
console.log(`EMAIL_USER: ${user}`);
console.log(`EMAIL_PASS: ${pass.substring(0, 4)}${'*'.repeat(pass.length - 4)} (${pass.length} chars)`);
console.log(`CONTACT_EMAIL: ${(process.env.CONTACT_EMAIL || '').trim()}`);
console.log('='.repeat(60));

if (!user || !pass) {
  console.error('❌ Missing EMAIL_USER or EMAIL_PASS in .env');
  process.exit(1);
}

async function testSMTP() {
  // Method 1: service:'gmail' (recommended)
  console.log('\n🔄 Test 1: Using service:"gmail"...');
  const transporter1 = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter1.verify();
    console.log('✅ Test 1 PASSED — service:"gmail" connection verified!');
    
    // Send a test email
    console.log('\n📧 Sending test email...');
    const info = await transporter1.sendMail({
      from: `"A3 Services Test" <${user}>`,
      to: user,
      subject: 'SMTP Test — Connection Verified ✅',
      html: '<h2 style="color:green;">✅ SMTP is working!</h2><p>Your contact form emails will now be delivered successfully.</p>'
    });
    console.log(`✅ Test email SENT! Message ID: ${info.messageId}`);
    console.log('\n🎉 SUCCESS: Your Gmail SMTP is correctly configured.');
    console.log('   Contact form emails WILL work.');
    return;
  } catch (err) {
    console.error('❌ Test 1 FAILED:', err.message);
    if (err.responseCode === 535) {
      console.error('\n⚠️  GMAIL REJECTED YOUR CREDENTIALS');
      console.error('   This means the App Password is wrong or expired.');
      console.error('\n   👉 FIX: Generate a NEW App Password:');
      console.error('   1. Go to https://myaccount.google.com/security');
      console.error('   2. Ensure 2-Step Verification is ON');
      console.error('   3. Go to https://myaccount.google.com/apppasswords');
      console.error('   4. Create a new App Password for "Mail" → "Windows Computer"');
      console.error('   5. Copy the 16-char code and put it in .env as EMAIL_PASS and SMTP_PASS');
      console.error('   6. Remove ALL spaces from the password');
      console.error('   7. Restart backend (npm run dev)');
    }
  }

  // Method 2: manual host/port as fallback
  console.log('\n🔄 Test 2: Using manual host/port...');
  const transporter2 = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  try {
    await transporter2.verify();
    console.log('✅ Test 2 PASSED — manual host/port connection verified!');
  } catch (err) {
    console.error('❌ Test 2 FAILED:', err.message);
    console.error('\n❌ BOTH METHODS FAILED. Your App Password is invalid.');
    console.error('   Please generate a new one following the steps above.');
  }
}

testSMTP();
