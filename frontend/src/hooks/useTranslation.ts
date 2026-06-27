import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'de' | 'fr';

const translations = {
  en: {
    navHome: 'Home',
    navAbout: 'About',
    navServices: 'Services',
    navProjects: 'Projects',
    navContact: 'Contact',
    navEstimate: 'Get Estimate',
    ctaLearnMore: 'Learn More',
    ctaSubmit: 'Submit Request',
    footerRights: 'All rights reserved.'
  },
  es: {
    navHome: 'Inicio',
    navAbout: 'Nosotros',
    navServices: 'Servicios',
    navProjects: 'Proyectos',
    navContact: 'Contacto',
    navEstimate: 'Presupuesto',
    ctaLearnMore: 'Saber Más',
    ctaSubmit: 'Enviar Solicitud',
    footerRights: 'Todos los derechos reservados.'
  },
  de: {
    navHome: 'Startseite',
    navAbout: 'Über uns',
    navServices: 'Dienste',
    navProjects: 'Projekte',
    navContact: 'Kontakt',
    navEstimate: 'Angebot anfordern',
    ctaLearnMore: 'Mehr erfahren',
    ctaSubmit: 'Absenden',
    footerRights: 'Alle Rechte vorbehalten.'
  },
  fr: {
    navHome: 'Accueil',
    navAbout: 'À propos',
    navServices: 'Services',
    navProjects: 'Projets',
    navContact: 'Contact',
    navEstimate: 'Obtenir un devis',
    ctaLearnMore: 'En savoir plus',
    ctaSubmit: 'Soumettre',
    footerRights: 'Tous droits réservés.'
  }
};

export function useTranslation() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('a3_website_lang');
    return (saved as Language) || 'en';
  });

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('a3_website_lang', newLang);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return { t, lang, changeLanguage };
}
