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
  iconSize = "w-3.5 h-3.5",
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
      className={`text-neutral-400 hover:text-white transition-colors z-10 bg-neutral-700 rounded p-1 flex items-center ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          {showCopiedText && <span className="mr-1.5 text-xxs">Copied!</span>}
          <CheckMarkIcon className={iconSize} />
        </>
      ) : (
        <CopyIcon className={iconSize} />
      )}
    </button>
  );
};

export default CopyButton;
