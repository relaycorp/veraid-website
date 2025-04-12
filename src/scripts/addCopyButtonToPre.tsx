import React from "react";
import { createRoot } from "react-dom/client";
import CopyButton from "../components/common/CopyButton";

/**
 * Adds copy buttons to all pre tags using the React CopyButton component
 */
export function addCopyButtonsToPre() {
  const preTags = document.querySelectorAll("pre");

  preTags.forEach((pre) => {
    if (pre.querySelector(".copy-button-container")) return;

    pre.classList.add("relative");

    // Create container for React component
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "copy-button-container absolute right-3 top-3";
    pre.appendChild(buttonContainer);

    const codeElement = pre.querySelector("code");
    const textToCopy = codeElement ? codeElement.innerText : pre.innerText;

    // Mount React component using createRoot
    const root = createRoot(buttonContainer);
    root.render(<CopyButton textToCopy={textToCopy} />);
  });
}
