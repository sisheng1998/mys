"use client"

import React, { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"

import { Category } from "@/types/category"
import { TemplateRecord } from "@/types/template"
import { getRowNumber } from "@/lib/data-table"
import { getNameWithTitle } from "@/lib/name"
import { formatCurrency } from "@/lib/number"
import { cn } from "@/lib/utils"
import { useDialog } from "@/hooks/use-dialog"
import { useQuery } from "@/hooks/use-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ColumnHeader, {
  multiSelectFilter,
} from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import CategoryFilter from "@/components/templates/CategoryFilter"
import DeleteTemplateRecord from "@/components/templates/DeleteTemplateRecord"
import EditTemplateRecord from "@/components/templates/EditTemplateRecord"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const DonationTable = ({
  categories,
  rowSelection,
  setRowSelection,
}: {
  categories: Category[]
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
}) => {
  const { _id } = useParams<{ _id: Id<"templates"> }>()

  const { data = [], status } = useQuery(api.templates.queries.getRecords, {
    _id,
  })

  const [selectedRecord, setSelectedRecord] = useState<TemplateRecord>()

  const editTemplateRecordDialog = useDialog()
  const deleteTemplateRecordDialog = useDialog()

  const columns = useMemo(
    (): ColumnDef<TemplateRecord>[] => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
        meta: {
          headerClassName: cn("text-center"),
          cellClassName: cn("text-center"),
        },
      },
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
        id: "donor",
        header: ({ column }) => <ColumnHeader column={column} title="Donor" />,
        accessorFn: (row) => getNameWithTitle(row.name, row.title),
        minSize: 160,
      },
      {
        accessorKey: "category",
        filterFn: multiSelectFilter,
        header: ({ column }) => (
          <ColumnHeader column={column} title="Category" />
        ),
        size: 128,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <ColumnHeader
            className="-mr-2.5 ml-0 flex-row-reverse"
            column={column}
            title="Amount"
          />
        ),
        cell: (info) => formatCurrency(info.getValue() as number),
        size: 96,
        meta: {
          headerClassName: cn("text-right"),
          cellClassName: cn("text-right"),
        },
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
                    editTemplateRecordDialog.trigger()
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
                    deleteTemplateRecordDialog.trigger()
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
    [editTemplateRecordDialog, deleteTemplateRecordDialog]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filters={(table) => (
          <CategoryFilter table={table} categories={categories} />
        )}
        isLoading={status === "pending"}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      <EditTemplateRecord
        templateRecord={selectedRecord}
        categories={categories}
        {...editTemplateRecordDialog.props}
      />

      <DeleteTemplateRecord
        templateRecord={selectedRecord}
        {...deleteTemplateRecordDialog.props}
      />
    </>
  )
}

export default DonationTable
