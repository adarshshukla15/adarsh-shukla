import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti canvas animation triggers on mount
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Keep size updated
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#06b6d4', // Cyan
      '#3b82f6', // Blue
      '#a855f7', // Purple
      '#10b981', // Emerald
      '#fbbf24', // Amber/Gold
      '#ec4899'  // Pink
    ];

    const particleCount = 130;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      alpha: number;
      shape: 'circle' | 'square' | 'triangle';
    }> = [];

    // Initialize particles launching from the center of the screen
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      particles.push({
        x: width / 2,
        y: height / 2 + 50, // Slightly below center
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - 6, // strong upward push
        radius: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.5 ? 'square' : 'triangle'
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravity
        p.vx *= 0.98;  // Friction
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.alpha -= 0.05;
        }

        if (p.alpha > 0) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'square') {
            ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          } else {
            ctx.beginPath();
            ctx.moveTo(0, -p.radius);
            ctx.lineTo(p.radius, p.radius);
            ctx.lineTo(-p.radius, p.radius);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden">
          {/* Confetti Overlay Layer */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none w-full h-full z-0" 
          />

          {/* Modal Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 cursor-pointer"
          />

          {/* Glass Success Dialog */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative z-20 w-[90%] max-w-md p-8 rounded-[32px] glass-panel border border-white/10 text-center flex flex-col items-center gap-6"
          >
            {/* Animated SVG Checkmark Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <svg 
                className="h-10 w-10 text-cyan-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                Inquiry Transmitted
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer"
            >
              Back to Portal
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
