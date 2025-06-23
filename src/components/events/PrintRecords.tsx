"use client"

import React, { useState } from "react"
import { useConvex } from "convex/react"
import { CircleAlert, Info } from "lucide-react"
import { toast } from "sonner"

import { handleMutationError } from "@/lib/error"
import { getLabelText } from "@/lib/name"
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

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const PrintRecords = ({
  ids,
  ...props
}: React.ComponentProps<typeof AlertDialog> & {
  ids: string[]
}) => {
  const convex = useConvex()
  const { device, print } = usePrinter()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePrint = async () => {
    setIsLoading(true)

    try {
      const data = await convex.query(api.events.queries.getRecordsForPrint, {
        ids: ids as Id<"eventRecords">[],
      })

      const records = data.map((record) =>
        getLabelText(record.name, record.title)
      )

      await print(records)

      toast.success(`${data.length} sticker(s) printed`)
      props.onOpenChange?.(false)
    } catch (error) {
      handleMutationError(error)
    }

    setIsLoading(false)
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Print Sticker(s)</AlertDialogTitle>

          <AlertDialogDescription>
            The selected record(s) will be printed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!device ? (
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
        ) : (
          <Alert className="bg-primary/10 border-primary text-primary">
            <Info />
            <AlertTitle>{ids.length} record(s) selected</AlertTitle>
            <AlertDescription className="text-primary">
              All selected record(s) will be printed.
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

export default PrintRecords
