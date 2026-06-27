import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity } from 'react-icons/fi';
import GlobeScene from '../ui/three/GlobeScene';
import MagneticButton from '../ui/buttons/MagneticButton';
import { getSettings } from '../../api';

export default function Hero() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const companyName = settings?.companyName || 'A3 Web & Software Services';
  const heroText = settings?.heroText || 'ENGINEERING DIGITAL COGNITION.';
  const heroSubtitle = settings?.heroSubtitle || 'We engineer high-fidelity web applications, scalable database systems, and custom AI automations designed for absolute performance and visual excellence.';

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 md:px-12">
      {/* Three.js Interactive Scene in background */}
      <GlobeScene />

      {/* Grid overlay */}
      <div className="animated-grid absolute inset-0 z-0 opacity-[0.03] pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center">
        
        {/* Modern Tag badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            {companyName}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="font-sans text-4xl font-black tracking-tight text-white sm:text-6xl md:text-8xl leading-none uppercase"
        >
          {heroText}
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
          className="mt-8 max-w-2xl text-base text-neutral-400 leading-relaxed md:text-lg"
        >
          {heroSubtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.7, ease: 'easeOut' }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link to="/projects">
            <MagneticButton className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-black shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-400/40">
              View Showcase <FiArrowRight className="inline-block ml-1" />
            </MagneticButton>
          </Link>
          
          <Link to="/contact">
            <MagneticButton className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20">
              Schedule Consultation
            </MagneticButton>
          </Link>
        </motion.div>

        {/* Scrolling mouse visualizer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-widest uppercase text-neutral-500 font-bold">Scroll</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-neutral-600 p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-2 w-1.5 rounded-full bg-cyan-400"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
