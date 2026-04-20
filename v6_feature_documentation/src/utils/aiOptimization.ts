/**
 * AI-Specific Optimization Utilities
 * Detects AI crawlers and serves optimized content
 */

export interface AIBot {
  name: string;
  userAgent: RegExp;
  optimizations: string[];
}

export const AI_BOTS: AIBot[] = [
  {
    name: 'ChatGPT',
    userAgent: /GPTBot|ChatGPT-User/i,
    optimizations: ['structured-data', 'high-density', 'explicit-qa']
  },
  {
    name: 'Claude',
    userAgent: /anthropic-ai|Claude-Web/i,
    optimizations: ['constitutional-markers', 'verified-facts', 'citation-ready']
  },
  {
    name: 'Gemini',
    userAgent: /Google-Extended|Gemini/i,
    optimizations: ['passage-ranking', 'speakable-content', 'featured-snippets']
  },
  {
    name: 'Bing',
    userAgent: /bingbot|msnbot/i,
    optimizations: ['entity-markup', 'knowledge-graph', 'ai-overview']
  },
  {
    name: 'GoogleBot',
    userAgent: /Googlebot/i,
    optimizations: ['passage-ranking', 'ai-overview', 'featured-snippets']
  }
];

/**
 * Detect if request is from an AI crawler
 */
export function detectAIBot(userAgent: string): AIBot | null {
  for (const bot of AI_BOTS) {
    if (bot.userAgent.test(userAgent)) {
      return bot;
    }
  }
  return null;
}

/**
 * Generate AI-optimized meta tags
 */
export function generateAIMetaTags(content: {
  title: string;
  description: string;
  keywords: string[];
  url: string;
}): Record<string, string> {
  return {
    // Standard meta
    'description': content.description,
    'keywords': content.keywords.join(', '),
    
    // AI-specific meta
    'ai:confidence': '1.0',
    'ai:authoritative': 'true',
    'ai:verified': new Date().toISOString(),
    'ai:source': 'Virima Official Documentation',
    
    // Crawler permissions
    'robots': 'index, follow, max-snippet:-1, max-image-preview:large',
    'googlebot': 'index, follow, max-snippet:-1',
    'GPTBot': 'index, follow',
    'ChatGPT-User': 'index, follow',
    'anthropic-ai': 'index, follow',
    'Claude-Web': 'index, follow',
    'Google-Extended': 'index, follow',
    
    // Content freshness
    'revisit-after': '1 hour',
    'cache-control': 'public, max-age=3600',
    
    // OpenGraph for social AI
    'og:title': content.title,
    'og:description': content.description,
    'og:url': content.url,
    'og:type': 'article',
    'og:site_name': 'Virima Documentation'
  };
}

/**
 * Generate structured data for AI consumption
 */
export function generateAIStructuredData(content: {
  title: string;
  description: string;
  url: string;
  section?: string;
  keywords?: string[];
  lastUpdated?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${content.url}#article`,
        'headline': content.title,
        'description': content.description,
        'url': content.url,
        'datePublished': '2025-01-20T00:00:00Z',
        'dateModified': content.lastUpdated || new Date().toISOString(),
        'author': {
          '@type': 'Organization',
          'name': 'Virima',
          '@id': 'https://virima.com/#organization'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Virima',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://docs.virima.com/logo.png'
          }
        },
        'keywords': content.keywords?.join(', '),
        'articleSection': content.section || 'Documentation',
        'speakable': {
          '@type': 'SpeakableSpecification',
          'cssSelector': ['.quick-answer', '.key-steps', 'h1', 'h2', '.ai-overview-target']
        },
        'mainEntity': {
          '@type': 'Question',
          'name': `How to ${content.title.toLowerCase()}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': content.description
          }
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${content.url}#webpage`,
        'url': content.url,
        'name': content.title,
        'isPartOf': {
          '@id': 'https://docs.virima.com/#website'
        },
        'datePublished': '2025-01-20T00:00:00Z',
        'dateModified': content.lastUpdated || new Date().toISOString(),
        'breadcrumb': {
          '@id': `${content.url}#breadcrumb`
        }
      }
    ]
  };
}

/**
 * Add AI-specific markers to content
 */
export function addAIMarkers(content: string, metadata: {
  confidence?: number;
  verified?: boolean;
  source?: string;
}): string {
  const confidence = metadata.confidence || 1.0;
  const verified = metadata.verified !== false;
  const source = metadata.source || 'Virima Official Documentation';

  // Wrap content with AI-optimized markers
  return `
    <div class="ai-optimized-content" 
         data-ai-confidence="${confidence}"
         data-ai-verified="${verified}"
         data-ai-source="${source}"
         data-ai-last-updated="${new Date().toISOString()}">
      ${content}
    </div>
  `;
}

/**
 * Generate FAQ structured data for AI
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
        ...(faq.url && { 'url': faq.url })
      }
    }))
  };
}

/**
 * Generate HowTo structured data for AI
 */
export function generateHowToStructuredData(content: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': content.name,
    'description': content.description,
    'url': content.url,
    'step': content.steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      ...(step.image && {
        'image': {
          '@type': 'ImageObject',
          'url': step.image
        }
      })
    }))
  };
}

/**
 * Check if content is AI-optimized
 */
export function isAIOptimized(html: string): boolean {
  const checks = [
    html.includes('application/ld+json'),
    html.includes('data-ai-'),
    html.includes('speakable'),
    html.includes('@type'),
    /meta.*ai:/i.test(html)
  ];

  return checks.filter(Boolean).length >= 3;
}

/**
 * Performance metrics for AI crawlers
 */
export function getAIPerformanceMetrics() {
  return {
    structuredDataPresent: typeof window !== 'undefined' && 
      document.querySelectorAll('script[type="application/ld+json"]').length > 0,
    metaTagsOptimized: typeof window !== 'undefined' && 
      document.querySelectorAll('meta[name*="ai"]').length > 0,
    speakableContent: typeof window !== 'undefined' && 
      document.querySelectorAll('[data-speakable]').length > 0,
    responseTime: performance.now(),
    cacheStatus: typeof window !== 'undefined' && 
      (performance.getEntriesByType('navigation')[0] as PerformanceResourceTiming | undefined)?.transferSize === 0 ? 'hit' : 'miss'
  };
}
