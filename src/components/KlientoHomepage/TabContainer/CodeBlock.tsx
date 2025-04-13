import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyButton from "../../../components/common/CopyButton";

interface CodeBlockProps {
  code: string;
  language: string;
  showCopyButton?: boolean;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showCopyButton = true,
  className = "",
}) => {
  const [fontSize, setFontSize] = useState<string>("1rem");

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 640 ? "0.75rem" : "1rem");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`relative p-4 w-full ${className}`}>
      {showCopyButton && (
        <div className="absolute top-4 right-3 z-10">
          <CopyButton textToCopy={code} />
        </div>
      )}

      <div className="max-h-[50vh] overflow-auto">
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
    </div>
  );
};

export default CodeBlock;
