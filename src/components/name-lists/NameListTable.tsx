"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { NameListRecord } from "@/types/nameList"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import ColumnHeader, {
  multiSelectFilter,
} from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import DeleteNameListRecord from "@/components/name-lists/DeleteNameListRecord"
import TitleFilter from "@/components/name-lists/TitleFilter"

import { api } from "@cvx/_generated/api"

const NameListTable = () => {
  const { data = [], status } = useQuery(api.nameLists.queries.list)

  const columns: ColumnDef<NameListRecord>[] = [
    {
      accessorKey: "index",
      header: ({ column }) => <ColumnHeader column={column} title="No." />,
      cell: ({ row, table }) => getRowNumber(row, table),
      enableSorting: false,
      enableHiding: false,
      meta: {
        headerClassName: cn("w-16 text-center"),
        cellClassName: cn("text-center"),
      },
    },
    {
      accessorKey: "title",
      filterFn: multiSelectFilter,
      header: ({ column }) => <ColumnHeader column={column} title="Title" />,
      cell: (info) => info.getValue() || "-",
      meta: {
        headerClassName: cn("w-32"),
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Name" />,
      cell: (info) => info.getValue() || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => <DeleteNameListRecord nameListRecord={row.original} />,
      enableHiding: false,
      meta: {
        headerClassName: cn("w-20"),
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      filters={<TitleFilter />}
      isLoading={status === "pending"}
    />
  )
}

export default NameListTable
