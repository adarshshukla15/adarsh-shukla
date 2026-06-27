import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description: string;
}

export default function SectionHeading({
  badge = '✨ Services',
  title = 'Engineering Digital Experiences That Inspire.',
  description = 'From websites to enterprise software, we design and develop scalable digital solutions that accelerate business growth and create unforgettable user experiences.'
}: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    
    const element = headingRef.current;
    const text = element.innerText;
    const words = text.split(' ');
    
    // Clear initial content
    element.innerHTML = '';
    
    // Build separate wrappers for each word to animate them from bottom-up
    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      wordSpan.style.verticalAlign = 'bottom';
      wordSpan.className = 'mr-3 py-1';

      const innerSpan = document.createElement('span');
      innerSpan.innerText = word;
      innerSpan.style.display = 'inline-block';
      innerSpan.className = 'title-word-inner transform translate-y-[110%] opacity-0';

      wordSpan.appendChild(innerSpan);
      element.appendChild(wordSpan);
    });

    const innerSpans = element.querySelectorAll('.title-word-inner');
    
    const trigger = gsap.to(innerSpans, {
      y: '0%',
      opacity: 1,
      duration: 1.0,
      stagger: 0.04,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, [title]);

  return (
    <div className="flex flex-col items-start text-left max-w-4xl mb-16 md:mb-24 relative z-10">
      {/* Small Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        {badge}
      </motion.div>

      {/* Large Heading */}
      <h2
        ref={headingRef}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] uppercase"
      >
        {title}
      </h2>

      {/* Paragraph with Blur Reveal */}
      <motion.p
        initial={{ filter: 'blur(12px)', opacity: 0, y: 25 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 text-neutral-400 max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
}
