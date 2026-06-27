import React from 'react';
import ContactSection from '../components/sections/contact/ContactSection';
import FAQ from '../components/sections/FAQ';

export default function Contact() {
  return (
    <div className="bg-black min-h-screen">
      {/* Premium redesigned Direct Inquiry Section */}
      <ContactSection />

      {/* FAQ Accordion */}
      <FAQ />
    </div>
  );
}
