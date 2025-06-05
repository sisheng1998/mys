"use client"

import React from "react"
import Link from "next/link"

import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import Logo from "@/icons/Logo"

const NavLogo = () => {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        onClick={() => setOpenMobile(false)}
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
  )
}

export default NavLogo
