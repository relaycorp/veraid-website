export interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
  id?: string;
}

export interface PrimaryNavProps {
  onServiceClick: (service: string) => void;
}

export interface SecondaryNavProps {
  currentPath: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  currentService: string | null;
}
