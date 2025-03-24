import { useState, useRef, useEffect } from "react";
import logoDark from "../assets/images/veraid-logo.png";
import MenuIcon from "../assets/icons/menu.svg?react";
import CloseIcon from "../assets/icons/close.svg?react";

interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
}

const navLinks: NavLink[] = [
  { href: "/users", text: "Users" },
  {
    href: "/services",
    text: "Services",
    children: [
      { href: "/services/kliento", text: "Kliento" },
      { href: "/services/servers", text: "Servers" },
    ],
  },
  { href: "/overview", text: "Tech overview" },
  { href: "/about", text: "About" },
];

export default function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      setShowSecondaryNav(true);
      setActiveSecondarySection("overview");
      setIsMobileMenuOpen(false);
    }
    setActiveDropdown(null);
  };

  const handleHoverIn = (text: string) => {
    setActiveDropdown(text);
  };

  return (
    <>
      <nav className="border-b border-neutral-800 px-4 sm:px-6 py-3 bg-amber-700 relative z-50">
        <div className="flex max-w-6xl mx-auto justify-between items-center">
          <a href="/">
            <img src={logoDark.src} alt="VeraId logo" className="h-6 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-12 text-white text-sm bg-green-500">
            {navLinks.map((link) => (
              <li key={link.text} className="relative">
                {link.children ? (
                  <div
                    className="dropdown-wrapper"
                    onMouseEnter={() => setActiveDropdown(link.text)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="hover:text-green-200 flex items-center space-x-1">
                      <span>{link.text}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === link.text ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {activeDropdown === link.text && (
                      <div className="absolute top-full left-0 w-48 bg-red-500 rounded shadow-lg py-2 z-50">
                        {link.children.map((child) => (
                          <a
                            key={child.text}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-white hover:bg-neutral-800"
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
              <CloseIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-12 left-0 w-full z-50 bg-green-500">
            <ul className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <li key={link.text}>
                  {link.children ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDropdownClick(link.text)}
                        className="text-white hover:text-green-200 flex items-center justify-between w-full"
                      >
                        <span>{link.text}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            activeDropdown === link.text ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
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

      {/* Secondary Navigation */}
      {showSecondaryNav && (
        <nav className="bg-neutral-900 px-4 sm:px-6 py-3">
          <div className="flex max-w-6xl mx-auto justify-between items-center">
            <a href="/services/kliento">
              <img src={logoDark.src} alt="VeraId logo" className="h-7 md:h-8 w-auto" />
            </a>

            {/* Secondary Mobile Toggle Button */}
            <button
              className="md:hidden text-white flex items-center space-x-1"
              onClick={() => setIsSecondaryMenuOpen(!isSecondaryMenuOpen)}
            >
              <span>Menu</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isSecondaryMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Secondary Desktop Menu */}
            <ul className="hidden md:flex space-x-8 text-sm">
              <li>
                <a
                  href="/services/kliento"
                  className={`text-white hover:text-green-200 ${
                    activeSecondarySection === "clients" ? "text-green-300" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSecondarySection("clients");
                  }}
                >
                  Clients
                </a>
              </li>
              <li>
                <a
                  href="/services/kliento/servers"
                  className={`text-white hover:text-green-200 ${
                    activeSecondarySection === "servers" ? "text-green-300" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSecondarySection("servers");
                  }}
                >
                  Servers
                </a>
              </li>
              <li>
                <a
                  href="/services/kliento/services"
                  className={`text-white hover:text-green-200 ${
                    activeSecondarySection === "overview" ? "text-green-300" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSecondarySection("overview");
                  }}
                >
                  Overview
                </a>
              </li>
            </ul>
          </div>

          {/* Secondary Mobile Menu */}
          {isSecondaryMenuOpen && (
            <div className="md:hidden w-full mt-3">
              <ul className="space-y-3 py-3">
                <li>
                  <a
                    href="/services/kliento"
                    className={`block text-white hover:text-green-200 ${
                      activeSecondarySection === "clients" ? "text-green-300" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSecondarySection("clients");
                      setIsSecondaryMenuOpen(false);
                    }}
                  >
                    Clients
                  </a>
                </li>
                <li>
                  <a
                    href="/services/kliento/servers"
                    className={`block text-white hover:text-green-200 ${
                      activeSecondarySection === "servers" ? "text-green-300" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSecondarySection("servers");
                      setIsSecondaryMenuOpen(false);
                    }}
                  >
                    Servers
                  </a>
                </li>
                <li>
                  <a
                    href="/services/kliento/services"
                    className={`block text-white hover:text-green-200 ${
                      activeSecondarySection === "overview" ? "text-green-300" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSecondarySection("overview");
                      setIsSecondaryMenuOpen(false);
                    }}
                  >
                    Overview
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>
      )}
    </>
  );
}
