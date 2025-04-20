"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { User } from "@/types/user"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import ColumnHeader from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"

import { api } from "@cvx/_generated/api"

const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: (info) => info.getValue() || "-",
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: (info) => info.getValue() || "-",
  },
]

const UserTable = () => {
  const { data = [] } = useQuery(api.users.queries.list)

  return <DataTable columns={columns} data={data} />
}

export default UserTable
