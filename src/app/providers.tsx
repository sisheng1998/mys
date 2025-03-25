import React from "react"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import TopLoader from "nextjs-toploader"

import ConvexClientProvider from "@/components/Providers/ConvexClientProvider"
import ThemeProvider from "@/components/Providers/ThemeProvider"

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ConvexAuthNextjsServerProvider>
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
