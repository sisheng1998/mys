"use client"

import {
  CheckCircle,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="font-sans!"
      icons={{
        info: <Info />,
        success: <CheckCircle />,
        warning: <TriangleAlert />,
        error: <CircleX />,
        loading: <Loader2 className="animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          icon: cn("[&_svg]:size-4"),
        },
      }}
      richColors
      {...props}
    />
  )
}

export { Toaster }
