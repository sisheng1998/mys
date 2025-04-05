import React from "react"
import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Logo from "@/icons/Logo"

export const dynamic = "force-static"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="container mx-auto my-8 flex w-auto flex-col items-center justify-center gap-6 p-4">
    <Card className="w-full">
      <CardHeader className="justify-start">
        <Link href="/" className="my-2 inline-flex">
          <Logo className="text-primary size-10" />
        </Link>
      </CardHeader>

      <CardContent>
        <article className="prose prose-neutral prose-sm">{children}</article>
      </CardContent>
    </Card>

    <p className="text-muted-foreground text-center text-sm">
      Copyright © {new Date().getFullYear()} - 妙音寺
    </p>
  </main>
)

export default Layout
