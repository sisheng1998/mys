import React, { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NotificationBadgeProps extends React.ComponentProps<typeof Badge> {
  badgeContent: number
  max?: number
  showZero?: boolean
}

export const NotificationBadge = ({
  badgeContent = 0,
  max = 9,
  showZero = false,
  className,
  children,
  ...props
}: NotificationBadgeProps) => {
  const lastNonZeroBadgeContent = useRef<number>(badgeContent)

  useEffect(() => {
    if (badgeContent === 0) return
    lastNonZeroBadgeContent.current = badgeContent
  }, [badgeContent])

  const displayBadgeContent =
    badgeContent === 0 && !showZero
      ? lastNonZeroBadgeContent.current
      : badgeContent

  const displayValue =
    displayBadgeContent > max ? `${max}+` : displayBadgeContent

  return (
    <div className="relative inline-flex">
      {children}
      <Badge
        className={cn(
          "absolute top-0 right-0 z-10 h-4 min-w-4 translate-x-1/2 -translate-y-1/2 rounded-full px-1 py-0 text-[0.625rem] transition-transform",
          badgeContent !== 0 || showZero ? "scale-100" : "scale-0",
          className
        )}
        {...props}
      >
        {displayValue}
      </Badge>
    </div>
  )
}
