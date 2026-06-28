import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

export default function TermsConditions() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Terms & Conditions for A3 Web & Software Services. Review our policies regarding software development services, payments, intellectual property, and liabilities."
      canonicalUrl="https://a3servicesin.netlify.app/terms-and-conditions"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">1. Agreement to Terms</h2>
        <p>
          By accessing this website or contracting design and engineering services from <strong>A3 Web & Software Services</strong>, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully before initiating a project with us.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">2. Services Offered</h2>
        <p>
          We provide custom engineering, deployment, optimization, and design solutions, including but not limited to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Website Development:</strong> Interactive user interfaces, single-page apps (SPA), landing pages, and content management systems.</li>
          <li><strong>Software Development:</strong> Custom tools, API architectures, microservices, and database systems.</li>
          <li><strong>Mobile Apps:</strong> Premium responsive hybrid mobile applications.</li>
          <li><strong>AI Automation:</strong> Custom scripts, automations, database cron operations, and integrations with language model APIs.</li>
          <li><strong>CRM & ERP Systems:</strong> Dedicated client dashboards, accounting sheets, and administrative project management systems.</li>
          <li><strong>Cloud Solutions:</strong> Deployment setups, pipeline configs, and cloud hosting management (Render, Netlify, AWS).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">3. Payments</h2>
        <p>
          Project pricing is defined inside official proposals. Invoices are dispatched on specific project milestones.
        </p>
        <div className="pl-4 border-l border-white/5 space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase">Advance Payment Policy</h3>
          <p>
            An advance payment (typically 30% to 50% of the project total) is required before we begin design or development. <strong>Advance payments are non-refundable</strong> as they are used to allocate developers, configure workspaces, and purchase project assets.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">4. Project Timeline</h2>
        <p>
          Estimated timelines represent engineering targets. Timelines depend heavily on the prompt delivery of assets, text contents, APIs credentials, and review approvals by the client. Delays in client feedback will extend project timelines.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">5. Client Responsibilities</h2>
        <p>
          Clients are responsible for providing correct business credentials, vector icons, copy assets, and compliance credentials required for deployment. Clients warrant that all supplied contents do not violate third-party intellectual property rights.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">6. Intellectual Property</h2>
        <p>
          Upon full settlement of all pending invoices, ownership rights of custom software files, design layouts, and database configurations will be transferred to the client. We reserve the right to display design wireframes and public screenshots of built interfaces in our agency portfolio unless restricted by non-disclosure agreements.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">7. Confidentiality</h2>
        <p>
          We promise to treat all proprietary codes, API keys, and client details with absolute confidentiality. We will never share or sell client data to third parties without prior written consent.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">8. Cancellation</h2>
        <p>
          Clients may cancel ongoing projects by submitting written notice. In the event of cancellation, the client remains responsible for paying for all work completed up to the date of notice. Completed work will be invoiced at our hourly rates.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">9. Limitation of Liability</h2>
        <p>
          A3 Web & Software Services is not liable for server downtime, software failures, data losses, rank declines, or business losses that occur after deployment. We build software to modern quality standards, but code is provided "as-is."
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">10. Termination</h2>
        <p>
          We reserve the right to terminate project agreements immediately if client behaviors become abusive, communications fail for more than 30 days, or payment terms are breached. In such cases, no files will be delivered, and advance deposits will be kept.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">11. Governing Law</h2>
        <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of Delhi, India, without regard to conflict of law principles. Any dispute arising out of these terms shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">12. Contact Us</h2>
        <p>
          For queries regarding these terms, contact us at:
        </p>
        <p className="text-cyan-400">
          Email: <a href="mailto:adarshshukla.3services@gmail.com" className="hover:underline">adarshshukla.3services@gmail.com</a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
