import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Clock,
  Calendar,
  FileText,
  Globe,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card } from "./ui/card";
import {
  analyzeConversations,
  ConversationAnalytics,
  getConversationDurations,
} from "../lib/chat/chat-analytics";
import { useTheme } from "../lib/theme/theme-provider";

interface ChatStatisticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatStatistics({ isOpen, onClose }: ChatStatisticsProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(
    null
  );
  const [durations, setDurations] = useState<{
    short: number;
    medium: number;
    long: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = () => {
    const data = analyzeConversations();
    const durationData = getConversationDurations();
    setAnalytics(data);
    setDurations(durationData);
  };

  if (!analytics || !durations) {
    return null;
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}${period}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[85vh] overflow-y-auto"
        style={{
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
          borderColor: isDark ? '#1a1a1a' : undefined,
          color: isDark ? '#f1f5f9' : '#0f172a',
        }}
      >
        <DialogTitle className="flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
          <BarChart3 className="h-5 w-5" style={{ color: isDark ? '#34d399' : '#059669' }} />
          Conversation Analytics
        </DialogTitle>
        <DialogDescription style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          Insights and statistics from your chat history
        </DialogDescription>

        <div className="space-y-6 py-4" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-4 w-4" style={{ color: isDark ? '#34d399' : '#059669' }} />
              </div>
              <div className="text-2xl mb-1" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {analytics.totalConversations}
              </div>
              <div className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Total Conversations</div>
            </Card>

            <Card className="p-4" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-4 w-4" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
              </div>
              <div className="text-2xl mb-1" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {analytics.totalMessages}
              </div>
              <div className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Total Messages</div>
            </Card>

            <Card className="p-4" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-4 w-4" style={{ color: isDark ? '#c084fc' : '#9333ea' }} />
              </div>
              <div className="text-2xl mb-1" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {analytics.averageMessagesPerConversation}
              </div>
              <div className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Avg Messages/Chat</div>
            </Card>

            <Card className="p-4" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-4 w-4" style={{ color: isDark ? '#fb923c' : '#ea580c' }} />
              </div>
              <div className="text-2xl mb-1" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {analytics.averageConversationLength}
              </div>
              <div className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Avg Words/Chat</div>
            </Card>
          </div>

          {/* Activity Patterns */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-5" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                <Calendar className="h-4 w-4" style={{ color: isDark ? '#34d399' : '#059669' }} />
                Activity Patterns
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Most Active Day</span>
                  <span className="text-sm" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                    {analytics.mostActiveDay}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Peak Hour</span>
                  <span className="text-sm" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                    {formatHour(analytics.mostActiveHour)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-5" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                <Clock className="h-4 w-4" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                Conversation Duration
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                      <span>Quick (&lt;5 min)</span>
                      <span>{durations.short}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}>
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${
                            (durations.short / analytics.totalConversations) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                      <span>Medium (5-30 min)</span>
                      <span>{durations.medium}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}>
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            (durations.medium / analytics.totalConversations) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                      <span>Long (&gt;30 min)</span>
                      <span>{durations.long}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}>
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${
                            (durations.long / analytics.totalConversations) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sources Breakdown */}
          <Card className="p-5" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
            <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              <Globe className="h-4 w-4" style={{ color: isDark ? '#c084fc' : '#9333ea' }} />
              Information Sources
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#dcfce7' }}>
                  <FileText className="h-6 w-6" style={{ color: isDark ? '#34d399' : '#059669' }} />
                </div>
                <div>
                  <div className="text-2xl" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                    {analytics.sourcesBreakdown.doc}
                  </div>
                  <div className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    Documentation Sources
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe' }}>
                  <Globe className="h-6 w-6" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                </div>
                <div>
                  <div className="text-2xl" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                    {analytics.sourcesBreakdown.web}
                  </div>
                  <div className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Web Sources</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Top Topics */}
          {analytics.topTopics.length > 0 && (
            <Card className="p-5" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                <TrendingUp className="h-4 w-4" style={{ color: isDark ? '#fb923c' : '#ea580c' }} />
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {analytics.topTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : undefined,
                      background: isDark ? undefined : 'linear-gradient(to right, #ecfdf5, #eff6ff)',
                      borderWidth: 1, borderStyle: 'solid',
                      borderColor: isDark ? '#1a1a1a' : '#a7f3d0',
                      color: isDark ? '#cbd5e1' : '#334155',
                    }}
                  >
                    <span className="capitalize">{topic.topic}</span>
                    <span style={{ color: isDark ? '#34d399' : '#059669' }}>
                      {topic.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conversation Trends */}
          {analytics.conversationTrends.length > 0 && (
            <Card className="p-5" style={{ backgroundColor: isDark ? '#111111' : undefined, borderColor: isDark ? '#1a1a1a' : undefined }}>
              <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                <Activity className="h-4 w-4" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                Activity Trend (Last 30 Days)
              </h3>
              <div className="flex items-end gap-1 h-32">
                {analytics.conversationTrends.map((trend, index) => {
                  const maxCount = Math.max(
                    ...analytics.conversationTrends.map((t) => t.count)
                  );
                  const height = (trend.count / maxCount) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t hover:opacity-80 transition-opacity group relative"
                      style={{ height: `${height}%`, minHeight: "4px" }}
                      title={`${trend.date}: ${trend.count} conversations`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {new Date(trend.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        : {trend.count}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs mt-2" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                <span>
                  {new Date(
                    analytics.conversationTrends[0].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span>
                  {new Date(
                    analytics.conversationTrends[
                      analytics.conversationTrends.length - 1
                    ].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
