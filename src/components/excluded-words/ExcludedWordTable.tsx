"use client"

import React, { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import { ExcludedWord } from "@/types/excludedWord"
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
import DeleteExcludedWord from "@/components/excluded-words/DeleteExcludedWord"
import StatusFilter from "@/components/excluded-words/StatusFilter"
import UpdateStatus from "@/components/excluded-words/UpdateStatus"

import { api } from "@cvx/_generated/api"

const ExcludedWordTable = () => {
  const { data = [], status } = useQuery(api.excludedWords.queries.list)

  const [selectedWord, setSelectedWord] = useState<ExcludedWord>()

  const deleteExcludedWordDialog = useDialog()

  const columns = useMemo(
    (): ColumnDef<ExcludedWord>[] => [
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
        accessorKey: "word",
        header: ({ column }) => <ColumnHeader column={column} title="Word" />,
        cell: (info) => info.getValue() || "-",
        minSize: 160,
        meta: {
          flex: 1,
        },
      },
      {
        id: "status",
        accessorKey: "isActive",
        filterFn: multiSelectFilter,
        header: ({ column }) => <ColumnHeader column={column} title="Status" />,
        cell: (info) => (
          <UpdateStatus
            excludedWord={info.row.original}
            isActive={info.getValue() as boolean}
          />
        ),
        minSize: 160,
        meta: {
          flex: 0.5,
        },
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
                  setSelectedWord(row.original)
                  deleteExcludedWordDialog.trigger()
                }}
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
    [deleteExcludedWordDialog]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filters={<StatusFilter />}
        isLoading={status === "pending"}
      />

      <DeleteExcludedWord
        excludedWord={selectedWord}
        {...deleteExcludedWordDialog.props}
      />
    </>
  )
}

export default ExcludedWordTable
