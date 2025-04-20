"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { User } from "@/types/user"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import ColumnHeader from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import DeleteUser from "@/components/users/DeleteUser"
import { useAuth } from "@/contexts/auth"

import { api } from "@cvx/_generated/api"

const UserTable = () => {
  const { user } = useAuth()

  const { data = [], status } = useQuery(api.users.queries.list)

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
      id: "actions",
      cell: ({ row }) => {
        const selectedUser = row.original

        if (selectedUser._id === user._id) return null

        return <DeleteUser user={selectedUser} />
      },
      enableHiding: false,
      meta: {
        headerClassName: cn("w-20"),
        cellClassName: cn("text-center"),
      },
    },
  ]

  return (
    <DataTable columns={columns} data={data} isLoading={status === "pending"} />
  )
}

export default UserTable
