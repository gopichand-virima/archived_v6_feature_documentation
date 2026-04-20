import { useState, useEffect, useRef, useCallback } from "react";
import { Resizable } from "re-resizable";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Loader2,
  FileText,
  Globe,
  ExternalLink,
  Copy,
  Check,
  History,
  RefreshCw,
  Trash2,
  MessageSquare,
  Crosshair,
  MousePointer2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  conversationService,
  Message,
} from "../lib/chat/conversation-service";
import { searchDocs } from "../lib/search/docs-search";
import { searchWeb, isWebSearchAvailable } from "../lib/search/web-search";
import {
  classifyIntent,
  buildScopeRejectionMessage,
  buildUnsafeRejectionMessage,
  buildGreetingResponse,
} from "../lib/chat/intent-detection";
import { useTheme } from "../lib/theme/theme-provider";

type SelectionKind = "text" | "element";

type SelectionContext = {
  kind: SelectionKind;
  text: string;
  domPath?: string;
  url: string;
  module?: string;
  page?: string;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
};

function getDomPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const tag = current.tagName.toLowerCase();
    const id = (current as HTMLElement).id ? `#${(current as HTMLElement).id}` : "";
    const classList = (current as HTMLElement).classList;
    const classHint =
      classList && classList.length > 0
        ? "." + Array.from(classList).slice(0, 3).join(".")
        : "";

    let nth = "";
    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c: Element) => c.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        nth = `:nth-of-type(${index})`;
      }
    }

    parts.unshift(`${tag}${id}${classHint}${nth}`);
    current = parent;
    if (id) break; // stable enough
  }

  return parts.join(" > ");
}

function getElementPreviewText(el: HTMLElement): string {
  const aria = el.getAttribute("aria-label");
  if (aria && aria.trim()) return aria.trim();
  const alt = (el as HTMLImageElement).alt;
  if (alt && alt.trim()) return alt.trim();
  const title = el.getAttribute("title");
  if (title && title.trim()) return title.trim();
  const text = (el.innerText || el.textContent || "").trim();
  return text;
}

