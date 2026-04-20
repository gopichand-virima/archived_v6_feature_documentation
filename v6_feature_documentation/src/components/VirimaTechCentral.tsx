import {
  Users,
  Search,
  TrendingUp,
  MessageSquare,
  Eye,
  ThumbsUp,
  Clock,
  Filter,
  Plus,
  ArrowLeft,
  Tag,
  Award,
  Zap,
  Shield,
  Code,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Reply,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { loadAllCommunityPosts, loadCommunityPost, type CommunityPost } from "../utils/mdxContentLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface VirumaTechCentralProps {
  onBack: () => void;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  threads: number;
  posts: number;
}


interface ForumPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isSolution?: boolean;
}

const categories: ForumCategory[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "General topics about Virima platform and IT management",
    icon: MessageSquare,
    color: "from-blue-500 to-blue-600",
    threads: 1247,
    posts: 8934,
  },
  {
    id: "announcements",
    name: "Product Updates & Announcements",
    description: "Latest news, releases, and updates from Virima team",
    icon: Zap,
    color: "from-green-500 to-emerald-600",
    threads: 156,
    posts: 2341,
  },
  {
    id: "technical",
    name: "Technical Support",
    description: "Get help with technical issues and troubleshooting",
    icon: HelpCircle,
    color: "from-orange-500 to-orange-600",
    threads: 892,
    posts: 5673,
  },
  {
    id: "features",
    name: "Feature Requests",
    description: "Suggest new features and vote on existing requests",
    icon: Lightbulb,
    color: "from-purple-500 to-purple-600",
    threads: 543,
    posts: 3210,
  },
  {
    id: "best-practices",
    name: "Best Practices & Tips",
    description: "Share and learn best practices for using Virima",
    icon: Award,
    color: "from-cyan-500 to-cyan-600",
    threads: 678,
    posts: 4521,
  },
  {
    id: "integrations",
    name: "API & Integrations",
    description: "Discuss APIs, integrations, and custom development",
    icon: Code,
    color: "from-indigo-500 to-indigo-600",
    threads: 324,
    posts: 2187,
  },
  {
    id: "security",
    name: "Security & Compliance",
    description: "Security practices, compliance, and vulnerability management",
    icon: Shield,
    color: "from-red-500 to-red-600",
    threads: 234,
    posts: 1456,
  },
  {
    id: "training",
    name: "Training & Resources",
    description: "Training materials, guides, and learning resources",
    icon: BookOpen,
    color: "from-teal-500 to-teal-600",
    threads: 445,
    posts: 2890,
  },
];


const sampleReplies: ForumPost[] = [
  {
    id: "r1",
    author: "Sarah Mitchell",
    authorRole: "Virima Product Manager",
    avatar: "SM",
    content:
      "Thank you all for the incredible feedback! We've been working hard on this release. The new AI-powered discovery features use machine learning to automatically classify assets with 95% accuracy. Performance improvements include 60% faster CMDB queries and optimized discovery scan engine.",
    timestamp: "1 hour ago",
    likes: 45,
  },
  {
    id: "r2",
    author: "John Parker",
    authorRole: "IT Architect",
    avatar: "JP",
    content:
      "This is exactly what we needed! The performance improvements will help us scale to our 50K+ asset environment. Can't wait to test the AI discovery features.",
    timestamp: "45 minutes ago",
    likes: 23,
  },
  {
    id: "r3",
    author: "Rachel Green",
    authorRole: "Senior Engineer",
    avatar: "RG",
    content:
      "Tested the beta and the performance gains are real. Query times reduced from 8s to 3s in our environment. The AI classification is impressively accurate!",
    timestamp: "30 minutes ago",
    likes: 34,
    isSolution: true,
  },
];

