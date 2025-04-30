import React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DialogTrigger } from "@/components/ui/dialog"
import NameListTable from "@/components/name-lists/NameListTable"
import UpsertNameListRecord from "@/components/name-lists/UpsertNameListRecord"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Name Lists",
}

const NameLists = () => (
  <>
    <Breadcrumb links={[{ label: "Name Lists" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Name Lists</CardTitle>
          <CardDescription>Create and manage name lists</CardDescription>
        </div>

        <UpsertNameListRecord>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              <span>New Record</span>
            </Button>
          </DialogTrigger>
        </UpsertNameListRecord>
      </CardHeader>
    </Card>

    <Card className="flex-1">
      <CardContent className="flex flex-1 flex-col">
        <NameListTable />
      </CardContent>
    </Card>
  </>
)

export default NameLists
