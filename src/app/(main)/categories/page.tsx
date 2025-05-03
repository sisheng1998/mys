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
import CategoryList from "@/components/categories/CategoryList"
import UpsertCategory from "@/components/categories/UpsertCategory"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Categories",
}

const Categories = () => (
  <>
    <Breadcrumb links={[{ label: "Categories" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Categories</CardTitle>
          <CardDescription>Categories for donation items</CardDescription>
        </div>

        <UpsertCategory>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              <span>New Category</span>
            </Button>
          </DialogTrigger>
        </UpsertCategory>
      </CardHeader>
    </Card>

    <CategoryList />
  </>
)

export default Categories
