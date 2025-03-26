import { useState, useRef, useEffect } from "react";
import veraIdLogo from "../../assets/images/veraid-logo.png";
import MenuIcon from "../../assets/icons/menu.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import ChevronIcon from "../../assets/icons/chevron.svg?react";
import { primaryNavLinks } from "./constants";

const navLinkClasses = {
  active: "text-green-300",
  inactive: "text-white hover:text-green-200",
};

const dropdownItemClasses = {
  active: "text-green-300",
  inactive: "text-white hover:text-green-200 hover:bg-neutral-700 ",
};

export function PrimaryNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleIconClass = "w-5 h-5";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }

    const handleUrlChange = () => {
      setCurrentPath(window.location.pathname);
    };

    document.addEventListener("astro:page-load", handleUrlChange);
    return () => {
      document.removeEventListener("astro:page-load", handleUrlChange);
    };
  }, []);

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(href);
  };

  const handleDropdownClick = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveDropdown(activeDropdown === text ? null : text);
  };

  const handleServiceClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="px-4 sm:px-6 py-4 bg-neutral-900 relative z-50">
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        <a href="/">
          <img src={veraIdLogo.src} alt="VeraId logo" className="h-5 md:h-6 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-10 text-sm">
          {primaryNavLinks.map((link, index) => (
            <li key={link.text} className="relative flex items-center">
              {link.children ? (
                <>
                  <div
                    className="dropdown-wrapper"
                    onMouseEnter={() => setActiveDropdown(link.text)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center space-x-1">
                      <a
                        href={link.href}
                        className={
                          isActive(link.href) ? navLinkClasses.active : navLinkClasses.inactive
                        }
                      >
                        {link.text}
                      </a>
                      <button
                        onClick={(e) => handleDropdownClick(link.text, e)}
                        className="flex items-center"
                        aria-label="Toggle dropdown"
                      >
                        <ChevronIcon
                          className={`w-3 h-3 transition-transform ${
                            activeDropdown === link.text ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {activeDropdown === link.text && (
                      <div className="absolute top-full left-0 min-w-max bg-neutral-900 border border-neutral-700 rounded py-2 z-50">
                        <div className="h-4 -mt-4 w-full"></div>
                        {link.children.map((child) => (
                          <a
                            key={child.text}
                            href={child.href}
                            className={`block px-4 py-2 text-sm whitespace-nowrap ${
                              isActive(child.href)
                                ? dropdownItemClasses.active
                                : dropdownItemClasses.inactive
                            }`}
                            onClick={handleServiceClick}
                          >
                            {child.text}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <a
                  href={link.href}
                  className={isActive(link.href) ? navLinkClasses.active : navLinkClasses.inactive}
                >
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
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={link.href}
                        className={
                          isActive(link.href) ? navLinkClasses.active : navLinkClasses.inactive
                        }
                      >
                        {link.text}
                      </a>
                      <div className="flex items-center">
                        <div className="h-6 w-px bg-neutral-600 mr-3"></div>
                        <button
                          onClick={() => handleDropdownClick(link.text)}
                          aria-label="Toggle dropdown"
                        >
                          <ChevronIcon
                            className={`w-4 h-4 transition-transform ${
                              activeDropdown === link.text ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {activeDropdown === link.text && (
                      <div className="pl-4 space-y-2">
                        {link.children.map((child) => (
                          <a
                            key={child.text}
                            href={child.href}
                            className={`block ${
                              isActive(child.href) ? navLinkClasses.active : navLinkClasses.inactive
                            }`}
                            onClick={handleServiceClick}
                          >
                            {child.text}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className={`block ${
                      isActive(link.href) ? navLinkClasses.active : navLinkClasses.inactive
                    }`}
                  >
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
