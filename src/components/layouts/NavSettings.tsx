"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, ListTodo } from "lucide-react"

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
    title: "Templates",
    url: "/templates",
    icon: FileText,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: ListTodo,
  },
]

const NavSettings = () => {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>

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

export default NavSettings
