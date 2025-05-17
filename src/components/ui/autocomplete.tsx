"use client"

import { useState } from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Check, ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input, InputIcon, InputRoot } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"

type AutocompleteProps<T> = {
  options: { data: T; value: string; label: string }[]
  onSelectValue: (data: T) => void
  isLoading?: boolean
  modal?: boolean
}

export function Autocomplete<T>({
  value,
  options,
  onSelectValue,
  isLoading,
  modal,
  ...props
}: AutocompleteProps<T> & React.ComponentProps<typeof CommandPrimitive.Input>) {
  const [open, setOpen] = useState<boolean>(false)

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget?.hasAttribute("cmdk-list")) return

    const selectedOption = options.find((option) => option.value === value)
    if (selectedOption) onSelectValue(selectedOption.data)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <Command className="overflow-visible bg-transparent" shouldFilter={false}>
        <PopoverAnchor asChild>
          <InputRoot className="w-full">
            <InputIcon position="right">
              {isLoading ? (
                <Loader2 className="animate-spin opacity-50" />
              ) : (
                <ChevronDown className="opacity-50" />
              )}
            </InputIcon>

            <CommandPrimitive.Input
              {...props}
              value={value}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((prev) => !!value || !prev)}
              onBlur={handleBlur}
              asChild
            >
              <Input />
            </CommandPrimitive.Input>
          </InputRoot>
        </PopoverAnchor>

        {options.length > 0 && (
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault()
              }
            }}
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <CommandList className="max-h-full">
              <CommandGroup className="max-h-80 overflow-x-hidden overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.label}
                    onSelect={() => {
                      onSelectValue(option.data)
                      setOpen(false)
                    }}
                  >
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        "ml-auto size-3.5",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        )}
      </Command>
    </Popover>
  )
}
