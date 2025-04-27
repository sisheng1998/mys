"use client"

import React from "react"
import { Column, Row } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

const ColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2.5 h-8 text-sm", className)}
      onClick={() => {
        const currentSort = column.getIsSorted()

        if (currentSort === false) {
          column.toggleSorting(false)
        } else if (currentSort === "asc") {
          column.toggleSorting(true)
        } else if (currentSort === "desc") {
          column.clearSorting()
        }
      }}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : (
        <ChevronsUpDown className="text-muted-foreground size-3.5" />
      )}
    </Button>
  )
}

export default ColumnHeader

export const multiSelectFilter = <TData extends object>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown[]
) => {
  if (!filterValue.length) return true
  const value = row.getValue(columnId)
  return filterValue.includes(value)
}
