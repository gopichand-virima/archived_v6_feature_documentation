import { useState, useEffect } from "react";
import { MessageSquare, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { conversationService } from "../lib/chat/conversation-service";

interface FloatingChatButtonProps {
  onClick: () => void;
  onHistoryClick: () => void;
}

export function FloatingChatButton({
  onClick,
  onHistoryClick,
}: FloatingChatButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasUnreadIndicator, setHasUnreadIndicator] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);

  useEffect(() => {
    // Show button after a short delay for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update conversation count
    const updateCount = () => {
      const conversations = conversationService.getAllConversations();
      setConversationCount(conversations.length);
    };

    updateCount();
    const unsubscribe = conversationService.subscribe(updateCount);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Show tooltip on first visit
    const hasSeenTooltip = localStorage.getItem("virima_chat_tooltip_seen");
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem("virima_chat_tooltip_seen", "true");
        }, 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClick = () => {
    setHasUnreadIndicator(false);
    onClick();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Tooltip */}
        {showTooltip && (
          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#3db553' }} />
                <div>
                  <p className="text-sm font-medium mb-1">
                    Need help? Ask Virima AI!
                  </p>
                  <p className="text-xs text-slate-300">
                    Get instant answers from documentation and the web
                  </p>
                </div>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-slate-900 rotate-45"></div>
          </div>
        )}

        {/* Quick access to history if there are conversations */}
        {conversationCount > 0 && (
          <button
            onClick={onHistoryClick}
            className="group bg-white hover:bg-slate-50 px-3 py-2 rounded-full shadow-lg border transition-all hover:scale-105 flex items-center gap-2 text-sm"
            style={{
              borderColor: '#e2e8f0',
              color: '#334155',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3db553';
              const icon = e.currentTarget.querySelector('svg');
              const span = e.currentTarget.querySelector('span');
              if (icon) icon.style.color = '#3db553';
              if (span) span.style.color = '#3db553';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              const icon = e.currentTarget.querySelector('svg');
              const span = e.currentTarget.querySelector('span');
              if (icon) icon.style.color = '#64748b';
              if (span) span.style.color = '#334155';
            }}
          >
            <MessageSquare className="h-4 w-4 transition-colors" style={{ color: '#64748b' }} />
            <span className="transition-colors">
              {conversationCount} chat{conversationCount !== 1 ? "s" : ""}
            </span>
          </button>
        )}

        {/* Main Chat Button */}
        <Button
          onClick={handleClick}
          className="relative h-14 w-14 rounded-full shadow-2xl text-white transition-all hover:scale-110 group"
          style={{
            background: "linear-gradient(to right, #3db553, #2e9141)",
            boxShadow:
              "0 10px 25px -5px rgba(61, 181, 83, 0.4), 0 8px 10px -6px rgba(61, 181, 83, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(to right, #2e9141, #267a37)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(to right, #3db553, #2e9141)";
          }}
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
          
          {/* Unread indicator */}
          {hasUnreadIndicator && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></div>
          )}

          {/* Pulse effect */}
          <div className="absolute inset-[12.5%] rounded-full opacity-25 group-hover:opacity-40 transition-opacity duration-700 animate-[ping_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{
            background: "linear-gradient(to bottom right, rgba(61, 181, 83, 0.6), rgba(46, 145, 65, 0.6), rgba(38, 122, 55, 0.6))"
          }}></div>
        </Button>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-24 right-6 z-30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded text-xs backdrop-blur-sm">
          Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Ctrl</kbd> +{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Shift</kbd> +{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">C</kbd>
        </div>
      </div>
    </>
  );
}