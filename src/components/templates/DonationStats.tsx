"use client"

import React from "react"
import { useParams } from "next/navigation"

import { Category } from "@/types/category"
import { formatCurrency } from "@/lib/number"
import { useQuery } from "@/hooks/use-query"
import { CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const DonationStats = ({ categories }: { categories: Category[] }) => {
  const { _id } = useParams<{ _id: Id<"templates"> }>()

  const {
    data = {
      totalAmount: 0,
      totalDonors: 0,
      totalRecords: 0,
      categoryStats: categories.map((category) => ({
        name: category.name,
        amount: 0,
        percentage: 0,
      })),
    },
    status,
  } = useQuery(api.templates.queries.getStats, {
    _id,
  })

  const isLoading = status === "pending"

  return (
    <CardContent className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-2">
        <OverallInfo
          title="Total Amount"
          value={formatCurrency(data.totalAmount)}
          isLoading={isLoading}
        />

        <OverallInfo
          title="Total Donors"
          value={data.totalDonors.toString()}
          isLoading={isLoading}
        />

        <OverallInfo
          title="Total Records"
          value={data.totalRecords.toString()}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          <Skeleton className="h-5" />
        ) : (
          <p className="font-medium">Donations by Category</p>
        )}

        {data.categoryStats.map((category) => (
          <CategoryInfo
            key={category.name}
            title={category.name}
            value={formatCurrency(category.amount)}
            percentage={category.percentage}
            isLoading={isLoading}
          />
        ))}
      </div>
    </CardContent>
  )
}

export default DonationStats

const OverallInfo = ({
  title,
  value,
  isLoading,
}: {
  title: string
  value: string
  isLoading: boolean
}) =>
  isLoading ? (
    <Skeleton className="h-5" />
  ) : (
    <p className="flex flex-wrap items-center justify-between gap-1">
      <span className="font-medium">{title}</span>
      <span className="font-bold">{value}</span>
    </p>
  )

const CategoryInfo = ({
  title,
  value,
  percentage,
  isLoading,
}: {
  title: string
  value: string
  percentage: number
  isLoading: boolean
}) => (
  <div className="flex flex-col gap-1.5">
    {isLoading ? (
      <Skeleton className="h-5" />
    ) : (
      <p className="flex flex-wrap items-center justify-between gap-1">
        <span>{title}</span>
        <span className="font-medium">{value}</span>
      </p>
    )}

    {isLoading ? (
      <Skeleton className="h-2" />
    ) : (
      <Progress value={percentage} className="h-2" />
    )}
  </div>
)
