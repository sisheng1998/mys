import { Row, Table } from "@tanstack/react-table"

export const getRowNumber = <T>(row: Row<T>, table: Table<T>): number => {
  const pageSize = table.getState().pagination.pageSize
  const pageIndex = table.getState().pagination.pageIndex

  const currentPageRows = table.getRowModel().rows
  const rowIndexOnPage = currentPageRows.findIndex((r) => r.id === row.id)

  return pageIndex * pageSize + rowIndexOnPage + 1
}
