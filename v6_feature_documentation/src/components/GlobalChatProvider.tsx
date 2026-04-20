import { useState, useEffect } from "react";
import { ChatPanel } from "./ChatPanel";
import { ConversationHistory } from "./ConversationHistory";
import { FloatingChatButton } from "./FloatingChatButton";
import { LoginDialog } from "./LoginDialog";
import { Message } from "../lib/chat/conversation-service";

interface GlobalChatProviderProps {
  currentModule?: string;
  currentPage?: string;
  mdxContent?: string;
  children?: React.ReactNode;
}

export function GlobalChatProvider({
  currentModule,
  currentPage,
  mdxContent,
  children,
}: GlobalChatProviderProps) {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >();
  const [initialMessages, setInitialMessages] = useState<Message[] | undefined>();

  // Keyboard shortcut for chat (Ctrl+Shift+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        setIsChatPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenChat = (messages?: Message[]) => {
    setSelectedConversationId(undefined); // Start new conversation
    setInitialMessages(messages);
    setIsChatPanelOpen(true);
  };

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsChatPanelOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatPanelOpen(false);
    // Reset conversation selection after a delay to allow smooth closing animation
    setTimeout(() => {
      setSelectedConversationId(undefined);
      setInitialMessages(undefined);
    }, 300);
  };

  // Make handleOpenChat available globally
  useEffect(() => {
    (window as any).openGlobalChat = handleOpenChat;
    return () => {
      delete (window as any).openGlobalChat;
    };
  }, []);

  return (
    <>
      {children}

      {/* Floating Chat Button */}
      <FloatingChatButton
        onClick={() => handleOpenChat()}
        onHistoryClick={handleOpenHistory}
      />

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatPanelOpen}
        onClose={handleCloseChat}
        conversationId={selectedConversationId}
        onOpenHistory={handleOpenHistory}
        currentModule={currentModule}
        currentPage={currentPage}
        mdxContent={mdxContent}
        initialMessages={initialMessages}
      />

      {/* Conversation History */}
      <ConversationHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectConversation={handleSelectConversation}
      />

      {/* Login Dialog */}
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </>
  );
}
