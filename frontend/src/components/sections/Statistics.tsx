import { motion } from 'framer-motion';

const stats = [
  { value: '50+', label: 'Digital Products Engineered' },
  { value: '99.9%', label: 'Production Server Uptime' },
  { value: '95+', label: 'Average Lighthouse Score' },
  { value: '40%', label: 'Average Growth in User Conversions' }
];

export default function Statistics() {
  return (
    <section className="relative py-20 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
      {/* Background soft glow */}
      <div className="glow-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] opacity-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              key={idx}
              className="text-center p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-cyan-500/20 transition-all duration-300"
            >
              <span className="block text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent leading-none mb-3">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
