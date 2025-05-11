"use client"

import React from "react"
import { Edit } from "lucide-react"

import { Template } from "@/types/template"
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import UpsertTemplate from "@/components/templates/UpsertTemplate"

const EditTemplate = ({ template }: { template: Template }) => (
  <UpsertTemplate template={template}>
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
  </UpsertTemplate>
)

export default EditTemplate
