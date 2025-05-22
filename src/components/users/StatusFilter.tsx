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

const KEY = "status"

const StatusFilter = () => {
  const [columnFilters, setColumnFilters] = useFilterParams()
  const selectedItem = columnFilters.find((f) => f.id === KEY)

  const handleSelect = (value: boolean) => {
    if (selectedItem) {
      const newValues =
        Array.isArray(selectedItem.value) && selectedItem.value.includes(value)
          ? selectedItem.value.filter((val) => val !== value)
          : [
              ...(Array.isArray(selectedItem.value) ? selectedItem.value : []),
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
        <Button variant="outline" className="px-3">
          <NotificationBadge
            badgeContent={
              Array.isArray(selectedItem?.value) ? selectedItem.value.length : 0
            }
          >
            <ListFilter />
          </NotificationBadge>
          <span className="hidden md:inline">Status</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search" />

          <CommandList className="max-h-full">
            <CommandEmpty>No results found</CommandEmpty>

            <CommandGroup
              heading="Status"
              className="max-h-80 overflow-x-hidden overflow-y-auto"
            >
              {[true, false].map((value, index) => {
                const isSelected =
                  Array.isArray(selectedItem?.value) &&
                  selectedItem.value.includes(value)

                return (
                  <CommandItem key={index} onSelect={() => handleSelect(value)}>
                    <Checkbox
                      className="pointer-events-none"
                      checked={isSelected}
                    />
                    <span>{value ? "Authorized" : "Unauthorized"}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selectedItem && (
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

export default StatusFilter
