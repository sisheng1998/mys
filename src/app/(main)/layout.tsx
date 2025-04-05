import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layouts/AppSidebar"
import Header from "@/components/layouts/Header"
import { AuthProvider } from "@/contexts/auth"

import { api } from "@cvx/_generated/api"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await fetchQuery(
    api.auth.currentUser,
    {},
    {
      token: await convexAuthNextjsToken(),
    }
  )

  if (!user) redirect("/sign-in")

  return (
    <AuthProvider user={user}>
      <SidebarLayout>{children}</SidebarLayout>
    </AuthProvider>
  )
}

export default Layout

const SidebarLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
