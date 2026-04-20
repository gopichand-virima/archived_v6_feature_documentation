/**
 * Enterprise-level Conversation Service
 * Manages persistent chat history with localStorage
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
    snippet: string;
    type: "doc" | "web";
  }[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
}

const STORAGE_KEY = "virima_conversations";
const MAX_CONVERSATIONS = 100; // Limit to prevent storage issues

class ConversationService {
  private conversations: Conversation[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadConversations();
  }

  /**
   * Load conversations from localStorage
   */
  private loadConversations(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.conversations = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      this.conversations = [];
    }
  }

  /**
   * Save conversations to localStorage
   */
  private saveConversations(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations));
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to save conversations:", error);
    }
  }

  /**
   * Subscribe to conversation changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback());
  }

  /**
   * Generate a title from the first user message
   */
  private generateTitle(firstMessage: string): string {
    const maxLength = 50;
    const cleaned = firstMessage.trim();
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    return cleaned.substring(0, maxLength) + "...";
  }

  /**
   * Create a new conversation
   */
  createConversation(firstMessage?: string, initialMessages?: Message[]): Conversation {
    const now = new Date();
    const conversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: firstMessage ? this.generateTitle(firstMessage) : (initialMessages && initialMessages.length > 0 ? this.generateTitle(initialMessages[0].content) : "New Conversation"),
      messages: initialMessages || [],
      createdAt: now,
      updatedAt: now,
    };

    this.conversations.unshift(conversation);

    // Limit total conversations
    if (this.conversations.length > MAX_CONVERSATIONS) {
      this.conversations = this.conversations.slice(0, MAX_CONVERSATIONS);
    }

    this.saveConversations();
    return conversation;
  }

  /**
   * Get all conversations, sorted by most recent
   */
  getAllConversations(): Conversation[] {
    return [...this.conversations].sort((a, b) => {
      // Pinned conversations first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by updatedAt
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }

  /**
   * Get a specific conversation by ID
   */
  getConversation(id: string): Conversation | undefined {
    return this.conversations.find((conv) => conv.id === id);
  }

  /**
   * Add a message to a conversation
   */
  addMessage(
    conversationId: string,
    role: "user" | "assistant",
    content: string,
    sources?: Message["sources"]
  ): void {
    const conversation = this.conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      sources,
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();

    // Update title if this is the first user message
    if (conversation.messages.length === 1 && role === "user") {
      conversation.title = this.generateTitle(content);
    }

    this.saveConversations();
  }

  /**
   * Update conversation title
   */
  updateTitle(conversationId: string, title: string): void {
    const conversation = this.conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return;

    conversation.title = title;
    conversation.updatedAt = new Date();
    this.saveConversations();
  }

  /**
   * Toggle pin status
   */
  togglePin(conversationId: string): void {
    const conversation = this.conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return;

    conversation.isPinned = !conversation.isPinned;
    this.saveConversations();
  }

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId: string): void {
    this.conversations = this.conversations.filter(
      (conv) => conv.id !== conversationId
    );
    this.saveConversations();
  }

  /**
   * Clear all conversations
   */
  clearAll(): void {
    if (
      confirm(
        "Are you sure you want to delete all conversations? This action cannot be undone."
      )
    ) {
      this.conversations = [];
      this.saveConversations();
    }
  }

  /**
   * Export conversation as JSON
   */
  exportConversation(conversationId: string): void {
    const conversation = this.conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return;

    const dataStr = JSON.stringify(conversation, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `virima_conversation_${conversation.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  /**
   * Search conversations
   */
  searchConversations(query: string): Conversation[] {
    const lowerQuery = query.toLowerCase();
    return this.conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(lowerQuery) ||
        conv.messages.some((msg) =>
          msg.content.toLowerCase().includes(lowerQuery)
        )
    );
  }

  /**
   * Get conversation statistics
   */
  getStats(): {
    totalConversations: number;
    totalMessages: number;
    oldestConversation: Date | null;
    newestConversation: Date | null;
  } {
    return {
      totalConversations: this.conversations.length,
      totalMessages: this.conversations.reduce(
        (sum, conv) => sum + conv.messages.length,
        0
      ),
      oldestConversation:
        this.conversations.length > 0
          ? new Date(
              Math.min(
                ...this.conversations.map((c) => c.createdAt.getTime())
              )
            )
          : null,
      newestConversation:
        this.conversations.length > 0
          ? new Date(
              Math.max(
                ...this.conversations.map((c) => c.createdAt.getTime())
              )
            )
          : null,
    };
  }
}

export const conversationService = new ConversationService();
