"use client"

import React, { createContext, ReactNode, useContext, useState } from "react"
import { Table } from "@tanstack/react-table"

type DataTableType = {
  table: Table<unknown> | undefined
  setTable: React.Dispatch<React.SetStateAction<Table<unknown> | undefined>>
}

const DataTable = createContext<DataTableType | undefined>(undefined)

type DataTableProviderProps = {
  children: ReactNode
}

export const DataTableProvider = ({ children }: DataTableProviderProps) => {
  const [table, setTable] = useState<Table<unknown> | undefined>()

  return (
    <DataTable.Provider
      value={{
        table,
        setTable,
      }}
    >
      {children}
    </DataTable.Provider>
  )
}

export const useDataTable = <TData,>(): {
  table: Table<TData> | undefined
  setTable: React.Dispatch<React.SetStateAction<Table<TData> | undefined>>
} => {
  const context = useContext(DataTable)

  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider")
  }

  const { table, setTable } = context

  return {
    table: (table ? { ...table } : undefined) as Table<TData> | undefined,
    setTable: setTable as React.Dispatch<
      React.SetStateAction<Table<TData> | undefined>
    >,
  }
}
