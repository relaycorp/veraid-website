import { useState, useEffect } from "react";
import { PrimaryNav } from "./PrimaryNav";
import { SecondaryNav } from "./SecondaryNav";
import { secondaryNavLinks } from "./constants";

export default function TopNav() {
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);

  const getActiveSectionFromPath = (path: string): string | null => {
    if (path === "/kliento") {
      return null;
    }

    const matchedLink = secondaryNavLinks.find((link) => path === link.href);
    return matchedLink && matchedLink.id ? matchedLink.id : null;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;

      if (path === "/kliento" || path.startsWith("/services/kliento")) {
        setShowSecondaryNav(true);
        setActiveSecondarySection(getActiveSectionFromPath(path));
      }
    }
  }, []);

  const handleKlientoClick = () => {
    setShowSecondaryNav(true);
    setActiveSecondarySection(null);

    if (typeof window !== "undefined" && window.location.pathname !== "/kliento") {
      window.location.href = "/kliento";
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
