import { useState, useEffect } from "react";
import { PrimaryNav } from "./PrimaryNav";
import { SecondaryNav } from "./SecondaryNav";
import { secondaryNavLinks } from "./constants";

export default function TopNav() {
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    // Set up a MutationObserver to detect URL changes
    const handleUrlChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      if (path === "/kliento" || path.startsWith("/services/kliento")) {
        setShowSecondaryNav(true);
        setActiveSecondarySection(getActiveSectionFromPath(path));
      } else {
        setShowSecondaryNav(false);
      }
    };

    // Initial check
    handleUrlChange();

    // Set up transition:after event listener for Astro's View Transitions
    document.addEventListener("astro:page-load", handleUrlChange);

    return () => {
      document.removeEventListener("astro:page-load", handleUrlChange);
    };
  }, []);

  const getActiveSectionFromPath = (path: string): string | null => {
    if (path === "/kliento") {
      return null;
    }

    const matchedLink = secondaryNavLinks.find((link) => path === link.href);
    return matchedLink && matchedLink.id ? matchedLink.id : null;
  };

  const handleKlientoClick = () => {
    // The navigation will happen via normal link behavior
    // View Transitions will handle the smooth transition
    setShowSecondaryNav(true);
    setActiveSecondarySection(null);
  };

  return (
    <>
      <PrimaryNav onKlientoClick={handleKlientoClick} />

      {showSecondaryNav && (
        <SecondaryNav
          activeSection={activeSecondarySection}
          setActiveSection={setActiveSecondarySection}
        />
      )}
    </>
  );
}
