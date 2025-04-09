import React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

const Footer = () => (
  <header className="text-muted-foreground m-2 flex shrink-0 flex-wrap items-center justify-between gap-2 px-2 pb-1 text-xs">
    <p>
      Made with
      <Heart className="mx-1 mb-1 inline size-3.5" />
      by{" "}
      <Link href="https://sisheng.my" target="_blank" className="underline">
        Sheng
      </Link>
    </p>

    <p>© {new Date().getFullYear()} - All Rights Reserved</p>
  </header>
)

export default Footer
