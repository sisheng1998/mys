"use client"

import React, { createContext, ReactNode, useContext, useState } from "react"
import { ColumnSizingState, Table } from "@tanstack/react-table"

type ColumnSizingMap = Record<string, ColumnSizingState>
type TableState<T> = Table<T> | undefined
type SetState<T> = React.Dispatch<React.SetStateAction<T>>

interface DataTableContextType<T> {
  table: TableState<T>
  setTable: SetState<TableState<T>>
  columnSizingMap: ColumnSizingMap
  setColumnSizingMap: SetState<ColumnSizingMap>
}

const DataTable = createContext<DataTableContextType<unknown> | undefined>(
  undefined
)

type DataTableProviderProps = {
  children: ReactNode
}

export const DataTableProvider = ({ children }: DataTableProviderProps) => {
  const [table, setTable] = useState<Table<unknown> | undefined>()
  const [columnSizingMap, setColumnSizingMap] = useState<ColumnSizingMap>({})

  return (
    <DataTable.Provider
      value={{
        table,
        setTable,
        columnSizingMap,
        setColumnSizingMap,
      }}
    >
      {children}
    </DataTable.Provider>
  )
}

export const useDataTable = <TData,>(): DataTableContextType<TData> => {
  const context = useContext(DataTable)

  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider")
  }

  const { table, ...props } = context

  return {
    table: table ? { ...table } : undefined,
    ...props,
  } as DataTableContextType<TData>
}
