import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyIcon from "../../../assets/icons/copy.svg?react";
import CheckMarkIcon from "../../../assets/icons/checkmark.svg?react";

interface CodeBlockProps {
  code: string;
  language: string;
  showCopyButton?: boolean;
  className?: string;
}

const COPY_CHECKMARK_ICON_CLASS = "w-4 h-4";

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showCopyButton = true,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<string>("1rem");

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 640 ? "0.75rem" : "1rem");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`p-4 relative max-h-[80vh] overflow-y-auto w-full ${className}`}>
      {showCopyButton && (
        <button
          onClick={copyToClipboard}
          className="absolute right-5 top-5 text-neutral-400 hover:text-white transition-colors z-10 bg-neutral-800 border border-neutral-700 rounded p-1.5 min-w-5 flex flex-col items-center"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <CheckMarkIcon className={COPY_CHECKMARK_ICON_CLASS} />
              <span className="mt-1 text-xxs">Copied!</span>
            </>
          ) : (
            <CopyIcon className={COPY_CHECKMARK_ICON_CLASS} />
          )}
        </button>
      )}

      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: 0,
          background: "transparent",
          fontSize: fontSize,
          lineHeight: "1.5",
        }}
        codeTagProps={{ style: { fontSize: "inherit" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
