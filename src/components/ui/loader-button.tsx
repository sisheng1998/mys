import React, { ElementType } from "react"
import { Loader2, LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type LoaderButtonProps = React.ComponentProps<typeof Button> & {
  icon?: LucideIcon | ElementType
  isLoading?: boolean
}

export const LoaderButton = ({
  icon: Icon,
  isLoading,
  disabled,
  children,
  ...props
}: LoaderButtonProps) => (
  <Button disabled={disabled || isLoading} {...props}>
    {isLoading ? (
      <Loader2 className="mr-2 size-4 animate-spin" />
    ) : Icon ? (
      <Icon className="mr-2 size-4" />
    ) : null}
    {children}
  </Button>
)
