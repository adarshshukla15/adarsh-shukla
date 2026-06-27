import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    phase: 'Discovery & Scope',
    detail: 'We dissect your product vision, define engineering constraints, budget estimates, and map detailed wireframe routes.'
  },
  {
    num: '02',
    phase: 'High-Fidelity Mockup',
    detail: 'Our Creative Designers build interactive Figma boards. We align on theme, typography, and GSAP micro-animations.'
  },
  {
    num: '03',
    phase: 'Engineering Phase',
    detail: 'We program using TypeScript. Code structures are modularized, utilizing Zustand stores and strict API validation.'
  },
  {
    num: '04',
    phase: 'Validation & Audits',
    detail: 'We stress-test routes, audit security configurations (Helmet, CORS), and optimize responsive frame rendering.'
  },
  {
    num: '05',
    phase: 'Production Release',
    detail: 'We deploy to isolated hosting configurations, set up auto-scaling scripts, CDN distribution, and continuous analytics.'
  }
];

export default function Process() {
  return (
    <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Lifecycle & Phases
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl uppercase">
            DEVELOPMENT PROCESS.
          </h2>
          <p className="mt-4 text-neutral-400 leading-relaxed text-sm md:text-base">
            A systematic, collaborative approach to engineering premium products with speed and precision.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: 'easeOut' }}
              key={idx}
              className="relative p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <span className="font-mono text-4xl font-black bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent opacity-80">
                  {step.num}
                </span>
                <h3 className="mt-4 text-base font-bold text-white tracking-wide uppercase">
                  {step.phase}
                </h3>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400 font-light">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
