import { useState, useEffect } from "react";
import klientoLogo from "../../assets/images/kliento-logo.png";
import { primaryNavLinks } from "./config";
import type { NavLink } from "./config";
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
  const {} = useNavigation();

  const findSecondaryLinks = (serviceName: string): NavLink[] => {
    // Find the parent service item in primaryNavLinks
    const parentItem = primaryNavLinks.find((item) =>
      item.children?.some((child) => child.text.toLowerCase() === serviceName.toLowerCase()),
    );

    // If parent exists, find the specific service
    if (parentItem?.children) {
      const serviceItem = parentItem.children.find(
        (child) => child.text.toLowerCase() === serviceName.toLowerCase(),
      );

      // Return the service's children or empty array
      return serviceItem?.children || [];
    }

    return [];
  };

  const serviceLinks = findSecondaryLinks(currentService);

  const secondaryNavLinkClass = {
    active: "text-indigo-300",
    inactive: "text-white hover:text-indigo-400",
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const links = findSecondaryLinks(currentService);
      const matchedLink = links.find((link: NavLink) => path === link.href);
      if (matchedLink && matchedLink.id) {
        setLocalActiveSection(matchedLink.id);
      }
    };

    handleUrlChange();
    document.addEventListener("astro:page-load", handleUrlChange);

    return () => {
      document.removeEventListener("astro:page-load", handleUrlChange);
    };
  }, [currentService]);

  const isActiveSectionLink = (linkId: string | undefined) => {
    if (!linkId) return false;
    return localActiveSection === linkId;
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-800 px-4 sm:px-6 py-3 text-sm">
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
