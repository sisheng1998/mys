"use client"

import React from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"

import { User } from "@/types/user"
import { handleMutationError } from "@/lib/error"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { api } from "@cvx/_generated/api"

const UpdateStatus = ({
  user,
  isAuthorized,
  disabled,
}: {
  user: User
  isAuthorized: boolean
  disabled: boolean
}) => {
  const updateUser = useMutation(api.users.mutations.updateUser)

  const handleUpdate = async (isAuthorized: boolean) => {
    try {
      await updateUser({ userId: user._id, isAuthorized })
      toast.success("Status updated")
    } catch (error) {
      handleMutationError(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
            isAuthorized
              ? "border-green-400 bg-green-100 text-green-700"
              : "border-red-400 bg-red-100 text-red-700",
            disabled ? "cursor-default" : "cursor-pointer"
          )}
        >
          {isAuthorized ? "Authorized" : "Unauthorized"}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(event) => event.preventDefault()}
        sideOffset={4}
      >
        <DropdownMenuLabel>Status</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {[true, false].map((value, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            className={cn(
              "flex flex-col items-start gap-1 [&>span:first-child]:top-2.5",
              value === isAuthorized && "pointer-events-none"
            )}
            checked={value === isAuthorized}
            onCheckedChange={() => handleUpdate(value)}
          >
            {value ? "Authorized" : "Unauthorized"}
            <span className="text-muted-foreground text-xs">
              {value
                ? "Able to access the application"
                : "Unable to access the application"}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UpdateStatus
