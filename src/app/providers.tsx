import React from "react"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"

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
        {children}
      </ThemeProvider>
    </ConvexClientProvider>
  </ConvexAuthNextjsServerProvider>
)

export default Providers
