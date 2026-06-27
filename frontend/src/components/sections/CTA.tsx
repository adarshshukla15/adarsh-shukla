import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import MagneticButton from '../ui/buttons/MagneticButton';

export default function CTA() {
  return (
    <section className="relative py-32 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
      {/* Glow Backdrops */}
      <div className="glow-cyan absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-y-1/2 opacity-20 pointer-events-none" />
      <div className="glow-blue absolute top-1/2 right-1/4 h-[400px] w-[400px] -translate-y-1/2 opacity-15 pointer-events-none" />

      {/* Grid */}
      <div className="animated-grid absolute inset-0 z-0 opacity-[0.015] pointer-events-none" />

      <div className="mx-auto max-w-5xl text-center relative z-10">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
          Begin Engineering
        </span>
        
        <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
          READY TO CODE
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            SOMETHING IMMENSE?
          </span>
        </h2>

        <p className="mt-8 text-neutral-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Estimate budgets, select custom service integrations, define timelines, and schedule directly with our core engineering directors.
        </p>

        <div className="mt-12">
          <Link to="/contact">
            <MagneticButton className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 text-sm font-bold uppercase tracking-wider text-black shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/40">
              Get Project Estimate <FiArrowRight className="inline-block ml-1" />
            </MagneticButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
