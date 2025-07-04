import React from "react"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider"
import TopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { Toaster } from "@/components/ui/sonner"
import BackgroundPattern from "@/components/layouts/BackgroundPattern"
import Preloader from "@/components/layouts/Preloader"
import ScrollToTopOnRouteChange from "@/components/layouts/ScrollToTopOnRouteChange"
import ConvexClientProvider from "@/components/providers/ConvexClientProvider"
import ThemeProvider from "@/components/providers/ThemeProvider"
import { PrinterProvider } from "@/contexts/printer"

export const CONVEX_AUTH_API_ROUTE = "/api/convex-auth"

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ConvexAuthNextjsServerProvider apiRoute={CONVEX_AUTH_API_ROUTE}>
    <ConvexClientProvider>
      <ConvexQueryCacheProvider>
        <NuqsAdapter>
          <PrinterProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Preloader />

              <BackgroundPattern />

              <TopLoader
                height={2}
                color="var(--primary)"
                shadow={false}
                showSpinner={false}
                showForHashAnchor={false}
              />

              {children}

              <Toaster />

              <ScrollToTopOnRouteChange />
            </ThemeProvider>
          </PrinterProvider>
        </NuqsAdapter>
      </ConvexQueryCacheProvider>
    </ConvexClientProvider>
  </ConvexAuthNextjsServerProvider>
)

export default Providers
