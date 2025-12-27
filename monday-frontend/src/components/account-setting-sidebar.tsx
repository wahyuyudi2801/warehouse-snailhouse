import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { NavLink } from "react-router";
import MenuItemSidebar from "./menu-item-sidebar";
import type { Nav, SubItem } from "@/types/sidebar-types";
import { useAuth } from "@/context/AuthContext";

export default function AccountSettingSidebar({
  accountSettings,
  pathName,
}: {
  accountSettings: Nav[];
  pathName: string;
}) {
  const { user } = useAuth();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account Setting</SidebarGroupLabel>
      <SidebarGroupContent>
        {accountSettings.map((item) => {
          if (item.roles.includes(user?.role || "")) {
            return item.items?.length ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem className="mb-2">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem: SubItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={subItem.url == pathName}
                            asChild
                          >
                            <NavLink to={subItem.url}>
                              <subItem.icon />
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
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
