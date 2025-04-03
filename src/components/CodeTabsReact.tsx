import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import GithubIcon from "../assets/icons/github.svg?react";
import AzureIcon from "../assets/icons/azure.svg?react";
import GCPIcon from "../assets/icons/gcp.svg?react";
import CopyIcon from "../assets/icons/copy.svg?react";
import CheckMarkIcon from "../assets/icons/checkmark.svg?react";

export interface CodeBlock {
  language: string;
  code: string;
}

export interface TabGroup {
  label: string;
  codeBlocks: CodeBlock[];
}

export interface CodeTabsProps {
  tabs: TabGroup[];
  showProviderTabs?: boolean;
}

const BASE_ICON_CLASS = "w-4 h-4";
const PROVIDER_ICON_CLASS = `${BASE_ICON_CLASS} mr-1.5`;

const getTabClasses = (isActive: boolean): string =>
  `px-4 py-2 text-xs transition-colors ${
    isActive ? "text-white border-b-2 border-white" : "text-neutral-400 hover:text-neutral-200"
  }`;

const CodeTabsReact: React.FC<CodeTabsProps> = ({ tabs, showProviderTabs = true }) => {
  const [activeProvider, setActiveProvider] = useState<string>(tabs[0]?.label || "");
  const [activeLanguage, setActiveLanguage] = useState<string>(
    tabs[0]?.codeBlocks[0]?.language || "",
  );
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<string>("14px");

  const activeTab = tabs.find((tab) => tab.label === activeProvider);
  const languages = activeTab?.codeBlocks.map((block) => block.language) || [];

  const codeBlock = activeTab?.codeBlocks.find((block) => block.language === activeLanguage);
  const code = codeBlock?.code || "";

  React.useEffect(() => {
    if (activeTab && !activeTab.codeBlocks.some((block) => block.language === activeLanguage)) {
      setActiveLanguage(activeTab.codeBlocks[0]?.language || "");
    }
  }, [activeProvider, activeTab, activeLanguage]);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 640 ? "12px" : "14px");
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
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
      <div className="rounded-md overflow-hidden bg-neutral-950 h-full">
        {showProviderTabs && (
          <div className="flex border-b border-neutral-800">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={getTabClasses(activeProvider === tab.label)}
                onClick={() => setActiveProvider(tab.label)}
              >
                <div className="flex items-center">
                  {tab.label === "GitHub" && <GithubIcon className={PROVIDER_ICON_CLASS} />}
                  {tab.label === "Azure" && <AzureIcon className={PROVIDER_ICON_CLASS} />}
                  {tab.label === "GCP" && <GCPIcon className={PROVIDER_ICON_CLASS} />}
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex border-b border-neutral-800">
          {languages.map((lang) => (
            <button
              key={lang}
              className={getTabClasses(activeLanguage === lang)}
              onClick={() => setActiveLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="p-4 relative bg-neutral-900">
          <button
            onClick={copyToClipboard}
            className="absolute right-5 top-5 text-neutral-400 hover:text-white transition-colors z-10 bg-neutral-800 rounded p-1.5 min-w-[60px] flex flex-col items-center"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <CheckMarkIcon className={BASE_ICON_CLASS} />
                <span className="mt-1 text-xs">Copied!</span>
              </>
            ) : (
              <CopyIcon className={BASE_ICON_CLASS} />
            )}
          </button>

          <SyntaxHighlighter
            language={activeLanguage.toLowerCase()}
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
