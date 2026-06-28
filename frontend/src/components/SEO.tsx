import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
}

export default function SEO({ title, description, keywords, canonicalUrl }: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | A3 Web & Software Services`;

    // Helper to get or create meta elements
    const getOrCreateMeta = (nameOrProperty: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(element);
      }
      return element;
    };

    // Helper to get or create link element
    const getOrCreateLink = (rel: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      return element;
    };

    // 2. Update Meta Description
    const metaDescription = getOrCreateMeta('description');
    metaDescription.setAttribute('content', description);

    // 3. Update Keywords if present
    if (keywords) {
      const metaKeywords = getOrCreateMeta('keywords');
      metaKeywords.setAttribute('content', keywords);
    }

    // 4. Update OpenGraph Tags
    const ogTitle = getOrCreateMeta('og:title', true);
    ogTitle.setAttribute('content', title);

    const ogDescription = getOrCreateMeta('og:description', true);
    ogDescription.setAttribute('content', description);

    const ogUrl = getOrCreateMeta('og:url', true);
    ogUrl.setAttribute('content', canonicalUrl);

    const ogType = getOrCreateMeta('og:type', true);
    ogType.setAttribute('content', 'website');

    // 5. Update Canonical URL
    const linkCanonical = getOrCreateLink('canonical');
    linkCanonical.setAttribute('href', canonicalUrl);

  }, [title, description, keywords, canonicalUrl]);

  return null;
}
