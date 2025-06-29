import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddNewNameListRecord from "@/components/name-lists/AddNewNameListRecord"
import NameListTable from "@/components/name-lists/NameListTable"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Name Lists",
}

const NameLists = () => (
  <>
    <Breadcrumb links={[{ label: "Name Lists" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Name Lists</CardTitle>
          <CardDescription>Master list of donors</CardDescription>
        </div>

        <AddNewNameListRecord />
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
