"use client"

import React, { useState } from "react"
import { RowSelectionState } from "@tanstack/react-table"
import { Preloaded, usePreloadedQuery } from "convex/react"

import { Category } from "@/types/category"
import { Event } from "@/types/event"
import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddEventRecord from "@/components/events/AddEventRecord"
import DeleteEventRecords from "@/components/events/DeleteEventRecords"
import DonationStats from "@/components/events/DonationStats"
import DonationTable from "@/components/events/DonationTable"
import EditEvent from "@/components/events/EditEvent"
import UpdateEventRecordAmount from "@/components/events/UpdateEventRecordAmount"
import { Breadcrumb } from "@/contexts/breadcrumb"

import { api } from "@cvx/_generated/api"

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

            <div className="-m-2">
              <EditEvent
                event={
                  {
                    ...event,
                    categories: event.categories.map(
                      (category) => category._id
                    ),
                  } as Event
                }
              />
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

  return (
    <Card className="flex-1 lg:col-span-2">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Donations</CardTitle>
          <CardDescription>List of all donation records</CardDescription>
        </div>

        {selectedIds.length !== 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <UpdateEventRecordAmount ids={selectedIds} />

            <DeleteEventRecords
              ids={selectedIds}
              setRowSelection={setRowSelection}
            />
          </div>
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
