import React from "react"

import BackgroundPattern from "@/components/Layouts/BackgroundPattern"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
    <BackgroundPattern />

    {children}
  </main>
)

export default Layout
