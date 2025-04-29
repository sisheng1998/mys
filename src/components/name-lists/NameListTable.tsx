"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { User } from "@/types/user"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import ColumnHeader, {
  multiSelectFilter,
} from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import DeleteUser from "@/components/users/DeleteUser"
import StatusFilter from "@/components/users/StatusFilter"
import UpdateStatus from "@/components/users/UpdateStatus"
import { useAuth } from "@/contexts/auth"

import { api } from "@cvx/_generated/api"

const NameListTable = () => {
  const { user } = useAuth()

  const { data = [], status } = useQuery(api.nameLists.queries.list)

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
    {
      id: "status",
      accessorKey: "isAuthorized",
      filterFn: multiSelectFilter,
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: (info) => (
        <UpdateStatus
          user={info.row.original}
          isAuthorized={info.getValue() as boolean}
          disabled={info.row.original._id === user._id}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DeleteUser
          user={row.original}
          disabled={row.original._id === user._id}
        />
      ),
      enableHiding: false,
      meta: {
        headerClassName: cn("w-20"),
        cellClassName: cn("text-center"),
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      filters={<StatusFilter />}
      isLoading={status === "pending"}
    />
  )
}

export default NameListTable
