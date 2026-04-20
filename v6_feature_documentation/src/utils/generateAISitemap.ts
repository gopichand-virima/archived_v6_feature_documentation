/**
 * AI-Optimized Sitemap Generator
 * Generates multiple sitemap formats for maximum AI discovery
 */

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  priority: number;
  title?: string;
  description?: string;
  keywords?: string[];
  category?: string;
}

export class AISitemapGenerator {
  private entries: SitemapEntry[] = [];

  /**
   * Generate standard XML sitemap
   */
  generateXMLSitemap(): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${this.entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  }

  /**
   * Generate AI-specific JSON sitemap
   */
  generateJSONSitemap(): string {
    return JSON.stringify({
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      updateFrequency: 'hourly',
      ai_optimized: true,
      entries: this.entries.map(entry => ({
        url: entry.url,
        title: entry.title,
        description: entry.description,
        keywords: entry.keywords,
        category: entry.category,
        lastModified: entry.lastmod,
        priority: entry.priority,
        changeFrequency: entry.changefreq
      }))
    }, null, 2);
  }

  /**
   * Generate real-time sitemap for immediate indexing
   */
  generateRealtimeSitemap(): string {
    const recentEntries = this.entries
      .filter(e => e.changefreq === 'always' || e.changefreq === 'hourly')
      .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime());

    return JSON.stringify({
      realtime: true,
      lastUpdate: new Date().toISOString(),
      entries: recentEntries
    }, null, 2);
  }

  /**
   * Generate priority sitemap for high-value content
   */
  generatePrioritySitemap(): string {
    const priorityEntries = this.entries
      .filter(e => e.priority >= 0.8)
      .sort((a, b) => b.priority - a.priority);

    return JSON.stringify({
      priority: 'high',
      entries: priorityEntries
    }, null, 2);
  }

  /**
   * Add entry to sitemap
   */
  addEntry(entry: SitemapEntry): void {
    this.entries.push(entry);
  }

  /**
   * Generate all sitemap variants
   */
  generateAll(): { [key: string]: string } {
    return {
      'sitemap.xml': this.generateXMLSitemap(),
      'sitemap-ai.json': this.generateJSONSitemap(),
      'sitemap-realtime.json': this.generateRealtimeSitemap(),
      'sitemap-priority.json': this.generatePrioritySitemap()
    };
  }
}

/**
 * Generate sitemaps for all documentation
 */
export function generateVirimaSitemaps(): { [key: string]: string } {
  const generator = new AISitemapGenerator();
  const now = new Date().toISOString();

  // Home page
  generator.addEntry({
    url: 'https://docs.virima.com',
    lastmod: now,
    changefreq: 'daily',
    priority: 1.0,
    title: 'Virima Documentation - Official Documentation Hub',
    description: 'Comprehensive documentation for Virima IT management platform',
    keywords: ['Virima', 'documentation', 'ITSM', 'CMDB', 'IT management'],
    category: 'Home'
  });

  // Version pages
  const versions = ['NextGen', '6.1.1', '6.1', '5.13'];
  versions.forEach(version => {
    generator.addEntry({
      url: `https://docs.virima.com/${version}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
      title: `Virima ${version} Documentation`,
      description: `Complete documentation for Virima version ${version}`,
      keywords: ['Virima', version, 'documentation'],
      category: 'Version'
    });
  });

  // Admin module pages
  const adminTopics = [
    'organization-details',
    'cost-center',
    'departments',
    'admin-functions'
  ];

  adminTopics.forEach(topic => {
    generator.addEntry({
      url: `https://docs.virima.com/6.1/admin/${topic}`,
      lastmod: now,
      changefreq: 'hourly',
      priority: 0.95,
      title: `Virima Admin - ${topic.replace(/-/g, ' ')}`,
      description: `Detailed guide for ${topic.replace(/-/g, ' ')} in Virima`,
      keywords: ['Virima', 'admin', topic, 'configuration'],
      category: 'Admin'
    });
  });

  // Module landing pages
  const modules = [
    'admin',
    'my-dashboard',
    'cmdb',
    'discovery-scan',
    'itsm',
    'vulnerability-management',
    'itam',
    'self-service',
    'program-project-management',
    'risk-register',
    'reports'
  ];

  modules.forEach(module => {
    generator.addEntry({
      url: `https://docs.virima.com/6.1/${module}`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9,
      title: `Virima ${module.replace(/-/g, ' ')} Module`,
      description: `Complete documentation for Virima ${module.replace(/-/g, ' ')} module`,
      keywords: ['Virima', module, 'documentation'],
      category: 'Module'
    });
  });

  return generator.generateAll();
}
