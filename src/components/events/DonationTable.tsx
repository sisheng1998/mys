"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import { useMutation } from "convex/react"
import { Edit, Loader2, Printer, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Category } from "@/types/category"
import { EventRecord } from "@/types/event"
import { getRowNumber } from "@/lib/data-table"
import { formatDate, formatTime } from "@/lib/date"
import { handleMutationError } from "@/lib/error"
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
import DeleteEventRecord from "@/components/events/DeleteEventRecord"
import EditEventRecord from "@/components/events/EditEventRecord"
import PrintEventRecord from "@/components/events/PrintEventRecord"
import TableFilters from "@/components/events/TableFilters"
import { usePrinter } from "@/contexts/printer"

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
  const { isSupported } = usePrinter()

  const { _id } = useParams<{ _id: Id<"events"> }>()

  const { data = [], status } = useQuery(api.events.queries.getRecords, {
    _id,
  })

  const [selectedRecord, setSelectedRecord] = useState<EventRecord>()

  const editEventRecordDialog = useDialog()
  const printEventRecordDialog = useDialog()
  const deleteEventRecordDialog = useDialog()

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
      header: ({ column }) => <ColumnHeader column={column} title="Category" />,
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
      id: "payment",
      accessorKey: "isPaid",
      filterFn: multiSelectFilter,
      header: ({ column }) => <ColumnHeader column={column} title="Paid?" />,
      cell: ({ cell, row }) => (
        <PaymentStatusCheckbox
          _id={row.original._id}
          isPaid={cell.getValue() as boolean}
        />
      ),
      enableSorting: false,
      size: 64,
      meta: {
        headerClassName: cn("text-center"),
        cellClassName: cn("pr-2! text-center"),
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

          <TooltipContent side="bottom" className="text-center">
            Recorded at
            <br />
            {cell.getValue() as string},{" "}
            {formatTime(row.original._creationTime)}
          </TooltipContent>
        </Tooltip>
      ),
      size: 96,
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
                  editEventRecordDialog.trigger()
                }}
              >
                <Edit />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">Edit</TooltipContent>
          </Tooltip>

          {isSupported && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setSelectedRecord(row.original)
                    printEventRecordDialog.trigger()
                  }}
                >
                  <Printer />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">Print</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setSelectedRecord(row.original)
                  deleteEventRecordDialog.trigger()
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
      size: 128,
      meta: {
        cellClassName: cn("text-center"),
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filters={(table) => (
          <TableFilters table={table} categories={categories} />
        )}
        isLoading={status === "pending"}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      <EditEventRecord
        eventRecord={selectedRecord}
        categories={categories}
        {...editEventRecordDialog.props}
      />

      <PrintEventRecord
        eventRecord={selectedRecord}
        {...printEventRecordDialog.props}
      />

      <DeleteEventRecord
        eventRecord={selectedRecord}
        {...deleteEventRecordDialog.props}
      />
    </>
  )
}

export default DonationTable

const PaymentStatusCheckbox = ({
  _id,
  isPaid,
}: {
  _id: Id<"eventRecords">
  isPaid: boolean
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateEventRecordPaymentStatus = useMutation(
    api.events.mutations.updateEventRecordPaymentStatus
  )

  const handleUpdatePaymentStatus = async (value: boolean) => {
    try {
      setIsLoading(true)

      await updateEventRecordPaymentStatus({
        ids: [_id],
        isPaid: value as boolean,
      })

      toast.success(`Marked as ${value ? "paid" : "unpaid"}`)
    } catch (error) {
      handleMutationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return isLoading ? (
    <div className="flex items-center justify-center">
      <Loader2 className="text-muted-foreground size-4 animate-spin opacity-50" />
    </div>
  ) : (
    <Checkbox checked={isPaid} onCheckedChange={handleUpdatePaymentStatus} />
  )
}
