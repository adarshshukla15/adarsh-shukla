import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/ui/navbar/Navbar';
import Footer from '../components/ui/footer/Footer';
import CustomCursor from '../components/ui/cursor/CustomCursor';
import Preloader from '../components/ui/loader/Preloader';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { getSettings } from '../api';
import FloatingContactWidget from '../components/ui/contact/FloatingContactWidget';

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Initialize Lenis smooth scrolling
  useSmoothScroll();

  // Load settings & Google Analytics dynamically
  useEffect(() => {
    getSettings().then((settings) => {
      if (settings && settings.googleAnalyticsId) {
        const gaId = settings.googleAnalyticsId;
        const scriptId = 'google-analytics-gtag';
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(script);

          const inlineScript = document.createElement('script');
          inlineScript.id = `${scriptId}-inline`;
          inlineScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `;
          document.head.appendChild(inlineScript);
        }
      }
    });
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    // Access global lenis if available to reset scroll position
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  return (
    <>
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
          {/* Global Noise Texture Overlap */}
          <div className="noise-bg" />

          {/* Glowing Background Blobs */}
          <div className="glow-cyan absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full opacity-35 blur-[120px] pointer-events-none" />
          <div className="glow-blue absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none" />
          <div className="glow-purple absolute bottom-[20%] left-[10%] h-[600px] w-[600px] rounded-full opacity-20 blur-[130px] pointer-events-none" />

          {/* Custom Cursor Trail */}
          <CustomCursor />

          {/* Floating Navigation Header */}
          <Navbar />

          {/* Page Routing Outlet */}
          <main className="relative z-10 pt-24 min-h-[calc(100vh-280px)]">
            <Outlet />
          </main>

          {/* Bottom Footer Section */}
          <Footer />

          {/* Floating Contact Widget */}
          {location.pathname !== '/admin' && <FloatingContactWidget />}
        </div>
      )}
    </>
  );
}
