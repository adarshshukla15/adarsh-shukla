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
    <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5">
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
                key={idx}
                className="glass-panel glass-panel-hover p-8 rounded-2xl flex gap-6"
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
