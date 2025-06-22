"use client"

import React, { useState } from "react"
import { CircleAlert, Printer } from "lucide-react"
import { toast } from "sonner"

import { EventRecord } from "@/types/event"
import { getLabelText, getNameWithTitle } from "@/lib/name"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LoaderButton } from "@/components/ui/loader-button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePrinter } from "@/contexts/printer"

const PrintEventRecord = ({ eventRecord }: { eventRecord: EventRecord }) => {
  const { device, print } = usePrinter()

  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePrint = async () => {
    setIsLoading(true)

    try {
      await print([getLabelText(eventRecord.name, eventRecord.title)])
      toast.success("Sticker printed")
      setOpen(false)
    } catch (error) {
      toast.error(String(error))
    }

    setIsLoading(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Printer />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">Print</TooltipContent>
      </Tooltip>

      <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Print Sticker</AlertDialogTitle>

          <AlertDialogDescription>
            Confirm to print a sticker for{" "}
            <strong className="text-foreground">
              {getNameWithTitle(eventRecord.name, eventRecord.title)}
            </strong>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!device && (
          <Alert
            variant="destructive"
            className="border-destructive bg-destructive/10"
          >
            <CircleAlert />
            <AlertTitle>Printer Not Connected</AlertTitle>
            <AlertDescription>
              Please connect to the printer before printing
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <LoaderButton
            onClick={handlePrint}
            isLoading={isLoading}
            disabled={!device || isLoading}
          >
            Print
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PrintEventRecord
