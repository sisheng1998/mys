"use client"

import React from "react"
import Link from "next/link"
import {
  CircleDollarSign,
  Command,
  LayoutList,
  LucideIcon,
  Plus,
  Users,
} from "lucide-react"

import { getLunarDateInChinese } from "@/lib/date"
import { formatCurrency } from "@/lib/number"
import { useQuery } from "@/hooks/use-query"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import DeleteTemplate from "@/components/templates/DeleteTemplate"
import EditTemplate from "@/components/templates/EditTemplate"
import UpsertTemplate from "@/components/templates/UpsertTemplate"

import { api } from "@cvx/_generated/api"

const TemplateList = () => {
  const { data = [], status } = useQuery(api.templates.queries.list)

  return (
    <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
      {status === "pending" ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg">
            <Skeleton className="min-h-36 rounded-lg" />
          </div>
        ))
      ) : data.length > 0 ? (
        data.map((template) => (
          <Card
            key={template._id}
            className="hover:border-primary relative transition-colors"
          >
            <Link
              href={`/templates/${template._id}`}
              className="absolute inset-0"
            />

            <CardHeader className="gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="leading-5">{template.name}</CardTitle>

                <div className="relative z-10 -m-2 flex items-center">
                  <EditTemplate template={template} />
                  <DeleteTemplate template={template} />
                </div>
              </div>

              <div className="-mb-0.5 flex flex-wrap items-center gap-1">
                {template.dates.map((date) => (
                  <Badge key={date}>{getLunarDateInChinese(date)}</Badge>
                ))}
              </div>
            </CardHeader>

            <CardFooter className="flex-wrap gap-x-4 gap-y-2 text-sm">
              <IconWithText
                icon={Command}
                text={template.categories.length.toString()}
                title="Total Categories"
              />

              <IconWithText
                icon={LayoutList}
                text={template.totalRecords.toString()}
                title="Total Records"
              />

              <IconWithText
                icon={Users}
                text={template.totalDonors.toString()}
                title="Total Donors"
              />

              <IconWithText
                icon={CircleDollarSign}
                text={formatCurrency(template.totalAmount)}
                title="Total Amount"
              />
            </CardFooter>
          </Card>
        ))
      ) : (
        <UpsertTemplate>
          <DialogTrigger className="bg-background rounded-lg">
            <Card className="bg-primary/10 border-primary text-primary hover:bg-primary/15 shadow-primary/10 min-h-36 justify-center border-dashed text-sm transition-colors">
              <CardContent className="flex flex-col items-center gap-1">
                <Plus className="size-5" />
                <span>New Template</span>
              </CardContent>
            </Card>
          </DialogTrigger>
        </UpsertTemplate>
      )}
    </div>
  )
}

export default TemplateList

const IconWithText = ({
  icon: Icon,
  text,
  title,
}: {
  icon: LucideIcon
  text: string
  title: string
}) => (
  <Tooltip>
    <div className="flex items-center gap-1.5">
      <TooltipTrigger asChild>
        <Icon className="size-4 opacity-75" />
      </TooltipTrigger>
      <span>{text}</span>
    </div>

    <TooltipContent side="bottom">{title}</TooltipContent>
  </Tooltip>
)
