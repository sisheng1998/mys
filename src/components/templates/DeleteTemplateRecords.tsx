"use client"

import React, { useState } from "react"
import { RowSelectionState } from "@tanstack/react-table"
import { useMutation } from "convex/react"
import { Info, Trash2 } from "lucide-react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LoaderButton } from "@/components/ui/loader-button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const DeleteTemplateRecords = ({
  ids,
  setRowSelection,
}: {
  ids: string[]
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const deleteTemplateRecords = useMutation(
    api.templates.mutations.deleteTemplateRecords
  )

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await deleteTemplateRecords({ ids: ids as Id<"templateRecords">[] })
      setRowSelection({})
      toast.success(`${ids.length} record(s) deleted`)
      setOpen(false)
    } catch (error) {
      handleMutationError(error)
    }

    setIsLoading(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="text-destructive" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">Delete</TooltipContent>
      </Tooltip>

      <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
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
          <Info className="size-4" />
          <AlertTitle>{ids.length} record(s) selected</AlertTitle>
          <AlertDescription>
            All selected record(s) will be deleted.
          </AlertDescription>
        </Alert>

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

export default DeleteTemplateRecords
