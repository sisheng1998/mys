"use client"

import React from "react"
import { useParams } from "next/navigation"

import { Category } from "@/types/category"
import { formatCurrency } from "@/lib/number"
import { useQuery } from "@/hooks/use-query"
import { CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryInfo, OverallInfo } from "@/components/templates/DonationStats"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

const DonationStats = ({ categories }: { categories: Category[] }) => {
  const { _id } = useParams<{ _id: Id<"events"> }>()

  const {
    data = {
      totalAmount: 0,
      totalDonors: 0,
      totalRecords: 0,
      totalPaid: 0,
      totalPaidPercentage: 0,
      categoryStats: categories.map((category) => ({
        name: category.name,
        amount: 0,
        percentage: 0,
      })),
    },
    status,
  } = useQuery(api.events.queries.getStats, {
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

        <OverallInfo
          title="Payment Status"
          value={`${data.totalRecords !== 0 ? `${data.totalPaid} of ${data.totalRecords}` : 0} paid`}
          isLoading={isLoading}
        />

        {isLoading ? (
          <Skeleton className="h-2" />
        ) : (
          <Progress value={data.totalPaidPercentage} className="h-2" />
        )}
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
