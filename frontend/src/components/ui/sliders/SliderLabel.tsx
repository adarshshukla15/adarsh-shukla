import React from 'react';

interface SliderLabelProps {
  label: string;
  value: string;
}

export default function SliderLabel({ label, value }: SliderLabelProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
        {label}
      </span>
      <span className="text-sm font-black text-cyan-400 font-mono tracking-wide px-3 py-1 rounded-md bg-cyan-950/20 border border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
        {value}
      </span>
    </div>
  );
}
