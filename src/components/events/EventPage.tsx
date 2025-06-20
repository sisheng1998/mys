"use client"

import React, { useState } from "react"
import { RowSelectionState } from "@tanstack/react-table"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { Check, Edit, LayoutList, Loader2, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { Category } from "@/types/category"
import { Event } from "@/types/event"
import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { handleMutationError } from "@/lib/error"
import { cn } from "@/lib/utils"
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
import AddEventRecord from "@/components/events/AddEventRecord"
import DonationStats from "@/components/events/DonationStats"
import DonationTable from "@/components/events/DonationTable"
import EditEvent from "@/components/events/EditEvent"
import ExportEvent from "@/components/events/ExportEvent"
import DeleteRecords from "@/components/records/DeleteRecords"
import UpdateRecordAmount from "@/components/records/UpdateRecordAmount"
import { Breadcrumb } from "@/contexts/breadcrumb"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const EventPage = ({
  preloadedEvent,
}: {
  preloadedEvent: Preloaded<typeof api.events.queries.get>
}) => {
  const event = usePreloadedQuery(preloadedEvent)

  return (
    <>
      <Breadcrumb
        links={[{ label: "Events", href: "/" }, { label: event.name }]}
      />

      <div className="flex flex-1 flex-col gap-4 lg:grid lg:grid-cols-3">
        <Card className="lg:self-start">
          <CardHeader className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <CardTitle>{event.name}</CardTitle>

              <div className="-mb-1 flex flex-wrap items-center gap-1">
                <Badge>{formatDate(event.date)}</Badge>
                <Badge>
                  {getLunarDateInChinese(getLunarDateFromSolarDate(event.date))}
                </Badge>
              </div>
            </div>

            <div className="-m-2 flex items-center">
              <EditEvent
                event={
                  {
                    ...event,
                    categories: event.categories.map((category) => ({
                      _id: category._id,
                      name: category.name,
                    })),
                  } as Event
                }
              />

              <ExportEvent _id={event._id} categories={event.categories} />
            </div>
          </CardHeader>

          <DonationStats categories={event.categories} />
        </Card>

        <DonationList categories={event.categories} />
      </div>
    </>
  )
}

export default EventPage

const DonationList = ({ categories }: { categories: Category[] }) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const selectedIds = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  )

  const [isPaidLoading, setIsPaidLoading] = useState<boolean>(false)
  const [isUnpaidLoading, setIsUnpaidLoading] = useState<boolean>(false)

  const updateRecordAmountDialog = useDialog()
  const deleteRecordsDialog = useDialog()

  const updateEventRecordPaymentStatus = useMutation(
    api.events.mutations.updateEventRecordPaymentStatus
  )
  const updateEventRecordAmount = useMutation(
    api.events.mutations.updateEventRecordAmount
  )
  const deleteEventRecords = useMutation(
    api.events.mutations.deleteEventRecords
  )

  const handleUpdatePaymentStatus = async (isPaid: boolean) => {
    try {
      if (isPaid) {
        setIsPaidLoading(true)
      } else {
        setIsUnpaidLoading(true)
      }

      await updateEventRecordPaymentStatus({
        ids: selectedIds as Id<"eventRecords">[],
        isPaid,
      })

      toast.success(
        `${selectedIds.length} record(s) marked as ${
          isPaid ? "paid" : "unpaid"
        }`
      )
    } catch (error) {
      handleMutationError(error)
    } finally {
      if (isPaid) {
        setIsPaidLoading(false)
      } else {
        setIsUnpaidLoading(false)
      }
    }
  }

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

                {[true, false].map((value, index) => {
                  const isLoading = value ? isPaidLoading : isUnpaidLoading
                  const Icon = isLoading ? Loader2 : value ? Check : X

                  return (
                    <DropdownMenuItem
                      key={index}
                      onSelect={(e) => {
                        e.preventDefault()
                        handleUpdatePaymentStatus(value)
                      }}
                      disabled={isPaidLoading || isUnpaidLoading}
                    >
                      <Icon className={cn(isLoading && "animate-spin")} />
                      Mark as {value ? "Paid" : "Unpaid"}
                    </DropdownMenuItem>
                  )
                })}

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
                await updateEventRecordAmount({
                  ids: selectedIds as Id<"eventRecords">[],
                  amount,
                })
              }}
              {...updateRecordAmountDialog.props}
            />

            <DeleteRecords
              ids={selectedIds}
              handleDeleteRecords={async () => {
                await deleteEventRecords({
                  ids: selectedIds as Id<"eventRecords">[],
                })
                setRowSelection({})
              }}
              {...deleteRecordsDialog.props}
            />
          </>
        ) : (
          <AddEventRecord categories={categories} />
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
