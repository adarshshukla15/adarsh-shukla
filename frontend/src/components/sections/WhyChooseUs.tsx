import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiCpu, FiClock } from 'react-icons/fi';

const features = [
  {
    icon: FiShield,
    title: 'Architecture-First',
    description: 'We do not rush to hack together templates. We engineer rigid, enterprise-ready database schemas and backend routes that stand resilient under spikes.'
  },
  {
    icon: FiTrendingUp,
    title: 'SEO & Performance Optimized',
    description: 'All builds aim for 95+ scores on Lighthouse. High speed caching, optimized CDN assets, and code splitting are pre-configured.'
  },
  {
    icon: FiCpu,
    title: 'AI & Automation Native',
    description: 'We integrate semantic AI searches, custom LLM routing, and automated webhook pipelines to slash operational costs by over 30%.'
  },
  {
    icon: FiClock,
    title: 'Dedicated DevOps & SLA',
    description: 'Continuous Integration pipelines, hot-reloading clusters, and automated backups backed by a firm SLA guarantee 99.9% uptime.'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
      {/* Luxurious ambient white glow styles */}
      <style>{`
        .premium-feature-card {
          position: relative;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.05),
                      0 0 80px rgba(255, 255, 255, 0.08),
                      0 20px 60px rgba(255, 255, 255, 0.04);
          transition: box-shadow 400ms ease, border-color 400ms ease !important;
        }
        .premium-feature-card::before {
          content: '';
          position: absolute;
          inset: -40px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 75%);
          filter: blur(45px);
          opacity: 0.7;
          z-index: -1;
          pointer-events: none;
          transition: opacity 400ms ease;
        }
        .premium-feature-card:hover {
          box-shadow: 0 0 50px rgba(255, 255, 255, 0.12),
                      0 0 100px rgba(255, 255, 255, 0.08),
                      0 30px 80px rgba(255, 255, 255, 0.08) !important;
        }
        .premium-feature-card:hover::before {
          opacity: 1.0;
        }
      `}</style>
      
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Strategic Alignment
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl uppercase">
            Why Partner With Us.
          </h2>
          <p className="mt-4 text-neutral-400 leading-relaxed text-sm md:text-base">
            We operate at the intersection of beautiful aesthetics and mathematical engineering. We build products designed to convert.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.4, ease: 'easeOut' }
                }}
                key={idx}
                className="glass-panel p-8 rounded-2xl flex gap-6 premium-feature-card"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-light">{feat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
