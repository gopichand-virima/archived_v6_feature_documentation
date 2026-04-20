import React from "react";
import {
  BookOpen,
  Search,
  Clock,
  User,
  Tag,
  ArrowLeft,
  ChevronRight,
  Star,
  TrendingUp,
  FileText,
  AlertCircle,
  Zap,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { loadAllKBArticles, loadKBArticle, type KBArticle } from "../utils/mdxContentLoader";
import { MDXRenderer } from "./MDXRenderer";

interface VirimaKnowledgeBaseProps {
  onBack: () => void;
}

const categories = [
  { id: "all", name: "All Articles", icon: FileText, count: 0 },
  { id: "CMDB", name: "CMDB", icon: BookOpen, count: 0 },
  { id: "Discovery", name: "Discovery", icon: Search, count: 0 },
  { id: "ITSM", name: "ITSM", icon: AlertCircle, count: 0 },
  { id: "Security", name: "Security", icon: Zap, count: 0 },
];

const difficultyColors = {
  Beginner: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Intermediate: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Advanced: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

export function VirimaKnowledgeBase({ onBack }: VirimaKnowledgeBaseProps) {
  const [activeView, setActiveView] = useState<"list" | "article">("list");
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KBArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Load all articles on mount
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      const loadedArticles = await loadAllKBArticles();
      setArticles(loadedArticles);
      setFilteredArticles(loadedArticles);
      setLoading(false);
    };

    loadArticles();
  }, []);

  // Filter articles when filters change
  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((article) => article.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, selectedDifficulty, searchQuery]);

  const openArticle = async (articleId: string) => {
    const article = await loadKBArticle(articleId);
    if (article) {
      setSelectedArticle(article);
      setActiveView("article");
    }
  };

  const closeArticle = () => {
    setActiveView("list");
    setSelectedArticle(null);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.icon || FileText;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 dark:from-green-700 dark:via-blue-700 dark:to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl mb-2 tracking-tight">
                Knowledge Base Articles
              </h1>
              <p className="text-xl text-white/90">
                Technical documentation, guides, and best practices for Virima platform
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Total Articles</span>
              </div>
              <div className="text-3xl">{articles.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Most Popular</span>
              </div>
              <div className="text-3xl">CMDB Guide</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Last Updated</span>
              </div>
              <div className="text-3xl">Today</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Avg Rating</span>
              </div>
              <div className="text-3xl">4.8/5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {activeView === "list" ? (
          <>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
                  />
                </div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/20"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading articles...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                  No articles found
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                {/* Results count and RSS feed */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-900 dark:text-white">{filteredArticles.length}</span> results found
                  </div>
                  <a 
                    href="/kb/rss" 
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                    </svg>
                    RSS Feed
                  </a>
                </div>

                {/* Articles List in F5 format */}
                <div className="space-y-4">
                  {filteredArticles.map((article) => {
                    const articleIcon = article.category === 'Security' ? AlertCircle :
                                       article.category === 'Discovery' ? Search :
                                       FileText;
                    
                    return (
                      <div
                        key={article.id}
                        onClick={() => openArticle(article.id)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:border-green-500 dark:hover:border-green-600 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          {/* Article icon */}
                          <div className="flex-shrink-0 mt-1">
                            {React.createElement(articleIcon, { 
                              className: "h-5 w-5 text-slate-400 dark:text-slate-500" 
                            })}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Title and Article ID */}
                            <div className="flex items-start gap-3 mb-2">
                              <h3 className="text-base font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                                {article.title}
                              </h3>
                              {article.articleId && (
                                <span className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                  {article.articleId}
                                </span>
                              )}
                            </div>

                            {/* Excerpt */}
                            {article.excerpt && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {article.excerpt}
                              </p>
                            )}

                            {/* Metadata row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                              {article.category && article.category !== 'General' && (
                                <span className="inline-flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {article.category}
                                </span>
                              )}
                              {article.published && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Published: {article.published}
                                </span>
                              )}
                              {article.modified && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Modified: {article.modified}
                                </span>
                              )}
                              {article.severity && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                                  article.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                  article.severity === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                  article.severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                }`}>
                                  {article.severity}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow icon */}
                          <div className="flex-shrink-0">
                            <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Original grid view kept as backup - can be removed if F5 format is preferred */}
            {false && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => {
                  const Icon = getCategoryIcon(article.category);
                  return (
                    <div
                      key={article.id}
                      onClick={() => openArticle(article.id)}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-500/10"
                    >
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {article.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl text-black-premium dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <span className={`px-2 py-1 rounded-lg ${difficultyColors[article.difficulty]}`}>
                          {article.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-500">
                          Updated {article.lastUpdated}
                        </span>
                        <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Article View */}
            {selectedArticle && (
              <div>
                <button
                  onClick={closeArticle}
                  className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Articles
                </button>

                {/* Article Header */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        {selectedArticle.category && selectedArticle.category !== 'General' && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-sm">
                            {selectedArticle.category}
                          </span>
                        )}
                        {selectedArticle.severity && (
                          <span className={`px-3 py-1.5 rounded-lg text-sm ${
                            selectedArticle.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                            selectedArticle.severity === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                            selectedArticle.severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          }`}>
                            {selectedArticle.severity}
                          </span>
                        )}
                        {!selectedArticle.severity && selectedArticle.difficulty && (
                          <span className={`px-3 py-1.5 rounded-lg text-sm ${difficultyColors[selectedArticle.difficulty]}`}>
                            {selectedArticle.difficulty}
                          </span>
                        )}
                      </div>
                      <h1 className="text-4xl text-black-premium dark:text-white mb-4">
                        {selectedArticle.title}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedArticle.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedArticle.readTime} read
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Updated {selectedArticle.lastUpdated}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-600 rounded-lg">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </Button>
                    <Button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-600 rounded-lg">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful
                    </Button>
                    <Button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-600 rounded-lg">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-600 rounded-lg">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <MDXRenderer 
                      content={selectedArticle.content} 
                      filePath={`/content/support_articles/${selectedArticle.id}.md`}
                    />
                  </div>
                </div>

                {/* Related Articles */}
                {selectedArticle.relatedArticles.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8">
                    <h2 className="text-2xl text-black-premium dark:text-white mb-6">
                      Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedArticle.relatedArticles.map((relatedId) => (
                        <button
                          key={relatedId}
                          onClick={() => openArticle(relatedId)}
                          className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-left"
                        >
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {relatedId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Missing Calendar import
function Calendar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
