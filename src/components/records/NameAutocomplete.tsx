"use client"

import React, { useLayoutEffect, useRef } from "react"
import { useController } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"

import { NameListRecord } from "@/types/nameList"
import { getNameWithTitle } from "@/lib/name"
import { convertSCToTC } from "@/lib/string"
import { useQuery } from "@/hooks/use-query"
import { Autocomplete } from "@/components/ui/autocomplete"

import { api } from "@cvx/_generated/api"

const NameAutocomplete = ({
  name,
  onSelect,
  isInvalid,
  autoFocus = false,
}: {
  name: string
  onSelect: (data: NameListRecord) => void
  isInvalid?: boolean
  autoFocus?: boolean
}) => {
  const { field } = useController({ name })
  const inputRef = useRef<HTMLInputElement | null>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)

  const [debouncedValue] = useDebounceValue(field.value, 300)

  const { data: options = [], status } = useQuery(
    api.nameLists.queries.search,
    {
      name: debouncedValue,
    }
  )

  const handleValueChange = (value: string) => {
    const input = inputRef.current
    if (input) {
      selectionRef.current = {
        start: input.selectionStart ?? 0,
        end: input.selectionEnd ?? 0,
      }
    }

    const converted = convertSCToTC(value)
    field.onChange(converted)
  }

  useLayoutEffect(() => {
    if (inputRef.current && selectionRef.current) {
      inputRef.current.setSelectionRange(
        selectionRef.current.start,
        selectionRef.current.end
      )
    }
  }, [field.value])

  return (
    <Autocomplete
      {...field}
      inputRef={inputRef}
      className="flex-1 rounded-l-none"
      placeholder="John Doe"
      value={field.value}
      onValueChange={handleValueChange}
      onSelectValue={onSelect}
      options={options.map((option) => ({
        data: option,
        value: option.name,
        label: getNameWithTitle(option.name, option.title),
      }))}
      isLoading={status === "pending"}
      isInvalid={isInvalid}
      autoFocus={autoFocus}
    />
  )
}

export default NameAutocomplete
