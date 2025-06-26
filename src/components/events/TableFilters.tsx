"use client"

import React from "react"
import { Table } from "@tanstack/react-table"
import { ListFilter, X } from "lucide-react"

import { Category } from "@/types/category"
import { useFilterParams } from "@/hooks/use-data-table"
import { Button } from "@/components/ui/button"
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
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CommandSearch from "@/components/data-table/CommandSearch"

const CATEGORY_KEY = "category"
const PAYMENT_KEY = "payment"

const TableFilters = <TData,>({
  table,
  categories,
}: {
  table: Table<TData>
  categories: Category[]
}) => {
  const [columnFilters] = useFilterParams()

  const selectedCategory = columnFilters.find((f) => f.id === CATEGORY_KEY)
  const selectedPayment = columnFilters.find((f) => f.id === PAYMENT_KEY)

  const noOfActiveFilters =
    (Array.isArray(selectedCategory?.value)
      ? selectedCategory.value.length
      : 0) +
    (Array.isArray(selectedPayment?.value) ? selectedPayment.value.length : 0)

  const handleSelect = (key: string, value?: string | boolean) => {
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

  const handleReset = () =>
    table.setColumnFilters((prev) =>
      prev.filter((f) => f.id !== CATEGORY_KEY && f.id !== PAYMENT_KEY)
    )

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

      <PopoverContent className="w-48 p-0" align="start">
        <Command>
          <CommandSearch />

          <CommandList className="max-h-full">
            <CommandEmpty>No results found</CommandEmpty>

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
