export interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
}

export const primaryNavLinks: NavLink[] = [
  { href: "/users", text: "Users" },
  {
    href: "/services",
    text: "Services",
    children: [
      {
        href: "/kliento",
        text: "Kliento",
        children: [
          { href: "/kliento/clients", text: "Clients" },
          { href: "/kliento/servers", text: "Servers" },
          { href: "/kliento/overview", text: "Overview" },
        ],
      },
    ],
  },
  { href: "/overview", text: "Tech overview" },
  { href: "/about", text: "About" },
];
