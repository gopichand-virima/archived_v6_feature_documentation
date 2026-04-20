import { useState, useEffect } from "react";
import {
  Search,
  Pin,
  Trash2,
  MessageSquare,
  Calendar,
  Clock,
  BarChart3,
  Loader2,
  FileText,
  Globe,
  ChevronRight,
  FileDown,
  MoreVertical,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  conversationService,
  Conversation,
} from "../lib/chat/conversation-service";
import {
  exportAsMarkdown,
  exportAsHTML,
  exportAsText,
} from "../lib/chat/chat-export";
import { ChatSettings } from "./ChatSettings";
import { ChatStatistics } from "./ChatStatistics";
import { useTheme } from "../lib/theme/theme-provider";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

/** Strip markdown syntax for plain-text previews in the history list. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')        // **bold**
    .replace(/\*(.+?)\*/g, '$1')             // *italic*
    .replace(/`{1,3}[^`]*`{1,3}/g, '')       // `code` / ```block```
    .replace(/^#{1,6}\s+/gm, '')             // ## headings
    .replace(/^[-*_]{3,}\s*$/gm, '')         // --- dividers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url)
    .replace(/^[-*+]\s+/gm, '')              // - list items
    .replace(/^\d+\.\s+/gm, '')              // 1. numbered lists
    .replace(/>\s?/g, '')                    // > blockquotes
    .replace(/\n{2,}/g, ' ')                 // collapse blank lines
    .replace(/\n/g, ' ')                     // newlines → space
    .trim();
}

export function ConversationHistory({
  isOpen,
  onClose,
  onSelectConversation,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<ReturnType<
    typeof conversationService.getStats
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  useEffect(() => {
    if (isOpen) {
      loadConversations();
      loadStats();
    }
  }, [isOpen]);

  useEffect(() => {
    // Subscribe to conversation changes
    const unsubscribe = conversationService.subscribe(() => {
      loadConversations();
      loadStats();
    });

    return unsubscribe;
  }, []);

  const loadConversations = () => {
    setIsLoading(true);
    try {
      const allConversations =
        conversationService.getAllConversations();
      setConversations(allConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = () => {
    const statsData = conversationService.getStats();
    setStats(statsData);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results =
        conversationService.searchConversations(query);
      setConversations(results);
    } else {
      loadConversations();
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId);
    onClose();
  };

  const handleTogglePin = (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    conversationService.togglePin(conversationId);
    loadConversations();
  };

  const handleDeleteConversation = (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (
      confirm(
        "Delete this conversation? This action cannot be undone.",
      )
    ) {
      conversationService.deleteConversation(conversationId);
      loadConversations();
      loadStats();
    }
  };

  const handleExportConversation = (
    conversationId: string,
    format: "json" | "markdown" | "html" | "text",
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const conversation =
      conversationService.getConversation(conversationId);
    if (!conversation) return;

    switch (format) {
      case "json":
        conversationService.exportConversation(conversationId);
        break;
      case "markdown":
        exportAsMarkdown(conversation);
        break;
      case "html":
        exportAsHTML(conversation);
        break;
      case "text":
        exportAsText(conversation);
        break;
    }
  };

  const handleClearAll = () => {
    conversationService.clearAll();
    loadConversations();
    loadStats();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  };

  const groupConversationsByDate = (convs: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {
      Pinned: [],
      Today: [],
      Yesterday: [],
      "Last 7 days": [],
      "Last 30 days": [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    convs.forEach((conv) => {
      if (conv.isPinned) {
        groups.Pinned.push(conv);
        return;
      }

      const convDate = new Date(conv.updatedAt);
      const convDay = new Date(
        convDate.getFullYear(),
        convDate.getMonth(),
        convDate.getDate(),
      );

      const diffTime = today.getTime() - convDay.getTime();
      const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24),
      );

      if (convDay.getTime() === today.getTime()) {
        groups.Today.push(conv);
      } else if (convDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(conv);
      } else if (diffDays < 7) {
        groups["Last 7 days"].push(conv);
      } else if (diffDays < 30) {
        groups["Last 30 days"].push(conv);
      } else {
        groups.Older.push(conv);
      }
    });

    // Remove empty groups
    return Object.entries(groups).filter(
      ([_, convs]) => convs.length > 0,
    );
  };

  const groupedConversations =
    groupConversationsByDate(conversations);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden flex flex-col"
        style={{
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
          borderColor: isDark ? '#1a1a1a' : undefined,
        }}
      >
        <DialogTitle className="sr-only">
          Conversation History
        </DialogTitle>
        <DialogDescription className="sr-only">
          View and manage your past conversations with Virima
          Assistant
        </DialogDescription>

        {/* Header */}
        <div
          className="flex-shrink-0 px-6 pt-6 pb-4"
          style={{
            borderBottom: `1px solid ${isDark ? '#1a1a1a' : '#e2e8f0'}`,
            background: isDark ? '#0a0a0a' : 'linear-gradient(to right, #ecfdf5, #eff6ff)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#dcfce7' }}>
                <MessageSquare className="h-5 w-5" style={{ color: isDark ? '#34d399' : '#059669' }} />
              </div>
              <div>
                <h2 style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                  Conversation History
                </h2>
                <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  Resume or review your past conversations
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 w-8 p-0"
                style={{ color: isDark ? '#94a3b8' : '#475569' }}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 focus:border-emerald-500 focus:ring-emerald-500/20"
              style={{
                backgroundColor: isDark ? '#111111' : '#ffffff',
                borderColor: isDark ? '#1a1a1a' : '#cbd5e1',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
            />
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: isDark ? '#111111' : '#ffffff', borderWidth: 1, borderStyle: 'solid', borderColor: isDark ? '#1a1a1a' : '#e2e8f0' }}>
                  <div className="flex items-center gap-2 mb-1" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    <MessageSquare className="h-3 w-3" />
                    <span className="text-xs">Conversations</span>
                  </div>
                  <div style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    {stats.totalConversations}
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: isDark ? '#111111' : '#ffffff', borderWidth: 1, borderStyle: 'solid', borderColor: isDark ? '#1a1a1a' : '#e2e8f0' }}>
                  <div className="flex items-center gap-2 mb-1" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    <BarChart3 className="h-3 w-3" />
                    <span className="text-xs">Messages</span>
                  </div>
                  <div style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    {stats.totalMessages}
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: isDark ? '#111111' : '#ffffff', borderWidth: 1, borderStyle: 'solid', borderColor: isDark ? '#1a1a1a' : '#e2e8f0' }}>
                  <div className="flex items-center gap-2 mb-1" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">Since</span>
                  </div>
                  <div className="text-sm" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    {stats.oldestConversation
                      ? stats.oldestConversation.toLocaleDateString(
                          [],
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsStatsOpen(true)}
                className="w-full mt-3"
                style={{
                  color: isDark ? '#34d399' : '#059669',
                  borderColor: isDark ? '#1a1a1a' : '#a7f3d0',
                  backgroundColor: isDark ? '#111111' : undefined,
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          )}
        </div>

        {/* Wrapper div owns the flex sizing; ScrollArea fills it with h-full.
            This is more reliable than flex-1 min-h-0 directly on a Radix Root
            across production builds where percentage-height resolution differs. */}
        <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: isDark ? '#34d399' : '#059669' }} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: isDark ? '#475569' : '#cbd5e1' }} />
                <h3 className="mb-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </h3>
                <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  {searchQuery
                    ? "Try a different search term"
                    : "Start chatting with the Virima Assistant to see your conversation history here"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedConversations.map(([group, convs]) => (
                  <div key={group}>
                    <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                      {group}
                    </h3>
                    <div className="space-y-2">
                      {convs.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() =>
                            handleSelectConversation(
                              conversation.id,
                            )
                          }
                          className="group rounded-lg p-4 transition-all cursor-pointer"
                          style={{
                            backgroundColor: isDark ? '#111111' : '#ffffff',
                            borderWidth: 1, borderStyle: 'solid',
                            borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="truncate" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                                  {conversation.title}
                                </h4>
                                {conversation.isPinned && (
                                  <Pin className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {conversation.messages.length}{" "}
                                  message
                                  {conversation.messages
                                    .length !== 1
                                    ? "s"
                                    : ""}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(
                                    conversation.updatedAt,
                                  )}
                                </div>
                              </div>

                              {conversation.messages.length >
                                0 && (
                                <div className="mt-2 text-sm line-clamp-2" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                                  {stripMarkdown(
                                    conversation.messages[
                                      conversation.messages.length - 1
                                    ].content
                                  )}
                                </div>
                              )}

                              <div className="mt-2 flex items-center gap-2">
                                {conversation.messages.some(
                                  (m) =>
                                    m.sources?.some(
                                      (s) => s.type === "doc",
                                    ),
                                ) && (
                                  <div className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ color: isDark ? '#34d399' : '#059669', backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5' }}>
                                    <FileText className="h-3 w-3" />
                                    Docs
                                  </div>
                                )}
                                {conversation.messages.some(
                                  (m) =>
                                    m.sources?.some(
                                      (s) => s.type === "web",
                                    ),
                                ) && (
                                  <div className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ color: isDark ? '#60a5fa' : '#2563eb', backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff' }}>
                                    <Globe className="h-3 w-3" />
                                    Web
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) =>
                                  handleTogglePin(
                                    conversation.id,
                                    e,
                                  )
                                }
                                className="h-7 w-7 p-0"
                                style={{ color: conversation.isPinned ? (isDark ? '#34d399' : '#059669') : (isDark ? '#94a3b8' : '#475569') }}
                                title={
                                  conversation.isPinned
                                    ? "Unpin"
                                    : "Pin to top"
                                }
                              >
                                <Pin className="h-3 w-3" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="h-7 w-7 p-0"
                                    style={{ color: isDark ? '#94a3b8' : '#475569' }}
                                    title="More options"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "json",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as JSON
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "markdown",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as Markdown
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "html",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as HTML
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleExportConversation(
                                        conversation.id,
                                        "text",
                                        e,
                                      )
                                    }
                                  >
                                    <FileDown className="h-3 w-3 mr-2" />
                                    Export as Text
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleDeleteConversation(
                                        conversation.id,
                                        e,
                                      )
                                    }
                                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <ChevronRight className="h-4 w-4 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1" style={{ color: isDark ? '#475569' : '#94a3b8' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        </div>

        {conversations.length > 0 && (
          <div
            className="flex-shrink-0 px-6 py-4"
            style={{
              borderTop: `1px solid ${isDark ? '#1a1a1a' : '#e2e8f0'}`,
              backgroundColor: isDark ? '#0a0a0a' : '#f8fafc',
            }}
          >
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="w-full"
              style={{
                color: isDark ? '#f87171' : '#dc2626',
                borderColor: isDark ? '#7f1d1d' : '#fecaca',
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Conversations
            </Button>
          </div>
        )}
      </DialogContent>
      
      {/* Settings Dialog */}
      <ChatSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      {/* Statistics Dialog */}
      <ChatStatistics
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </Dialog>
  );
}