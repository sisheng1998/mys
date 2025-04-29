"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, NotebookTabs, Users } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const PAGES = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Name Lists",
    url: "/name-lists",
    icon: NotebookTabs,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
]

const NavMain = () => {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {PAGES.map((page) => (
            <SidebarMenuItem key={page.title}>
              <SidebarMenuButton
                tooltip={page.title}
                isActive={pathname === page.url}
                onClick={() => setOpenMobile(false)}
                asChild
              >
                <Link href={page.url}>
                  <page.icon />
                  <span>{page.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavMain
