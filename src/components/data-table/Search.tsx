"use client"

import React from "react"
import { SearchIcon } from "lucide-react"

import { Input, InputIcon, InputRoot } from "@/components/ui/input"

interface SearchProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const Search = ({ search, setSearch }: SearchProps) => (
  <InputRoot className="w-full max-w-none md:max-w-sm">
    <InputIcon>
      <SearchIcon />
    </InputIcon>

    <Input
      placeholder="Search"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  </InputRoot>
)

export default Search
