import {
  ArrowLeftRight,
  ChartBarStacked,
  Home,
  Notebook,
  Settings,
  ShoppingBag,
  Store,
  User,
  UserCheck,
  UserCircle,
  Warehouse,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import { useEffect, useState } from "react";

import { useLocation } from "react-router";
import HeaderSidebar from "./header-sidebar";
import type { Nav, NavUser as NavUserType } from "@/types/sidebar-types";
import MainMenuSidebar from "./main-menu-sidebar";
import AccountSettingSidebar from "./account-setting-sidebar";
import { NavUser } from "./nav-user";

// ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
const mainMenus: Nav[] = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
    roles: ["manager", "keeper"],
  },
  {
    title: "Products",
    url: "/product",
    icon: ShoppingBag,
    roles: ["manager"],
  },
  {
    title: "Categories",
    url: "/category",
    icon: ChartBarStacked,
    roles: ["manager"],
  },
  {
    title: "Warehouse",
    url: "/warehouse",
    icon: Warehouse,
    roles: ["manager"],
  },
  {
    title: "Merchant",
    url: "/merchant",
    icon: Store,
    roles: ["manager"],
  },
  {
    title: "Transations",
    url: "/transaction",
    icon: ArrowLeftRight,
    roles: ["keeper"],
  },
];

const accountSettings: Nav[] = [
  {
    title: "Roles",
    url: "/role",
    icon: Notebook,
    roles: ["manager"],
  },
  {
    title: "Manage Users",
    url: "#",
    icon: UserCircle,
    isActive: false,
    roles: ["manager"],
    items: [
      {
        title: "Users List",
        url: "/user-list",
        icon: User,
      },
      {
        title: "Assign Role",
        url: "/assign-role",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Settings",
    url: "/setting",
    icon: Settings,
    roles: ["manager", "keeper"],
  },
];

const user: NavUserType = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export default function AppSidebar() {
  const [pathName, setPathName] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    setPathName(location.pathname);
  }, [location]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white">
        <HeaderSidebar />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {/* Main Menu */}
        <MainMenuSidebar mainMenus={mainMenus} pathName={pathName} />
        {/* Account Setting */}
        <AccountSettingSidebar
          accountSettings={accountSettings}
          pathName={pathName}
        />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
