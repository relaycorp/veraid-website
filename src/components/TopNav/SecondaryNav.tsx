import { useState, useEffect } from "react";
import klientoLogo from "../../assets/images/kliento-logo.png";
import { secondaryNavLinks } from "./constants";
import { useNavigation } from "./hooks";
import { MobileMenuToggle } from "./MobileMenuToggle";

interface SecondaryNavProps {
  currentService: string;
  activeSection?: string | null;
}

export function SecondaryNav({ currentService, activeSection }: SecondaryNavProps) {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [localActiveSection, setLocalActiveSection] = useState<string | null>(
    activeSection || null,
  );
  const { currentPath } = useNavigation();

  const serviceLinks = secondaryNavLinks.filter((link) =>
    link.href.includes(currentService.toLowerCase()),
  );

  const secondaryNavLinkClass = {
    active: "text-indigo-300",
    inactive: "text-white hover:text-indigo-400",
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const matchedLink = secondaryNavLinks.find((link) => path === link.href);
      if (matchedLink && matchedLink.id) {
        setLocalActiveSection(matchedLink.id);
      }
    };

    handleUrlChange();
    document.addEventListener("astro:page-load", handleUrlChange);

    return () => {
      document.removeEventListener("astro:page-load", handleUrlChange);
    };
  }, []);

  const isActiveSectionLink = (linkId: string | undefined) => {
    if (!linkId) return false;
    return (activeSection || localActiveSection) === linkId;
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-800 px-4 sm:px-6 py-3">
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        <a href={`/${currentService.toLowerCase()}`}>
          <img
            src={currentService === "Kliento" ? klientoLogo.src : ""}
            alt={`${currentService} logo`}
            className="h-4 md:h-5 w-auto"
          />
        </a>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-xs">
          {serviceLinks.map((link) => (
            <li key={link.text}>
              <a
                href={link.href}
                className={
                  isActiveSectionLink(link.id)
                    ? secondaryNavLinkClass.active
                    : secondaryNavLinkClass.inactive
                }
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <MobileMenuToggle
        isOpen={isSecondaryMenuOpen}
        onClick={() => setIsSecondaryMenuOpen(!isSecondaryMenuOpen)}
        label="Menu"
        showChevron={true}
      />
      {/* Mobile Menu */}
      {isSecondaryMenuOpen && (
        <div className="md:hidden w-full mt-3">
          <ul className="space-y-3 py-3">
            {serviceLinks.map((link) => (
              <li key={link.text}>
                <a
                  href={link.href}
                  className={
                    isActiveSectionLink(link.id)
                      ? `block ${secondaryNavLinkClass.active}`
                      : `block ${secondaryNavLinkClass.inactive}`
                  }
                  onClick={() => setIsSecondaryMenuOpen(false)}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
