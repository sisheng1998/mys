"use client"

import React from "react"
import { useController, useFormContext } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"

import { Category } from "@/types/category"
import { isCategoryDisabled } from "@/lib/category"
import { getNameWithTitle } from "@/lib/name"
import { useQuery } from "@/hooks/use-query"
import { Autocomplete } from "@/components/ui/autocomplete"

import { api } from "@cvx/_generated/api"

const NameAutocomplete = ({ categories }: { categories: Category[] }) => {
  const { watch, setValue } = useFormContext()
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
      onSelectValue={(data) => {
        field.onChange(data.name)
        setValue("title", data.title || null)

        const category = watch("category")
        const selectedCategory = categories.find((c) => c.name === category)

        if (
          selectedCategory &&
          isCategoryDisabled(selectedCategory, data.title)
        ) {
          setValue("category", null)
        }
      }}
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
