import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SEO from '../SEO';

interface LegalPageLayoutProps {
  title: string;
  description: string;
  canonicalUrl: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, description, canonicalUrl, children }: LegalPageLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.reveal-header', 
        { opacity: 0, y: 30, filter: 'blur(10px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }
      );

      tl.fromTo('.reveal-content', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6 }, 
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden flex flex-col items-center">
      <SEO title={title} description={description} canonicalUrl={canonicalUrl} />
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[15%] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute top-[35%] right-[5%] h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header Section */}
        <div className="reveal-header text-center mb-12">
          <h1 className="text-3xl font-black text-white md:text-5xl uppercase tracking-tight leading-none bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-neutral-400 text-[10px] md:text-xs font-light mt-4 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
            Last Updated: June 28, 2026
          </p>
          <div className="w-16 h-[2px] bg-cyan-500/50 mx-auto mt-6 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
        </div>

        {/* Content Box */}
        <div className="reveal-content relative rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="rounded-[23px] bg-[#050505]/95 p-6 sm:p-10 lg:p-12 text-neutral-300 space-y-8 text-sm leading-relaxed font-light select-text">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
