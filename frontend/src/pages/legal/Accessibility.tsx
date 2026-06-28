import React from 'react';
import LegalPageLayout from '../../components/legal/LegalPageLayout';

export default function Accessibility() {
  return (
    <LegalPageLayout
      title="Accessibility"
      description="Accessibility statement for A3 Web & Software Services. Learn how we optimize keyboard navigation, screen reader support, and contrast details."
      canonicalUrl="https://a3servicesin.netlify.app/accessibility"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">1. Our Commitment</h2>
        <p>
          At <strong>A3 Web & Software Services</strong>, we are committed to making our digital products, custom websites, and client dashboards accessible to everyone, including individuals with visual, auditory, motor, or cognitive challenges. We design and build systems using WCAG 2.1 accessibility benchmarks as guidelines.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">2. Implemented Accessibility Features</h2>
        
        <div className="pl-4 border-l border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase">A. Keyboard Navigation</h3>
          <p>
            Our layouts and interactive inputs (such as text boxes, slides, and chips) are structured semantic nodes, ensuring users can navigate pages using the `Tab` and `Enter` keys on a keyboard.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">B. Screen Reader Support</h3>
          <p>
            We implement proper ARIA roles, label identifiers, alt text details, and header sequences, allowing screen readers to interpret and describe the application layout correctly.
          </p>

          <h3 className="text-sm font-semibold text-white uppercase">C. Color Contrast</h3>
          <p>
            Although our website has a futuristic dark mode theme, we select font colors, glows, and background contrasts to satisfy standard visual accessibility requirements for readability.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">3. Continuous Improvements</h2>
        <p>
          We periodically review audit scripts and accessibility scores (such as Lighthouse) to identify issues and optimize elements. We update focus outlines, text ratios, and keyboard inputs on an ongoing basis.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-cyan-400">4. Accessibility Feedback</h2>
        <p>
          If you encounter navigation errors, reading challenges, or layout compliance issues on our site, please let us know:
        </p>
        <p className="text-cyan-400">
          Email: <a href="mailto:a3webservices.inn@gmail.com" className="hover:underline">a3webservices.inn@gmail.com</a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
