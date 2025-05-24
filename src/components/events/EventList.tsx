"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { usePaginatedQuery } from "convex/react"
import {
  CircleAlert,
  CircleDollarSign,
  LayoutList,
  Plus,
  Users,
} from "lucide-react"
import { parseAsBoolean, useQueryState } from "nuqs"

import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { formatCurrency } from "@/lib/number"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import DeleteEvent from "@/components/events/DeleteEvent"
import EditEvent from "@/components/events/EditEvent"
import UpsertEvent from "@/components/events/UpsertEvent"
import { IconWithText } from "@/components/templates/TemplateList"

import { api } from "@cvx/_generated/api"

const ITEMS_PER_PAGE = 6

const EventList = () => {
  const [past] = useQueryState("past", parseAsBoolean.withDefault(false))

  const observerRef = useRef<HTMLDivElement>(null)

  const {
    results: data = [],
    status,
    loadMore,
  } = usePaginatedQuery(
    api.events.queries.list,
    { past },
    { initialNumItems: ITEMS_PER_PAGE }
  )

  useEffect(() => {
    const target = observerRef.current
    const hasMore = status === "CanLoadMore"
    const loading = status === "LoadingMore"

    if (!target || !hasMore || loading) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(ITEMS_PER_PAGE)
    )

    observer.observe(target)
    return () => observer.unobserve(target)
  }, [loadMore, status])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
        {status === "LoadingFirstPage" ? (
          <LoadingSkeletons />
        ) : data.length > 0 ? (
          data.map((event) => (
            <Card
              key={event._id}
              className="hover:border-primary relative transition-colors"
            >
              <Link
                href={`/events/${event._id}`}
                className="absolute inset-0"
              />

              <CardHeader className="gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="leading-5">{event.name}</CardTitle>

                  <div className="relative z-10 -m-2 flex items-center">
                    <EditEvent event={event} />
                    <DeleteEvent event={event} />
                  </div>
                </div>

                <div className="-mb-0.5 flex flex-wrap items-center gap-1">
                  <Badge>{formatDate(event.date)}</Badge>
                  <Badge>
                    {getLunarDateInChinese(
                      getLunarDateFromSolarDate(event.date)
                    )}
                  </Badge>
                </div>
              </CardHeader>

              <CardFooter className="flex-wrap gap-x-4 gap-y-2 text-sm">
                <IconWithText
                  icon={CircleDollarSign}
                  text={formatCurrency(event.totalAmount)}
                  title="Total Amount"
                />

                <IconWithText
                  icon={Users}
                  text={event.totalDonors.toString()}
                  title="Total Donors"
                />

                <IconWithText
                  icon={LayoutList}
                  text={event.totalRecords.toString()}
                  title="Total Records"
                />
              </CardFooter>
            </Card>
          ))
        ) : !past ? (
          <UpsertEvent>
            <DialogTrigger className="bg-background rounded-lg">
              <Card className="bg-primary/10 border-primary text-primary hover:bg-primary/15 shadow-primary/10 min-h-36 justify-center border-dashed text-sm transition-colors">
                <CardContent className="flex flex-col items-center gap-1">
                  <Plus className="size-5" />
                  <span>New Event</span>
                </CardContent>
              </Card>
            </DialogTrigger>
          </UpsertEvent>
        ) : (
          <Alert className="col-span-full items-center [&>svg]:translate-y-0">
            <CircleAlert />
            <AlertTitle className="py-px">No events yet</AlertTitle>
          </Alert>
        )}

        {status === "LoadingMore" && <LoadingSkeletons />}
      </div>

      <div ref={observerRef} className="h-px" />
    </>
  )
}

export default EventList

const LoadingSkeletons = () =>
  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
    <div key={i} className="bg-card rounded-lg">
      <Skeleton className="min-h-36 rounded-lg" />
    </div>
  ))
