"use client"

import React from "react"
import { useController } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"

import { NameListRecord } from "@/types/nameList"
import { getNameWithTitle } from "@/lib/name"
import { useQuery } from "@/hooks/use-query"
import { Autocomplete } from "@/components/ui/autocomplete"

import { api } from "@cvx/_generated/api"

const NameAutocomplete = ({
  onSelect,
}: {
  onSelect: (data: NameListRecord) => void
}) => {
  const { field } = useController({
    name: "name",
  })

  const [debouncedValue] = useDebounceValue(field.value, 300)

  const { data: options = [], status } = useQuery(
    api.nameLists.queries.search,
    {
      name: debouncedValue,
    }
  )

  return (
    <Autocomplete
      {...field}
      className="flex-1 rounded-l-none"
      placeholder="John Doe"
      value={field.value}
      onValueChange={(value) => field.onChange(value)}
      onSelectValue={onSelect}
      options={options.map((option) => ({
        data: option,
        value: option.name,
        label: getNameWithTitle(option.name, option.title),
      }))}
      isLoading={status === "pending"}
      autoFocus
    />
  )
}

export default NameAutocomplete
