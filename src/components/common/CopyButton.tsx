import React, { useState } from "react";
import CopyIcon from "../../assets/icons/copy.svg?react";
import CheckMarkIcon from "../../assets/icons/checkmark.svg?react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  iconSize?: string;
  showCopiedText?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  className = "",
  iconSize = "w-4 h-4",
  showCopiedText = true,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`text-neutral-400 hover:text-white transition-colors z-10 bg-neutral-800 border border-neutral-700 rounded p-1.5 min-w-5 flex flex-col items-center ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <CheckMarkIcon className={iconSize} />
          {showCopiedText && <span className="mt-1 text-xxs">Copied!</span>}
        </>
      ) : (
        <CopyIcon className={iconSize} />
      )}
    </button>
  );
};

export default CopyButton;
