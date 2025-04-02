import { useState } from "react";
import type { NavLink } from "./config";
import { useNavigation, findServiceByPath } from "./hooks";
import { MobileMenuToggle } from "./MobileMenuToggle";

interface SecondaryNavProps {
  nav?: NavLink;
  servicePath?: string;
  logoSrc: string;
}

export function SecondaryNav({ nav, servicePath, logoSrc }: SecondaryNavProps) {
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const { isActive } = useNavigation();

  const navigation = nav || (servicePath ? findServiceByPath(servicePath) : null);

  if (!navigation) {
    return null;
  }

  const secondaryNavLinkClass = {
    active: "text-indigo-300",
    inactive: "text-white hover:text-indigo-400",
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-800 px-4 sm:px-6 py-3 text-sm">
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        <a href={navigation.href}>
          <img src={logoSrc} alt={`${navigation.text} logo`} className="h-4 md:h-5 w-auto" />
        </a>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-xs">
          {navigation.children?.map((link) => (
            <li key={link.text}>
              <a
                href={link.href}
                className={
                  isActive(link.href)
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
            {navigation.children?.map((link) => (
              <li key={link.text}>
                <a
                  href={link.href}
                  className={
                    isActive(link.href)
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
