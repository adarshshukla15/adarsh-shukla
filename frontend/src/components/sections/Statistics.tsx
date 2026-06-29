import { motion } from 'framer-motion';
import { FiSliders, FiCode, FiHeadphones, FiZap } from 'react-icons/fi';

const highlights = [
  {
    icon: FiSliders,
    title: '100% Custom Solutions',
    description: 'Every website, application, and automation is built specifically for your business needs.',
    accent: 'from-cyan-400 via-blue-500 to-indigo-500',
    glowColor: 'group-hover:shadow-cyan-500/10'
  },
  {
    icon: FiCode,
    title: '10+ Modern Technologies',
    description: 'React, Node.js, Next.js, React Native, AI, Cloud, MongoDB, Firebase, AWS, and more.',
    accent: 'from-blue-500 via-indigo-500 to-purple-500',
    glowColor: 'group-hover:shadow-blue-500/10'
  },
  {
    icon: FiHeadphones,
    title: '24/7 Project Support',
    description: 'Quick communication, continuous updates, and dedicated support throughout development.',
    accent: 'from-purple-500 via-pink-500 to-rose-500',
    glowColor: 'group-hover:shadow-purple-500/10'
  },
  {
    icon: FiZap,
    title: '7–14 Days Avg. Delivery',
    description: 'Fast development process for MVPs, business websites, landing pages, and custom software.',
    accent: 'from-amber-400 via-orange-500 to-red-500',
    glowColor: 'group-hover:shadow-amber-500/10'
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function Statistics() {
  return (
    <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
      {/* Background soft glowing blur elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Trust Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Our Commitments
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl uppercase">
            Designed for Speed & Quality.
          </h2>
          <p className="mt-4 text-neutral-400 leading-relaxed text-sm md:text-base font-light">
            We build modern, scalable systems using cutting-edge tech stacks. No generic templates, no corporate overhead—just custom-engineered code that works.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8 }}
                key={idx}
                className="group relative rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-8 backdrop-blur-xl transition-all duration-300 shadow-2xl flex flex-col justify-between min-h-[250px]"
              >
                {/* Glow layer that appears on hover */}
                <div className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
                
                <div className="relative z-10">
                  {/* Icon wrapper with custom gradient border */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} p-[1px] mb-6 shadow-lg shadow-black/40`}>
                    <div className="w-full h-full rounded-[11px] bg-neutral-950 flex items-center justify-center text-white transition-colors duration-300 group-hover:bg-neutral-900">
                      <Icon className="text-xl transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black tracking-tight text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Subtle border accent line at the bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl bg-gradient-to-r ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
