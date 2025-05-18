"use client"

import React, { useState } from "react"
import { RowSelectionState } from "@tanstack/react-table"
import { Preloaded, usePreloadedQuery } from "convex/react"

import { Category } from "@/types/category"
import { Template } from "@/types/template"
import { getLunarDateInChinese } from "@/lib/date"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddTemplateRecord from "@/components/templates/AddTemplateRecord"
import DonationStats from "@/components/templates/DonationStats"
import DonationTable from "@/components/templates/DonationTable"
import EditTemplate from "@/components/templates/EditTemplate"
import UpdateTemplateRecordAmount from "@/components/templates/UpdateTemplateRecordAmount"
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
                    categories: template.categories.map(
                      (category) => category._id
                    ),
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

  return (
    <Card className="flex-1 lg:col-span-2">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Donations</CardTitle>
          <CardDescription>List of all donation records</CardDescription>
        </div>

        {selectedIds.length !== 0 ? (
          <UpdateTemplateRecordAmount ids={selectedIds} />
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
