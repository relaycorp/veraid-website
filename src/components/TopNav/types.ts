export interface NavLink {
  href: string;
  text: string;
  children?: NavLink[];
  id?: string;
}
