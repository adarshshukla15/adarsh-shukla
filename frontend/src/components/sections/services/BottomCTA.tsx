import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPhone } from 'react-icons/fi';
import MagneticButton from '../../ui/buttons/MagneticButton';

export default function BottomCTA() {
  return (
    <div className="relative mt-24 md:mt-32 w-full max-w-5xl mx-auto z-10">
      {/* Background Glows */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-12 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/8 blur-[100px] pointer-events-none" />

      {/* Main Glass Panel Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a]/50 p-8 sm:p-12 md:p-16 text-center backdrop-blur-2xl shadow-3xl group"
      >
        {/* Animated Radial Border Glow Follower */}
        <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Ambient Grid Inside Card */}
        <div className="absolute inset-0 animated-grid opacity-[0.02] pointer-events-none" />

        {/* Floating Particles in CTA Card */}
        <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-cyan-400/20 blur-xs animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-12 right-16 w-3 h-3 rounded-full bg-purple-400/20 blur-xs animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 right-10 w-1.5 h-1.5 rounded-full bg-blue-400/25 blur-xs animate-pulse" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Subtle Badge */}
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-3 py-1 rounded-full mb-6">
            Let's Collaborate
          </span>

          {/* Heading */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            Ready to Build Something{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">
              Extraordinary?
            </span>
          </h3>

          {/* Paragraph */}
          <p className="mt-6 text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed font-light">
            Let's transform your ideas into premium digital products with modern technologies, exceptionally engineered systems, and unforgettable user experiences.
          </p>

          {/* Buttons Layout */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Primary Action Button */}
            <Link to="/contact" className="w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-cyan-400 hover:text-black shadow-lg shadow-white/5 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                Start Your Project
                <FiArrowRight className="text-sm transition-transform group-hover/btn:translate-x-1" />
              </MagneticButton>
            </Link>

            {/* Secondary Action Button */}
            <Link to="/contact?type=consultation" className="w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.03] border border-white/10 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/5 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                <FiPhone className="text-sm" />
                Book Free Consultation
              </MagneticButton>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
