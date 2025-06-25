"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"

import { cn } from "@/lib/utils"
import {
  useFilterParams,
  usePaginationParams,
  useSearchParams,
  useSortingParams,
} from "@/hooks/use-data-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ColumnToggle from "@/components/data-table/ColumnToggle"
import Pagination from "@/components/data-table/Pagination"
import Search from "@/components/data-table/Search"

type WithId = { _id: string }

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filters?: React.ReactNode
  isLoading?: boolean
  rowSelection?: RowSelectionState
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

// TODO: Fix cell width changes when content changes

const DataTable = <TData extends WithId, TValue>({
  columns,
  data,
  filters,
  isLoading,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue>) => {
  const ref = useRef<VirtuosoHandle>(null)

  const [pagination, setPagination] = usePaginationParams()
  const [search, setSearch] = useSearchParams()
  const [sorting, setSorting] = useSortingParams()
  const [columnFilters, setColumnFilters] = useFilterParams()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      globalFilter: search,
      sorting,
      columnFilters,
      columnVisibility,
      ...(rowSelection && { rowSelection }),
    },
    getRowId: (row) => row._id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
  })

  useEffect(() => {
    ref.current?.scrollToIndex({ index: 0, align: "start" })
  }, [pagination.pageIndex])

  const { rows } = table.getRowModel()

  return !isLoading ? (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto flex flex-wrap items-center gap-2">
          <ColumnToggle table={table} />
          {filters}
        </div>

        <Search search={search} setSearch={setSearch} />
      </div>

      <TableVirtuoso
        ref={ref}
        className="min-h-96 flex-shrink flex-grow basis-0 rounded-md border"
        totalCount={rows.length}
        components={{
          Table: (props) => <Table {...props} />,
          TableHead: (props) => (
            <TableHeader
              className="bg-card sticky top-0 z-10 [&_tr]:border-b-0"
              {...props}
            />
          ),
          TableBody: ({ className, ...props }) => (
            <TableBody
              className={cn("[&_tr:last-child]:border-b", className)}
              {...props}
            />
          ),
          TableRow: (props) => {
            const index = props["data-index"]
            const row = rows[index]

            if (!row) return null

            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                {...props}
              />
            )
          },
          EmptyPlaceholder: () => (
            <TableBody className="[&_tr:last-child]:border-b">
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <p className="flex h-9 items-center justify-center">
                    No results
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          ),
        }}
        fixedHeaderContent={() => (
          <>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.headerClassName}
                    colSpan={header.colSpan}
                  >
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TableHead colSpan={columns.length} className="bg-border h-px" />
            </TableRow>
          </>
        )}
        itemContent={(index) =>
          rows[index].getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={cn(
                "break-words whitespace-normal",
                cell.column.columnDef.meta?.cellClassName
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))
        }
      />

      <Pagination table={table} />
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-4">
      <Skeleton className="h-9" />
      <Skeleton className="min-h-96 flex-1" />
      <Skeleton className="h-9" />
    </div>
  )
}

export default DataTable
