import React from "react"
import { cookies } from "next/headers"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layouts/AppSidebar"
import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"
import RequireAuthorization from "@/components/layouts/RequireAuthorization"
import { AuthProvider } from "@/contexts/auth"
import { BreadcrumbProvider } from "@/contexts/breadcrumb"

import { api } from "@cvx/_generated/api"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const preloadedUser = await preloadQuery(
    api.users.getCurrentUser,
    {},
    {
      token: await convexAuthNextjsToken(),
    }
  )

  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value ?? "true"
  const defaultOpen = sidebarState === "true"

  return (
    <AuthProvider preloadedUser={preloadedUser}>
      <RequireAuthorization>
        <BreadcrumbProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />

            <SidebarInset className="bg-transparent">
              <Header />

              <div className="relative flex flex-1 flex-col gap-4 p-2">
                {children}
              </div>

              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </RequireAuthorization>
    </AuthProvider>
  )
}

export default Layout
