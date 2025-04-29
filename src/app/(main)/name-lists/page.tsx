import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddNewRecord from "@/components/name-lists/AddNewRecord"
import NameListTable from "@/components/name-lists/NameListTable"
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

        <AddNewRecord />
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
