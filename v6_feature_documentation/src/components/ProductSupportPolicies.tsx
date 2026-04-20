import {
  ArrowLeft,
  Download,
  Printer,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { getContent } from "../lib/content/contentLoader";
import { MDXRenderer } from "./MDXRenderer";

interface ProductSupportPoliciesProps {
  onBack: () => void;
}

export function ProductSupportPolicies({
  onBack,
}: ProductSupportPoliciesProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // Load content directly from the MDX file using contentLoader
        const filePath = "/content/support_policy/product-support-policies.md";
        const policyContent = await getContent(filePath);
        if (policyContent) {
          setContent(policyContent);
        } else {
          console.error("Failed to load product support policies content");
        }
      } catch (error) {
        console.error("Error loading product support policies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "virima-software-support-policy.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Simple Header - No gradient */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-slate-900 dark:text-white mb-1">
                Product Support Policies and Software Lifecycle
                Information
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-slate-500 dark:text-slate-400">
              Loading documentation...
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <MDXRenderer 
                content={content} 
                filePath="/content/support_policy/product-support-policies.md"
              />
            </article>

            {/* Footer - Was this article helpful? */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg text-slate-900 dark:text-white mb-4">
                  Was this article helpful?
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <Button variant="outline" size="sm">
                    Yes
                  </Button>
                  <Button variant="outline" size="sm">
                    No
                  </Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  For technical support inquiries, please
                  contact{" "}
                  <a
                    href="mailto:support@virima.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@virima.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          button, .no-print {
            display: none !important;
          }
          
          .prose {
            max-width: 100% !important;
          }
          
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
          }
          
          table, figure, img {
            page-break-inside: avoid;
          }
          
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
}