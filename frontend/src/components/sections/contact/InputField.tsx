import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import * as Icons from 'react-icons/fi';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  iconName: string;
  error?: string;
  register: UseFormRegisterReturn;
  isTextArea?: boolean;
}

export default function InputField({ label, iconName, error, register, isTextArea = false, ...props }: InputFieldProps) {
  const IconComponent = (Icons as any)[iconName] || Icons.FiEdit3;

  return (
    <div className="relative w-full flex flex-col gap-1 select-none">
      <div className="relative w-full rounded-xl p-[1px] bg-white/5 focus-within:bg-gradient-to-r focus-within:from-cyan-500/30 focus-within:to-blue-500/30 transition-all duration-300">
        
        {/* Glass Content Box */}
        <div className="relative w-full rounded-[11px] bg-[#070707]/90 backdrop-blur-xl flex items-center border border-white/5 focus-within:border-transparent transition-colors duration-300">
          
          {/* Internal Icon */}
          <div className="absolute left-4 text-neutral-500 focus-within:text-cyan-400 transition-colors pointer-events-none z-10">
            <IconComponent size={14} className="focus-within:text-cyan-400" />
          </div>

          {/* Input / Textarea Field */}
          {isTextArea ? (
            <textarea
              {...register}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              placeholder=" "
              className="peer w-full rounded-xl bg-transparent py-4 pl-11 pr-4 text-xs text-white placeholder-transparent outline-none min-h-[120px] resize-none transition-all"
            />
          ) : (
            <input
              {...register}
              {...props}
              placeholder=" "
              className="peer w-full rounded-xl bg-transparent py-4 pl-11 pr-4 text-xs text-white placeholder-transparent outline-none h-[50px] transition-all"
            />
          )}

          {/* Floating Label */}
          <label className="absolute left-11 text-xs text-neutral-500 transition-all duration-300 pointer-events-none origin-left 
            peer-placeholder-shown:translate-y-0 
            peer-placeholder-shown:scale-100 
            peer-focus:-translate-y-3.5 
            peer-focus:scale-75 
            peer-focus:text-cyan-400 
            -translate-y-3.5 
            scale-75 
            text-cyan-400/80
            bg-[#070707]/90 px-1 rounded-sm
            peer-focus:bg-[#070707]
            top-4"
          >
            {label}
          </label>

          {/* Focus spotlight inner glow */}
          <div className="absolute inset-0 rounded-[11px] bg-cyan-500/5 opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
        </div>
      </div>

      {/* Validation Error Message */}
      {error && (
        <span className="text-[10px] text-rose-500 pl-1 font-medium transition-opacity animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}
