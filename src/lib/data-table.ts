import { CSSProperties } from "react"
import {
  Cell,
  defaultColumnSizing,
  Header,
  Row,
  Table,
} from "@tanstack/react-table"

export const getRowNumber = <T>(row: Row<T>, table: Table<T>): string => {
  const pageSize = table.getState().pagination.pageSize
  const pageIndex = table.getState().pagination.pageIndex

  const currentPageRows = table.getRowModel().rows
  const rowIndexOnPage = currentPageRows.findIndex((r) => r.id === row.id)

  const rowNumber = pageIndex * pageSize + rowIndexOnPage + 1

  return `${rowNumber}.`
}

export const getColumnSize = <T>(
  item: Cell<T, unknown> | Header<T, unknown>
): CSSProperties => {
  const { minSize, size, maxSize } = item.column.columnDef
  const style: CSSProperties = {}

  if (minSize !== defaultColumnSizing.minSize) {
    style.minWidth = minSize
  }

  if (size !== defaultColumnSizing.size) {
    style.minWidth = size
    style.width = size
  }

  if (maxSize !== defaultColumnSizing.maxSize) {
    style.maxWidth = maxSize
  }

  return style
}
