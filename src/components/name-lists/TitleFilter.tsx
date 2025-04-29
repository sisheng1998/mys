"use client"

import React from "react"
import { ListFilter, X } from "lucide-react"

import { useFilterParams } from "@/hooks/use-data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

import { TITLES } from "@cvx/nameLists/schemas"

const KEY = "title"

const TitleFilter = () => {
  const [columnFilters, setColumnFilters] = useFilterParams()
  const selectedStatus = columnFilters.find((f) => f.id === KEY)

  const handleSelect = (value?: string) => {
    if (selectedStatus) {
      const newValues =
        Array.isArray(selectedStatus.value) &&
        selectedStatus.value.includes(value)
          ? selectedStatus.value.filter((val) => val !== value)
          : [
              ...(Array.isArray(selectedStatus.value)
                ? selectedStatus.value
                : []),
              value,
            ]

      setColumnFilters((prev) =>
        prev
          .map((f) => (f.id === KEY ? { ...f, value: newValues } : f))
          .filter((f) => !(f.id === KEY && (f.value as unknown[]).length === 0))
      )
    } else {
      setColumnFilters((prev) => [...prev, { id: KEY, value: [value] }])
    }
  }

  const handleReset = () =>
    setColumnFilters((prev) => prev.filter((f) => f.id !== KEY))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <NotificationBadge
            badgeContent={
              Array.isArray(selectedStatus?.value)
                ? selectedStatus.value.length
                : 0
            }
          >
            <ListFilter />
          </NotificationBadge>
          Title
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search" />

          <CommandList className="max-h-full">
            <CommandEmpty>No results found</CommandEmpty>

            <CommandGroup className="max-h-80 overflow-x-hidden overflow-y-auto">
              <CommandItem onSelect={() => handleSelect(undefined)}>
                <Checkbox
                  className="pointer-events-none"
                  checked={
                    Array.isArray(selectedStatus?.value) &&
                    selectedStatus.value.includes(undefined)
                  }
                />
                <span>No Title</span>
              </CommandItem>

              {TITLES.map((value, index) => {
                const isSelected =
                  Array.isArray(selectedStatus?.value) &&
                  selectedStatus.value.includes(value)

                return (
                  <CommandItem key={index} onSelect={() => handleSelect(value)}>
                    <Checkbox
                      className="pointer-events-none"
                      checked={isSelected}
                    />
                    <span>{value}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selectedStatus && (
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

export default TitleFilter
