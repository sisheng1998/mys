"use client"

import React, { useLayoutEffect, useRef, useState } from "react"

import { convertSCToTC } from "@/lib/string"
import { CommandInput } from "@/components/ui/command"

const CommandSearch = () => {
  const [search, setSearch] = useState<string>("")
  const [isComposing, setIsComposing] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)

  const handleChange = (value: string, forceConvert = false) => {
    const input = inputRef.current

    if (input) {
      selectionRef.current = {
        start: input.selectionStart ?? 0,
        end: input.selectionEnd ?? 0,
      }
    }

    const shouldConvert = forceConvert || !isComposing
    setSearch(shouldConvert ? convertSCToTC(value) : value)
  }

  useLayoutEffect(() => {
    if (inputRef.current && selectionRef.current) {
      inputRef.current.setSelectionRange(
        selectionRef.current.start,
        selectionRef.current.end
      )
    }
  }, [search])

  return (
    <CommandInput
      ref={inputRef}
      placeholder="Search"
      value={search}
      onValueChange={handleChange}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(e) => {
        setIsComposing(false)
        handleChange(e.currentTarget.value, true)
      }}
    />
  )
}

export default CommandSearch
