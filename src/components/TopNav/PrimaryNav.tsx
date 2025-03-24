import { useState, useRef, useEffect } from "react";
import veraIdLogo from "../../assets/images/veraid-logo.png";
import MenuIcon from "../../assets/icons/menu.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import ChevronIcon from "../../assets/icons/chevron.svg?react";
import type { NavLink, PrimaryNavProps } from "./types";
import { primaryNavLinks } from "./constants";

export function PrimaryNav({ onKlientoClick }: PrimaryNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleIconClass = "w-5 h-5";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = (text: string) => {
    // Only for mobile
    setActiveDropdown(activeDropdown === text ? null : text);
  };

  const handleServiceClick = (e: React.MouseEvent, service: string) => {
    if (service === "Kliento") {
      e.preventDefault();
      onKlientoClick();
      setIsMobileMenuOpen(false);
    }
    setActiveDropdown(null);
  };

  return (
    <nav className="px-4 sm:px-6 py-4 bg-neutral-900 relative z-50">
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        <a href="/">
          <img src={veraIdLogo.src} alt="VeraId logo" className="h-5 md:h-6 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-10 text-white text-sm">
          {primaryNavLinks.map((link) => (
            <li key={link.text} className="relative">
              {link.children ? (
                <div
                  className="dropdown-wrapper"
                  onMouseEnter={() => setActiveDropdown(link.text)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="hover:text-green-200 flex items-center space-x-1">
                    <span>{link.text}</span>
                    <ChevronIcon
                      className={`w-3 h-3 transition-transform ${
                        activeDropdown === link.text ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === link.text && (
                    <div className="absolute top-full left-0 min-w-max bg-neutral-900 border border-neutral-700 rounded py-2 z-50">
                      {link.children.map((child) => (
                        <a
                          key={child.text}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-white hover:bg-neutral-800 whitespace-nowrap"
                          onClick={(e) => handleServiceClick(e, child.text)}
                        >
                          {child.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a href={link.href} className="hover:text-green-200">
                  {link.text}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <CloseIcon className={toggleIconClass} />
          ) : (
            <MenuIcon className={toggleIconClass} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-13 left-0 w-full bg-neutral-900 z-50">
          <ul className="px-6 py-4 space-y-4">
            {primaryNavLinks.map((link) => (
              <li key={link.text}>
                {link.children ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDropdownClick(link.text)}
                      className="text-white hover:text-green-200 flex items-center justify-between w-full"
                    >
                      <span>{link.text}</span>
                      <ChevronIcon
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === link.text ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeDropdown === link.text && (
                      <div className="pl-4 space-y-2">
                        {link.children.map((child) => (
                          <a
                            key={child.text}
                            href={child.href}
                            className="block text-white hover:text-green-200"
                            onClick={(e) => handleServiceClick(e, child.text)}
                          >
                            {child.text}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a href={link.href} className="text-white hover:text-green-200 block">
                    {link.text}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
