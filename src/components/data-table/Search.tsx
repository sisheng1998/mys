"use client"

import React from "react"
import { SearchIcon } from "lucide-react"

import { Input, InputIcon, InputRoot } from "@/components/ui/input"

interface SearchProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const Search = ({ search, setSearch }: SearchProps) => (
  <InputRoot className="w-full md:max-w-60 xl:max-w-80">
    <InputIcon>
      <SearchIcon />
    </InputIcon>

    <Input
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </InputRoot>
)

export default Search
