import { useState, useRef, useEffect } from "react";
import veraidLogo from "../assets/images/veraid-logo.png";
import KlientoLogo from "../assets/images/kliento-logo.png";
import MenuIcon from "../assets/icons/menu.svg?react";
import CloseIcon from "../assets/icons/close.svg?react";
import ChevronIcon from "../assets/icons/chevron.svg?react";

interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
  id?: string;
}

const primaryNavLinks: NavLink[] = [
  { href: "/users", text: "Users" },
  {
    href: "/services",
    text: "Services",
    children: [
      { href: "/services/kliento", text: "Kliento" },
      { href: "/services/servers", text: "Services" },
    ],
  },
  { href: "/overview", text: "Tech overview" },
  { href: "/about", text: "About" },
];

const secondaryNavLinks: NavLink[] = [
  { href: "/services/kliento", text: "Clients", id: "clients" },
  { href: "/services/kliento/servers", text: "Servers", id: "servers" },
  { href: "/services/kliento/services", text: "Overview", id: "overview" },
];

export default function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [activeSecondarySection, setActiveSecondarySection] = useState<string | null>(null);
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
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

  const handleDropdownClick = (text: string) => {
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
      <nav className="border-b border-neutral-800 px-4 sm:px-6 py-3 relative z-50 bg-neutral-900">
        <div className="flex max-w-6xl mx-auto justify-between items-center">
          <a href="/">
            <img src={veraidLogo.src} alt="VeraId logo" className="h-5 md:h-6 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8 text-white text-sm">
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
                            className="block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-green-200 whitespace-nowrap"
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
          <div className="md:hidden absolute top-11 left-0 w-full bg-neutral-900 border-b-2 border-neutral-800">
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

      {/* Secondary Navigation */}
      {showSecondaryNav && (
        <nav className="border-b border-neutral-800 bg-neutral-800 px-4 sm:px-6 py-3">
          <div className="flex max-w-6xl mx-auto justify-between items-center">
            <a href="/services/kliento">
              <img src={KlientoLogo.src} alt="Kliento logo" className="h-4 md:h-5 w-auto" />
            </a>

            {/* Secondary Mobile Toggle Button */}
            <button
              className="md:hidden text-white flex items-center space-x-1 text-xs"
              onClick={() => setIsSecondaryMenuOpen(!isSecondaryMenuOpen)}
            >
              <span>Menu</span>
              <ChevronIcon
                className={`w-4 h-4 transition-transform ${
                  isSecondaryMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Secondary Desktop Menu */}
            <ul className="hidden md:flex space-x-8 text-xs">
              {secondaryNavLinks.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.href}
                    className={`text-white hover:text-green-200 ${
                      activeSecondarySection === link.id ? "text-green-300" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSecondarySection(link.id || null);
                    }}
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
                      className={`block text-white hover:text-green-200 ${
                        activeSecondarySection === link.id ? "text-green-300" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSecondarySection(link.id || null);
                        setIsSecondaryMenuOpen(false);
                      }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      )}
    </>
  );
}
