export interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
  id?: string;
}

export interface PrimaryNavProps {
  onKlientoClick: () => void;
}

export interface SecondaryNavProps {
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}
