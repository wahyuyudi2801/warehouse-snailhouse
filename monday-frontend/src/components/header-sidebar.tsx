import { SnailIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function HeaderSidebar() {
    return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <SnailIcon className="!size-6" color="purple" />
                <span className="text-base text-purple-800 font-pacifico font-medium py-4">
                  {"Snailhouse"}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
    )
}