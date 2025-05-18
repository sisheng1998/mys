"use client"

import React from "react"
import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationProps<TData> {
  table: Table<TData>
}

const Pagination = <TData,>({ table }: PaginationProps<TData>) => {
  const totalRows = table.getFilteredRowModel().rows.length

  const firstRowNumber =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1

  const lastRowNumber = Math.min(
    (table.getState().pagination.pageIndex + 1) *
      table.getState().pagination.pageSize,
    totalRows
  )

  const currentPageSize = table.getState().pagination.pageSize

  const noOfRowsSelected = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {noOfRowsSelected !== 0 ? (
        <p className="text-sm">
          {noOfRowsSelected} of {totalRows} row{totalRows !== 1 ? "s" : ""}{" "}
          selected
        </p>
      ) : totalRows > 1 ? (
        <p className="text-sm">
          Showing {firstRowNumber} - {lastRowNumber} of {totalRows} results
        </p>
      ) : (
        <p className="text-sm">
          Showing {totalRows} result{totalRows === 0 ? "s" : ""}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm">Rows / Page</p>

          <Select
            value={currentPageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={currentPageSize.toString()}>
                {currentPageSize}
              </SelectValue>
            </SelectTrigger>

            <SelectContent side="top">
              {[25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
