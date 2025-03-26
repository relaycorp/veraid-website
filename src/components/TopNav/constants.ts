import type { NavLink } from "./types";

export const primaryNavLinks: NavLink[] = [
  { href: "/users", text: "Users" },
  {
    href: "/services",
    text: "Services",
    children: [{ href: "/kliento", text: "Kliento" }],
  },
  { href: "/overview", text: "Tech overview" },
  { href: "/about", text: "About" },
];

export const secondaryNavLinks: NavLink[] = [
  { href: "/kliento/clients", text: "Clients", id: "clients" },
  { href: "/kliento/servers", text: "Servers", id: "servers" },
  { href: "/kliento/overview", text: "Overview", id: "overview" },
];

export const navLinkClasses = {
  active: "text-green-300",
  inactive: "text-white hover:text-green-200",
};

export const dropdownItemClasses = {
  active: "text-green-300",
  inactive: "text-white hover:text-green-200 hover:bg-neutral-700",
};
