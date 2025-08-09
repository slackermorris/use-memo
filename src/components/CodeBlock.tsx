import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import "./CodeBlock.css";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  title,
  className = "",
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: "github-dark",
        });
        setHtml(highlighted);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language]);

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg ${className}`}>
      {title && (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h4 className="font-mono text-sm font-medium text-gray-700">
            {title}
          </h4>
        </div>
      )}
      <div
        className="text-sm w-full overflow-x-scroll"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
