import { useEffect } from 'react';
import {
  SITE_NAME,
  getSiteUrl,
  getCanonicalUrl,
  getDefaultOgImageUrl,
} from '../config/seoConfig';

export interface BreadcrumbItem {
  name: string;
  item: string; // path or absolute url
}

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  breadcrumbData?: BreadcrumbItem[];
}

export function useSEO({
  title,
  description,
  canonicalPath = '',
  type = 'website',
  image,
  noIndex = false,
  structuredData,
  articleData,
  breadcrumbData,
}: SEOProps) {
  useEffect(() => {
    const fullCanonicalUrl = getCanonicalUrl(canonicalPath);
    const ogImageUrl = image || getDefaultOgImageUrl();

    // Standardize title format: "[Page Title] | Leonida Forge"
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

    // Update document title
    document.title = fullTitle;

    // Helper to safely set or create meta elements
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');

    // Open Graph
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:image', ogImageUrl);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImageUrl);

    // Canonical link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // Structured Data JSON-LD
    let jsonLdScript = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'seo-json-ld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    const schemaGraph: Array<Record<string, any>> = [];

    // Custom or explicit structured data
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        schemaGraph.push(...structuredData);
      } else {
        schemaGraph.push(structuredData);
      }
    }

    // Article schema for guides
    if (type === 'article' && articleData) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image: ogImageUrl,
        datePublished: articleData.publishedTime || '2025-01-15',
        dateModified: articleData.modifiedTime || articleData.publishedTime || '2025-02-01',
        author: {
          '@type': 'Organization',
          name: articleData.author || SITE_NAME,
          url: getSiteUrl(),
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: getSiteUrl(),
          logo: {
            '@type': 'ImageObject',
            url: `${getSiteUrl()}/favicon.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullCanonicalUrl,
        },
      });
    }

    // BreadcrumbList schema
    if (breadcrumbData && breadcrumbData.length > 0) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbData.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item.startsWith('http')
            ? crumb.item
            : getCanonicalUrl(crumb.item),
        })),
      });
    }

    if (schemaGraph.length > 0) {
      // If single item, render directly; if multiple, wrap in @graph
      const output = schemaGraph.length === 1
        ? schemaGraph[0]
        : {
            '@context': 'https://schema.org',
            '@graph': schemaGraph,
          };
      jsonLdScript.textContent = JSON.stringify(output);
    } else {
      jsonLdScript.textContent = '';
    }

    // Optional Google Analytics 4 pageview tracking if configured
    const metaEnv = (import.meta as any).env || {};
    const gaId = metaEnv.VITE_GA_MEASUREMENT_ID as string | undefined;
    if (gaId && typeof window !== 'undefined') {
      const anyWin = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof anyWin.gtag === 'function') {
        anyWin.gtag('event', 'page_view', {
          page_title: fullTitle,
          page_location: fullCanonicalUrl,
          page_path: canonicalPath,
        });
      }
    }
  }, [
    title,
    description,
    canonicalPath,
    type,
    image,
    noIndex,
    JSON.stringify(structuredData),
    JSON.stringify(articleData),
    JSON.stringify(breadcrumbData),
  ]);
}
