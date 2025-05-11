"use client"

import React from "react"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { Plus } from "lucide-react"

import { Template } from "@/types/template"
import { getLunarDateInChinese } from "@/lib/date"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteTemplate from "@/components/templates/DeleteTemplate"
import DonationStats from "@/components/templates/DonationStats"
import DonationTable from "@/components/templates/DonationTable"
import EditTemplate from "@/components/templates/EditTemplate"
import { Breadcrumb } from "@/contexts/breadcrumb"

import { api } from "@cvx/_generated/api"

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

      <div className="flex flex-1 flex-col gap-4 xl:grid xl:grid-cols-3">
        <Card className="xl:self-start">
          <CardHeader className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <CardTitle>{template.name}</CardTitle>

              <div className="-mb-1 flex flex-wrap items-center gap-1">
                {template.dates.map((date) => (
                  <Badge key={date}>{getLunarDateInChinese(date)}</Badge>
                ))}
              </div>
            </div>

            <div className="-m-2 flex items-center">
              <EditTemplate
                template={
                  {
                    ...template,
                    categories: template.categories.map(
                      (category) => category._id
                    ),
                  } as Template
                }
              />

              <DeleteTemplate template={template as unknown as Template} />
            </div>
          </CardHeader>

          <DonationStats categories={template.categories} />
        </Card>

        <Card className="flex-1 xl:col-span-2">
          <CardHeader className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Donations</CardTitle>
              <CardDescription>List of all donation records</CardDescription>
            </div>

            <Button>
              <Plus />
              <span>New Record</span>
            </Button>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col">
            <DonationTable categories={template.categories} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default EventTemplate
