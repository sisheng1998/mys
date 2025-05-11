"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"

import { Category } from "@/types/category"
import { TemplateRecord } from "@/types/template"
import { getRowNumber } from "@/lib/data-table"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import ColumnHeader from "@/components/data-table/ColumnHeader"
import DataTable from "@/components/data-table/DataTable"
import CategoryFilter from "@/components/templates/CategoryFilter"

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
