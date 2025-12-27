import { NavLink } from "react-router";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import type { Nav } from "@/types/sidebar-types";

export default function MenuItemSidebar({
  item,
  pathName,
}: {
  item: Nav;
  pathName: string;
}) {
  return (
    <SidebarMenuItem className="mb-2">
      <SidebarMenuButton isActive={item.url == pathName} asChild>
        <NavLink to={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
