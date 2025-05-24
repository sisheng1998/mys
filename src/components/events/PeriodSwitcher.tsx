"use client"

import React from "react"
import { Calendar, History } from "lucide-react"
import { parseAsBoolean, useQueryState } from "nuqs"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PeriodSwitcher = () => {
  const [past, setPast] = useQueryState(
    "past",
    parseAsBoolean.withDefault(false)
  )

  return (
    <Tabs
      value={past ? "past" : "upcoming"}
      onValueChange={(value) => setPast(value === "past")}
    >
      <TabsList className="w-full max-w-xs">
        <TabsTrigger value="upcoming">
          <Calendar />
          Upcoming
        </TabsTrigger>
        <TabsTrigger value="past">
          <History />
          Past
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default PeriodSwitcher
