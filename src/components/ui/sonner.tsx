"use client"

import {
  CheckCircle,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group font-sans!"
      icons={{
        info: <Info />,
        success: <CheckCircle />,
        warning: <TriangleAlert />,
        error: <CircleX />,
        loading: <Loader2 className="animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          icon: "[&_svg]:size-4",
        },
      }}
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
