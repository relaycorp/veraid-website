import { useState, useEffect } from "react";
import { primaryNavLinks, type NavLink } from "./config";

export function useNavigation() {
  const [currentPath, setCurrentPath] = useState<string>("");

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

  return { currentPath, isActive };
}
