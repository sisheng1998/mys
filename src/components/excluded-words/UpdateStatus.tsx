"use client"

import React from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"

import { ExcludedWord } from "@/types/excludedWord"
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
  excludedWord,
  isActive,
}: {
  excludedWord: ExcludedWord
  isActive: boolean
}) => {
  const updateExcludedWord = useMutation(
    api.excludedWords.mutations.updateExcludedWord
  )

  const handleUpdate = async (isActive: boolean) => {
    try {
      await updateExcludedWord({ _id: excludedWord._id, isActive })
      toast.success("Status updated")
    } catch (error) {
      handleMutationError(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
            isActive
              ? "border-green-400 bg-green-100 text-green-700"
              : "border-red-400 bg-red-100 text-red-700"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={4}
      >
        <DropdownMenuLabel>Status</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {[true, false].map((value, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            className={cn(
              "flex flex-col items-start gap-1 [&>span:first-child]:top-2.5",
              value === isActive && "pointer-events-none"
            )}
            checked={value === isActive}
            onCheckedChange={() => handleUpdate(value)}
          >
            {value ? "Active" : "Inactive"}
            <span className="text-muted-foreground text-xs">
              {value
                ? "Will be excluded from the conversion"
                : "Will be converted as is"}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UpdateStatus
