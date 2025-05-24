import React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DialogTrigger } from "@/components/ui/dialog"
import EventList from "@/components/events/EventList"
import PeriodSwitcher from "@/components/events/PeriodSwitcher"
import UpsertEvent from "@/components/events/UpsertEvent"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Events",
}

const Events = () => (
  <>
    <Breadcrumb links={[{ label: "Events" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Events</CardTitle>
          <CardDescription>List of all events</CardDescription>
        </div>

        <UpsertEvent>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              <span>New Event</span>
            </Button>
          </DialogTrigger>
        </UpsertEvent>
      </CardHeader>
    </Card>

    <PeriodSwitcher />

    <EventList />
  </>
)

export default Events
