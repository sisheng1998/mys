import type { Metadata } from "next"
import { Noto_Sans_SC as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <html lang="en">
    <body
      className={cn(
        "relative flex min-h-svh flex-col overflow-x-hidden overscroll-y-none font-sans antialiased",
        fontSans.variable
      )}
    >
      {children}
    </body>
  </html>
)

export default RootLayout
