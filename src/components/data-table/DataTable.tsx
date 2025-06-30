"use client"

import React, { memo, useEffect, useRef, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderGroup,
  Row,
  RowSelectionState,
  Table as TableType,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { TableVirtuoso, TableVirtuosoHandle } from "react-virtuoso"

import { getColumnSize } from "@/lib/data-table"
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
  filters?: (table: TableType<TData>) => React.ReactNode
  isLoading?: boolean
  rowSelection?: RowSelectionState
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

const DataTable = <TData extends WithId, TValue>({
  columns,
  data,
  filters = () => null,
  isLoading,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue>) => {
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
    onGlobalFilterChange: (value) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      setSearch(value)
    },
    onSortingChange: (value) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      setSorting(value)
    },
    onColumnFiltersChange: (value) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      setColumnFilters(value)
    },
    onColumnVisibilityChange: setColumnVisibility,
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    autoResetPageIndex: false,
  })

  useEffect(() => {
    if (data.length === 0) return

    const currentPageIndex = table.getState().pagination.pageIndex
    const lastPageIndex = table.getPageCount() - 1

    if (currentPageIndex > lastPageIndex) {
      table.setPageIndex(lastPageIndex)
    }
  }, [table, data.length])

  return isLoading ? (
    <div className="flex flex-1 flex-col gap-4">
      <Skeleton className="h-9" />
      <Skeleton className="min-h-96 flex-1" />
      <Skeleton className="h-9" />
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto flex flex-wrap items-center gap-2">
          <ColumnToggle table={table} />
          {filters(table)}
        </div>

        <Search search={search} setSearch={table.setGlobalFilter} />
      </div>

      <VirtualizedDataTable table={table} />

      <Pagination table={table} />
    </div>
  )
}

export default DataTable

const VirtualizedDataTable = <TData,>({
  table,
}: {
  table: TableType<TData>
}) => {
  const ref = useRef<TableVirtuosoHandle>(null)
  const scrollerRef = useRef<HTMLElement | Window>(null)

  const [hasScrollbar, setHasScrollbar] = useState<boolean>(false)

  const { rows } = table.getRowModel()
  const pageIndex = table.getState().pagination.pageIndex

  useEffect(() => {
    ref.current?.scrollToIndex({ index: 0, align: "start" })
  }, [pageIndex])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!(scroller instanceof HTMLElement)) return

    const handleResize = () =>
      setHasScrollbar(scroller.scrollHeight > scroller.clientHeight)

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(scroller)

    handleResize()

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <TableVirtuoso
      ref={ref}
      scrollerRef={(ref) => (scrollerRef.current = ref)}
      className="min-h-96 flex-shrink flex-grow basis-0 rounded-md border"
      totalCount={rows.length}
      defaultItemHeight={53}
      components={{
        Table: (props) => (
          <Table className="border-separate border-spacing-0" {...props} />
        ),
        TableHead: (props) => (
          <TableHeader className="bg-card sticky top-0 z-10" {...props} />
        ),
        TableBody: (props) => <TableBody {...props} />,
        TableRow: (props) => {
          const index = props["data-index"]
          const row = rows[index]

          if (!row) return null

          return (
            <TableRow
              data-state={row.getIsSelected() && "selected"}
              {...props}
            />
          )
        },
        EmptyPlaceholder: () => (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="border-b text-center"
              >
                <p className="flex h-9 items-center justify-center">
                  No results
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        ),
      }}
      fixedHeaderContent={() => (
        <MemoizedHeader
          headerGroups={table.getHeaderGroups() as HeaderGroup<unknown>[]}
        />
      )}
      itemContent={(index) => (
        <MemoizedRow
          row={rows[index] as Row<unknown>}
          isLastRow={index === rows.length - 1}
          hasScrollbar={hasScrollbar}
        />
      )}
    />
  )
}

const MemoizedHeader = memo(
  ({ headerGroups }: { headerGroups: HeaderGroup<unknown>[] }) =>
    headerGroups.map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead
            key={header.id}
            className={cn(
              "border-b",
              header.column.columnDef.meta?.headerClassName
            )}
            colSpan={header.colSpan}
            style={getColumnSize(header)}
          >
            {!header.isPlaceholder &&
              flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))
)
MemoizedHeader.displayName = "MemoizedHeader"

const MemoizedRow = memo(
  ({
    row,
    isLastRow,
    hasScrollbar,
  }: {
    row: Row<unknown>
    isLastRow: boolean
    hasScrollbar: boolean
  }) =>
    row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className={cn(
          "border-b whitespace-normal",
          isLastRow && hasScrollbar && "border-b-0",
          cell.column.columnDef.meta?.cellClassName
        )}
        style={getColumnSize(cell)}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))
)
MemoizedRow.displayName = "MemoizedRow"
