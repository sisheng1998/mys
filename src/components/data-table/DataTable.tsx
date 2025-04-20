"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  usePaginationParams,
  useSearchParams,
  useSortingParams,
} from "@/hooks/use-data-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ColumnToggle from "@/components/data-table/ColumnToggle"
import Pagination from "@/components/data-table/Pagination"
import Search from "@/components/data-table/Search"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}

const DataTable = <TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) => {
  const [pagination, setPagination] = usePaginationParams()
  const [search, setSearch] = useSearchParams()
  const [sorting, setSorting] = useSortingParams()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      globalFilter: search,
      sorting,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearch,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  })

  return !isLoading ? (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ColumnToggle table={table} />

        <div className="flex-1" />

        <Search search={search} setSearch={setSearch} />
      </div>

      <TableContainer className="max-h-96 rounded-md border">
        <Table className="table-fixed">
          <TableHeader className="bg-accent sticky top-0 z-10 shadow-[inset_0_-1px_0_0_var(--color-border)] [&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.headerClassName}
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
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.cellClassName}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination table={table} />
    </div>
  ) : (
    <Skeleton className="h-[30.5rem]" />
  )
}

export default DataTable