function unionClientRects(rects: DOMRectList | DOMRect[]): HighlightRect | null {
  const arr = Array.from(rects || []).filter(
    (r) => r && r.width > 0 && r.height > 0,
  );
  if (arr.length === 0) return null;

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  arr.forEach((r) => {
    left = Math.min(left, r.left);
    top = Math.min(top, r.top);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  });

  return {
    left,
    top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

// ── Resizable panel constants ─────────────────────────────────────────────
const CHAT_PANEL_STORAGE_KEY = "virima-chat-panel-size";
const PANEL_DEFAULTS = { width: 380, height: 560 };
const PANEL_MIN_W = 320;
const PANEL_MAX_W = 700;
const PANEL_MIN_H = 400;

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
  onOpenHistory: () => void;
  currentModule?: string;
  currentPage?: string;
  mdxContent?: string;
  initialMessages?: Message[];
}

export function ChatPanel({
  isOpen,
  onClose,
  conversationId: initialConversationId,
  onOpenHistory,
  currentModule,
  currentPage,
  mdxContent: _mdxContent,
  initialMessages,
}: ChatPanelProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const [conversationId, setConversationId] = useState<
    string | null
  >(initialConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionContext, setSelectionContext] =
    useState<SelectionContext | null>(null);
  const [hoverHighlight, setHoverHighlight] =
    useState<HighlightRect | null>(null);
  const [lockedHighlight, setLockedHighlight] =
    useState<HighlightRect | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<
    string | null
  >(null);
  const [showContextBanner, setShowContextBanner] =
    useState(false);
  // Regeneration tracking — tracks retry count for the current assistant response.
  // After regenerationCountRef.current >= 3 a web-search fallback is permitted.
  const regenerationCountRef = useRef(0);
  const [regenerationCount, setRegenerationCount] = useState(0); // triggers re-render only
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRootRef = useRef<HTMLDivElement>(null);
  const selectedElementRef = useRef<HTMLElement | null>(null);

  // ── Resizable panel state ─────────────────────────────────────────────────
  const [panelSize, setPanelSize] = useState(PANEL_DEFAULTS);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // ── Desktop detection + localStorage size restoration ────────────────────
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    try {
      const stored = localStorage.getItem(CHAT_PANEL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { width: number; height: number };
        const maxH = Math.floor(window.innerHeight * 0.9);
        setPanelSize({
          width: Math.min(Math.max(parsed.width, PANEL_MIN_W), PANEL_MAX_W),
          height: Math.min(Math.max(parsed.height, PANEL_MIN_H), maxH),
        });
      }
    } catch {
      // ignore corrupt storage
    }

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Load conversation messages
  useEffect(() => {
    if (conversationId) {
      const conversation =
        conversationService.getConversation(conversationId);
      if (conversation) {
        setMessages(conversation.messages);
      }
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Update conversation ID when prop changes
  useEffect(() => {
    if (initialConversationId) {
      setConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
      if (scrollContainer) {
        // Smooth scroll for initial messages, instant for new messages
        const behavior = showContextBanner ? "smooth" : "auto";
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior,
        });
      }
    }
  }, [messages, showContextBanner]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // ── Minimize-state and stale-state fix ───────────────────────────────────
  // When the panel re-opens always start expanded.
  // When the panel closes reset transient loading/selection state so it
  // cannot leak into the next session.
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    } else {
      setIsLoading(false);
      setIsSelectionMode(false);
      setHoverHighlight(null);
      setLockedHighlight(null);
    }
  }, [isOpen]);

  // ── Live conversation subscription ───────────────────────────────────────
  // Keep the message list in sync when messages are added from outside the
  // panel (e.g., the "Continue chat" button in SearchDialog).
  useEffect(() => {
    const unsubscribe = conversationService.subscribe(() => {
      if (conversationId) {
        const conv = conversationService.getConversation(conversationId);
        if (conv) setMessages(conv.messages);
      }
    });
    return unsubscribe;
  }, [conversationId]);

  // Point & Ask selection mode: capture text or element selection outside the panel
  useEffect(() => {
    if (!isSelectionMode) return;

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";
    setHoverHighlight(null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSelectionMode(false);
      }
    };

    const updateHoverFromTarget = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setHoverHighlight({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label: "Click to select element",
      });
    };

    let rafId: number | null = null;
    const handleMouseMoveCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (panelRootRef.current?.contains(target)) {
        setHoverHighlight(null);
        return;
      }

      // If user is actively selecting text, prefer selection range highlight.
      const sel = window.getSelection?.();
      const selectedText = sel?.toString().trim() || "";
      if (sel && selectedText && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const rect = unionClientRects(range.getClientRects());
        if (rect) {
          setHoverHighlight({ ...rect, label: "Release mouse to capture text" });
        }
        return;
      }

      // Throttle hover updates
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updateHoverFromTarget(target));
    };

    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && panelRootRef.current?.contains(target)) return;

      const selected = window.getSelection?.()?.toString().trim() || "";
      if (!selected) return;

      // Capture selection highlight rect
      const sel = window.getSelection?.();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const rect = unionClientRects(range.getClientRects());
        if (rect) {
          setLockedHighlight({ ...rect, label: "Selected text" });
        }
      }
      selectedElementRef.current = null;
      setSelectionContext({
        kind: "text",
        text: selected,
        url: window.location.href,
        module: currentModule,
        page: currentPage,
      });
      setIsSelectionMode(false);
    };

    const handleClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Allow normal interaction inside the chat panel.
      if (panelRootRef.current?.contains(target)) return;

      // Prevent navigation/side-effects while selecting.
      e.preventDefault();
      e.stopPropagation();

      // If user is selecting text, mouseup handler will capture it.
      const selected = window.getSelection?.()?.toString().trim() || "";
      if (selected) return;

      const preview = getElementPreviewText(target);
      const text = preview.length > 0 ? preview : `<${target.tagName.toLowerCase()}>`;

      const rect = target.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setLockedHighlight({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          label: "Selected element",
        });
      }
      selectedElementRef.current = target;
      setSelectionContext({
        kind: "element",
        text: text.slice(0, 500),
        domPath: getDomPath(target),
        url: window.location.href,
        module: currentModule,
        page: currentPage,
      });
      setIsSelectionMode(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("mousemove", handleMouseMoveCapture, true);

    return () => {
      document.body.style.cursor = previousCursor;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", handleMouseUp, true);
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("mousemove", handleMouseMoveCapture, true);
      if (rafId) cancelAnimationFrame(rafId);
      setHoverHighlight(null);
    };
  }, [isSelectionMode, currentModule, currentPage]);

  // Keep locked highlight aligned for element selections on scroll/resize
  useEffect(() => {
    if (!selectionContext || selectionContext.kind !== "element") return;
    if (!selectedElementRef.current) return;

    const update = () => {
      const el = selectedElementRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      setLockedHighlight((prev) =>
        prev
          ? {
              ...prev,
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }
          : {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              label: "Selected element",
            },
      );
    };

    let raf: number | null = null;
    const onScrollOrResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [selectionContext]);

  // Handle initial messages - create conversation with context
  useEffect(() => {
    if (
      isOpen &&
      initialMessages &&
      initialMessages.length > 0 &&
      !conversationId
    ) {
      // Create a new conversation with the initial messages
      const newConversation =
        conversationService.createConversation(
          initialMessages[0].content,
          initialMessages,
        );
      setConversationId(newConversation.id);
      setMessages(initialMessages);
      setShowContextBanner(true);
    }
  }, [isOpen, initialMessages, conversationId]);

  // Hide context banner after user sends first follow-up
  useEffect(() => {
    if (
      initialMessages &&
      messages.length > initialMessages.length
    ) {
      setShowContextBanner(false);
    }
  }, [messages.length, initialMessages]);

  /**
   * Core message handler — intent-aware, ranked-retrieval, scope-enforced.
   *
   * @param overrideQuery  When provided, re-uses an existing query without
   *                       creating a new user message bubble (used by
   *                       handleRegenerateMessage).
   */
  const handleSendMessage = useCallback(async (overrideQuery?: string) => {
    const rawInput = overrideQuery ?? input;
    if (!rawInput.trim() || isLoading) return;

    const userMessage = rawInput.trim();
    // Only clear the input on a new user message, not on regeneration.
    if (!overrideQuery) {
      setInput("");
      regenerationCountRef.current = 0; // reset retry count for new message
      setRegenerationCount(0);
    }

    // ── Intent classification — 0 tokens, synchronous ─────────────────────
    const intent = classifyIntent(userMessage);

    // Create new conversation if needed
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const newConv = conversationService.createConversation(userMessage);
      currentConversationId = newConv.id;
      setConversationId(currentConversationId);
    }

    // Add user message bubble (only for new messages, not regenerations)
    if (!overrideQuery) {
      conversationService.addMessage(currentConversationId, "user", userMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: `temp_${Date.now()}`,
          role: "user" as const,
          content: userMessage,
          timestamp: new Date(),
        },
      ]);
    }

    setIsLoading(true);

    try {
      // ── Scope enforcement ──────────────────────────────────────────────────
      if (intent.intent === "unsafe") {
        const rejection = buildUnsafeRejectionMessage();
        conversationService.addMessage(currentConversationId, "assistant", rejection);
        const conv = conversationService.getConversation(currentConversationId);
        if (conv) setMessages(conv.messages);
        return;
      }

      // ── Greeting — respond warmly, skip doc retrieval entirely ────────────
      if (intent.intent === "greeting") {
        const greetingReply = buildGreetingResponse(userMessage);
        conversationService.addMessage(currentConversationId, "assistant", greetingReply);
        const conv = conversationService.getConversation(currentConversationId);
        if (conv) setMessages(conv.messages);
        return;
      }

      const webFallbackAllowed =
        regenerationCountRef.current >= 3 && isWebSearchAvailable();
      const explicitlyOutOfScope =
        intent.intent === "out-of-scope" && intent.confidence >= 0.80;

      if (explicitlyOutOfScope && !webFallbackAllowed) {
        const rejection = buildScopeRejectionMessage(userMessage);
        conversationService.addMessage(currentConversationId, "assistant", rejection);
        const conv = conversationService.getConversation(currentConversationId);
        if (conv) setMessages(conv.messages);
        return;
      }

      // ── Ranked documentation retrieval (Ranks 1–3) ─────────────────────────
      const searchQuery = selectionContext
        ? `${userMessage} ${selectionContext.text}`.trim()
        : userMessage;

      const docsResults = await searchDocs(searchQuery);
      const sources: Message["sources"] = [];
      let response = "";

      if (docsResults.length > 0) {
        // Rank 1: Primary match
        const r1 = docsResults[0];
        const breadcrumb = r1.breadcrumb ? `*${r1.breadcrumb}*\n\n` : "";
        const primaryHeadings = r1.headings.slice(0, 4).map(h => `  - ${h}`).join("\n");
        const primaryBlock = [
          `${breadcrumb}**${r1.title}**`,
          r1.excerpt,
          primaryHeadings ? `\n**Key sections:**\n${primaryHeadings}` : "",
        ].filter(Boolean).join("\n");

        sources.push({ title: r1.title, url: r1.filePath, snippet: r1.excerpt, type: "doc" });

        // Ranks 2–3: Related results
        const relatedLines: string[] = [];
        docsResults.slice(1, 3).forEach((r) => {
          sources.push({ title: r.title, url: r.filePath, snippet: r.excerpt, type: "doc" });
          const loc = r.breadcrumb || `${r.moduleLabel}`;
          relatedLines.push(`- **${r.title}** — ${loc}`);
        });

        response = `Based on the Virima 6.1 documentation:\n\n${primaryBlock}`;
        if (relatedLines.length > 0) {
          response += `\n\n---\n**Related documentation:**\n${relatedLines.join("\n")}`;
        }
      } else if (webFallbackAllowed) {
        // Web fallback — only after 3+ regenerations with no doc match
        const webRes = await searchWeb(searchQuery).catch(() => []);
        if (webRes.length > 0) {
          const lines = webRes.slice(0, 3).map((w, i) => {
            sources.push({ title: w.title, url: w.url, snippet: w.description, type: "web" });
            return `${i + 1}. **${w.title}** — ${w.domain}\n   ${w.description}`;
          });
          response =
            `No match found in the 6.1 documentation. The following web results may help:\n\n` +
            lines.join("\n\n") +
            `\n\n*Web results shown after documentation search did not find a match.*`;
        } else {
          response =
            "Documentation search returned no results and web search is unavailable. " +
            "Please rephrase your question.";
        }
      } else {
        response =
          "I could not find specific information about that in the Virima 6.1 documentation. " +
          "Try rephrasing your question, or use ⌘K to browse all published articles.";
      }

      conversationService.addMessage(
        currentConversationId,
        "assistant",
        response,
        sources.length > 0 ? sources : undefined,
      );

      const conv = conversationService.getConversation(currentConversationId);
      if (conv) setMessages(conv.messages);

    } catch (error) {
      console.error("[Ask Virima] Error:", error);
      const errorMsg =
        "I encountered an error while processing your request. Please try again.";
      conversationService.addMessage(currentConversationId, "assistant", errorMsg);
      const conv = conversationService.getConversation(currentConversationId);
      if (conv) setMessages(conv.messages);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, conversationId, selectionContext]);

  /**
   * Regenerate the last assistant response.
   * Increments the retry counter; after 3 retries web-search fallback is enabled.
   */
  const handleRegenerateMessage = useCallback(async () => {
    if (isLoading) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (!lastUserMsg) return;

    regenerationCountRef.current += 1;
    setRegenerationCount(regenerationCountRef.current); // trigger render for button state

    await handleSendMessage(lastUserMsg.content);
  }, [isLoading, messages, handleSendMessage]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (
    messageId: string,
    content: string,
  ) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
  };

  const handleDeleteConversation = () => {
    if (!conversationId) return;

    if (confirm("Delete this conversation?")) {
      conversationService.deleteConversation(conversationId);
      handleNewChat();
    }
  };

  const overlay = (() => {
    if (typeof document === "undefined") return null;
    const rect = isSelectionMode ? hoverHighlight : lockedHighlight;
    if (!rect) return null;

    // Keep overlay below the chat panel (panel is z-50)
    return createPortal(
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 45 }}
      >
        <div
          className="absolute rounded-md"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            border: "2px solid rgba(120, 116, 242, 0.95)",
            background: "rgba(120, 116, 242, 0.12)",
            boxShadow: "0 0 0 4px rgba(120, 116, 242, 0.12)",
          }}
        >
          {rect.label && (
            <div
              className="absolute -top-6 left-0 text-[11px] font-medium px-2 py-1 rounded bg-slate-900 text-white"
              style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.18)" }}
            >
              {rect.label}
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  })();

  const renderMessageContent = (message: Message) => {
    // Render assistant messages as Markdown for readability (tables, lists, headings, code blocks).
    // Keep user messages as plain text to preserve exactly what was typed.
    if (message.role !== "assistant") {
      return (
        <div className="whitespace-pre-wrap break-words text-sm">
          {message.content}
        </div>
      );
    }

    return (
      <div className="text-sm break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // react-markdown is safe by default (HTML is not rendered unless rehypeRaw is used).
          components={{
            h1: ({ children }) => (
              <h1 className="text-base font-semibold mt-2 mb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-semibold mt-3 mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-medium mt-3 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-2 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-2 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-600 hover:decoration-emerald-500 dark:hover:decoration-emerald-400"
              >
                {children}
              </a>
            ),
            code: ({ children, className }) => {
              const isBlock = Boolean(className);
              if (!isBlock) {
                return (
                  <code className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 font-mono text-[0.85em]">
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs my-2">
                  <code className="font-mono">{children}</code>
                </pre>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto my-2">
                <table className="w-full border border-slate-200 dark:border-slate-700 border-collapse text-xs">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-1 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-slate-200 dark:border-slate-700 px-2 py-1 align-top">
                {children}
              </td>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  };

  if (!isOpen) return null;

  // ── Shared panel shell styles ────────────────────────────────────────────
  const sharedBorderColor = isDark ? '#1a1a1a' : '#e2e8f0';
  const sharedBoxShadow = isDark
    ? "0 0 0 1px rgba(255,255,255,0.05), 0 -4px 20px rgba(0,0,0,0.4)"
    : "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)";

  const useResizable = isDesktop && !isMinimized;

  // ── Panel inner content (shared between resizable and fixed layouts) ─────
  const panelContent = (
    <>
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-t-xl"
        style={{
          borderBottom: `1px solid ${isDark ? '#1a1a1a' : '#e2e8f0'}`,
          background: isDark ? '#0a0a0a' : 'linear-gradient(to right, #ecfdf5, #eff6ff)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="20" height="13" viewBox="0 0 50 33" fill="none" aria-hidden="true">
              <path d="M49.9994 15.8871C49.9994 15.8871 45.192 23.4867 37.7038 28.2218C30.2156 32.957 24.4453 32.7994 24.4453 32.7994V26.817C24.4453 26.817 34.5173 25.2958 34.5173 15.8871C34.5173 6.47846 24.9302 6.38938 24.9302 6.38938L24.8194 0.112373C24.8194 0.112373 30.2087 -0.846994 38.4727 3.94984C43.3898 6.75663 47.3901 10.8995 49.9994 15.8871Z" fill="url(#chat_hdr_grad)"/>
              <path d="M23.4202 31.6139V30.0721L22.0694 29.2977L20.7256 30.0721V31.6139L22.0694 32.3814L23.4202 31.6139Z" fill="#55BA63"/>
              <path d="M17.6027 31.436V30.2436L16.5567 29.6475L15.5107 30.2436V31.436L16.5567 32.0322L17.6027 31.436Z" fill="#55BA63"/>
              <path d="M22.0706 27.6191V24.4669L19.3136 22.8907L16.5566 24.4669V27.6191L19.3136 29.1952L22.0706 27.6191Z" fill="#55BA63"/>
              <path d="M15.2192 26.8583V25.2273L13.7922 24.4119L12.3652 25.2273V26.8583L13.7922 27.6737L15.2192 26.8583Z" fill="#55BA63"/>
              <path d="M12.8916 22.3079V20.1905L11.0352 19.1283L9.17871 20.1905V22.3079L11.0352 23.3701L12.8916 22.3079Z" fill="#55BA63"/>
              <path d="M6.9558 22.0682V20.4305L5.51496 19.6082L4.08105 20.4305V22.0682L5.51496 22.8906L6.9558 22.0682Z" fill="#55BA63"/>
              <path d="M5.51397 18.032V14.8798L2.75698 13.3037L0 14.8798V18.032L2.75698 19.6081L5.51397 18.032Z" fill="#55BA63"/>
              <path d="M15.2192 17.2713V15.6404L13.7922 14.825L12.3652 15.6404V17.2713L13.7922 18.0868L15.2192 17.2713Z" fill="#55BA63"/>
              <path d="M7.11471 12.3581V10.734L5.68772 9.91858L4.26074 10.734V12.3581L5.68772 13.1804L7.11471 12.3581Z" fill="#55BA63"/>
              <path d="M13.1825 12.8857V10.4324L11.0351 9.20581L8.8877 10.4324V12.8857L11.0351 14.1123L13.1825 12.8857Z" fill="#55BA63"/>
              <path d="M15.2341 7.68459V6.03997L13.7933 5.21765L12.3594 6.03997V7.68459L13.7933 8.50691L15.2341 7.68459Z" fill="#55BA63"/>
              <path d="M20.6645 7.53384V5.992L19.3137 5.21765L17.9629 5.992V7.53384L19.3137 8.30818L20.6645 7.53384Z" fill="#55BA63"/>
              <path d="M23.4206 3.059V1.07859L21.6888 0.0849609L19.957 1.07859V3.059L21.6888 4.04578L23.4206 3.059Z" fill="#55BA63"/>
              <path d="M25.167 21.5131L29.7319 18.82L29.6696 13.5641L25.1878 16.2023L25.167 21.5131Z" fill="#7DC242"/>
              <path d="M25.1873 16.2025L29.6691 13.5642L25.021 10.9945L20.4561 13.6876L25.1873 16.2025Z" fill="#CBDB2A"/>
              <path d="M20.4561 13.6875L20.5184 18.9435L25.1665 21.5132L25.1873 16.2024L20.4561 13.6875Z" fill="#A4D178"/>
              <defs>
                <radialGradient id="chat_hdr_grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-886.997 -1264.3) rotate(180) scale(1751.86 1748.95)">
                  <stop offset="0.05" stopColor="#B9D877"/>
                  <stop offset="1" stopColor="#32B44A"/>
                </radialGradient>
              </defs>
            </svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" style={{ borderWidth: 1, borderStyle: 'solid', borderColor: isDark ? '#0a0a0a' : '#ffffff' }}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 style={{ color: isDark ? '#ffffff' : '#0f172a' }}>Ask Virima</h3>
            </div>
            {messages.length > 0 && (
              <p className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {messages.length} message
                {messages.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSelectionMode((prev) => !prev)}
            className="h-8 w-8 p-0"
            style={{
              color: isSelectionMode ? (isDark ? '#34d399' : '#047857') : (isDark ? '#94a3b8' : '#475569'),
              backgroundColor: isSelectionMode ? (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') : undefined,
            }}
            title={
              isSelectionMode
                ? "Selection mode active (Esc to cancel)"
                : "Point & Ask: select something on the page"
            }
          >
            <MousePointer2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHistory}
            className="h-8 w-8 p-0"
            style={{ color: isDark ? '#94a3b8' : '#475569' }}
            title="View conversation history"
          >
            <History className="h-4 w-4" />
          </Button>
          {conversationId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteConversation}
              className="h-8 w-8 p-0"
              style={{ color: isDark ? '#94a3b8' : '#475569' }}
              title="Delete conversation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
            style={{ color: isDark ? '#94a3b8' : '#475569' }}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            style={{ color: isDark ? '#94a3b8' : '#475569' }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-hidden"
          >
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <svg width="48" height="32" viewBox="0 0 50 33" fill="none" aria-hidden="true" className="mb-5" style={{ opacity: isDark ? 0.7 : 0.5 }}>
                    <path d="M49.9994 15.8871C49.9994 15.8871 45.192 23.4867 37.7038 28.2218C30.2156 32.957 24.4453 32.7994 24.4453 32.7994V26.817C24.4453 26.817 34.5173 25.2958 34.5173 15.8871C34.5173 6.47846 24.9302 6.38938 24.9302 6.38938L24.8194 0.112373C24.8194 0.112373 30.2087 -0.846994 38.4727 3.94984C43.3898 6.75663 47.3901 10.8995 49.9994 15.8871Z" fill="url(#chat_vlogo_grad)"/>
                    <path d="M23.4202 31.6139V30.0721L22.0694 29.2977L20.7256 30.0721V31.6139L22.0694 32.3814L23.4202 31.6139Z" fill="#55BA63"/>
                    <path d="M17.6027 31.436V30.2436L16.5567 29.6475L15.5107 30.2436V31.436L16.5567 32.0322L17.6027 31.436Z" fill="#55BA63"/>
                    <path d="M22.0706 27.6191V24.4669L19.3136 22.8907L16.5566 24.4669V27.6191L19.3136 29.1952L22.0706 27.6191Z" fill="#55BA63"/>
                    <path d="M15.2192 26.8583V25.2273L13.7922 24.4119L12.3652 25.2273V26.8583L13.7922 27.6737L15.2192 26.8583Z" fill="#55BA63"/>
                    <path d="M12.8916 22.3079V20.1905L11.0352 19.1283L9.17871 20.1905V22.3079L11.0352 23.3701L12.8916 22.3079Z" fill="#55BA63"/>
                    <path d="M6.9558 22.0682V20.4305L5.51496 19.6082L4.08105 20.4305V22.0682L5.51496 22.8906L6.9558 22.0682Z" fill="#55BA63"/>
                    <path d="M5.51397 18.032V14.8798L2.75698 13.3037L0 14.8798V18.032L2.75698 19.6081L5.51397 18.032Z" fill="#55BA63"/>
                    <path d="M15.2192 17.2713V15.6404L13.7922 14.825L12.3652 15.6404V17.2713L13.7922 18.0868L15.2192 17.2713Z" fill="#55BA63"/>
                    <path d="M7.11471 12.3581V10.734L5.68772 9.91858L4.26074 10.734V12.3581L5.68772 13.1804L7.11471 12.3581Z" fill="#55BA63"/>
                    <path d="M13.1825 12.8857V10.4324L11.0351 9.20581L8.8877 10.4324V12.8857L11.0351 14.1123L13.1825 12.8857Z" fill="#55BA63"/>
                    <path d="M15.2341 7.68459V6.03997L13.7933 5.21765L12.3594 6.03997V7.68459L13.7933 8.50691L15.2341 7.68459Z" fill="#55BA63"/>
                    <path d="M20.6645 7.53384V5.992L19.3137 5.21765L17.9629 5.992V7.53384L19.3137 8.30818L20.6645 7.53384Z" fill="#55BA63"/>
                    <path d="M23.4206 3.059V1.07859L21.6888 0.0849609L19.957 1.07859V3.059L21.6888 4.04578L23.4206 3.059Z" fill="#55BA63"/>
                    <path d="M25.167 21.5131L29.7319 18.82L29.6696 13.5641L25.1878 16.2023L25.167 21.5131Z" fill="#7DC242"/>
                    <path d="M25.1873 16.2025L29.6691 13.5642L25.021 10.9945L20.4561 13.6876L25.1873 16.2025Z" fill="#CBDB2A"/>
                    <path d="M20.4561 13.6875L20.5184 18.9435L25.1665 21.5132L25.1873 16.2024L20.4561 13.6875Z" fill="#A4D178"/>
                    <defs>
                      <radialGradient id="chat_vlogo_grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-886.997 -1264.3) rotate(180) scale(1751.86 1748.95)">
                        <stop offset="0.05" stopColor="#B9D877"/>
                        <stop offset="1" stopColor="#32B44A"/>
                      </radialGradient>
                    </defs>
                  </svg>
                  <h4 className="mb-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                    Start a conversation
                  </h4>
                  <p className="text-sm mb-5" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    Ask me anything about Virima documentation,
                    features, or get help with troubleshooting.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Context continuation indicator */}
                  {showContextBanner && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-200">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">
                            Continuing from your search
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setShowContextBanner(false)
                          }
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Your previous Q&A has been preserved —
                        ask follow-up questions below
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#dcfce7' }}>
                          <Bot className="h-4 w-4" style={{ color: isDark ? '#34d399' : '#059669' }} />
                        </div>
                      )}
                      <div
                        className={`flex-1 max-w-[85%] ${
                          message.role === "user"
                            ? "flex justify-end"
                            : ""
                        }`}
                      >
                        <div
                          className="group relative rounded-lg px-4 py-3"
                          style={{
                            backgroundColor: message.role === "user" ? '#059669' : (isDark ? '#1e293b' : '#f1f5f9'),
                            color: message.role === "user" ? '#ffffff' : (isDark ? '#f1f5f9' : '#0f172a'),
                          }}
                        >
                          {renderMessageContent(message)}

                          {/* Sources */}
                          {message.sources &&
                            message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                {message.sources.map(
                                  (source, idx) => (
                                    <a
                                      key={idx}
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-2 text-xs hover:bg-white/50 dark:hover:bg-white/5 rounded p-2 -mx-2 transition-colors"
                                    >
                                      {source.type === "doc" ? (
                                        <FileText className="h-3 w-3 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                      ) : (
                                        <Globe className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="text-slate-900 dark:text-white truncate">
                                          {source.title}
                                        </div>
                                        <div className="text-slate-500 dark:text-slate-400 line-clamp-1">
                                          {source.snippet}
                                        </div>
                                      </div>
                                      <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                                    </a>
                                  ),
                                )}
                              </div>
                            )}

                          {/* Copy button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopyMessage(
                                message.id,
                                message.content,
                              )
                            }
                            className={`absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                              message.role === "user"
                                ? "text-white hover:bg-emerald-700"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div
                          className={`mt-1 text-xs text-slate-500 dark:text-slate-500 ${
                            message.role === "user"
                              ? "text-right"
                              : ""
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>

                        {/* Regenerate button — last assistant message only */}
                        {message.role === "assistant" &&
                          message.id === messages[messages.length - 1]?.id &&
                          !isLoading && (
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRegenerateMessage}
                                className="h-7 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 gap-1"
                                title={
                                  regenerationCount >= 3
                                    ? "Retry with web search fallback"
                                    : `Regenerate response (${3 - regenerationCount} retries before web fallback)`
                                }
                              >
                                <RefreshCw className="h-3 w-3" />
                                {regenerationCount >= 3
                                  ? "Retry with web search"
                                  : "Regenerate"}
                              </Button>
                              {regenerationCount > 0 && (
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  {regenerationCount >= 3
                                    ? "Web search enabled"
                                    : `${regenerationCount} / 3 retries`}
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe' }}>
                          <User className="h-4 w-4" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#dcfce7' }}>
                        <Bot className="h-4 w-4" style={{ color: isDark ? '#34d399' : '#059669' }} />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-lg px-4 py-3 inline-flex items-center gap-2" style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}>
                          <Loader2 className="h-4 w-4 animate-spin" style={{ color: isDark ? '#34d399' : '#059669' }} />
                          <span className="text-sm" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 p-4"
            style={{
              borderTop: `1px solid ${isDark ? '#1a1a1a' : '#e2e8f0'}`,
              backgroundColor: isDark ? '#0a0a0a' : '#f8fafc',
            }}
          >
            {isSelectionMode && (
              <div
                className="mb-3 text-xs rounded-lg px-3 py-2"
                style={{
                  color: isDark ? '#cbd5e1' : '#334155',
                  backgroundColor: isDark ? '#111111' : '#ffffff',
                  borderWidth: 1, borderStyle: 'solid',
                  borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                }}
              >
                <span className="font-medium">Selection mode:</span>{" "}
                click an element or highlight text on the page. Press{" "}
                <span className="font-mono">Esc</span> to cancel.
              </div>
            )}
            {selectionContext && (
              <div
                className="mb-3 rounded-lg px-3 py-2 flex items-start gap-2"
                style={{
                  backgroundColor: isDark ? '#111111' : '#ffffff',
                  borderWidth: 1, borderStyle: 'solid',
                  borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                }}
              >
                <Crosshair className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: isDark ? '#34d399' : '#047857' }} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs mb-1" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    Using selected {selectionContext.kind} context
                    {selectionContext.page
                      ? ` • ${selectionContext.page}`
                      : ""}
                  </div>
                  <div className="text-xs whitespace-pre-wrap break-words line-clamp-3" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                    {selectionContext.text}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectionContext(null);
                    setLockedHighlight(null);
                    selectedElementRef.current = null;
                  }}
                  className="h-7 w-7 p-0"
                  style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  title="Clear selected context"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Virima..."
                className="min-h-[44px] max-h-[120px] resize-none focus:border-emerald-500 focus:ring-emerald-500/20 placeholder:text-slate-400"
                style={{
                  backgroundColor: isDark ? '#111111' : '#ffffff',
                  borderColor: isDark ? '#1a1a1a' : '#cbd5e1',
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="mt-2 w-full text-xs"
                style={{ color: isDark ? '#94a3b8' : '#475569' }}
              >
                Start new conversation
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {overlay}
      {useResizable ? (
        <Resizable
          size={{ width: panelSize.width, height: panelSize.height }}
          minWidth={PANEL_MIN_W}
          maxWidth={PANEL_MAX_W}
          minHeight={PANEL_MIN_H}
          maxHeight={`${Math.floor(window.innerHeight * 0.9)}px`}
          enable={{
            top: true,
            left: true,
            topLeft: true,
            right: false,
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            topRight: false,
          }}
          handleStyles={{
            top: { height: 8, top: 0, cursor: 'n-resize', background: 'transparent', zIndex: 5 },
            left: { width: 8, left: 0, cursor: 'w-resize', background: 'transparent', zIndex: 5 },
            topLeft: { width: 14, height: 14, top: 0, left: 0, cursor: 'nw-resize', background: 'transparent', zIndex: 10 },
          }}
          onResizeStart={() => setIsResizing(true)}
          onResizeStop={(_e, _dir, _el, delta) => {
            const maxH = Math.floor(window.innerHeight * 0.9);
            const newSize = {
              width: Math.min(Math.max(panelSize.width + delta.width, PANEL_MIN_W), PANEL_MAX_W),
              height: Math.min(Math.max(panelSize.height + delta.height, PANEL_MIN_H), maxH),
            };
            setPanelSize(newSize);
            setIsResizing(false);
            try { localStorage.setItem(CHAT_PANEL_STORAGE_KEY, JSON.stringify(newSize)); } catch { /* ignore */ }
          }}
          style={{ position: 'fixed', bottom: '1rem', right: '1.5rem', zIndex: 50 }}
        >
          <div
            ref={panelRootRef}
            className="w-full h-full flex flex-col rounded-t-xl overflow-hidden"
            style={{
              backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: isResizing ? '#10b981' : sharedBorderColor,
              boxShadow: sharedBoxShadow,
            }}
          >
            {panelContent}
          </div>
        </Resizable>
      ) : (
        <div
          ref={panelRootRef}
          className={`fixed z-50 shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${
            isMinimized
              ? "bottom-4 right-6 w-80 h-14 rounded-xl"
              : "bottom-4 right-4 md:right-6 w-[calc(100%-2rem)] md:w-[30vw] md:min-w-[280px] md:max-w-[400px] mx-0 rounded-t-xl"
          }`}
          style={{
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: sharedBorderColor,
            boxShadow: sharedBoxShadow,
            height: isMinimized ? "3.5rem" : "min(600px, calc(100vh - 2rem))",
            maxHeight: isMinimized ? "3.5rem" : "calc(100vh - 2rem)",
          }}
        >
          {panelContent}
        </div>
      )}
    </>
  );
}