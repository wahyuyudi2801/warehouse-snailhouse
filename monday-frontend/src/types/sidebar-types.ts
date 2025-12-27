import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type SubItem = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  isActive?: boolean;
};

export type Nav = {
  title: string;
  url: string;
  roles: string[];
  isActive?: boolean;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  items?: SubItem[];
};

export type NavUser = {
  name: string;
  email: string;
  avatar: string;
};
