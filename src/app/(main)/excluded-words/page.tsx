import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddNewExcludedWord from "@/components/excluded-words/AddNewExcludedWord"
import ExcludedWordTable from "@/components/excluded-words/ExcludedWordTable"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Excluded Words",
}

const NameLists = () => (
  <>
    <Breadcrumb links={[{ label: "Excluded Words" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Excluded Words</CardTitle>
          <CardDescription>
            Excluded words for Simplified → Traditional Chinese conversion
          </CardDescription>
        </div>

        <AddNewExcludedWord />
      </CardHeader>
    </Card>

    <Card className="flex-1">
      <CardContent className="flex flex-1 flex-col">
        <ExcludedWordTable />
      </CardContent>
    </Card>
  </>
)

export default NameLists
