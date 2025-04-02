import { useState, useEffect } from "react";
import type { NavLink } from "./config";
import { useNavigation } from "./hooks";
import { MobileMenuToggle } from "./MobileMenuToggle";

interface SecondaryNavProps {
  serviceName: string;
  serviceLinks: NavLink[];
  logoSrc: string;
  activeSection?: string | null;
}

export function SecondaryNav({
  serviceName,
  serviceLinks,
  logoSrc,
  activeSection,
}: SecondaryNavProps) {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [localActiveSection, setLocalActiveSection] = useState<string | null>(
    activeSection || null,
  );
  const {} = useNavigation();

  const secondaryNavLinkClass = {
    active: "text-indigo-300",
    inactive: "text-white hover:text-indigo-400",
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const matchedLink = serviceLinks.find((link: NavLink) => path === link.href);
      if (matchedLink && matchedLink.id) {
        setLocalActiveSection(matchedLink.id);
      }
    };

    handleUrlChange();
    document.addEventListener("astro:page-load", handleUrlChange);

    return () => {
      document.removeEventListener("astro:page-load", handleUrlChange);
    };
  }, [serviceLinks]);

  const isActiveSectionLink = (linkId: string | undefined) => {
    if (!linkId) return false;
    return localActiveSection === linkId;
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-800 px-4 sm:px-6 py-3 text-sm">
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        <a href={`/${serviceName.toLowerCase()}`}>
          <img src={logoSrc} alt={`${serviceName} logo`} className="h-4 md:h-5 w-auto" />
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
        <div className="md:hidden">
          <MobileMenuToggle
            isOpen={isSecondaryMenuOpen}
            onClick={() => setIsSecondaryMenuOpen(!isSecondaryMenuOpen)}
            label="Menu"
            showChevron={true}
          />
        </div>
      </div>
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
