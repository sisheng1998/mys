"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ColumnDef, RowSelectionState } from "@tanstack/react-table"

import { Category } from "@/types/category"
import { EventRecord } from "@/types/event"
import { getRowNumber } from "@/lib/data-table"
import { formatDate, formatTime } from "@/lib/date"
import { getNameWithTitle } from "@/lib/name"
import { CURRENCY_FORMAT_OPTIONS, formatCurrency } from "@/lib/number"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
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
import DeleteEventRecord from "@/components/events/DeleteEventRecord"
import EditEventRecord from "@/components/events/EditEventRecord"
import CategoryFilter from "@/components/templates/CategoryFilter"

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
  const { _id } = useParams<{ _id: Id<"events"> }>()

  const { data = [], status } = useQuery(api.events.queries.getRecords, {
    _id,
  })

  const columns: ColumnDef<EventRecord>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      meta: {
        headerClassName: cn("w-8 text-center"),
        cellClassName: cn("text-center"),
      },
    },
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
      id: "donor",
      header: ({ column }) => <ColumnHeader column={column} title="Donor" />,
      accessorFn: (row) => getNameWithTitle(row.name, row.title),
    },
    {
      accessorKey: "category",
      filterFn: multiSelectFilter,
      header: ({ column }) => <ColumnHeader column={column} title="Category" />,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <ColumnHeader
          className="-mr-2.5 ml-0 flex-row-reverse"
          column={column}
          title="Amount (RM)"
        />
      ),
      cell: (info) =>
        formatCurrency(info.getValue() as number, undefined, {
          ...CURRENCY_FORMAT_OPTIONS,
          style: "decimal",
        }),
      meta: {
        headerClassName: cn("text-right"),
        cellClassName: cn("text-right"),
      },
    },
    {
      id: "date",
      header: ({ column }) => <ColumnHeader column={column} title="Date" />,
      accessorFn: (row) => formatDate(row._creationTime),
      cell: ({ cell, row }) => (
        <Tooltip>
          <TooltipTrigger className="cursor-text">
            {cell.getValue() as string}
          </TooltipTrigger>

          <TooltipContent side="bottom">
            Recorded on {cell.getValue() as string}, at{" "}
            {formatTime(row.original._creationTime)}
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <>
          <EditEventRecord eventRecord={row.original} categories={categories} />
          <DeleteEventRecord eventRecord={row.original} />
        </>
      ),
      enableHiding: false,
      meta: {
        headerClassName: cn("w-24"),
        cellClassName: cn("text-center"),
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      filters={<CategoryFilter categories={categories} />}
      isLoading={status === "pending"}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  )
}

export default DonationTable
