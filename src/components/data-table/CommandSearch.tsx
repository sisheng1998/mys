"use client"

import React, { useLayoutEffect, useRef, useState } from "react"

import { convertSCToTC } from "@/lib/string"
import { CommandInput } from "@/components/ui/command"

const CommandSearch = () => {
  const [search, setSearch] = useState<string>("")

  const inputRef = useRef<HTMLInputElement>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)

  const handleChange = (value: string) => {
    const inputEl = inputRef.current

    if (inputEl) {
      selectionRef.current = {
        start: inputEl.selectionStart ?? 0,
        end: inputEl.selectionEnd ?? 0,
      }
    }

    setSearch(convertSCToTC(value))
  }

  useLayoutEffect(() => {
    const inputEl = inputRef.current
    const selection = selectionRef.current

    if (inputEl && selection) {
      inputEl.setSelectionRange(selection.start, selection.end)
    }
  }, [search])

  return (
    <CommandInput
      ref={inputRef}
      placeholder="Search"
      value={search}
      onValueChange={handleChange}
    />
  )
}

export default CommandSearch
