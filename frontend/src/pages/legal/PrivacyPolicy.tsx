import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Privacy Policy for A3 Web & Software Services. Learn how we collect, protect, and use your personal and project information."
      canonicalUrl="https://a3servicesin.netlify.app/privacy-policy"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">1. Introduction</h2>
        <p>
          Welcome to <strong>A3 Web & Software Services</strong>. We are committed to protecting your privacy and ensuring that your personal and project data is handled securely and responsibly. This Privacy Policy describes how we collect, use, store, and share your information when you visit our website (https://a3servicesin.netlify.app) or contract our design, engineering, and consulting services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">2. Information We Collect</h2>
        
        <div className="pl-4 border-l border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase">A. Personal Information</h3>
          <p>
            When you submit contact forms or request quotes, we collect personal identity parameters such as your name, email address, phone number, and company name to communicate project estimates and updates.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">B. Project Information</h3>
          <p>
            We collect structural details concerning your digital requirements, including target features, messages, service selections, budgets, and timelines, which are essential for engineering custom solutions.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">C. Cookies</h3>
          <p>
            Our website uses cookies and similar tracking identifiers to authenticate admin sessions, maintain user preferences, and analyze navigation behaviors.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">D. Analytics</h3>
          <p>
            We dynamically collect browser properties, remote IP addresses, referral source paths, page loads, and active interaction rates to optimize interface layouts.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">3. How We Use Data</h2>
        <p>
          We process client data to deliver development solutions, verify user permissions, handle database lookups, analyze performance parameters, and distribute product alerts.
        </p>
        <div className="pl-4 border-l border-white/5 space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase">Email Communication</h3>
          <p>
            We use your contact details to reply directly to inquiry estimates, deliver project proposals, send invoices, and distribute newsletter articles (should you subscribe). You can opt out of newsletter alerts at any time.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">4. Data Security</h2>
        <p>
          We employ standard security strategies, including SSL certificates, request rate limiting, input sanitization, and parameterized database queries to protect your data. While we take maximum precautions, no online transmission is 100% secure, and we cannot guarantee complete data safety.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">5. Third-Party Services</h2>
        <p>
          We integrate secure, enterprise-grade cloud providers to store information and host applications:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Cloudinary:</strong> Used for storing and distributing images and digital assets.</li>
          <li><strong>MongoDB:</strong> Secure database cloud platform hosting structural inquiry records.</li>
          <li><strong>Render:</strong> Backend hosting server where Express API endpoints are executed.</li>
          <li><strong>Netlify:</strong> Static web hosting network delivering frontend bundle directories.</li>
          <li><strong>SMTP Mail:</strong> Secure mail routers dispatching background notification logs.</li>
          <li><strong>Google Fonts:</strong> Embedded typography files used to load modern interface layouts.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">6. User Rights</h2>
        <p>
          You have the right to request access to the personal data we store about you, update incorrect properties, or ask for the deletion of your inquiry logs. To exercise these rights, please contact us.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">7. Data Retention</h2>
        <p>
          We retain client contact details and database inquiries as long as necessary to fulfill project requirements, handle administrative accounting, resolve conflicts, and satisfy legal obligations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">8. Children's Privacy</h2>
        <p>
          Our web solutions are designed for adult business owners and software managers. We do not knowingly collect personal details from children under 13. If you believe a child has provided us with details, contact us for immediate deletion.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">9. Changes to Policy</h2>
        <p>
          We reserve the right to revise this Privacy Policy at any time. Changes will be posted directly to this page with the modified timestamp updated above.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">10. Contact Information</h2>
        <p>
          For questions, data access requests, or privacy concerns, reach out to us:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div>
            <p className="font-bold text-white">Adarsh Shukla</p>
            <p>Email: <a href="mailto:a3webservices.inn@gmail.com" className="text-cyan-400 hover:underline">a3webservices.inn@gmail.com</a></p>
            <p>Phone: <a href="tel:+917827174313" className="text-cyan-400 hover:underline">+91 78271 74313</a></p>
          </div>
          <div>
            <p className="font-bold text-white">Aditya Kumar</p>
            <p>Email: <a href="mailto:a3webservices.inn@gmail.com" className="text-cyan-400 hover:underline">a3webservices.inn@gmail.com</a></p>
            <p>Phone: <a href="tel:+917678451381" className="text-cyan-400 hover:underline">+91 76784 51381</a></p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Office: North East Delhi, Delhi, India
        </p>
      </section>
    </LegalPageLayout>
  );
}
