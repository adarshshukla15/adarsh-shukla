import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiMail, FiMessageCircle, FiX, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getSettings } from '../../../api';

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const emails = settings?.email
    ? settings.email.split(',').map((e: string) => e.trim())
    : ['a3services.inn@gmail.com'];

  const phones = settings?.phone
    ? settings.phone.split(/[,/]/).map((p: string) => p.trim())
    : ['+91 78271 74313', '+91 76784 51381'];

  // wa.me links
  const whatsappLinks = [
    'https://wa.me/917827174313',
    'https://wa.me/917678451381'
  ];

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Floating Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-72 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-xl p-5 shadow-2xl z-50 flex flex-col gap-4 text-left select-none relative"
            style={{
              boxShadow: '0 20px 40px -15px rgba(6, 182, 212, 0.25)'
            }}
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-100 pointer-events-none" />

            <div className="relative z-10">
              <h4 className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Direct Channels
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Connect instantly with our team
              </p>
            </div>

            {/* Quick Channels List */}
            <div className="relative z-10 flex flex-col gap-2.5">
              
              {/* WhatsApp Channels */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">
                  💬 WhatsApp
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href={whatsappLinks[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-all duration-300"
                  >
                    <FaWhatsapp size={12} />
                    Aditya
                  </a>
                  <a 
                    href={whatsappLinks[1]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-all duration-300"
                  >
                    <FaWhatsapp size={12} />
                    Adarsh
                  </a>
                </div>
              </div>

              {/* Call Channels */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">
                  📞 Phone Calls
                </span>
                <div className="flex flex-col gap-1.5">
                  {phones.map((phone: string, idx: number) => {
                    const cleanPhone = phone.replace(/\s+/g, '');
                    const label = idx === 0 ? 'Aditya' : 'Adarsh';
                    return (
                      <a 
                        key={phone}
                        href={`tel:${cleanPhone}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-semibold text-neutral-300 hover:text-white hover:bg-white/5 hover:border-cyan-500/25 transition-all duration-300"
                      >
                        <span className="flex items-center gap-1.5">
                          <FiPhone size={10} className="text-cyan-400" />
                          {phone}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold">
                          {label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Email Channels */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">
                  📧 Email Links
                </span>
                <div className="flex flex-col gap-1.5">
                  {emails.map((email: string, idx: number) => {
                    const label = emails.length > 1 ? (idx === 0 ? 'Aditya' : 'Adarsh') : 'Agency';
                    return (
                      <a 
                        key={email}
                        href={`mailto:${email}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-semibold text-neutral-300 hover:text-white hover:bg-white/5 hover:border-cyan-500/25 transition-all duration-300"
                      >
                        <span className="flex items-center gap-1.5 truncate max-w-[80%]">
                          <FiMail size={10} className="text-blue-400 shrink-0" />
                          <span className="truncate">{email}</span>
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold shrink-0">
                          {label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick response stats */}
            <div className="relative z-10 border-t border-white/5 pt-3 flex items-center justify-between text-[9px] text-neutral-500">
              <span className="flex items-center gap-1">
                <FiClock size={10} className="text-cyan-500" />
                Response Time: Within 24h
              </span>
              <span>Mon – Sat</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-black/60 text-cyan-400 backdrop-blur-xl shadow-xl hover:text-cyan-300 hover:border-cyan-500/60 transition-colors duration-300 focus:outline-none cursor-pointer group"
        style={{
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)'
        }}
      >
        {/* Glow pulsing backdrop ring */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-75 animate-[pulse_2s_infinite] pointer-events-none group-hover:bg-cyan-400/35 transition-all duration-300" />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiX size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <FiMessageCircle size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
