"use client"

import { useEffect } from "react"

export const useSafeArea = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return

      ref.current.style.setProperty(
        "padding-bottom",
        "env(safe-area-inset-bottom)"
      )
    }

    if (!window.visualViewport) return

    window.visualViewport.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      if (!window.visualViewport) return

      window.visualViewport.removeEventListener("resize", handleResize)
    }
  }, [ref])
}
