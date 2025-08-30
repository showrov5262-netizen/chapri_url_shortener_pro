'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  Link as LinkIcon,
  LogOut,
  UserCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <LinkIcon className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-bold">ChapriURL Pro</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard"}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/settings")}
              tooltip="Settings"
            >
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://picsum.photos/100" alt="@admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin</span>
            <span className="text-xs text-muted-foreground">admin@chapri.url</span>
          </div>
          <LogOut className="ml-auto h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
