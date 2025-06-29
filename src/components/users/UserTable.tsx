"use client"

import React, { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import { User } from "@/types/user"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useDialog } from "@/hooks/use-dialog"
import { useQuery } from "@/hooks/use-query"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ColumnHeader, {
  multiSelectFilter,
} from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import DeleteUser from "@/components/users/DeleteUser"
import StatusFilter from "@/components/users/StatusFilter"
import UpdateStatus from "@/components/users/UpdateStatus"
import { useAuth } from "@/contexts/auth"

import { api } from "@cvx/_generated/api"

const UserTable = () => {
  const { user } = useAuth()

  const { data = [], status } = useQuery(api.users.queries.list)

  const [selectedUser, setSelectedUser] = useState<User>()

  const deleteUserDialog = useDialog()

  const columns = useMemo(
    (): ColumnDef<User>[] => [
      {
        accessorKey: "index",
        header: ({ column }) => <ColumnHeader column={column} title="No." />,
        cell: ({ row, table }) => getRowNumber(row, table),
        enableSorting: false,
        enableHiding: false,
        size: 64,
        meta: {
          headerClassName: cn("text-center"),
          cellClassName: cn("text-center"),
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <ColumnHeader column={column} title="Name" />,
        cell: (info) => info.getValue() || "-",
        minSize: 160,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <ColumnHeader column={column} title="Email" />,
        minSize: 160,
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
        size: 128,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setSelectedUser(row.original)
                  deleteUserDialog.trigger()
                }}
                disabled={row.original._id === user._id}
              >
                <Trash2 className="text-destructive" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">Delete</TooltipContent>
          </Tooltip>
        ),
        enableHiding: false,
        size: 64,
        meta: {
          cellClassName: cn("text-center"),
        },
      },
    ],
    [deleteUserDialog, user]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filters={(table) => <StatusFilter table={table} />}
        isLoading={status === "pending"}
      />

      <DeleteUser user={selectedUser} {...deleteUserDialog.props} />
    </>
  )
}

export default UserTable
