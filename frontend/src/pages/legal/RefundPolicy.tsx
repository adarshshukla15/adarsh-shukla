import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

export default function RefundPolicy() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      description="Refund Policy for A3 Web & Software Services. Read about our guidelines concerning custom software development payments and advance refunds."
      canonicalUrl="https://a3servicesin.netlify.app/refund-policy"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">1. Scope of Policy</h2>
        <p>
          At <strong>A3 Web & Software Services</strong>, we design and engineer high-quality, customized digital products. Because all resources, servers, and developers are allocated specifically to your project requirements upon signing the agreement, we enforce a strict refund policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">2. Refund Guidelines</h2>
        
        <div className="pl-4 border-l border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase">A. Advance Payments are Non-Refundable</h3>
          <p>
            An advance deposit is required to start any software project. This advance payment is strictly non-refundable under all circumstances, as it immediately covers design prototyping, software setup, API licenses, and engineering labor.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">B. No Refunds After Project Inception</h3>
          <p>
            Once design or development work begins (such as creating mockups, planning databases, or writing codebase templates), no refunds will be issued for completed milestones, set retainers, or hourly invoices.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">C. Refunds Prior to Project Commencement</h3>
          <p>
            A full or partial refund of the advance payment may only be considered if a request is submitted in writing before any development, research, or environment setup has started. If resources have already been set up, we reserve the right to deduct setup costs from the deposit.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">D. Custom Software Non-Refundability</h3>
          <p>
            Since custom CRMs, ERPs, SaaS models, and custom websites are engineered specifically to your company requirements and cannot be resold, completed software products are completely non-refundable once deployed or handed over.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">3. Resolution of Issues</h2>
        <p>
          If you are unsatisfied with any of our software systems, we provide standard post-launch support and bug-fixing windows to address errors. We will work closely with your technical team to ensure the delivered code complies with the project specifications.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">4. Contact Information</h2>
        <p>
          For refund inquiries or agreement cancellation requests, contact us:
        </p>
        <p className="text-cyan-400">
          Email: <a href="mailto:a3webservices.inn@gmail.com" className="hover:underline">a3webservices.inn@gmail.com</a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
