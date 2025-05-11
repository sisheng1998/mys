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
import TemplateList from "@/components/templates/TemplateList"
import UpsertTemplate from "@/components/templates/UpsertTemplate"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Templates",
}

const Templates = () => (
  <>
    <Breadcrumb links={[{ label: "Templates" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Templates</CardTitle>
          <CardDescription>Predefined event templates</CardDescription>
        </div>

        <UpsertTemplate>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              <span>New Template</span>
            </Button>
          </DialogTrigger>
        </UpsertTemplate>
      </CardHeader>
    </Card>

    <TemplateList />
  </>
)

export default Templates
