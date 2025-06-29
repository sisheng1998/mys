"use client"

import React, { useState } from "react"
import { CircleAlert } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import { LoaderButton } from "@/components/ui/loader-button"
import { usePrinter } from "@/contexts/printer"

const PrintEventRecord = ({
  eventRecord,
  ...props
}: React.ComponentProps<typeof AlertDialog> & {
  eventRecord?: EventRecord
}) => {
  const { device, print } = usePrinter()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePrint = async () => {
    if (!eventRecord) return

    setIsLoading(true)

    try {
      await print([getLabelText(eventRecord.name, eventRecord.title)])
      toast.success("Sticker printed")
      props.onOpenChange?.(false)
    } catch (error) {
      toast.error(String(error))
    }

    setIsLoading(false)
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Print Sticker</AlertDialogTitle>

          <AlertDialogDescription>
            Confirm to print a sticker for{" "}
            <strong className="text-foreground">
              {getNameWithTitle(eventRecord?.name || "", eventRecord?.title)}
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
              Please connect to the printer before printing.
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
