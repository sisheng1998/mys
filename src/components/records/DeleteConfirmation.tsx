"use client"

import React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const DeleteConfirmation = ({
  label,
  value,
  setValue,
}: {
  label: string
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <Label
    htmlFor="confirmation"
    className="bg-background dark:bg-input/30 dark:hover:bg-input/50 cursor-pointer rounded-md border border-dashed px-3 py-2 shadow-xs"
  >
    <Checkbox
      id="confirmation"
      checked={value}
      onCheckedChange={(checked) => setValue(checked as boolean)}
    />

    <Label className="pointer-events-none h-4.5 font-normal">{label}</Label>
  </Label>
)

export default DeleteConfirmation
