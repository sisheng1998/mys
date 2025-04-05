import React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import NavMain from "@/components/layouts/NavMain"
import Logo from "@/icons/Logo"

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar collapsible="icon" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-[width,height,padding,margin] group-data-[collapsible=icon]:mt-2"
          asChild
        >
          <Link href="/">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Logo className="size-6" />
            </div>

            <p className="truncate font-semibold">妙音寺</p>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <NavMain />
    </SidebarContent>

    <SidebarFooter className="group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2.5 truncate text-xs">
            <SidebarMenuItem>
              Made with
              <Heart className="mx-1 mb-1 inline size-3.5" />
              by{" "}
              <Link
                href="https://sisheng.my"
                target="_blank"
                className="underline"
              >
                Sheng
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem className="text-muted-foreground">
              © {new Date().getFullYear()} - All Rights Reserved
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
)

export default AppSidebar
