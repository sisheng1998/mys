import { defaultColumnSizing, Header, Row, Table } from "@tanstack/react-table"

export const getRowNumber = <T>(row: Row<T>, table: Table<T>): string => {
  const pageSize = table.getState().pagination.pageSize
  const pageIndex = table.getState().pagination.pageIndex

  const currentPageRows = table.getRowModel().rows
  const rowIndexOnPage = currentPageRows.findIndex((r) => r.id === row.id)

  const rowNumber = pageIndex * pageSize + rowIndexOnPage + 1

  return `${rowNumber}.`
}

const getSize = (
  size = defaultColumnSizing.size,
  max = defaultColumnSizing.maxSize,
  min = defaultColumnSizing.minSize
) => Math.max(Math.min(size, max), min)

export const calculateColumnSizing = <DataType>(
  columns: Header<DataType, unknown>[],
  totalWidth: number
): Record<string, number> => {
  const sizing: Record<string, number> = {}

  let totalFixedWidth = 0
  let totalFlex = 0

  const flexColumns: {
    header: Header<DataType, unknown>
    flex: number
    minSize: number
    maxSize: number
  }[] = []

  for (const header of columns) {
    const col = header.column.columnDef
    const flex = col.meta?.flex

    if (typeof flex !== "number") {
      const fixedSize = getSize(col.size, col.maxSize, col.minSize)
      col.size = fixedSize
      sizing[header.column.id] = fixedSize
      totalFixedWidth += fixedSize
    } else {
      const minSize = col.minSize ?? defaultColumnSizing.minSize
      const maxSize = col.maxSize ?? defaultColumnSizing.maxSize
      flexColumns.push({ header, flex, minSize, maxSize })
      totalFlex += flex
    }
  }

  const remainingWidth = totalWidth - totalFixedWidth
  const totalMinFlexWidth = flexColumns.reduce(
    (sum, col) => sum + col.minSize,
    0
  )

  if (remainingWidth <= totalMinFlexWidth) {
    for (const { header, minSize } of flexColumns) {
      header.column.columnDef.size = minSize
      sizing[header.column.id] = minSize
    }
  } else {
    const extraSpace = remainingWidth - totalMinFlexWidth

    for (const { header, flex, minSize, maxSize } of flexColumns) {
      const share = (flex / totalFlex) * extraSpace
      const rawSize = minSize + share
      const finalSize = getSize(rawSize, maxSize, minSize)
      header.column.columnDef.size = finalSize
      sizing[header.column.id] = finalSize
    }
  }

  return sizing
}
