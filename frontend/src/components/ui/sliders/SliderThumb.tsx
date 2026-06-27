import React from 'react';
import { motion } from 'framer-motion';

interface SliderThumbProps {
  percentage: number;
  isHovered: boolean;
}

export default function SliderThumb({ percentage, isHovered }: SliderThumbProps) {
  return (
    <motion.div
      style={{ left: `calc(${percentage}% - 10px)` }}
      animate={{
        scale: isHovered ? 1.25 : 1,
        boxShadow: isHovered 
          ? '0 0 20px rgba(6, 182, 212, 0.8), inset 0 0 8px rgba(6, 182, 212, 0.5)' 
          : '0 0 10px rgba(6, 182, 212, 0.4), inset 0 0 4px rgba(6, 182, 212, 0.2)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-black border-2 border-cyan-400 cursor-pointer pointer-events-none z-20 flex items-center justify-center"
    >
      {/* Inner glowing dot */}
      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
    </motion.div>
  );
}
