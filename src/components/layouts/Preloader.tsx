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
    <LoadingAnimation
      className={cn(
        "opacity-100 transition-opacity duration-500",
        isAnimated && "pointer-events-none opacity-0"
      )}
    />
  )
}

export default Preloader

export const LoadingAnimation = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "bg-background fixed inset-0 z-50 flex items-center justify-center",
      className
    )}
  >
    <Logo className="text-primary size-20 animate-spin" />
  </div>
)
