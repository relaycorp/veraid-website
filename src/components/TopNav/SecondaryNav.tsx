import { useState, useEffect } from "react";
import klientoLogo from "../../assets/images/kliento-logo.png";
import ChevronIcon from "../../assets/icons/chevron.svg?react";
import type { SecondaryNavProps } from "./types";
import { secondaryNavLinks } from "./constants";

const navLinkClasses = {
  active: "text-green-300",
  inactive: "text-white hover:text-green-200",
};

export function SecondaryNav({ activeSection, setActiveSection }: SecondaryNavProps) {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const matchedLink = secondaryNavLinks.find((link) => path === link.href);
    if (matchedLink && matchedLink.id) {
      setActiveSection(matchedLink.id);
    }
  }, [setActiveSection]);

  return (
    <nav className="border-b border-neutral-800 bg-neutral-800 px-4 sm:px-6 py-3">
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        <a href="/kliento">
          <img src={klientoLogo.src} alt="Kliento logo" className="h-4 md:h-5 w-auto" />
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
          {secondaryNavLinks.map((link) => (
            <li key={link.text}>
              <a
                href={link.href}
                className={
                  activeSection === link.id ? navLinkClasses.active : navLinkClasses.inactive
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
            {secondaryNavLinks.map((link) => (
              <li key={link.text}>
                <a
                  href={link.href}
                  className={
                    activeSection === link.id
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
