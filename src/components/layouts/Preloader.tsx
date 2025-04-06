"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import Logo from "@/icons/Logo"

const Preloader = () => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "bg-background fixed inset-0 z-50 flex items-center justify-center opacity-100 transition-opacity duration-500",
        isAnimated && "pointer-events-none opacity-0"
      )}
    >
      <Logo className="text-primary size-20 animate-spin" />
    </div>
  )
}

export default Preloader
