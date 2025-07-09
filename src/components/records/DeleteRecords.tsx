"use client"

import React, { useState } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"

import { handleMutationError } from "@/lib/error"
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
import DeleteConfirmation from "@/components/records/DeleteConfirmation"

const DeleteRecords = ({
  ids,
  handleDeleteRecords,
  ...props
}: React.ComponentProps<typeof AlertDialog> & {
  ids: string[]
  handleDeleteRecords: () => Promise<void>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isConfirmDeletion, setIsConfirmDeletion] = useState<boolean>(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await handleDeleteRecords()
      toast.success(`${ids.length} record(s) deleted`)
      props.onOpenChange?.(false)
    } catch (error) {
      handleMutationError(error)
    }

    setIsLoading(false)
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          setTimeout(() => setIsConfirmDeletion(false), 100)
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Alert
          variant="destructive"
          className="border-destructive bg-destructive/10"
        >
          <Info />
          <AlertTitle>{ids.length} record(s) selected</AlertTitle>
          <AlertDescription>
            All selected record(s) will be deleted.
          </AlertDescription>
        </Alert>

        <DeleteConfirmation
          label="Yes, delete the selected record(s)"
          value={isConfirmDeletion}
          setValue={setIsConfirmDeletion}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <LoaderButton
            variant="destructive"
            onClick={handleDelete}
            isLoading={isLoading}
            disabled={isLoading || !isConfirmDeletion}
          >
            Delete
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteRecords
