import React from "react"
import Link from "next/link"

import Logo from "@/icons/Logo"

export const dynamic = "force-static"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="container my-12 max-w-prose space-y-12">
    <Link href="/" className="inline-flex">
      <Logo className="size-12" />
    </Link>

    <article className="prose prose-neutral">{children}</article>

    <hr className="bg-border" />

    <p className="text-sm text-muted-foreground">
      Copyright © {new Date().getFullYear()} - 妙音寺
    </p>
  </main>
)

export default Layout
