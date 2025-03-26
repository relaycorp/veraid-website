import { useState, useEffect } from "react";
import { PrimaryNav } from "./PrimaryNav";
import { SecondaryNav } from "./SecondaryNav";
import { secondaryNavLinks } from "./constants";

export default function TopNav() {
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      if (path.startsWith("/kliento") || path.startsWith("/services/kliento")) {
        setShowSecondaryNav(true);
        setActiveSecondarySection(getActiveSectionFromPath(path));
      } else {
        setShowSecondaryNav(false);
      }
    };

    handleUrlChange();

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
    // Don't set state if we're already on the Kliento page to avoid flicker
    if (currentPath !== "/kliento") {
      // We don't need to manually navigate with window.location.href
      // The PrimaryNav component will use a regular <a> tag with proper href
      setShowSecondaryNav(true);
      setActiveSecondarySection(null);
    }
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
