"use client"

import { useEffect } from "react"

export const useSafeArea = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const handleResize = () => {
      if (!ref.current || !window.visualViewport) return

      const vh = window.visualViewport.height
      const fullHeight = window.innerHeight

      const keyboardHeight = fullHeight - vh

      ref.current.style.setProperty("bottom", `${keyboardHeight}px`)
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
