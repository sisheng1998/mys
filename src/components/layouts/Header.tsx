import React from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import AppBreadcrumb from "@/components/layouts/AppBreadcrumb"

// import PrinterButton from "@/components/layouts/PrinterButton"

const Header = () => (
  <header className="bg-card text-card-foreground m-2 flex shrink-0 items-center gap-2 rounded-lg border px-6 py-2.5 shadow-sm">
    <SidebarTrigger className="-ml-2" />

    <Separator orientation="vertical" className="mr-2 h-6!" />

    <AppBreadcrumb />

    {/* <PrinterButton className="-mr-2 ml-auto" /> */}
  </header>
)

export default Header
