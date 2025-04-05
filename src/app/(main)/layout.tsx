import React from "react"
import { redirect } from "next/navigation"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"

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

  return <AuthProvider user={user}>{children}</AuthProvider>
}
export default Layout
