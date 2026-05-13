"use client"

import React from "react"
import { Row } from "@tanstack/react-table"
import { SearchIcon } from "lucide-react"

import { convertSCToTC, convertTCToSC } from "@/lib/string"
import ControlledInput from "@/components/ui/controlled-input"
import { InputIcon, InputRoot } from "@/components/ui/input"

interface SearchProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const Search = ({ search, setSearch }: SearchProps) => (
  <InputRoot className="min-w-40 flex-1 md:max-w-60 xl:max-w-80">
    <InputIcon>
      <SearchIcon />
    </InputIcon>

    <ControlledInput
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </InputRoot>
)

export default Search

export const searchFilterFn = <TData extends object>(
  row: Row<TData>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue<string>(columnId)

  if (typeof value !== "string" || !filterValue) return false

  const normalize = (text: string) => text.toLowerCase()

  const valueVariants = [
    normalize(value),
    normalize(convertSCToTC(value)),
    normalize(convertTCToSC(value)),
  ]

  const searchVariants = [
    normalize(filterValue),
    normalize(convertSCToTC(filterValue)),
    normalize(convertTCToSC(filterValue)),
  ]

  return valueVariants.some((valueText) =>
    searchVariants.some((searchText) => valueText.includes(searchText))
  )
}
