import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { getContent } from "../lib/content/contentLoader";
import { MDXRenderer } from "./MDXRenderer";

interface GlossaryPageProps {
  onBack: () => void;
}

export function GlossaryPage({ onBack }: GlossaryPageProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const filePath = "/content/glossary.md";
        const glossaryContent = await getContent(filePath);
        if (glossaryContent) {
          setContent(glossaryContent);
        } else {
          console.error("Failed to load glossary content");
        }
      } catch (error) {
        console.error("Error loading glossary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div>
            <h1 className="text-3xl text-slate-900 dark:text-white mb-1">
              Glossary
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Terminology, acronyms, and abbreviations organized by module across Virima V6.1
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-slate-500 dark:text-slate-400">
              Loading glossary...
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <MDXRenderer
                content={content}
                filePath="/content/glossary.md"
              />
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
