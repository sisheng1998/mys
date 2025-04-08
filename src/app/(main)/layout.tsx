import React from "react"
import { cookies } from "next/headers"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layouts/AppSidebar"
import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"
import RedirectToSignIn from "@/components/layouts/RedirectToSignIn"
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

  if (!user) return <RedirectToSignIn />

  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value ?? "true"
  const defaultOpen = sidebarState === "true"

  return (
    <AuthProvider user={user}>
      <RequireAuthorization>
        <BreadcrumbProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />

            <SidebarInset className="bg-transparent">
              <Header />

              <div className="relative flex flex-1 flex-col p-2">
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
