"use client"

import React, { memo, useEffect, useMemo, useRef, useState } from "react"
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

import { calculateColumnSizing, getColumnSignature } from "@/lib/data-table"
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
import Search, { searchFilterFn } from "@/components/data-table/Search"
import { useDataTable } from "@/contexts/data-table"

type WithId = { _id: string }

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filters?: React.ReactNode
  isLoading?: boolean
  rowSelection?: RowSelectionState
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
  footer?: React.ReactNode
}

const DataTable = <TData extends WithId, TValue>({
  columns,
  data,
  filters,
  isLoading,
  rowSelection,
  setRowSelection,
  footer,
}: DataTableProps<TData, TValue>) => {
  const [pagination, setPagination] = usePaginationParams()
  const [search, setSearch] = useSearchParams()
  const [sorting, setSorting] = useSortingParams()
  const [columnFilters, setColumnFilters] = useFilterParams()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const { setTable } = useDataTable<TData>()

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
    globalFilterFn: searchFilterFn,
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
    setTable(table)
  }, [table, setTable])

  useEffect(() => {
    if (data.length === 0) return

    const currentPageIndex = table.getState().pagination.pageIndex
    const lastPageIndex = table.getPageCount() - 1

    if (currentPageIndex > lastPageIndex) {
      table.setPageIndex(lastPageIndex)
    }
  }, [table, data.length])

  return (
    <div className="relative flex flex-1 flex-col">
      {isLoading && (
        <div className="bg-card absolute inset-0 z-20 flex flex-1 flex-col gap-4">
          <Skeleton className="h-9" />
          <Skeleton className="min-h-96 flex-1" />
          <Skeleton className="h-9" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-auto flex flex-wrap items-center gap-2">
            <ColumnToggle table={table} />
            {filters}
          </div>

          <Search search={search} setSearch={table.setGlobalFilter} />
        </div>

        <VirtualizedDataTable table={table} hasFooter={!!footer} />

        {footer && (
          <div className="bg-card -mt-4 rounded-b-md border border-t-0">
            {footer}
          </div>
        )}

        <Pagination table={table} />
      </div>
    </div>
  )
}

export default DataTable

export const VirtualizedDataTable = <TData,>({
  table,
  hasFooter = false,
}: {
  table: TableType<TData>
  hasFooter?: boolean
}) => {
  const ref = useRef<TableVirtuosoHandle>(null)
  const scrollerRef = useRef<HTMLElement | Window>(null)
  const lastWidthRef = useRef<number>(0)

  const [hasScrollbar, setHasScrollbar] = useState<boolean>(false)

  const columns = table.getAllLeafColumns()
  const { rows } = table.getRowModel()
  const {
    pagination: { pageIndex },
    columnSizingInfo,
    columnSizing,
  } = table.getState()

  const { columnSizingMap, setColumnSizingMap } = useDataTable()
  const columnSignature = useMemo(() => getColumnSignature(columns), [columns])
  const initialSizing = columnSizingMap[columnSignature] || {}

  useEffect(() => {
    if (Object.keys(initialSizing).length === 0) return
    table.setColumnSizing(initialSizing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--column-${header.column.id}-size`] = header.column.getSize()
    }

    return colSizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo, columnSizing])

  useEffect(() => {
    ref.current?.scrollToIndex({ index: 0, align: "start" })
  }, [pageIndex])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!(scroller instanceof HTMLElement)) return

    const resizeObserver = new ResizeObserver(() => {
      const hasScrollbar = scroller.scrollHeight > scroller.clientHeight
      setHasScrollbar(hasScrollbar)

      const width = scroller.clientWidth - (hasScrollbar ? 0 : 12)
      if (width === lastWidthRef.current) return
      lastWidthRef.current = width

      const headers = table.getFlatHeaders()
      const columnSizing = calculateColumnSizing(headers, width)

      table.setColumnSizing(columnSizing)
      setColumnSizingMap((prev) => ({
        ...prev,
        [columnSignature]: columnSizing,
      }))
    })

    resizeObserver.observe(scroller)

    return () => resizeObserver.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TableVirtuoso
      ref={ref}
      scrollerRef={(ref) => (scrollerRef.current = ref)}
      className={cn(
        "min-h-96 flex-shrink flex-grow basis-0 rounded-md border",
        hasFooter && "rounded-b-none"
      )}
      totalCount={rows.length}
      defaultItemHeight={53}
      increaseViewportBy={150}
      components={{
        Table: ({ style, ...props }) => (
          <Table
            className={cn(
              "table-fixed border-separate border-spacing-0",
              hasScrollbar && "[&_tr:last-child_td]:border-b-transparent"
            )}
            style={{
              ...style,
              ...columnSizeVars,
            }}
            {...props}
          />
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
              className="data-[state=selected]:bg-muted/25"
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
      itemContent={(index) => <MemoizedRow row={rows[index] as Row<unknown>} />}
    />
  )
}

const MemoizedHeader = memo(
  ({ headerGroups }: { headerGroups: HeaderGroup<unknown>[] }) =>
    headerGroups.map((headerGroup) => (
      <TableRow key={headerGroup.id} className="hover:bg-transparent">
        {headerGroup.headers.map((header) => (
          <TableHead
            key={header.id}
            className={cn(
              "border-b",
              header.column.columnDef.meta?.headerClassName
            )}
            colSpan={header.colSpan}
            style={{
              width: `calc(var(--header-${header.id}-size) * 1px)`,
            }}
          >
            {!header.isPlaceholder &&
              flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))
)
MemoizedHeader.displayName = "MemoizedHeader"

const MemoizedRow = memo(({ row }: { row: Row<unknown> }) =>
  row.getVisibleCells().map((cell) => (
    <TableCell
      key={cell.id}
      className={cn(
        "border-b whitespace-normal",
        cell.column.columnDef.meta?.cellClassName
      )}
      style={{ width: `calc(var(--column-${cell.column.id}-size) * 1px)` }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  ))
)
MemoizedRow.displayName = "MemoizedRow"
