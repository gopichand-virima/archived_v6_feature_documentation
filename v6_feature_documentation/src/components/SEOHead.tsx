import { useEffect } from 'react';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_ORG_URL, SITE_SUPPORT_URL } from '../lib/config/site';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  module?: string;
  section?: string;
  version?: string;
}

export function SEOHead({
  title = `${SITE_NAME} - Official IT Management Platform Documentation`,
  description = SITE_DESCRIPTION,
  keywords = ['Virima', 'ITSM', 'CMDB', 'IT management', 'documentation', 'IT asset management'],
  url = SITE_URL,
  module,
  section,
  version
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Remove existing SEO meta tags and links
    document.querySelectorAll('meta[data-seo="true"], link[data-seo="true"], script[data-seo="true"]')
      .forEach(el => el.remove());

    // Standard meta tags
    const metaTags: Array<{ name?: string; property?: string; content: string }> = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: 'Virima' },

      // OpenGraph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },

      // Crawler directives
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    ];

    for (const tag of metaTags) {
      const meta = document.createElement('meta');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    }

    // Canonical link
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    canonical.setAttribute('data-seo', 'true');
    document.head.appendChild(canonical);

    // JSON-LD structured data
    const breadcrumbItems: object[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ];
    let pos = 2;
    if (version) {
      breadcrumbItems.push({ '@type': 'ListItem', position: pos++, name: `Version ${version}`, item: `${SITE_URL}/${version}` });
    }
    if (module) {
      breadcrumbItems.push({ '@type': 'ListItem', position: pos++, name: module, item: `${SITE_URL}/${version ?? '6.1'}/${module}` });
    }
    if (section && section !== module) {
      breadcrumbItems.push({ '@type': 'ListItem', position: pos++, name: section, item: `${SITE_URL}/${version ?? '6.1'}/${module}/${section}` });
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          publisher: { '@id': `${SITE_ORG_URL}/#organization` },
        },
        {
          '@type': 'Organization',
          '@id': `${SITE_ORG_URL}/#organization`,
          name: 'Virima',
          url: SITE_ORG_URL,
          sameAs: [SITE_URL, SITE_SUPPORT_URL],
          knowsAbout: [
            'IT Service Management',
            'Configuration Management Database',
            'IT Asset Management',
            'Discovery and Dependency Mapping',
            'Vulnerability Management',
          ],
        },
        {
          '@type': 'TechArticle',
          '@id': `${url}#article`,
          headline: title,
          description,
          url,
          dateModified: new Date().toISOString(),
          author: { '@type': 'Organization', name: 'Virima' },
          publisher: { '@id': `${SITE_ORG_URL}/#organization` },
          keywords: keywords.join(', '),
          articleSection: section ?? module ?? 'Documentation',
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'h2', '.quick-answer'],
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        },
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, url, module, section, version]);

  return null;
}
