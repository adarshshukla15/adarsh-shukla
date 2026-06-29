import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { getTestimonials, Testimonial } from '../../api';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then((data) => {
      setTestimonials(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Validated Results
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl uppercase">
            CLIENT FEEDBACK.
          </h2>
          <p className="mt-4 text-neutral-400 leading-relaxed text-sm md:text-base">
            What engineering leaders, startup founders, and project managers say about our design decisions and clean code delivery.
          </p>
        </div>

        {/* Testimonials List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[250px] rounded-2xl bg-white/[0.01] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-indigo-500/5 opacity-30 animate-pulse pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 animate-bounce">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Updated Soon
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight md:text-3xl uppercase">
                Reviews and Recommendations
              </h3>
              <p className="mt-3 text-neutral-400 max-w-md mx-auto text-sm leading-relaxed">
                We are currently collaborating with new partners. Verified reviews from our clients and partners will be published soon!
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.08 }}
                key={test.id || test._id || idx}
                className="glass-panel p-8 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {Array.from({ length: test.rating }).map((_, rIdx) => (
                      <FiStar key={rIdx} className="fill-amber-500 text-sm" />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-sm text-neutral-300 leading-relaxed font-light italic mb-8">
                    "{test.feedback}"
                  </p>
                </div>

                {/* Profile detail */}
                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                  {test.avatar && (
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">{test.name}</h4>
                    <span className="text-[10px] text-neutral-500 font-semibold mt-1 block">
                      {test.role}, {test.company}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
