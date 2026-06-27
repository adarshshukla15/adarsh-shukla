import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const colors = ['#06b6d4', '#3b82f6', '#a855f7']; // Cyan, Blue, Purple
      // Generate moderate number of particles for performance
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 35000), 50);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce or wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.shadowBlur = 0; // Reset shadow for next cycles
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505] pointer-events-none z-0">
      {/* Premium Gradient Grid Mesh */}
      <div className="absolute inset-0 animated-grid opacity-[0.03] z-[1]" />

      {/* SVG Radial Gradients for ambient lighting */}
      <div className="absolute top-[10%] left-[-15%] w-[80%] h-[60%] rounded-full bg-radial from-cyan-500/10 via-transparent to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[10%] right-[-15%] w-[80%] h-[60%] rounded-full bg-radial from-purple-500/8 via-transparent to-transparent blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[40%] right-[10%] w-[50%] h-[50%] rounded-full bg-radial from-blue-500/5 via-transparent to-transparent blur-[130px]" />

      {/* Canvas Particle Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 z-[2]" />
    </div>
  );
}
