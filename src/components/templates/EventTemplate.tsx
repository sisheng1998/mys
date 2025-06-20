"use client"

import React, { useState } from "react"
import { RowSelectionState } from "@tanstack/react-table"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { Edit, LayoutList, Trash2, X } from "lucide-react"

import { Category } from "@/types/category"
import { Template } from "@/types/template"
import { getLunarDateInChinese } from "@/lib/date"
import { useDialog } from "@/hooks/use-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteRecords from "@/components/records/DeleteRecords"
import UpdateRecordAmount from "@/components/records/UpdateRecordAmount"
import AddTemplateRecord from "@/components/templates/AddTemplateRecord"
import DonationStats from "@/components/templates/DonationStats"
import DonationTable from "@/components/templates/DonationTable"
import EditTemplate from "@/components/templates/EditTemplate"
import { Breadcrumb } from "@/contexts/breadcrumb"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const EventTemplate = ({
  preloadedTemplate,
}: {
  preloadedTemplate: Preloaded<typeof api.templates.queries.get>
}) => {
  const template = usePreloadedQuery(preloadedTemplate)

  return (
    <>
      <Breadcrumb
        links={[
          { label: "Templates", href: "/templates" },
          { label: template.name },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 lg:grid lg:grid-cols-3">
        <Card className="lg:self-start">
          <CardHeader className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <CardTitle>{template.name}</CardTitle>

              <div className="-mb-1 flex flex-wrap items-center gap-1">
                {template.dates.map((date) => (
                  <Badge key={date}>{getLunarDateInChinese(date)}</Badge>
                ))}
              </div>
            </div>

            <div className="-m-2">
              <EditTemplate
                template={
                  {
                    ...template,
                    categories: template.categories.map((category) => ({
                      _id: category._id,
                      name: category.name,
                    })),
                  } as Template
                }
              />
            </div>
          </CardHeader>

          <DonationStats categories={template.categories} />
        </Card>

        <DonationList categories={template.categories} />
      </div>
    </>
  )
}

export default EventTemplate

const DonationList = ({ categories }: { categories: Category[] }) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const selectedIds = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  )

  const updateRecordAmountDialog = useDialog()
  const deleteRecordsDialog = useDialog()

  const updateTemplateRecordAmount = useMutation(
    api.templates.mutations.updateTemplateRecordAmount
  )
  const deleteTemplateRecords = useMutation(
    api.templates.mutations.deleteTemplateRecords
  )

  return (
    <Card className="flex-1 lg:col-span-2">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Donations</CardTitle>
          <CardDescription>List of all donation records</CardDescription>
        </div>

        {selectedIds.length !== 0 ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <LayoutList />
                  <span>Bulk Action(s)</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel>
                  {selectedIds.length} record(s) selected
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={updateRecordAmountDialog.trigger}>
                  <Edit />
                  Edit Amount
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onSelect={deleteRecordsDialog.trigger}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => setRowSelection({})}
                  className="text-muted-foreground"
                >
                  <X />
                  Clear Selection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UpdateRecordAmount
              ids={selectedIds}
              handleUpdateAmount={async (amount) => {
                await updateTemplateRecordAmount({
                  ids: selectedIds as Id<"templateRecords">[],
                  amount,
                })
              }}
              {...updateRecordAmountDialog.props}
            />

            <DeleteRecords
              ids={selectedIds}
              handleDeleteRecords={async () => {
                await deleteTemplateRecords({
                  ids: selectedIds as Id<"templateRecords">[],
                })
                setRowSelection({})
              }}
              {...deleteRecordsDialog.props}
            />
          </>
        ) : (
          <AddTemplateRecord categories={categories} />
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <DonationTable
          categories={categories}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </CardContent>
    </Card>
  )
}
