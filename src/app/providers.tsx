import React from "react"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import TopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/sonner"
import ConvexClientProvider from "@/components/Providers/ConvexClientProvider"
import ThemeProvider from "@/components/Providers/ThemeProvider"

export const CONVEX_AUTH_API_ROUTE = "/api/convex-auth"

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ConvexAuthNextjsServerProvider apiRoute={CONVEX_AUTH_API_ROUTE}>
    <ConvexClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TopLoader
          height={2}
          color="var(--primary)"
          shadow={false}
          showSpinner={false}
          showForHashAnchor={false}
        />

        {children}

        <Toaster />
      </ThemeProvider>
    </ConvexClientProvider>
  </ConvexAuthNextjsServerProvider>
)

export default Providers
