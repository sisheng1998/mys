"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"

import { Category } from "@/types/category"
import { TemplateRecord } from "@/types/template"
import { getRowNumber } from "@/lib/data-table"
import { getNameWithTitle } from "@/lib/name"
import { CURRENCY_FORMAT_OPTIONS, formatCurrency } from "@/lib/number"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import ColumnHeader, {
  multiSelectFilter,
} from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import CategoryFilter from "@/components/templates/CategoryFilter"
import DeleteTemplateRecord from "@/components/templates/DeleteTemplateRecord"
import EditTemplateRecord from "@/components/templates/EditTemplateRecord"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const DonationTable = ({ categories }: { categories: Category[] }) => {
  const { _id } = useParams<{ _id: Id<"templates"> }>()

  const { data = [], status } = useQuery(api.templates.queries.getRecords, {
    _id,
  })

  const columns: ColumnDef<TemplateRecord>[] = [
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
      header: ({ column }) => <ColumnHeader column={column} title="Donor" />,
      cell: (info) =>
        getNameWithTitle(info.getValue() as string, info.row.original.title),
    },
    {
      accessorKey: "category",
      filterFn: multiSelectFilter,
      header: ({ column }) => <ColumnHeader column={column} title="Category" />,
      cell: (info) => info.getValue(),
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
      id: "actions",
      cell: ({ row }) => (
        <>
          <EditTemplateRecord
            templateRecord={row.original}
            categories={categories}
          />
          <DeleteTemplateRecord templateRecord={row.original} />
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
    />
  )
}

export default DonationTable
