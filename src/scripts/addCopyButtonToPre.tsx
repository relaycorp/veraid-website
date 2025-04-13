import React from "react";
import { createRoot } from "react-dom/client";
import CopyButton from "../components/common/CopyButton";

/**
 * Adds copy buttons to all pre tags using the React CopyButton component
 */
export function addCopyButtonsToPre() {
  // Add the CSS only once
  if (!document.getElementById("code-block-copy-styles")) {
    const style = document.createElement("style");
    style.id = "code-block-copy-styles";
    style.textContent = `
      .code-block-wrapper {
        position: relative;
      }
      .code-block-wrapper pre {
        position: relative;
      }
      .code-block-wrapper .copy-button-container {
        position: sticky;
        float: right;
        top: 12px;
        right: 12px;
        z-index: 20;
      }
    `;
    document.head.appendChild(style);
  }

  const preTags = document.querySelectorAll("pre");

  preTags.forEach((pre) => {
    if (pre.querySelector(".copy-button-container")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper relative";
    wrapper.style.position = "relative";
    wrapper.style.display = "block";

    pre.style.position = "relative";
    pre.style.overflow = "auto";
    pre.style.maxWidth = "100%";

    if (pre.parentNode) {
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    } else {
      return;
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "copy-button-container";

    // Style the button container for sticky behavior
    Object.assign(buttonContainer.style, {
      position: "absolute",
      top: "12px",
      right: "16px",
      zIndex: "20",
      pointerEvents: "auto",
    });

    wrapper.insertBefore(buttonContainer, pre);

    const codeElement = pre.querySelector("code");
    const textToCopy = codeElement ? codeElement.innerText : pre.innerText;

    // Mount React component using createRoot
    const root = createRoot(buttonContainer);
    root.render(<CopyButton textToCopy={textToCopy} />);
  });
}
