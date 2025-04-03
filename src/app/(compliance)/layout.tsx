import React from "react"
import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BackgroundPattern from "@/components/Layouts/BackgroundPattern"
import Logo from "@/icons/Logo"

export const dynamic = "force-static"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <BackgroundPattern />

    <main className="container mx-auto my-12 flex w-auto flex-col items-center justify-center gap-6">
      <Card className="w-full">
        <CardHeader>
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
  </>
)

export default Layout
