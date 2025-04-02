export interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
  id?: string;
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
          { href: "/kliento/clients", text: "Clients", id: "clients" },
          { href: "/kliento/servers", text: "Servers", id: "servers" },
          { href: "/kliento/overview", text: "Overview", id: "overview" },
        ],
      },
    ],
  },
  { href: "/overview", text: "Tech overview" },
  { href: "/about", text: "About" },
];
