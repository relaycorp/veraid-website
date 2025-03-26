import { useState, useEffect } from "react";
import klientoLogo from "../../assets/images/kliento-logo.png";
import ChevronIcon from "../../assets/icons/chevron.svg?react";
import { secondaryNavLinks } from "./constants";

const navLinkClasses = {
  active: "text-green-300",
  inactive: "text-white hover:text-green-200",
};

interface SecondaryNavProps {
  currentPath: string;
  activeSection: string | null;
  currentService: string;
  setActiveSection?: (section: string | null) => void;
}

export function SecondaryNav({ currentPath, activeSection, currentService }: SecondaryNavProps) {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [localActiveSection, setLocalActiveSection] = useState<string | null>(activeSection);

  // Filter links to only show the ones relevant to the current service
  const serviceLinks = secondaryNavLinks.filter((link) =>
    link.href.includes(currentService.toLowerCase()),
  );

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

        {/* Secondary Mobile Toggle Button */}
        <button
          className="md:hidden text-white flex items-center space-x-1 text-xs"
          onClick={() => setIsSecondaryMenuOpen(!isSecondaryMenuOpen)}
        >
          <span>Menu</span>
          <ChevronIcon
            className={`w-4 h-4 transition-transform ${isSecondaryMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Secondary Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-xs">
          {serviceLinks.map((link) => (
            <li key={link.text}>
              <a
                href={link.href}
                className={
                  (activeSection || localActiveSection) === link.id
                    ? navLinkClasses.active
                    : navLinkClasses.inactive
                }
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Secondary Mobile Menu */}
      {isSecondaryMenuOpen && (
        <div className="md:hidden w-full mt-3">
          <ul className="space-y-3 py-3">
            {serviceLinks.map((link) => (
              <li key={link.text}>
                <a
                  href={link.href}
                  className={
                    (activeSection || localActiveSection) === link.id
                      ? `block ${navLinkClasses.active}`
                      : `block ${navLinkClasses.inactive}`
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
