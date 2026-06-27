import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useServices } from '../../hooks/useServices';
import ServiceCard from './services/ServiceCard';
import SectionHeading from './services/SectionHeading';
import AnimatedBackground from './services/AnimatedBackground';
import BottomCTA from './services/BottomCTA';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { services, loading: isLoading, error, refetch } = useServices();

  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    // Select all cards to animate
    const cards = containerRef.current.querySelectorAll('.bento-card-trigger');
    if (cards.length === 0) return;

    // Staggered reveal animation with scale, blur, and fade-up
    const animation = gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 50,
        scale: 0.97,
        filter: 'blur(6px)'
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [isLoading, services]);

  return (
    <section className="relative py-28 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#050505] overflow-hidden min-h-screen">
      {/* Premium Ambient Background */}
      <AnimatedBackground />

      {/* Grid Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start w-full">
        {/* Animated Heading */}
        <SectionHeading
          badge="✨ Services"
          title="Engineering Digital Experiences That Inspire."
          description="From websites to enterprise software, we design and develop scalable digital solutions that accelerate business growth and create unforgettable user experiences."
        />

        {/* CSS Grid Redesigned Layout */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center w-full">
            <div className="rounded-full bg-red-500/10 border border-red-500/20 p-4 text-red-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
            <p className="text-sm text-neutral-400 max-w-sm mb-6">
              There was a problem loading the service list. Please check your internet or retry below.
            </p>
            <button
              onClick={refetch}
              className="rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10"
            >
              Retry Connection
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="w-full max-w-[380px] h-[320px] rounded-[26px] border border-white/5 bg-white/[0.01] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto w-full"
          >
            {services.map((service, idx) => (
              <div key={service.id || service._id || idx} className="bento-card-trigger w-full max-w-[380px]">
                <ServiceCard service={service} index={idx} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Call-To-Action */}
        <BottomCTA />
      </div>
    </section>
  );
}
