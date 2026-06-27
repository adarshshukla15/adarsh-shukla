import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as Icons from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface ContactInfoItem {
  text: string;
  link?: string;
  label?: string;
}

interface ContactInfoCardProps {
  iconName: string;
  title: string;
  value?: string;
  link?: string;
  subtext?: string;
  items?: ContactInfoItem[];
}

export default function ContactInfoCard({ iconName, title, value, link, subtext, items }: ContactInfoCardProps) {
  const cardRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic icon resolver
  const IconComponent = iconName === 'FaWhatsapp' ? FaWhatsapp : ((Icons as any)[iconName] || Icons.FiMessageSquare);

  // 3D Tilt coordinates (via motion values)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<any>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    // Save local mouse coordinates for spotlight
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const cardContent = (
    <>
      {/* Glow Border Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-500 pointer-events-none z-0" />
      
      {/* Internal Glass Background */}
      <div className="relative z-10 h-full w-full rounded-2xl bg-[#080808]/75 backdrop-blur-xl p-5 border border-white/5 group-hover:border-cyan-500/20 transition-colors duration-300 flex items-start gap-4">
        
        {/* Animated Icon Container */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.02] border border-white/10 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 group-hover:border-cyan-500/35 transition-all duration-300 transform group-hover:scale-110">
          <IconComponent size={20} className="transition-transform duration-300 group-hover:rotate-12" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 block mb-1">
            {title}
          </span>
          
          {items && items.length > 0 ? (
            <div className="flex flex-col gap-2 mt-1 z-20 relative">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 border-b border-white/[0.03] pb-1.5 last:border-0 last:pb-0">
                  {item.link ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white hover:text-cyan-300 transition-colors duration-200 block truncate cursor-pointer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm font-bold text-white block truncate">
                      {item.text}
                    </span>
                  )}
                  {item.label && (
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-500 shrink-0">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-cyan-300 transition-colors duration-200">
              {value}
            </h4>
          )}

          {subtext && (
            <p className="text-[10px] text-neutral-400 mt-1.5 font-light leading-relaxed">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </>
  );

  const motionProps = {
    ref: cardRef,
    style: { rotateX, rotateY, transformStyle: 'preserve-3d' as const },
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
    whileHover: { y: -5, scale: 1.01 },
    transition: { type: 'spring', stiffness: 350, damping: 22 },
    className: "group relative w-full rounded-2xl p-[1px] bg-white/[0.02] overflow-hidden cursor-pointer select-none"
  };

  if (link && (!items || items.length === 0)) {
    return (
      <motion.a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        {...motionProps}
      >
        {cardContent}
      </motion.a>
    );
  }

  return (
    <motion.div {...motionProps}>
      {cardContent}
    </motion.div>
  );
}
