"use client"

import React from "react"
import { SearchIcon } from "lucide-react"

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
