import React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import NavLogo from "@/components/layouts/NavLogo"
import NavMain from "@/components/layouts/NavMain"
import NavSettings from "@/components/layouts/NavSettings"
import NavUser from "@/components/layouts/NavUser"

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar variant="floating" collapsible="icon" {...props}>
    <SidebarHeader>
      <NavLogo />
    </SidebarHeader>

    <SidebarContent className="overflow-x-hidden">
      <NavMain />
      <NavSettings />
    </SidebarContent>

    <SidebarFooter>
      <NavUser />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
)

export default AppSidebar
