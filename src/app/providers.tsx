import React from "react"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import TopLoader from "nextjs-toploader"

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
        <TopLoader height={2} color="hsl(var(--primary))" showSpinner={false} />
        {children}
      </ThemeProvider>
    </ConvexClientProvider>
  </ConvexAuthNextjsServerProvider>
)

export default Providers
