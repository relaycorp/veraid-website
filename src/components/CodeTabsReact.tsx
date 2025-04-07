import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyIcon from "../assets/icons/copy.svg?react";
import CheckMarkIcon from "../assets/icons/checkmark.svg?react";

export interface CodeTab {
  label: string;
  language: string;
  code: string;
}

export interface CodeTabsProps {
  tabs: CodeTab[];
}

const BASE_ICON_CLASS = "w-4 h-4";

const getTabClasses = (isActive: boolean): string =>
  `px-4 py-2 text-xs transition-colors ${
    isActive ? "text-white border-b-2 border-white" : "text-neutral-400 hover:text-neutral-200"
  }`;

const CodeTabsReact: React.FC<CodeTabsProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<string>("14px");

  const activeTab = tabs[activeTabIndex];
  const code = activeTab?.code || "";

  // The resize handler makes the syntax highlighter's font size responsive
  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 640 ? "12px" : "14px");
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
    <div className="rounded-md bg-gradient-to-r from-indigo-500 from-10% via-indigo-400 via-30% to-emerald-500 to-90% p-[2px]">
      <div className="rounded-md overflow-hidden bg-black h-full">
        <div className="flex border-b border-neutral-800">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              className={getTabClasses(activeTabIndex === index)}
              onClick={() => setActiveTabIndex(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 relative bg-neutral-950">
          <button
            onClick={copyToClipboard}
            className="absolute right-5 top-5 text-neutral-400 hover:text-white transition-colors z-10 bg-neutral-800 border border-neutral-700 rounded p-1.5 min-w-5 flex flex-col items-center"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <CheckMarkIcon className={BASE_ICON_CLASS} />
                <span className="mt-1 text-xxs">Copied!</span>
              </>
            ) : (
              <CopyIcon className={BASE_ICON_CLASS} />
            )}
          </button>

          <SyntaxHighlighter
            language={(activeTab?.language || "").toLowerCase()}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              fontSize: fontSize,
              lineHeight: "1.5",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeTabsReact;
