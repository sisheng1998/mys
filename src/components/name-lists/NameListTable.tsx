"use client"

import React, { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"

import { NameListRecord } from "@/types/nameList"
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
import DeleteNameListRecord from "@/components/name-lists/DeleteNameListRecord"
import TitleFilter from "@/components/name-lists/TitleFilter"
import UpsertNameListRecord from "@/components/name-lists/UpsertNameListRecord"

import { api } from "@cvx/_generated/api"

const NameListTable = () => {
  const { data = [], status } = useQuery(api.nameLists.queries.list)

  const [selectedRecord, setSelectedRecord] = useState<NameListRecord>()

  const upsertNameListRecordDialog = useDialog()
  const deleteNameListRecordDialog = useDialog()

  const columns = useMemo(
    (): ColumnDef<NameListRecord>[] => [
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setSelectedRecord(row.original)
                    upsertNameListRecordDialog.trigger()
                  }}
                >
                  <Edit />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setSelectedRecord(row.original)
                    deleteNameListRecordDialog.trigger()
                  }}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">Delete</TooltipContent>
            </Tooltip>
          </>
        ),
        enableHiding: false,
        size: 96,
        meta: {
          cellClassName: cn("text-center"),
        },
      },
    ],
    [deleteNameListRecordDialog, upsertNameListRecordDialog]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filters={(table) => <TitleFilter table={table} />}
        isLoading={status === "pending"}
      />

      <UpsertNameListRecord
        nameListRecord={selectedRecord}
        {...upsertNameListRecordDialog.props}
      />

      <DeleteNameListRecord
        nameListRecord={selectedRecord}
        {...deleteNameListRecordDialog.props}
      />
    </>
  )
}

export default NameListTable
