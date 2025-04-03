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

export function findServiceByPath(servicePath: string): NavLink {
  const servicesItem = primaryNavLinks.find((item) => item.href === "/services");

  if (!servicesItem?.children?.length) {
    throw new Error("Services navigation not properly configured");
  }

  const service = servicesItem.children.find(
    (child) => child.href.toLowerCase() === servicePath.toLowerCase(),
  );

  if (!service) {
    throw new Error(`Service not found for path: ${servicePath}`);
  }

  return service;
}
