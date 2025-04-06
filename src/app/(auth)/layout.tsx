import React from "react"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-1 flex-col items-center justify-center p-4">
    {children}
  </main>
)

export default Layout
