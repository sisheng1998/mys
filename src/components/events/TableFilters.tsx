"use client"

import React from "react"
import { CalendarIcon, ListFilter, X } from "lucide-react"

import { Category } from "@/types/category"
import {
  formatDate,
  formatISODate,
  getDateFromISODate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
  isSameDay,
} from "@/lib/date"
import { useFilterParams } from "@/hooks/use-data-table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { NotificationBadge } from "@/components/ui/notification-badge"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CommandSearch from "@/components/data-table/CommandSearch"
import { useDataTable } from "@/contexts/data-table"

const CATEGORY_KEY = "category"
const PAYMENT_KEY = "payment"
const DATE_KEY = "date"

const TableFilters = <TData,>({
  categories,
  _creationTime,
}: {
  categories: Category[]
  _creationTime: number
}) => {
  const today = new Date()
  const minDate = new Date(_creationTime)

  const { table } = useDataTable<TData>()

  const [columnFilters] = useFilterParams()

  const selectedCategory = columnFilters.find((f) => f.id === CATEGORY_KEY)
  const selectedPayment = columnFilters.find((f) => f.id === PAYMENT_KEY)
  const selectedDate = columnFilters.find((f) => f.id === DATE_KEY)

  const noOfActiveFilters =
    (Array.isArray(selectedCategory?.value)
      ? selectedCategory.value.length
      : 0) +
    (Array.isArray(selectedPayment?.value) ? selectedPayment.value.length : 0) +
    (Array.isArray(selectedDate?.value) ? 1 : 0)

  const handleSelect = (key: string, value?: string | boolean) => {
    if (!table) return

    const selectedItem =
      key === CATEGORY_KEY ? selectedCategory : selectedPayment

    if (selectedItem) {
      const newValues =
        Array.isArray(selectedItem.value) && selectedItem.value.includes(value)
          ? selectedItem.value.filter((val) => val !== value)
          : [
              ...(Array.isArray(selectedItem.value) ? selectedItem.value : []),
              value,
            ]

      table.setColumnFilters((prev) =>
        prev
          .map((f) => (f.id === key ? { ...f, value: newValues } : f))
          .filter((f) => !(f.id === key && (f.value as unknown[]).length === 0))
      )
    } else {
      table.setColumnFilters((prev) => [...prev, { id: key, value: [value] }])
    }
  }

  const dateRange =
    Array.isArray(selectedDate?.value) && selectedDate.value.length > 0
      ? {
          from: getDateFromISODate(selectedDate.value[0]),
          to: getDateFromISODate(
            selectedDate.value[selectedDate.value.length - 1]
          ),
        }
      : undefined

  const handleSelectDateRange = (date: typeof dateRange) => {
    if (!table) return

    if (!date) {
      table.setColumnFilters((prev) => prev.filter((f) => f.id !== DATE_KEY))
      return
    }

    const from = formatISODate(date.from)
    const to = formatISODate(date.to)

    const dateValues = from === to ? [from] : [from, to]

    table.setColumnFilters((prev) => [
      ...prev.filter((f) => f.id !== DATE_KEY),
      { id: DATE_KEY, value: dateValues },
    ])
  }

  const handleReset = () => {
    if (!table) return

    table.setColumnFilters((prev) =>
      prev.filter(
        (f) =>
          f.id !== CATEGORY_KEY && f.id !== PAYMENT_KEY && f.id !== DATE_KEY
      )
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="px-3">
          <NotificationBadge badgeContent={noOfActiveFilters}>
            <ListFilter />
          </NotificationBadge>
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandSearch />

          <CommandList className="max-h-full">
            <CommandEmpty>No results found</CommandEmpty>

            <CommandGroup heading="Date Range">
              <CommandItem className="p-0">
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto w-full justify-start rounded-sm px-2! py-1.5 text-left font-normal whitespace-normal"
                    >
                      <CalendarIcon />
                      {dateRange ? (
                        <span>
                          {`${formatDate(dateRange.from)} (${getLunarDateInChinese(getLunarDateFromSolarDate(dateRange.from))})`}
                          {!isSameDay(dateRange.from, dateRange.to) &&
                            ` - ${formatDate(dateRange.to)} (${getLunarDateInChinese(getLunarDateFromSolarDate(dateRange.to))})`}
                        </span>
                      ) : (
                        <span>All Dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <PopoverClose className="hidden" />

                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(date) =>
                        handleSelectDateRange(date as typeof dateRange)
                      }
                      startMonth={minDate}
                      endMonth={today}
                      disabled={{
                        before: minDate,
                        after: today,
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Payment Status">
              {[true, false].map((value, index) => {
                const isSelected =
                  Array.isArray(selectedPayment?.value) &&
                  selectedPayment.value.includes(value)

                return (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(PAYMENT_KEY, value)}
                  >
                    <Checkbox
                      className="pointer-events-none"
                      checked={isSelected}
                    />
                    <span>{value ? "Paid" : "Unpaid"}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              heading="Category"
              className="max-h-80 overflow-x-hidden overflow-y-auto"
            >
              {categories.map((category, index) => {
                const isSelected =
                  Array.isArray(selectedCategory?.value) &&
                  selectedCategory.value.includes(category.name)

                return (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(CATEGORY_KEY, category.name)}
                  >
                    <Checkbox
                      className="pointer-events-none"
                      checked={isSelected}
                    />
                    <span>{category.name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {noOfActiveFilters > 0 && (
              <>
                <CommandSeparator alwaysRender />

                <CommandGroup forceMount>
                  <CommandItem
                    onSelect={handleReset}
                    className="text-muted-foreground"
                  >
                    <X />
                    Clear Filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TableFilters
