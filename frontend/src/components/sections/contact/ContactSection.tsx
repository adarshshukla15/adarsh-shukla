import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import AnimatedBackground from './AnimatedBackground';
import ContactInfoCard from './ContactInfoCard';
import InquiryForm from './InquiryForm';
import { getSettings } from '../../../api';

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const parseContactItems = (str: string, isPhone = true) => {
    if (!str) return [];
    return str.split(',').map(item => {
      const trimmed = item.trim();
      const match = trimmed.match(/^([^\(]+)(?:\((.*)\))?$/);
      const text = match ? match[1].trim() : trimmed;
      const label = match && match[2] ? match[2].trim() : '';
      const cleanNumber = text.replace(/[\s\-\+\(\)]/g, '');
      const link = isPhone ? `tel:${text.startsWith('+') ? '' : '+'}${cleanNumber}` : `https://wa.me/${cleanNumber}`;
      return { text, link, label };
    });
  };

  // GSAP entrance staggers
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.reveal-badge', 
        { opacity: 0, scale: 0.8, filter: 'blur(3px)' }, 
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6 }
      );

      tl.fromTo('.reveal-title', 
        { opacity: 0, y: 30, filter: 'blur(8px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 
        '-=0.4'
      );

      tl.fromTo('.reveal-desc', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.6 }, 
        '-=0.5'
      );

      tl.fromTo('.reveal-card', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7 }, 
        '-=0.4'
      );

      tl.fromTo('.reveal-form', 
        { opacity: 0, y: 25, filter: 'blur(4px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden flex flex-col items-center min-h-screen justify-center"
    >
      {/* Cinematic animated mesh background */}
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl">
        
        {/* Intro Header Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <span className="reveal-badge rounded-full px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
            Request Quote & Estimate
          </span>
          <h2 className="reveal-title text-3xl font-black text-white md:text-5xl uppercase tracking-tight leading-none mt-1">
            LET'S STRUCTURE YOUR
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent leading-none">
              DIGITAL PRODUCTS.
            </span>
          </h2>
          <p className="reveal-desc text-neutral-400 text-xs md:text-sm font-light max-w-2xl mt-4 leading-relaxed pl-1">
            Submit custom web details or direct consulting requirements. Our senior technical architects will respond with accurate estimation reports in less than 24 hours.
          </p>
        </div>

        {/* Large Glassmorphism Layout Container */}
        <div className="relative rounded-[32px] p-[1.5px] bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 hover:from-cyan-500/25 hover:via-blue-500/20 hover:to-purple-500/25 transition-all duration-700 pointer-events-auto">
          
          {/* Inner Blur Body */}
          <div className="rounded-[31px] bg-[#050505]/80 backdrop-blur-3xl p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start overflow-hidden relative">
            
            {/* Ambient inner card glows */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-48 w-48 bg-blue-500/5 blur-3xl pointer-events-none" />

            {/* LEFT COLUMN: Contact Cards & Globe */}
            <div className="lg:col-span-5 space-y-6 flex flex-col h-full justify-between">
              
              <div className="space-y-4">
                <h3 className="text-neutral-500 text-[10px] font-extrabold uppercase tracking-widest pl-1">
                  Contact Channels
                </h3>

                <div className="reveal-card">
                  <ContactInfoCard
                    iconName="FiPhone"
                    title="Phone Numbers"
                    items={parseContactItems(settings?.phone || '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)', true)}
                    subtext="Business Hours: Monday – Saturday, 10:00 AM – 7:00 PM (IST)"
                  />
                </div>

                <div className="reveal-card">
                  <ContactInfoCard
                    iconName="FiMail"
                    title="Agency Email"
                    value={settings?.email || "a3services.inn@gmail.com"}
                    link={`mailto:${settings?.email || "a3services.inn@gmail.com"}`}
                    subtext="Available for project bids, consulting & inquiry bookings."
                  />
                </div>

                <div className="reveal-card">
                  <ContactInfoCard
                    iconName="FaWhatsapp"
                    title="WhatsApp Channels"
                    items={parseContactItems(settings?.whatsapp || settings?.phone || '+91 78271 74313 (Aditya), +91 76784 51381 (Adarsh)', false)}
                    subtext="Click to start instant WhatsApp text chat."
                  />
                </div>

                <div className="reveal-card">
                  <ContactInfoCard
                    iconName="FiMapPin"
                    title="Office Location"
                    value={settings?.address || "North East Delhi, Delhi, India"}
                    link={settings?.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(settings?.address || "North East Delhi, Delhi, India")}`}
                    subtext="North East Delhi, India"
                  />
                </div>

                <div className="reveal-card">
                  <ContactInfoCard
                    iconName="FiClock"
                    title="Response Time"
                    value="Within 24 Hours"
                    subtext="Business Hours: Mon – Sat, 10:00 AM – 7:00 PM"
                  />
                </div>
              </div>

              {/* Animated Globe Container */}
              <div className="reveal-card relative rounded-2xl border border-white/5 bg-white/[0.01] p-6 h-[200px] flex items-center justify-between overflow-hidden">
                <div className="z-10 max-w-[50%]">
                  <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block">
                    Global Reach
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 uppercase">
                    Serving Enterprise Clients
                  </h4>
                  <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">
                    Deploying production web products across global nodes.
                  </p>
                </div>

                {/* Spinning Globe Vector Graphic */}
                <div className="absolute right-[-20px] bottom-[-20px] w-[180px] h-[180px] select-none pointer-events-none opacity-40">
                  <svg
                    className="w-full h-full text-cyan-500 animate-[spin_35s_linear_infinite]"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  >
                    <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                    <ellipse cx="50" cy="50" rx="30" ry="45" />
                    <ellipse cx="50" cy="50" rx="12" ry="45" />
                    <ellipse cx="50" cy="50" rx="45" ry="15" />
                    <ellipse cx="50" cy="50" rx="45" ry="5" />
                    <line x1="5" y1="50" x2="95" y2="50" />
                    <line x1="50" y1="5" x2="50" y2="95" />
                  </svg>
                </div>

                {/* Floating 3D shapes */}
                <div className="absolute top-4 right-12 h-3.5 w-3.5 rounded-full bg-indigo-500/25 blur-xs animate-[bounce_4s_infinite_alternate]" />
                <div className="absolute bottom-4 right-24 h-2.5 w-2.5 rounded-full bg-cyan-400/30 blur-xs animate-[bounce_3s_infinite_alternate]" />
              </div>
            </div>

            {/* RIGHT COLUMN: Inquiry Form Container */}
            <div className="reveal-form lg:col-span-7 relative">
              
              {/* Glow Layers absolute behind */}
              <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
                {/* Top-left Cyan Glow */}
                <motion.div
                  animate={{
                    scale: [0.95, 1.05, 0.95],
                    opacity: [0.12, 0.20, 0.12],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(0, 229, 255, 0.18) 0%, transparent 70%)',
                    filter: 'blur(160px)',
                  }}
                  className="absolute -top-40 -left-40"
                />

                {/* Bottom-right Blue Glow */}
                <motion.div
                  animate={{
                    scale: [1.05, 0.95, 1.05],
                    opacity: [0.12, 0.20, 0.12],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    filter: 'blur(120px)',
                  }}
                  className="absolute -bottom-32 -right-32"
                />

                {/* Center Purple Glow */}
                <motion.div
                  animate={{
                    scale: [0.98, 1.02, 0.98],
                    opacity: [0.10, 0.16, 0.10],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: '450px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
                    filter: 'blur(140px)',
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>

              {/* Glassmorphic Form Card Panel */}
              <div className="relative z-10 rounded-2xl border border-white/5 bg-[#050505]/70 backdrop-blur-3xl p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    Inquiry Briefings
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                    Input targets to receive customized estimations
                  </p>
                </div>

                <InquiryForm />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
