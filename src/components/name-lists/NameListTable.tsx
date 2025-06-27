"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"

import { NameListRecord } from "@/types/nameList"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ColumnHeader, {
  multiSelectFilter,
} from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import DeleteNameListRecord from "@/components/name-lists/DeleteNameListRecord"
import TitleFilter from "@/components/name-lists/TitleFilter"
import UpsertNameListRecord from "@/components/name-lists/UpsertNameListRecord"

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
      size: 64,
      meta: {
        headerClassName: cn("text-center"),
        cellClassName: cn("text-center"),
      },
    },
    {
      accessorKey: "title",
      filterFn: multiSelectFilter,
      header: ({ column }) => <ColumnHeader column={column} title="Title" />,
      cell: (info) => info.getValue() || "-",
      size: 128,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Name" />,
      minSize: 160,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <>
          <UpsertNameListRecord nameListRecord={row.original}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Edit />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>

              <TooltipContent side="bottom">Edit</TooltipContent>
            </Tooltip>
          </UpsertNameListRecord>

          <DeleteNameListRecord nameListRecord={row.original} />
        </>
      ),
      enableHiding: false,
      size: 96,
      meta: {
        cellClassName: cn("text-center"),
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      filters={(table) => <TitleFilter table={table} />}
      isLoading={status === "pending"}
    />
  )
}

export default NameListTable
