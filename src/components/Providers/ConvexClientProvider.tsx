"use client"

import { ReactNode } from "react"
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"
import { ConvexReactClient } from "convex/react"

import { env } from "@/env"

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL)

const ConvexClientProvider = ({ children }: { children: ReactNode }) => (
  <ConvexAuthNextjsProvider client={convex}>
    {children}
  </ConvexAuthNextjsProvider>
)

export default ConvexClientProvider
