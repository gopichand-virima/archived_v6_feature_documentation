import { Sparkles, Zap } from "lucide-react";
import { Button } from "./ui/button";
import {
  generateWelcomeMessage,
  getPromptSuggestions,
  getRandomTip,
} from "../lib/chat/welcome-messages";

interface ChatWelcomeProps {
  currentModule?: string;
  currentPage?: string;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatWelcome({
  currentModule,
  currentPage,
  onSuggestionClick,
}: ChatWelcomeProps) {
  const welcomeMessage = generateWelcomeMessage({
    currentModule,
    currentPage,
    isFirstTime: false,
  });

  const suggestions = getPromptSuggestions({ currentModule });
  const tip = getRandomTip();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Welcome Avatar */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h3 className="text-lg text-slate-900">
            Virima AI Assistant
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {welcomeMessage}
          </p>
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="h-3 w-3" />
            <span>Quick suggestions to get started:</span>
          </div>
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSuggestionClick(suggestion)}
                className="justify-start text-left h-auto py-3 px-4 text-sm text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
              >
                <span className="flex-1">{suggestion}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">{tip}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-emerald-600 text-sm mb-1">📚</div>
            <div className="text-xs text-slate-600">Documentation Search</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-blue-600 text-sm mb-1">🌐</div>
            <div className="text-xs text-slate-600">Web Search</div>
          </div>
        </div>
      </div>
    </div>
  );
}
