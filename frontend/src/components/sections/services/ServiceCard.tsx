import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import TechBadge from './TechBadge';
import { Link } from 'react-router-dom';

// Dynamic icon resolver
const getIcon = (iconName: string) => {
  const Icon = (FiIcons as any)[iconName];
  return Icon || FiIcons.FiGlobe;
};

interface ServiceCardProps {
  service: any;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const canvasType = service.canvasType || 'web';
  const accentColor = service.accentColor || 'from-cyan-500 to-blue-500';
  const glowColor = service.glowColor || 'rgba(6,182,212,0.2)';
  const tags = service.tags || [];

  // Framer Motion 3D Tilt coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 22, stiffness: 240, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  // Mouse move handler for tilt & cursor glow coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalized coordinate (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    // Save absolute coordinates for CSS radial-gradient light
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Interactive HTML5 Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Canvas specific state variables
    let frame = 0;
    const dots: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    // Initialize custom canvas particles
    if (canvasType === 'ai') {
      const count = 10;
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1
        });
      }
    } else if (canvasType === 'api') {
      for (let i = 0; i < 6; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.random() * 0.5 + 0.2,
          vy: 0,
          radius: Math.random() * 1.5 + 0.8
        });
      }
    } else if (canvasType === 'ecommerce' || canvasType === 'mobile') {
      for (let i = 0; i < 8; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -Math.random() * 0.3 - 0.1,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      frame++;
      const baseColor = accentColor.includes('cyan')
        ? '#06b6d4'
        : accentColor.includes('pink')
        ? '#ec4899'
        : accentColor.includes('purple')
        ? '#a855f7'
        : accentColor.includes('emerald')
        ? '#10b981'
        : '#3b82f6';

      // 1. Website Development: Sine Wave
      if (canvasType === 'web') {
        ctx.beginPath();
        ctx.strokeStyle = baseColor;
        ctx.globalAlpha = isHovered ? 0.22 : 0.08;
        ctx.lineWidth = 1.2;
        const frequency = isHovered ? 0.012 : 0.008;
        const amplitude = isHovered ? 20 : 12;
        const speed = isHovered ? 0.03 : 0.02;

        for (let xCoord = 0; xCoord < width; xCoord++) {
          const yCoord =
            height * 0.65 + Math.sin(xCoord * frequency + frame * speed) * amplitude;
          if (xCoord === 0) ctx.moveTo(xCoord, yCoord);
          else ctx.lineTo(xCoord, yCoord);
        }
        ctx.stroke();
      }

      // 2. Design: Intersecting Rotating Rings
      else if (canvasType === 'design') {
        ctx.globalAlpha = isHovered ? 0.22 : 0.08;
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1;
        const speed = isHovered ? 0.015 : 0.006;

        ctx.save();
        ctx.translate(width * 0.75, height * 0.4);
        ctx.rotate(frame * speed);
        
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(width, height) * 0.18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-10, 0, Math.min(width, height) * 0.12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 3. AI: Neural Node Connection Net
      else if (canvasType === 'ai') {
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = baseColor;
        const speedMultiplier = isHovered ? 1.5 : 0.8;

        dots.forEach((dot) => {
          dot.x += dot.vx * speedMultiplier;
          dot.y += dot.vy * speedMultiplier;

          if (dot.x < 0 || dot.x > width) dot.vx *= -1;
          if (dot.y < 0 || dot.y > height) dot.vy *= -1;

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.globalAlpha = isHovered ? 0.3 : 0.15;
          ctx.fill();
        });

        ctx.lineWidth = 0.5;
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 60) {
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.globalAlpha = (1 - dist / 60) * (isHovered ? 0.2 : 0.08);
              ctx.stroke();
            }
          }
        }
      }

      // 4. CRM: Vertical dashboard pipeline blocks
      else if (canvasType === 'crm') {
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = isHovered ? 0.14 : 0.06;
        const barWidth = 10;
        const gap = 8;
        const barsCount = 5;
        const startX = width * 0.7;

        for (let i = 0; i < barsCount; i++) {
          const targetHeight = 25 + Math.sin(frame * 0.03 + i) * 10;
          const barX = startX + i * (barWidth + gap);
          ctx.fillRect(barX, height * 0.35 - targetHeight / 2, barWidth, targetHeight);
        }
      }

      // 5. ERP: Matrix Status Nodes Grid
      else if (canvasType === 'erp') {
        const rows = 3;
        const cols = 4;
        const size = 5;
        const gap = 8;
        const startX = width * 0.72;
        const startY = height * 0.3;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const glowVal = Math.sin(frame * 0.04 + r * 0.5 + c * 0.3) * 0.5 + 0.5;
            ctx.fillStyle = baseColor;
            ctx.globalAlpha = (glowVal * 0.18 + 0.04) * (isHovered ? 1.4 : 1.0);
            ctx.fillRect(startX + c * (size + gap), startY + r * (size + gap), size, size);
          }
        }
      }

      // 6. API: Flowing Data Packets
      else if (canvasType === 'api') {
        ctx.strokeStyle = baseColor;
        ctx.fillStyle = baseColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = isHovered ? 0.12 : 0.05;

        const pathways = [height * 0.3, height * 0.5];
        pathways.forEach((pY) => {
          ctx.beginPath();
          ctx.moveTo(width * 0.6, pY);
          ctx.lineTo(width - 15, pY);
          ctx.stroke();
        });

        dots.forEach((dot, idx) => {
          dot.x += dot.vx * (isHovered ? 1.5 : 1.0);
          if (dot.x > width - 15) {
            dot.x = width * 0.6;
          }
          const pathwayY = pathways[idx % pathways.length];
          ctx.beginPath();
          ctx.arc(dot.x, pathwayY, dot.radius, 0, Math.PI * 2);
          ctx.globalAlpha = isHovered ? 0.4 : 0.15;
          ctx.fill();
        });
      }

      // 7. SaaS: Line Graph
      else if (canvasType === 'saas') {
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = isHovered ? 0.2 : 0.08;

        ctx.beginPath();
        const startX = width * 0.65;
        const endX = width - 20;
        const totalPoints = 8;
        const step = (endX - startX) / (totalPoints - 1);

        for (let i = 0; i < totalPoints; i++) {
          const pX = startX + i * step;
          const noiseVal = Math.sin(frame * 0.035 + i * 0.9) * 6;
          const trendVal = (i / totalPoints) * 20;
          const pY = height * 0.45 - trendVal + noiseVal;

          if (i === 0) ctx.moveTo(pX, pY);
          else ctx.lineTo(pX, pY);
        }
        ctx.stroke();
      }

      // 8. Mobile: Phone outline with bouncing signal pulses
      else if (canvasType === 'mobile') {
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = isHovered ? 0.18 : 0.06;

        const phoneW = 35;
        const phoneH = 60;
        const pX = width * 0.75;
        const pY = height * 0.25;

        ctx.beginPath();
        ctx.roundRect(pX, pY, phoneW, phoneH, 5);
        ctx.stroke();

        const maxR = isHovered ? 30 : 20;
        const rVal = (frame % 80) * (maxR / 80);
        ctx.beginPath();
        ctx.arc(pX + phoneW / 2, pY + phoneH / 2, rVal, 0, Math.PI * 2);
        ctx.globalAlpha = (1 - rVal / maxR) * (isHovered ? 0.15 : 0.06);
        ctx.stroke();
      }

      // 9. E-Commerce: Jumping Coins
      else if (canvasType === 'ecommerce') {
        ctx.fillStyle = baseColor;
        dots.forEach((dot) => {
          dot.y += dot.vy;
          dot.x += dot.vx;
          if (dot.y < 0) {
            dot.y = height * 0.6;
            dot.x = width * 0.6 + Math.random() * (width * 0.35);
          }
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.globalAlpha = isHovered ? 0.22 : 0.1;
          ctx.fill();
        });
      }

      // 10. Cloud: Radiating radar rings
      else if (canvasType === 'cloud') {
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1;
        const circleCount = 2;
        const maxRadius = Math.min(width, height) * 0.25;

        for (let i = 0; i < circleCount; i++) {
          const shiftFrame = (frame + i * 40) % 100;
          const radius = (shiftFrame / 100) * maxRadius;
          const alpha = (1 - shiftFrame / 100) * (isHovered ? 0.2 : 0.08);

          ctx.beginPath();
          ctx.arc(width * 0.78, height * 0.38, radius, 0, Math.PI * 2);
          ctx.globalAlpha = alpha;
          ctx.stroke();
        }
      }

      // 11. Support: EKG/Heartbeat pulse line
      else if (canvasType === 'support') {
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = isHovered ? 0.22 : 0.08;

        ctx.beginPath();
        const startX = width * 0.6;
        const endX = width - 15;
        const midY = height * 0.45;

        for (let xCoord = startX; xCoord < endX; xCoord++) {
          let offset = 0;
          const spikeCenter = startX + ((frame * (isHovered ? 2 : 1.2)) % (endX - startX));
          const dx = Math.abs(xCoord - spikeCenter);

          if (dx < 15) {
            offset = Math.sin(dx * 0.4) * Math.cos(dx * 0.15) * 20;
          }

          if (xCoord === startX) ctx.moveTo(xCoord, midY + offset);
          else ctx.lineTo(xCoord, midY + offset);
        }
        ctx.stroke();
      }

      // 12. Custom Software: Binary digital fall rain
      else if (canvasType === 'software') {
        ctx.fillStyle = baseColor;
        ctx.font = '6px monospace';
        ctx.globalAlpha = isHovered ? 0.16 : 0.06;

        const cols = 5;
        for (let i = 0; i < cols; i++) {
          const char = Math.random() > 0.5 ? '1' : '0';
          const rY = height * 0.15 + ((Math.sin(frame * 0.02 + i) * 0.5 + 0.5) * (height * 0.4));
          ctx.fillText(char, width * 0.65 + i * 12, rY);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasType, isHovered]);

  const Icon = getIcon(service.icon);

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative w-full max-w-[380px] h-[320px] p-[1.5px] rounded-[26px] bg-white/[0.03] flex flex-col justify-between transition-all duration-300"
    >
      {/* 1. Animated Gradient Border Overlay */}
      <div className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 opacity-100 group-hover:from-cyan-500/40 group-hover:via-blue-500/40 group-hover:to-purple-500/40 transition-all duration-700 pointer-events-none z-0" />

      {/* 2. Soft Cyan Glow on Hover */}
      <div className="absolute inset-0 rounded-[26px] opacity-0 group-hover:opacity-100 blur-xl bg-cyan-500/10 transition-opacity duration-500 pointer-events-none z-0" />

      {/* 3. Glass reflection sheer light line */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[26px] pointer-events-none z-[1]">
        <div className="absolute -inset-y-12 left-0 w-24 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-[200px] group-hover:translate-x-[500px] transition-transform duration-1000 ease-out" />
      </div>

      {/* 4. Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
      />

      {/* 5. Glassmorphism Card Body */}
      <div className="relative z-10 w-full h-full rounded-[25px] bg-[#070707]/90 backdrop-blur-xl p-7 flex flex-col justify-between overflow-hidden">
        
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            {/* Large Top Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.02] border border-white/10 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 group-hover:border-cyan-500/35 transition-all duration-500 transform group-hover:rotate-[360deg] shadow-lg">
              <Icon size={24} />
            </div>

            {/* Category Tag */}
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-md">
              {service.category}
            </span>
          </div>

          {/* Title Below Icon */}
          <h3 className="text-lg font-bold tracking-tight text-white uppercase group-hover:text-cyan-300 transition-colors duration-300 transform group-hover:translate-y-[-1px]">
            {service.title}
          </h3>

          {/* Short Description (constrained to 3 lines) */}
          <p className="mt-3 text-neutral-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 group-hover:text-neutral-300 transition-colors duration-300">
            {service.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
          
          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 max-w-[65%]">
            {tags.slice(0, 3).map((tag: any) => (
              <TechBadge key={tag} name={tag} />
            ))}
          </div>

          {/* Learn More link bottom-right */}
          <Link
            to={`/contact?service=${encodeURIComponent(service.title)}`}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group/link shrink-0"
          >
            <span>Learn More</span>
            <FiArrowRight size={12} className="transition-transform duration-300 transform group-hover/link:translate-x-[3px]" />
          </Link>

        </div>

      </div>
    </motion.div>
  );
}