export function VirumaTechCentral({ onBack }: VirumaTechCentralProps) {
  const [activeView, setActiveView] = useState<"categories" | "thread">(
    "categories"
  );
  const [selectedThread, setSelectedThread] = useState<CommunityPost | null>(
    null
  );
  const [threads, setThreads] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "solved">(
    "all"
  );
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const loadedPosts = await loadAllCommunityPosts();
      setThreads(loadedPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const openThread = async (postId: string) => {
    const post = await loadCommunityPost(postId);
    if (post) {
      setSelectedThread(post);
      setActiveView("thread");
    }
  };

  const closeThread = () => {
    setActiveView("categories");
    setSelectedThread(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "trending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            Trending
          </span>
        );
      case "solved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
            <CheckCircle className="h-3.5 w-3.5" />
            Solved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm">
            <MessageSquare className="h-3.5 w-3.5" />
            Open
          </span>
        );
    }
  };

  const filteredThreads = threads.filter((thread) => {
    if (filterStatus !== "all" && thread.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      return (
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 text-white">
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
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl mb-2 tracking-tight">
                Virima Tech Central
              </h1>
              <p className="text-xl text-white/90">
                Product Community Forum & Discussions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Active Members</span>
              </div>
              <div className="text-3xl">12,458</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Total Threads</span>
              </div>
              <div className="text-3xl">4,519</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Reply className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Total Posts</span>
              </div>
              <div className="text-3xl">31,212</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Active Today</span>
              </div>
              <div className="text-3xl">847</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {activeView === "categories" ? (
          <>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search discussions, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "open" | "solved"
                      )
                    }
                    className="px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="solved">Solved</option>
                  </select>
                  <Button className="px-6 py-4 h-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/20">
                    <Plus className="h-5 w-5 mr-2" />
                    New Thread
                  </Button>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="mb-12">
              <h2 className="text-3xl text-black-premium dark:text-white mb-6">
                Forum Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-500/10"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg text-black-premium dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                        <span>{category.threads} threads</span>
                        <span>•</span>
                        <span>{category.posts} posts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trending Discussions */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl text-black-premium dark:text-white">
                  {searchQuery
                    ? "Search Results"
                    : "Trending Discussions"}
                </h2>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Filter className="h-5 w-5" />
                  <span>Sort by: Latest Activity</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">Loading discussions...</p>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                    No discussions found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => openThread(thread.id)}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-500/10"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                          {thread.avatar}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-xl text-black-premium dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {thread.title}
                            </h3>
                            {getStatusBadge(thread.status)}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <span className="text-black-premium dark:text-white">
                              {thread.author}
                            </span>
                            <span>•</span>
                            <span>{thread.authorRole}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {thread.timestamp}
                            </span>
                          </div>

                          <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                            {thread.content}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {thread.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm"
                              >
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              {thread.views} views
                            </span>
                            <span className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              {thread.replies} replies
                            </span>
                            <span className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />
                              {thread.likes} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Thread View */}
            {selectedThread && (
              <div>
                <button
                  onClick={closeThread}
                  className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Discussions
                </button>

                {/* Thread Header */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-4xl text-black-premium dark:text-white pr-8">
                      {selectedThread.title}
                    </h1>
                    {getStatusBadge(selectedThread.status)}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg text-lg">
                      {selectedThread.avatar}
                    </div>
                    <div>
                      <div className="text-lg text-black-premium dark:text-white">
                        {selectedThread.author}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedThread.authorRole} •{" "}
                        {selectedThread.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedThread.content}
                    </ReactMarkdown>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {selectedThread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                      <span>{selectedThread.likes}</span>
                    </button>
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MessageSquare className="h-5 w-5" />
                      {selectedThread.replies} replies
                    </span>
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Eye className="h-5 w-5" />
                      {selectedThread.views} views
                    </span>
                  </div>
                </div>

                {/* Replies */}
                <div className="mb-8">
                  <h2 className="text-2xl text-black-premium dark:text-white mb-6">
                    {sampleReplies.length} Replies
                  </h2>

                  <div className="space-y-4">
                    {sampleReplies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 ${
                          reply.isSolution
                            ? "border-green-300 dark:border-green-700 shadow-lg shadow-green-500/10"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {reply.isSolution && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">
                              Accepted Solution
                            </span>
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            {reply.avatar}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg text-black-premium dark:text-white">
                                {reply.author}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                • {reply.authorRole}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-500">
                                • {reply.timestamp}
                              </span>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                              {reply.content}
                            </p>

                            <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                  <h3 className="text-xl text-black-premium dark:text-white mb-4">
                    Post a Reply
                  </h3>
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Share your thoughts, solutions, or questions..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 resize-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500 dark:text-slate-500">
                      Be respectful and constructive
                    </span>
                    <Button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/20">
                      <Send className="h-4 w-4 mr-2" />
                      Post Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
