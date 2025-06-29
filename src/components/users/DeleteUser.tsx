"use client"

import React, { useState } from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"

import { User } from "@/types/user"
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

const DeleteUser = ({
  user,
  ...props
}: React.ComponentProps<typeof AlertDialog> & { user?: User }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const deleteUser = useMutation(api.users.mutations.deleteUser)

  const handleDelete = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      await deleteUser({ _id: user._id })
      toast.success("User deleted")
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
            This action cannot be undone. This will permanently delete the user.
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

export default DeleteUser
