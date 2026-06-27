import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { getFaqs } from '../../api';

interface FaqItem {
  question: string;
  answer: string;
}

const fallbackFaqs = [
  {
    question: 'What is your stack preference for backend architectures?',
    answer: 'We heavily leverage Node.js & Express.js for fast API routers and middleware layers. Depending on product rules, we pair them with robust MongoDB Mongoose models or SQLite/JSON file databases for localized environments.'
  },
  {
    question: 'How do you structure custom CMS, CRM, and ERP configurations?',
    answer: 'Every business operates uniquely. We skip generic templates and code direct custom dashboard interfaces using React 19, Tailwind CSS, and global state managers like Zustand, connecting directly to customized database layers.'
  },
  {
    question: 'Do you configure automated pipelines and microservices?',
    answer: 'Yes. We script automated integrations, cron schedules, Docker cluster deployments, and trigger pipelines using webhook services. We also design semantic AI pipelines using OpenAI embeddings.'
  },
  {
    question: 'What is your design aesthetic standard?',
    answer: 'We focus on high-fidelity visual wow-factor. We utilize dark glassmorphic panels, fine borders, noise texture backdrops, radial blue-cyan glows, and smooth scroll integrations using Lenis and GSAP ScrollTrigger.'
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFaqs().then((data) => {
      if (data && data.length > 0) {
        setFaqs(data);
      } else {
        setFaqs(fallbackFaqs);
      }
      setIsLoading(false);
    });
  }, []);

  const toggle = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5">
      <div className="mx-auto max-w-4xl">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Common Queries
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl uppercase">
            Frequently Asked Questions.
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden transition-colors duration-300 hover:border-white/10"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                  <span className="shrink-0 ml-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-cyan-400 border border-white/5">
                    {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-white/5 text-xs md:text-sm leading-relaxed text-neutral-400 font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
