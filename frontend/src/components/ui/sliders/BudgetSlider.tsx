import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import SliderLabel from './SliderLabel';
import SliderThumb from './SliderThumb';

interface BudgetSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const min = 0;
  const max = 500000;
  const step = 5000;
  const percentage = ((value - min) / (max - min)) * 100;

  // Format currency into Indian Rupees format (e.g., ₹2,35,000)
  const formatValue = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // GSAP entrance fade-up and blur reveal animation on mount
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col py-2 select-none opacity-0">
      <SliderLabel label="Project Budget" value={formatValue(value)} />

      {/* Slider Track Container */}
      <div 
        className="relative w-full h-8 flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Track Background */}
        <div className="relative w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          {/* Filled track with active cyan gradient */}
          <div 
            style={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          />
        </div>

        {/* Custom Glowing Slider Thumb */}
        <SliderThumb percentage={percentage} isHovered={isHovered} />

        {/* Fully operational invisible native range input */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
        />
      </div>
      
      {/* Slider Limits labels */}
      <div className="flex justify-between items-center mt-1 text-[9px] text-neutral-600 font-bold uppercase tracking-wider">
        <span>₹0</span>
        <span>₹5,00,000</span>
      </div>
    </div>
  );
}
