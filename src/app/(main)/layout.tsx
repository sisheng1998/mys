import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layouts/AppSidebar"
import Header from "@/components/layouts/Header"
import RequireAuthorization from "@/components/layouts/RequireAuthorization"
import { AuthProvider } from "@/contexts/auth"
import { BreadcrumbProvider } from "@/contexts/breadcrumb"

import { api } from "@cvx/_generated/api"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await fetchQuery(
    api.users.getCurrentUser,
    {},
    {
      token: await convexAuthNextjsToken(),
    }
  )

  if (!user) redirect("/sign-in")

  const cookie = await cookies()
  const sidebarState = cookie.get("sidebar_state")?.value ?? "true"
  const defaultOpen = sidebarState === "true"

  return (
    <AuthProvider user={user}>
      <RequireAuthorization>
        <BreadcrumbProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />

            <SidebarInset className="bg-transparent">
              <Header />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </RequireAuthorization>
    </AuthProvider>
  )
}

export default Layout
