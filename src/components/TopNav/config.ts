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
  const normalizedPath = servicePath.startsWith("/") ? servicePath : `/${servicePath}`;

  const servicesItem = primaryNavLinks.find((item) => item.href === "/services");

  if (!servicesItem) {
    throw new Error("Services navigation item not found in primary navigation");
  }

  if (!servicesItem.children || servicesItem.children.length === 0) {
    throw new Error("No services defined in navigation config");
  }

  const service = servicesItem.children.find(
    (child) => child.href.toLowerCase() === normalizedPath.toLowerCase(),
  );

  if (!service) {
    throw new Error(`Service not found for path: ${servicePath}`);
  }

  return service;
}
