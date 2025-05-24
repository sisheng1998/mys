"use client"

import React from "react"
import { Edit } from "lucide-react"

import { Event } from "@/types/event"
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import UpsertEvent from "@/components/events/UpsertEvent"

const EditEvent = ({ event }: { event: Event }) => (
  <UpsertEvent event={event}>
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <Edit />
          </Button>
        </DialogTrigger>
      </TooltipTrigger>

      <TooltipContent side="bottom">Edit</TooltipContent>
    </Tooltip>
  </UpsertEvent>
)

export default EditEvent
