"use client"

import React, { useState } from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"

import { NameListRecord } from "@/types/nameList"
import { handleMutationError } from "@/lib/error"
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

import { api } from "@cvx/_generated/api"

const DeleteNameListRecord = ({
  nameListRecord,
  ...props
}: React.ComponentProps<typeof AlertDialog> & {
  nameListRecord?: NameListRecord
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const deleteNameListRecord = useMutation(
    api.nameLists.mutations.deleteNameListRecord
  )

  const handleDelete = async () => {
    if (!nameListRecord) return

    setIsLoading(true)

    try {
      await deleteNameListRecord({ _id: nameListRecord._id })
      toast.success("Record deleted")
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            record.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <LoaderButton
            variant="destructive"
            onClick={handleDelete}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Delete
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteNameListRecord
