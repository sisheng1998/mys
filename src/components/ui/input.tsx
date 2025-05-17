import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

function InputRoot({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative flex items-center", className)} {...props}>
      {children}
    </div>
  )
}

function InputIcon({
  children,
  position = "left",
  className,
}: {
  children: React.ReactNode
  position?: "left" | "right"
  className?: string
}) {
  return (
    <Slot
      role="presentation"
      className={cn(
        "pointer-events-none absolute size-4",
        position === "left" && "left-3 [&~input]:pl-10",
        position === "right" && "right-3 [&~input]:pr-10",
        className
      )}
    >
      {children}
    </Slot>
  )
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputRoot, InputIcon }
