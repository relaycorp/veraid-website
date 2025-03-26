import { useState, useEffect } from "react";
import { PrimaryNav } from "./PrimaryNav";
import { SecondaryNav } from "./SecondaryNav";
import { primaryNavLinks, secondaryNavLinks } from "./constants";

export default function TopNav() {
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentService, setCurrentService] = useState<string | null>(null);

  // Find service prefixes dynamically from primaryNavLinks
  const servicePrefixes = primaryNavLinks
    .filter((link) => link.children)
    .flatMap(
      (link) =>
        link.children?.map((child) => ({
          service: child.text,
          prefixes: [`/${child.text.toLowerCase()}`, `/services/${child.text.toLowerCase()}`],
        })) || [],
    );

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      // Determine if we're in a service section and which one
      const matchedService = servicePrefixes.find((service) =>
        service.prefixes.some((prefix) => path.startsWith(prefix)),
      );

      if (matchedService) {
        setShowSecondaryNav(true);
        setCurrentService(matchedService.service);
        setActiveSecondarySection(getActiveSectionFromPath(path));
      } else {
        setShowSecondaryNav(false);
        setCurrentService(null);
      }
    };

    handleUrlChange();

    document.addEventListener("astro:page-load", handleUrlChange);

    return () => {
      document.removeEventListener("astro:page-load", handleUrlChange);
    };
  }, []);

  const getActiveSectionFromPath = (path: string): string | null => {
    // If we're at the root of a service section, don't highlight any specific section
    if (servicePrefixes.some((service) => service.prefixes.includes(path))) {
      return null;
    }

    const matchedLink = secondaryNavLinks.find((link) => path === link.href);
    return matchedLink && matchedLink.id ? matchedLink.id : null;
  };

  const handleServiceClick = (service: string) => {
    // Don't set state if we're already on the service page to avoid flicker
    if (!currentPath.startsWith(`/${service.toLowerCase()}`)) {
      setShowSecondaryNav(true);
      setCurrentService(service);
      setActiveSecondarySection(null);
    }
  };

  return (
    <>
      <PrimaryNav onServiceClick={handleServiceClick} />

      {showSecondaryNav && (
        <SecondaryNav
          currentPath={currentPath}
          activeSection={activeSecondarySection}
          setActiveSection={setActiveSecondarySection}
          currentService={currentService}
        />
      )}
    </>
  );
}
