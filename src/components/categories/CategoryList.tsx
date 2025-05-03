"use client"

import React from "react"
import { Edit, Plus } from "lucide-react"

import { CurrencyDisplay } from "@/lib/number"
import { useQuery } from "@/hooks/use-query"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import DeleteCategory from "@/components/categories/DeleteCategory"
import UpsertCategory from "@/components/categories/UpsertCategory"

import { api } from "@cvx/_generated/api"

const CategoryList = () => {
  const { data = [], status } = useQuery(api.categories.queries.list)

  return (
    <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
      {status === "pending" ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg">
            <Skeleton className="min-h-24 rounded-lg" />
          </div>
        ))
      ) : data.length > 0 ? (
        data.map((category) => (
          <Card key={category._id}>
            <CardContent className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <CardTitle className="leading-5">{category.name}</CardTitle>
                <CardDescription>
                  {category.amount !== undefined ? (
                    <CurrencyDisplay value={category.amount} />
                  ) : (
                    "Any Amount"
                  )}
                </CardDescription>
              </div>

              <div className="-m-2 flex items-center">
                <UpsertCategory category={category}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Edit />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>

                    <TooltipContent side="bottom">Edit</TooltipContent>
                  </Tooltip>
                </UpsertCategory>
                <DeleteCategory category={category} />
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <UpsertCategory>
          <DialogTrigger className="bg-background rounded-lg">
            <Card className="bg-primary/10 border-primary text-primary hover:bg-primary/15 shadow-primary/10 min-h-24 justify-center border-dashed text-sm transition-colors">
              <CardContent className="flex flex-col items-center gap-1">
                <Plus className="size-5" />
                <span>New Category</span>
              </CardContent>
            </Card>
          </DialogTrigger>
        </UpsertCategory>
      )}
    </div>
  )
}

export default CategoryList
