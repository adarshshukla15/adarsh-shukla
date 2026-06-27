import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiSend, FiArrowRight, FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import MagneticButton from '../buttons/MagneticButton';
import { getSettings } from '../../../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="relative border-t border-white/5 bg-black pt-20 pb-10">
      {/* Background glow effects */}
      <div className="glow-cyan absolute bottom-0 left-1/4 h-[350px] w-[350px] -translate-x-1/2 opacity-30 pointer-events-none" />
      <div className="glow-blue absolute bottom-0 right-1/4 h-[350px] w-[350px] translate-x-1/2 opacity-20 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-white mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <img src="/favicon.png" alt="logo" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-wider text-white">
                  {(settings?.companyName || 'A3 Web & Software Services').split(' ')[0]} Agency
                </span>
                <span className="text-[9px] font-medium tracking-widest text-cyan-400 uppercase">
                  {(settings?.companyName || 'A3 Web & Software Services').split(' ').slice(1).join(' ') || 'Web & Software'}
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-md">
              {settings?.footerText || settings?.heroSubtitle || 'A3 Web & Software Services designs and engineers premium digital products. We translate complex product requirements into high-performance, award-winning code.'}
            </p>
            <div className="flex items-center gap-4">
              <a 
                href={settings?.socialLinks?.twitter || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300"
              >
                <FiTwitter />
              </a>
              <a 
                href={settings?.socialLinks?.linkedin || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300"
              >
                <FiLinkedin />
              </a>
              <a 
                href={settings?.socialLinks?.github || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300"
              >
                <FiGithub />
              </a>
              <a 
                href={settings?.socialLinks?.instagram || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300"
              >
                <FiInstagram />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">Explore</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">About Us</Link></li>
                <li><Link to="/services" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">Services</Link></li>
                <li><Link to="/projects" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">Projects</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">Services</h3>
              <ul className="space-y-4">
                <li><Link to="/services" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">Web Development</Link></li>
                <li><Link to="/services" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">AI & Automation</Link></li>
                <li><Link to="/services" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">Cloud & DevOps</Link></li>
                <li><Link to="/services" className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors">Custom CRM/ERP</Link></li>
              </ul>
            </div>
             <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">Connect</h3>
              <ul className="space-y-4">
                <li>
                  {(() => {
                    const emails = settings?.email
                      ? settings.email.split(',').map((e: string) => e.trim())
                      : ['a3services.inn@gmail.com'];
                    return emails.map((email: string) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors block"
                      >
                        {email}
                      </a>
                    ));
                  })()}
                </li>
                <li>
                  {(() => {
                    const phones = settings?.phone
                      ? settings.phone.split(/[,/]/).map((p: string) => p.trim())
                      : ['+91 78271 74313', '+91 76784 51381'];
                    return phones.map((phone: string) => {
                      const cleanPhone = phone.replace(/\s+/g, '');
                      return (
                        <a
                          key={phone}
                          href={`tel:${cleanPhone}`}
                          className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors block"
                        >
                          {phone}
                        </a>
                      );
                    });
                  })()}
                </li>
                <li className="text-sm text-neutral-400 leading-relaxed">
                  <a
                    href="https://maps.google.com/?q=North+East+Delhi,+Delhi,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {settings?.address || 'North East Delhi, Delhi, India'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">Newsletter</h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Subscribe to stay updated with fresh design insights, technical tutorials, and product releases.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="relative">
                <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-white/5 py-3.5 pr-14 pl-12 text-sm text-white placeholder-neutral-500 outline-none backdrop-blur-md transition-all focus:border-cyan-500/30 focus:bg-white/10"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute top-1/2 right-2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  <FiSend size={16} />
                </button>
              </div>
              
              {/* Status Message */}
              {message && (
                <p className={`mt-2 text-xs font-medium ${status === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/5 pt-8 gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500">
            {settings?.copyright || `© ${new Date().getFullYear()} ${settings?.companyName || 'A3 Web & Software Services'}. All rights reserved.`}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">Terms of Service</a>
            <Link to="/admin" className="text-xs text-neutral-500 hover:text-cyan-400 transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
