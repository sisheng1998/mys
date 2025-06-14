"use client"

import React from "react"
import { Check, Printer, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePrinter } from "@/contexts/printer"

const PrinterButton = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { device, connect, disconnect, isSupported } = usePrinter()

  if (!isSupported) return null

  const handleClick = async () => {
    try {
      if (device) {
        disconnect()
        toast.success("Printer disconnected")
      } else {
        await connect()
        toast.success("Printer connected")
      }
    } catch {
      toast.error(
        `Failed to ${device ? "disconnect from" : "connect to"} printer`
      )
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...props}
          variant="ghost"
          size="icon"
          className={cn("relative size-7", className)}
          onClick={handleClick}
        >
          <Printer />

          <div
            className={cn(
              "absolute -top-1 -right-1 rounded-full p-0.5 [&>svg]:size-2.5!",
              device ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            )}
          >
            {device ? <Check /> : <X />}
          </div>
        </Button>
      </TooltipTrigger>

      <TooltipContent side="left">
        {device ? "Printer Connected" : "Connect to Printer"}
      </TooltipContent>
    </Tooltip>
  )
}

export default PrinterButton
