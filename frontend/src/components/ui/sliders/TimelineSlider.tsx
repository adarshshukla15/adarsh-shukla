import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import SliderLabel from './SliderLabel';
import SliderThumb from './SliderThumb';

interface TimelineSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export default function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const min = 1;
  const max = 30;
  const step = 1;
  const percentage = ((value - min) / (max - min)) * 100;

  // Format value into days string (e.g. 1 Day, 15 Days)
  const formatValue = (val: number): string => {
    return val === 1 ? '1 Day' : `${val} Days`;
  };

  // GSAP entrance fade-up and blur reveal animation on mount
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col py-2 select-none opacity-0">
      <SliderLabel label="Project Timeline" value={formatValue(value)} />

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
        <span>1 Day</span>
        <span>30 Days</span>
      </div>
    </div>
  );
}
