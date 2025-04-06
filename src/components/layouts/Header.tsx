import React from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import AppBreadcrumb from "@/components/layouts/AppBreadcrumb"

const Header = () => (
  <header className="bg-card text-card-foreground m-2 flex shrink-0 items-center gap-2 rounded-lg border px-6 py-2.5 shadow-sm">
    <SidebarTrigger className="-ml-2" />

    <Separator orientation="vertical" className="mr-2 h-6!" />

    <AppBreadcrumb />
  </header>
)

export default Header
