import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Templates",
}

const Templates = () => (
  <>
    <Breadcrumb links={[{ label: "Templates" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Templates</CardTitle>
          <CardDescription>Create and manage templates</CardDescription>
        </div>

        {/* <AddNewUser /> */}
      </CardHeader>
    </Card>

    <Card className="flex-1">
      <CardContent className="flex flex-1 flex-col">
        {/* <UserTable /> */}
      </CardContent>
    </Card>
  </>
)

export default Templates
