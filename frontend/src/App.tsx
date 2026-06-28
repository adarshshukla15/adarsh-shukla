import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Lazy loaded legal pages
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/legal/TermsConditions'));
const RefundPolicy = lazy(() => import('./pages/legal/RefundPolicy'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));
const Accessibility = lazy(() => import('./pages/legal/Accessibility'));

const SuspenseLayout = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-cyan-400 font-mono text-xs">Loading...</div>}>
    {children}
  </Suspense>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website Wrapper Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          
          {/* Legal pages routes */}
          <Route path="privacy-policy" element={<SuspenseLayout><PrivacyPolicy /></SuspenseLayout>} />
          <Route path="terms-and-conditions" element={<SuspenseLayout><TermsConditions /></SuspenseLayout>} />
          <Route path="refund-policy" element={<SuspenseLayout><RefundPolicy /></SuspenseLayout>} />
          <Route path="cookie-policy" element={<SuspenseLayout><CookiePolicy /></SuspenseLayout>} />
          <Route path="disclaimer" element={<SuspenseLayout><Disclaimer /></SuspenseLayout>} />
          <Route path="accessibility" element={<SuspenseLayout><Accessibility /></SuspenseLayout>} />

          {/* Catch-all fallback redirect to home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
