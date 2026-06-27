import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import MagneticButton from '../buttons/MagneticButton';
import { getSettings } from '../../../api';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const companyName = settings?.companyName || 'A3 Web & Software Services';
  const logoText = settings?.logo || 'A3';

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-black/40 backdrop-blur-xl border-b border-white/5' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center gap-2.5 font-bold tracking-tight text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-transform duration-500 group-hover:scale-105">
              <img src="/favicon.png" alt="logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                {companyName.split(' ')[0]} Agency
              </span>
              <span className="text-[9px] font-medium tracking-widest text-cyan-400 uppercase">
                {companyName.split(' ').slice(1).join(' ') || 'Web & Software'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="relative py-2 text-sm font-medium tracking-wide text-neutral-400 transition-colors duration-300 hover:text-white"
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavLine"
                          className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="h-4 w-px bg-white/10" />

            {/* Magnetic CTA */}
            <Link to="/contact">
              <MagneticButton className="rounded-full bg-cyan-500/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 border border-cyan-500/20 backdrop-blur-md transition-all hover:bg-cyan-500/20 hover:border-cyan-500/40">
                Get Estimate <FiArrowRight className="inline-block ml-1" />
              </MagneticButton>
            </Link>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10 md:hidden"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 flex flex-col bg-black/95 backdrop-blur-2xl pt-28 px-8 md:hidden"
          >
            <ul className="flex flex-col gap-6 text-2xl font-bold tracking-tight">
              {navLinks.map((link, idx) => (
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    className={`block py-2 ${
                      location.pathname === link.path 
                        ? 'text-cyan-400' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 h-px bg-white/10" />

            <div className="mt-12 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-neutral-500">Quick Contact</span>
              {(() => {
                const emails = settings?.email
                  ? settings.email.split(',').map((e: string) => e.trim())
                  : ['a3services.inn@gmail.com'];
                return emails.map((email: string) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="text-sm font-medium text-white hover:text-cyan-400 block truncate"
                  >
                    {email}
                  </a>
                ));
              })()}
              <Link
                to="/contact"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 font-bold text-black shadow-lg shadow-cyan-500/20"
              >
                Request Consultation <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
