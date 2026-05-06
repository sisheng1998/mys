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
import { Progress } from "@/components/ui/progress"
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
  const [progress, setProgress] = useState<{
    current: number
    total: number
  } | null>(null)

  const handlePrint = async () => {
    setIsLoading(true)
    setProgress(null)

    try {
      const data = await convex.query(api.events.queries.getRecordsForPrint, {
        ids: ids as Id<"eventRecords">[],
      })

      const records = data.map((record) =>
        getLabelText(record.name, record.title)
      )

      await print(records, (current, total) => setProgress({ current, total }))

      toast.success(`${data.length} sticker(s) printed`)
      props.onOpenChange?.(false)
    } catch (error) {
      handleMutationError(error)
    }

    setIsLoading(false)
    setProgress(null)
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
            <AlertTitle>Printer not connected</AlertTitle>
            <AlertDescription>
              Please connect to the printer before printing.
            </AlertDescription>
          </Alert>
        ) : progress ? (
          <div className="flex flex-col gap-2 rounded-lg border px-4 py-3.75">
            <p className="flex items-baseline justify-between gap-2 text-sm">
              <span>Printing in progress...</span>

              <span className="font-medium">
                {progress.current} / {progress.total}
              </span>
            </p>

            <Progress value={(progress.current / progress.total) * 100} />
          </div>
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
