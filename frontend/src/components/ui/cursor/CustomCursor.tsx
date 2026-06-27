import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide default cursor on desktop
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    // Position setup
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Main dot moves immediately
      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    // Lagged ring follower loop
    const ticker = () => {
      const dt = 1.0 - Math.pow(0.85, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
      
      gsap.set(ring, { x: pos.x, y: pos.y });
    };

    window.addEventListener('mousemove', onMouseMove);
    gsap.ticker.add(ticker);

    // Hover listeners
    const onMouseEnter = () => {
      gsap.to(ring, { scale: 1.8, backgroundColor: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.8)', duration: 0.3 });
      gsap.to(dot, { scale: 0.5, backgroundColor: '#ffffff', duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(ring, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(6, 182, 212, 0.3)', duration: 0.3 });
      gsap.to(dot, { scale: 1, backgroundColor: '#06b6d4', duration: 0.3 });
    };

    const updateHoverElements = () => {
      const hoverables = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .hover-trigger');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    // Mutation Observer to watch for newly added components to attach hover listeners
    const observer = new MutationObserver(updateHoverElements);
    observer.observe(document.body, { childList: true, subtree: true });
    updateHoverElements();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(ticker);
      observer.disconnect();
      document.documentElement.style.cursor = 'auto';
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
