/**
 * Chat Analytics Utilities
 * Analyze conversation patterns and provide insights
 */

import { conversationService } from "./conversation-service";

export interface ConversationAnalytics {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  mostActiveDay: string;
  mostActiveHour: number;
  averageConversationLength: number;
  topTopics: { topic: string; count: number }[];
  sourcesBreakdown: { doc: number; web: number };
  conversationTrends: { date: string; count: number }[];
}

/**
 * Analyze all conversations and return insights
 */
export function analyzeConversations(): ConversationAnalytics {
  const conversations = conversationService.getAllConversations();

  if (conversations.length === 0) {
    return {
      totalConversations: 0,
      totalMessages: 0,
      averageMessagesPerConversation: 0,
      mostActiveDay: "N/A",
      mostActiveHour: 0,
      averageConversationLength: 0,
      topTopics: [],
      sourcesBreakdown: { doc: 0, web: 0 },
      conversationTrends: [],
    };
  }

  // Basic metrics
  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.length,
    0
  );
  const averageMessagesPerConversation =
    Math.round((totalMessages / totalConversations) * 10) / 10;

  // Activity patterns
  const dayCount: { [key: string]: number } = {};
  const hourCount: { [key: number]: number } = {};
  const dateCount: { [key: string]: number } = {};

  conversations.forEach((conv) => {
    conv.messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const hour = date.getHours();
      const dateKey = date.toISOString().split("T")[0];

      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
      hourCount[hour] = (hourCount[hour] || 0) + 1;
      dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
    });
  });

  const mostActiveDay =
    Object.keys(dayCount).length > 0
      ? Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  const mostActiveHour =
    Object.keys(hourCount).length > 0
      ? parseInt(
          Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0][0],
          10
        )
      : 0;

  // Conversation trends (last 30 days)
  const conversationTrends = Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  // Average conversation length (in words)
  const totalWords = conversations.reduce((sum, conv) => {
    const words = conv.messages.reduce(
      (msgSum, msg) => msgSum + msg.content.split(/\s+/).length,
      0
    );
    return sum + words;
  }, 0);
  const averageConversationLength = Math.round(totalWords / totalConversations);

  // Top topics (extract keywords from titles)
  const topicCount: { [key: string]: number } = {};
  conversations.forEach((conv) => {
    const words = conv.title
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4); // Only words longer than 4 chars
    words.forEach((word) => {
      topicCount[word] = (topicCount[word] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  // Sources breakdown
  const sourcesBreakdown = { doc: 0, web: 0 };
  conversations.forEach((conv) => {
    conv.messages.forEach((msg) => {
      if (msg.sources) {
        msg.sources.forEach((source) => {
          if (source.type === "doc") sourcesBreakdown.doc++;
          if (source.type === "web") sourcesBreakdown.web++;
        });
      }
    });
  });

  return {
    totalConversations,
    totalMessages,
    averageMessagesPerConversation,
    mostActiveDay,
    mostActiveHour,
    averageConversationLength,
    topTopics,
    sourcesBreakdown,
    conversationTrends,
  };
}

/**
 * Get activity heatmap data
 */
export function getActivityHeatmap(): {
  day: string;
  hour: number;
  count: number;
}[] {
  const conversations = conversationService.getAllConversations();
  const heatmapData: { [key: string]: number } = {};

  conversations.forEach((conv) => {
    conv.messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const hour = date.getHours();
      const key = `${day}-${hour}`;

      heatmapData[key] = (heatmapData[key] || 0) + 1;
    });
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const result: { day: string; hour: number; count: number }[] = [];

  days.forEach((day) => {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`;
      result.push({
        day,
        hour,
        count: heatmapData[key] || 0,
      });
    }
  });

  return result;
}

/**
 * Get conversation duration statistics
 */
export function getConversationDurations(): {
  short: number; // < 5 minutes
  medium: number; // 5-30 minutes
  long: number; // > 30 minutes
} {
  const conversations = conversationService.getAllConversations();
  const durations = { short: 0, medium: 0, long: 0 };

  conversations.forEach((conv) => {
    if (conv.messages.length < 2) {
      durations.short++;
      return;
    }

    const firstMessage = conv.messages[0].timestamp;
    const lastMessage = conv.messages[conv.messages.length - 1].timestamp;
    const durationMinutes =
      (lastMessage.getTime() - firstMessage.getTime()) / 1000 / 60;

    if (durationMinutes < 5) {
      durations.short++;
    } else if (durationMinutes < 30) {
      durations.medium++;
    } else {
      durations.long++;
    }
  });

  return durations;
}
