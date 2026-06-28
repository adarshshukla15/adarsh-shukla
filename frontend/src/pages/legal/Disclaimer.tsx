import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

export default function Disclaimer() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="Legal Disclaimer for A3 Web & Software Services. Read about our guidelines on project rankings, business revenues, and information warranties."
      canonicalUrl="https://a3servicesin.netlify.app/disclaimer"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">1. Information Provided As-Is</h2>
        <p>
          All technical articles, tutorial documents, project estimations, and consulting data displayed on the <strong>A3 Web & Software Services</strong> website are provided "as-is" for informational purposes. While we keep contents accurate, we make no warranties regarding completeness, correctness, or software availability.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">2. Service Disclaimers</h2>
        
        <div className="pl-4 border-l border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase">A. No Guaranteed Search Engine Rankings</h3>
          <p>
            Although we build search engine optimized (SEO) codebases, integrate schema marks, and optimize layout tags, we do not guarantee specific ranks on Google or other engines. Search algorithms change constantly, and positioning is subject to search engine updates, content strategies, and external competition.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">B. No Guaranteed Business Revenue</h3>
          <p>
            We help business owners launch digital portals, custom CRMs, SaaS utilities, and mobile products. We make no promises or warranties that deploying our custom software systems will increase business revenues, customer bases, or conversion rates. Final sales remain dependent on market demands and management execution.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">C. Client Responsibility for Content</h3>
          <p>
            Clients are solely responsible for ensuring that all copy materials, database assets, product images, brand tags, and terms uploaded to their custom portals comply with regional rules. We do not audit or assume liability for client contents.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">3. Third-Party Connections</h2>
        <p>
          Our pages may contain links directing users to external platforms. We have no authority over the contents, security terms, or tracking cookies of external domains, and we do not assume responsibility for their practices.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">4. Contact Information</h2>
        <p>
          For questions regarding these disclaimers, contact us:
        </p>
        <p className="text-cyan-400">
          Email: <a href="mailto:adarshshukla.3services@gmail.com" className="hover:underline">adarshshukla.3services@gmail.com</a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
