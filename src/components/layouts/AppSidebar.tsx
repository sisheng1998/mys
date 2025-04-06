import React from "react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import NavMain from "@/components/layouts/NavMain"
import NavUser from "@/components/layouts/NavUser"
import Logo from "@/icons/Logo"

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar variant="floating" collapsible="icon" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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

    <SidebarContent className="overflow-x-hidden">
      <NavMain />
    </SidebarContent>

    <SidebarFooter>
      <NavUser />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
)

export default AppSidebar
