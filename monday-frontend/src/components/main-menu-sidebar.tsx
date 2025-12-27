import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./ui/sidebar";
import type { Nav } from "@/types/sidebar-types";
import MenuItemSidebar from "./menu-item-sidebar";
import { useAuth } from "@/context/AuthContext";

export default function MainMenuSidebar({
  mainMenus,
  pathName,
}: {
  mainMenus: Nav[];
  pathName: string;
}) {
  const { user } = useAuth();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        {mainMenus.map((item) => {
          if (item.roles.includes(user?.role || "")) {
            return (
              <MenuItemSidebar
                key={item.title}
                item={item}
                pathName={pathName}
              />
            );
          }
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
