import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export default function SubmitButton({ isLoading = false, disabled = false }: SubmitButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Click ripple state
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  // Handle magnetic attraction on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Magnetic pull: pull button up to 8px towards mouse
    setMagneticPos({ x: x * 0.18, y: y * 0.18 });
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  // Add click ripple
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || isLoading || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples((prev) => [...prev, newRipple]);
    
    // Auto-remove ripple
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <motion.button
      ref={buttonRef}
      type="submit"
      disabled={isLoading || disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ x: magneticPos.x, y: magneticPos.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      whileTap={{ scale: 0.96 }}
      className="group relative w-full h-[52px] rounded-xl bg-white/5 border border-white/10 hover:border-transparent flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 font-bold text-xs uppercase tracking-wider text-white hover:text-black cursor-pointer select-none"
    >
      {/* 1. Dynamic Hover Gradient Background Fill */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      {/* 2. Glow shadow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 blur-lg bg-cyan-400/20" />

      {/* 3. Ripple circles */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y
          }}
          className="absolute h-5 w-5 bg-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-[ping_0.8s_ease-out] z-10"
        />
      ))}

      {/* 4. Content */}
      <div className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <svg 
              className="animate-spin h-4 w-4 text-black" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-black">Processing...</span>
          </>
        ) : (
          <>
            <span>Send Inquiry</span>
            {/* Arrow slides out / paper plane launches */}
            <FiSend className="transition-transform duration-300 transform group-hover:translate-x-[4px] group-hover:-translate-y-[2px]" />
          </>
        )}
      </div>
    </motion.button>
  );
}
