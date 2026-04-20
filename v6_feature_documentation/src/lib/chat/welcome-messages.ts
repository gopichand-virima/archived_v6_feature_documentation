/**
 * Welcome Messages for Chat Assistant
 * Generates contextual welcome messages based on user context
 */

export interface WelcomeMessageContext {
  currentModule?: string;
  currentPage?: string;
  timeOfDay?: "morning" | "afternoon" | "evening";
  isFirstTime?: boolean;
}

/**
 * Generate a welcome message based on context
 */
export function generateWelcomeMessage(
  context?: WelcomeMessageContext
): string {
  const { currentModule, currentPage, timeOfDay, isFirstTime } = context || {};

  // Determine time-based greeting
  const greeting = getTimeBasedGreeting(timeOfDay);

  // If first time user
  if (isFirstTime) {
    return `${greeting} Welcome to the Virima AI Assistant! 👋

I'm here to help you navigate the Virima documentation and answer your questions. I can:

✅ Search across all documentation versions
✅ Find information from the web when needed
✅ Provide step-by-step guidance
✅ Explain concepts and features

**What would you like to know about Virima today?**`;
  }

  // If on a specific module/page
  if (currentModule && currentPage) {
    return `${greeting} I see you're viewing **${currentPage}** in the **${currentModule}** module.

How can I assist you with this topic? I can:
- Explain concepts in detail
- Guide you through procedures
- Find related documentation
- Answer specific questions

**What would you like to know?**`;
  }

  if (currentModule) {
    return `${greeting} I see you're exploring the **${currentModule}** module.

I can help you understand features, find specific topics, or guide you through configurations.

**What would you like to know about ${currentModule}?**`;
  }

  // Generic welcome
  return `${greeting} How can I help you today?

I'm your Virima documentation assistant. Ask me anything about:
- Product features and capabilities
- Configuration and setup
- Troubleshooting and best practices
- Version-specific information

**What's on your mind?**`;
}

/**
 * Get time-based greeting
 */
function getTimeBasedGreeting(
  timeOfDay?: "morning" | "afternoon" | "evening"
): string {
  if (timeOfDay) {
    switch (timeOfDay) {
      case "morning":
        return "Good morning! ☀️";
      case "afternoon":
        return "Good afternoon! 👋";
      case "evening":
        return "Good evening! 🌙";
    }
  }

  // Auto-detect based on current time
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! ☀️";
  if (hour < 18) return "Good afternoon! 👋";
  return "Good evening! 🌙";
}

/**
 * Generate quick action suggestions
 */
export function getQuickActions(context?: WelcomeMessageContext): string[] {
  const { currentModule } = context || {};

  const genericActions = [
    "What is Virima?",
    "Tell me about the latest features",
    "How do I get started?",
    "Show me configuration guides",
  ];

  const moduleActions: { [key: string]: string[] } = {
    Admin: [
      "How do I manage users?",
      "Tell me about role-based access",
      "How do I configure system settings?",
      "Show me admin best practices",
    ],
    Discovery: [
      "How does discovery work?",
      "How do I configure discovery?",
      "What devices can be discovered?",
      "Troubleshooting discovery issues",
    ],
    CMDB: [
      "What is CMDB?",
      "How do I manage configuration items?",
      "Tell me about CI relationships",
      "How do I import data into CMDB?",
    ],
    ITAM: [
      "What is IT Asset Management?",
      "How do I track software licenses?",
      "Tell me about asset lifecycle",
      "How do I generate asset reports?",
    ],
    ITSM: [
      "What is IT Service Management?",
      "How do I create incidents?",
      "Tell me about change management",
      "How do I configure workflows?",
    ],
  };

  return currentModule && moduleActions[currentModule]
    ? moduleActions[currentModule]
    : genericActions;
}

/**
 * Generate random helpful tip
 */
export function getRandomTip(): string {
  const tips = [
    "💡 Tip: You can pin important conversations for quick access later.",
    "💡 Tip: Use Ctrl+Shift+C to quickly toggle the chat panel.",
    "💡 Tip: Export conversations as Markdown for easy sharing with your team.",
    "💡 Tip: Check the Analytics view to see your most discussed topics.",
    "💡 Tip: I search both documentation and the web to give you comprehensive answers.",
    "💡 Tip: Your conversation history is saved automatically - you can always come back to it.",
    "💡 Tip: Click on source links to jump directly to the relevant documentation.",
    "💡 Tip: Ask follow-up questions to dive deeper into any topic.",
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Generate contextual prompt suggestions
 */
export function getPromptSuggestions(
  context?: WelcomeMessageContext
): string[] {
  const quickActions = getQuickActions(context);
  // Return 3-4 suggestions
  return quickActions.slice(0, 4);
}
