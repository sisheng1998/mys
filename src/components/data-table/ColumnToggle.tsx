"use client"

import React from "react"
import { Table } from "@tanstack/react-table"
import { Columns2, RotateCcw } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ColumnToggleProps<TData> {
  table: Table<TData>
}

const ColumnToggle = <TData,>({ table }: ColumnToggleProps<TData>) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <Columns2 />
        Columns
      </Button>
    </PopoverTrigger>

    <PopoverContent className="w-48 p-0" align="start">
      <Command>
        <CommandInput placeholder="Search" />

        <CommandList className="max-h-full">
          <CommandEmpty>No results found</CommandEmpty>

          <CommandGroup className="max-h-80 overflow-x-hidden overflow-y-auto">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <CommandItem
                  key={column.id}
                  className="capitalize"
                  onSelect={() => column.toggleVisibility()}
                >
                  <Checkbox
                    className="pointer-events-none"
                    checked={column.getIsVisible()}
                  />
                  <span>{column.id}</span>
                </CommandItem>
              ))}
          </CommandGroup>

          {!table.getIsAllColumnsVisible() && (
            <>
              <CommandSeparator alwaysRender />

              <CommandGroup forceMount>
                <CommandItem
                  onSelect={() => table.toggleAllColumnsVisible()}
                  className="text-muted-foreground"
                >
                  <RotateCcw />
                  Reset
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
)

export default ColumnToggle
