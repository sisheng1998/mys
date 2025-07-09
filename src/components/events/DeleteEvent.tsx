"use client"

import React, { useState } from "react"
import { useMutation } from "convex/react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Event } from "@/types/event"
import { handleMutationError } from "@/lib/error"
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
import DeleteConfirmation from "@/components/records/DeleteConfirmation"

import { api } from "@cvx/_generated/api"

const DeleteEvent = ({ event }: { event: Event }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isConfirmDeletion, setIsConfirmDeletion] = useState<boolean>(false)

  const deleteEvent = useMutation(api.events.mutations.deleteEvent)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await deleteEvent({ _id: event._id })
      toast.success("Event deleted")
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
            <Button size="icon" variant="ghost">
              <Trash2 className="text-destructive" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">Delete</TooltipContent>
      </Tooltip>

      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          setTimeout(() => setIsConfirmDeletion(false), 100)
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event{" "}
            {`"`}
            <strong className="text-foreground">{event.name}</strong>
            {`"`}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <DeleteConfirmation
          label="Yes, delete the event"
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

export default DeleteEvent
