import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const words = ['DESIGN', 'THREE.JS', 'REACT 19', 'SCALABILITY', 'AI DRIVEN', 'A3 SERVICES'];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Count interpolation using GSAP object ticker
    const countObj = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        // Slide up preloader panel
        gsap.to(containerRef.current, {
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: onComplete
        });
      }
    });

    timeline.to(countObj, {
      value: 100,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.floor(countObj.value));
      }
    });

    // Word cycling interval
    const wordCycle = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 350);

    // Initial counter/word entries
    gsap.fromTo([counterRef.current, wordRef.current], 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );

    return () => {
      clearInterval(wordCycle);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black p-10 font-sans md:p-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-cyan-400 tracking-wider">
          <span className="text-xl">⚡</span>
          <span className="font-sans text-sm font-extrabold uppercase">A3 Agency</span>
        </div>
        <span className="text-xs text-neutral-500 uppercase tracking-widest">Digital Experience</span>
      </div>

      <div className="my-auto flex flex-col gap-4">
        <div ref={wordRef} className="h-16 text-3xl font-extrabold tracking-tight text-neutral-500 md:text-5xl">
          <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            {words[wordIndex]}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-white/10 pt-8">
        <div className="text-neutral-500 text-xs tracking-widest max-w-[200px]">
          CREATIVE CODE & PREMIUM SYSTEMS
        </div>
        <div ref={counterRef} className="text-right">
          <span className="font-sans text-7xl font-light tracking-tighter md:text-9xl text-white">
            {count}
          </span>
          <span className="text-cyan-400 text-xl font-bold font-sans ml-1">%</span>
        </div>
      </div>
    </div>
  );
}
