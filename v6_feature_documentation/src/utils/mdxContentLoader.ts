/**
 * MDX Content Loader
 * Loads and parses MDX files for community forum posts and KB articles
 */

// community_forum, kb_articles, support_articles do not yet exist — stub with empty arrays
const communityPostIds: string[] = [];
const kbArticleIds: string[] = [];
const supportArticleIds: string[] = [];
import { getRegisteredContent } from '../lib/content/mdxContentRegistry';

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  avatar: string;
  category: string;
  timestamp: string;
  views: number;
  replies: number;
  likes: number;
  status: 'open' | 'solved' | 'trending';
  tags: string[];
  content: string;
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  module: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  relatedArticles: string[];
  content: string;
  // Support article specific fields
  articleId?: string;
  published?: string;
  modified?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  type?: 'Problem' | 'Solution' | 'Guide';
  excerpt?: string;
}

// Parse frontmatter from MDX content
function parseFrontmatter(content: string): { frontmatter: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterText = match[1];
  const mainContent = match[2];

  // Simple YAML parser for frontmatter
  const frontmatter: any = {};
  const lines = frontmatterText.split('\n');
  let currentKey = '';
  let currentArray: string[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) return;

    // Check for array items
    if (trimmedLine.startsWith('-')) {
      const value = trimmedLine.substring(1).trim();
      currentArray.push(value);
      return;
    }

    // Check for key-value pairs
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex > 0) {
      // Save previous array if exists
      if (currentKey && currentArray.length > 0) {
        frontmatter[currentKey] = currentArray;
        currentArray = [];
      }

      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      
      currentKey = key;

      if (value) {
        // Try to parse as number
        if (!isNaN(Number(value))) {
          frontmatter[key] = Number(value);
        } else {
          frontmatter[key] = value;
        }
      } else {
        // This might be the start of an array
        currentArray = [];
      }
    }
  });

  // Save last array if exists
  if (currentKey && currentArray.length > 0) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, content: mainContent };
}

// Community Forum Post Loader
export async function loadCommunityPost(postId: string): Promise<CommunityPost | null> {
  try {
    // Get content from registry
    const rawContent = getRegisteredContent(`/content/community_forum/${postId}.md`);
    
    if (!rawContent) {
      console.error(`Community post not found: ${postId}`);
      return null;
    }

    const { frontmatter, content } = parseFrontmatter(rawContent);

    return {
      id: frontmatter.id || postId,
      title: frontmatter.title || '',
      author: frontmatter.author || 'Anonymous',
      authorRole: frontmatter.authorRole || 'Community Member',
      avatar: frontmatter.avatar || 'AN',
      category: frontmatter.category || 'general',
      timestamp: frontmatter.timestamp || 'Unknown',
      views: frontmatter.views || 0,
      replies: frontmatter.replies || 0,
      likes: frontmatter.likes || 0,
      status: frontmatter.status || 'open',
      tags: frontmatter.tags || [],
      content: content,
    };
  } catch (error) {
    console.error(`Failed to load community post: ${postId}`, error);
    return null;
  }
}

// Load all community posts
export async function loadAllCommunityPosts(): Promise<CommunityPost[]> {
  const posts = await Promise.all(
    communityPostIds.map((id) => loadCommunityPost(id))
  );

  return posts.filter((post): post is CommunityPost => post !== null);
}

// KB Article Loader
export async function loadKBArticle(articleId: string): Promise<KBArticle | null> {
  try {
    // Try loading actual MDX content first using contentLoader
    const { getContent } = await import('../lib/content/contentLoader');
    
    // Try support articles first
    let rawContent = await getContent(`/content/support_articles/${articleId}.md`);
    // If not found, try KB articles
    if (!rawContent) {
      rawContent = await getContent(`/content/kb_articles/${articleId}.md`);
    }
    
    // Fallback to registry if contentLoader doesn't have the file
    if (!rawContent) {
      rawContent = getRegisteredContent(`/content/support_articles/${articleId}.md`);
      if (!rawContent) {
        rawContent = getRegisteredContent(`/content/kb_articles/${articleId}.md`);
      }
    }
    
    if (!rawContent) {
      console.error(`Article not found: ${articleId}`);
      return null;
    }

    const { frontmatter, content } = parseFrontmatter(rawContent);

    return {
      id: frontmatter.id || articleId,
      title: frontmatter.title || articleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      category: frontmatter.category || '',
      module: frontmatter.module || '',
      difficulty: frontmatter.difficulty || 'Intermediate',
      readTime: frontmatter.readTime || '10 min',
      lastUpdated: frontmatter.lastUpdated || frontmatter.modified || '',
      author: frontmatter.author || 'Virima Team',
      tags: frontmatter.tags || [],
      relatedArticles: frontmatter.relatedArticles || [],
      content: content,
      // Support article fields
      articleId: frontmatter.articleId,
      published: frontmatter.published,
      modified: frontmatter.modified,
      severity: frontmatter.severity,
      type: frontmatter.type,
      excerpt: frontmatter.excerpt,
    };
  } catch (error) {
    console.error(`Failed to load article: ${articleId}`, error);
    return null;
  }
}

// Load all KB articles
export async function loadAllKBArticles(): Promise<KBArticle[]> {
  // Combine both support articles and KB articles
  const allIds = [...supportArticleIds, ...kbArticleIds];
  const articles = await Promise.all(
    allIds.map((id) => loadKBArticle(id))
  );

  return articles.filter((article): article is KBArticle => article !== null);
}

// Get KB articles by category
export async function getKBArticlesByCategory(category: string): Promise<KBArticle[]> {
  const allArticles = await loadAllKBArticles();
  return allArticles.filter((article) => article.category === category);
}

// Get KB articles by module
export async function getKBArticlesByModule(module: string): Promise<KBArticle[]> {
  const allArticles = await loadAllKBArticles();
  return allArticles.filter((article) => article.module === module);
}

// Search KB articles
export async function searchKBArticles(query: string): Promise<KBArticle[]> {
  const allArticles = await loadAllKBArticles();
  const lowerQuery = query.toLowerCase();

  return allArticles.filter((article) => {
    return (
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

// Search community posts
export async function searchCommunityPosts(query: string): Promise<CommunityPost[]> {
  const allPosts = await loadAllCommunityPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
