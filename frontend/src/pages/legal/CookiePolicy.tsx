import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

export default function CookiePolicy() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Cookie Policy for A3 Web & Software Services. Learn how we use essential, analytics, and preference cookies on our website."
      canonicalUrl="https://a3servicesin.netlify.app/cookie-policy"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">1. What are Cookies?</h2>
        <p>
          Cookies are small text documents that are saved on your computer or mobile device when you load web pages. They help websites remember your credentials, layout settings, and active session tokens so you do not have to enter them repeatedly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">2. Cookies We Use</h2>
        <p>
          We use cookies to improve user experience, secure administrator logins, and gather analytical data:
        </p>
        
        <div className="pl-4 border-l border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase">A. Essential Cookies</h3>
          <p>
            These cookies are required to authenticate admin sessions, allow dashboard access, and protect contact forms from spam. Without these cookies, the portal cannot operate correctly.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">B. Analytics Cookies</h3>
          <p>
            We use Google Analytics and background tracking systems to monitor page loads, device types, referral domains, and interaction speeds. This statistical information is aggregated and helps us improve our services.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">C. Preference Cookies</h3>
          <p>
            These cookies remember your preferences, dark mode states, and layout interactions, making your navigation experience smoother.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">3. Managing Cookies</h2>
        <p>
          You can restrict, disable, or delete cookies at any time by configuring your browser's security settings. If you disable cookies, please note that some sections of our website (including administrative portal logins) will not operate correctly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">4. Contact Information</h2>
        <p>
          For queries regarding cookie usage on our platform, reach out to us:
        </p>
        <p className="text-cyan-400">
          Email: <a href="mailto:a3webservices.inn@gmail.com" className="hover:underline">a3webservices.inn@gmail.com</a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
