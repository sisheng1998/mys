import type { Metadata, Viewport } from "next"
import { Noto_Sans_SC as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import Providers from "@/app/providers"

import "@/app/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    template: "%s | 妙音寺",
    default: "妙音寺",
  },
  description: "心正 - 修菩提",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  interactiveWidget: "resizes-content",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        "relative flex min-h-svh flex-col overflow-x-hidden overscroll-y-none font-sans text-pretty antialiased",
        fontSans.variable
      )}
    >
      <Providers>{children}</Providers>
    </body>
  </html>
)

export default RootLayout
