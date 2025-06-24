"use client"

import React from "react"
import { useParams } from "next/navigation"
import { CircleDollarSign, Users } from "lucide-react"

import { Category } from "@/types/category"
import { formatCurrency, formatNumber } from "@/lib/number"
import { useQuery } from "@/hooks/use-query"
import { CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
        donors: 0,
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
          value={formatNumber(data.totalDonors)}
          isLoading={isLoading}
        />

        <OverallInfo
          title="Total Records"
          value={formatNumber(data.totalRecords)}
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
            donors={formatNumber(category.donors)}
            amount={formatCurrency(category.amount)}
            percentage={category.percentage}
            isLoading={isLoading}
          />
        ))}
      </div>
    </CardContent>
  )
}

export default DonationStats

export const OverallInfo = ({
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

export const CategoryInfo = ({
  title,
  donors,
  amount,
  percentage,
  isLoading,
}: {
  title: string
  donors: string
  amount: string
  percentage: number
  isLoading: boolean
}) => (
  <div className="flex flex-col gap-1.5">
    {isLoading ? (
      <Skeleton className="h-5" />
    ) : (
      <div className="flex flex-wrap items-center justify-between gap-1">
        <p>{title}</p>

        <div className="flex flex-wrap items-center gap-1 font-medium">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="flex flex-wrap items-center gap-1">
                <span>{donors}</span>
                <Users className="size-3.5" />
              </p>
            </TooltipTrigger>

            <TooltipContent side="left">Donors</TooltipContent>
          </Tooltip>

          <span>-</span>

          <Tooltip>
            <TooltipTrigger asChild>
              <p className="flex flex-wrap items-center gap-1">
                <span>{amount}</span>
                <CircleDollarSign className="size-3.5" />
              </p>
            </TooltipTrigger>

            <TooltipContent side="right">Amount</TooltipContent>
          </Tooltip>
        </div>
      </div>
    )}

    {isLoading ? (
      <Skeleton className="h-2" />
    ) : (
      <Progress value={percentage} className="h-2" />
    )}
  </div>
)
