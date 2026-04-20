import { useState, useEffect } from "react";
import { MessageSquare, History, Search, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

export function ChatOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem(
      "virima_chat_onboarding_seen"
    );
    if (!hasSeenOnboarding) {
      // Show onboarding after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to Virima AI Assistant",
      description:
        "Your intelligent companion for navigating Virima documentation. Get instant answers, search across all docs, and access web resources.",
      icon: MessageSquare,
      color: "from-emerald-500 to-blue-500",
    },
    {
      title: "Start a Conversation",
      description:
        "Click the floating chat button in the bottom-right corner anytime you need help. Or use Ctrl+Shift+C for quick access.",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "View Your History",
      description:
        "All your conversations are automatically saved. Access them anytime from the history panel to resume where you left off.",
      icon: History,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Smart Search Integration",
      description:
        "The assistant searches both Virima documentation and the web to provide comprehensive answers with clickable sources.",
      icon: Search,
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("virima_chat_onboarding_seen", "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Chat Assistant Onboarding
        </DialogTitle>
        <DialogDescription className="sr-only">
          Learn how to use the Virima AI Assistant
        </DialogDescription>

        {/* Header with gradient */}
        <div
          className={`relative h-32 bg-gradient-to-br ${currentStepData.color} flex items-center justify-center`}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <currentStepData.icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl text-slate-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-gradient-to-r " + currentStepData.color
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-slate-600 hover:text-slate-900"
            >
              Skip
            </Button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-slate-300"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                className={`bg-gradient-to-r ${currentStepData.color} text-white hover:opacity-90`}
              >
                {currentStep < steps.length - 1 ? "Next" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}