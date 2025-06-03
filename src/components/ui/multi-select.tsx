import React from "react"
import { ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import CommandSearch from "@/components/data-table/CommandSearch"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  placeholder?: string
  value?: string[]
  onChange?: (values: string[]) => void
  className?: string
  isInvalid?: boolean
  modal?: boolean
}

export const MultiSelect = ({
  options,
  placeholder = "Select",
  value,
  onChange,
  className,
  isInvalid,
  modal,
}: MultiSelectProps) => {
  const handleSelect = (selectedValue: string) => {
    const newValue =
      value?.includes(selectedValue) && Array.isArray(value)
        ? value.filter((v) => v !== selectedValue)
        : [...(value ?? []), selectedValue]

    onChange?.(newValue)
  }

  const handleClear = () => onChange?.([])

  const hasValue = value && value.length > 0

  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "hover:bg-background h-auto min-h-9 px-3 py-1 font-normal",
            className
          )}
          aria-invalid={isInvalid}
        >
          <div
            className={cn(
              "flex flex-1 flex-wrap items-center gap-1",
              hasValue && "-ml-1"
            )}
          >
            {hasValue ? (
              options
                .filter(
                  (option) =>
                    Array.isArray(value) && value.includes(option.value)
                )
                .map((option) => (
                  <Badge key={option.value} variant="secondary">
                    {option.label}
                    <div
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        handleSelect(option.value)
                      }}
                    >
                      <X className="size-3" />
                    </div>
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>

          {hasValue && (
            <>
              <div
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  handleClear()
                }}
              >
                <X className="size-4" />
              </div>

              <Separator orientation="vertical" />
            </>
          )}

          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandSearch />

          <CommandList className="max-h-full">
            <CommandEmpty>No results found</CommandEmpty>

            <CommandGroup className="max-h-80 overflow-x-hidden overflow-y-auto">
              {options.map((option) => {
                const isSelected =
                  Array.isArray(value) && value.includes(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Checkbox
                      className="pointer-events-none"
                      checked={isSelected}
                    />
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {hasValue && (
              <>
                <CommandSeparator alwaysRender />

                <CommandGroup forceMount>
                  <CommandItem
                    onSelect={handleClear}
                    className="text-muted-foreground"
                  >
                    <X />
                    Clear All
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
