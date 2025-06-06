"use client"

import React, { useLayoutEffect, useRef, useState } from "react"
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
}: {
  name: string
  onSelect: (data: NameListRecord) => void
  isInvalid?: boolean
}) => {
  const { field } = useController({ name })

  const inputRef = useRef<HTMLInputElement | null>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)
  const skipRestoreSelectionRef = useRef<boolean>(false)

  const [isComposing, setIsComposing] = useState<boolean>(false)

  const [debouncedValue] = useDebounceValue(field.value, 300)

  const { data: options = [], status } = useQuery(
    api.nameLists.queries.search,
    {
      name: debouncedValue,
    }
  )

  const handleValueChange = (value: string, forceConvert = false) => {
    const input = inputRef.current

    if (input) {
      selectionRef.current = {
        start: input.selectionStart ?? 0,
        end: input.selectionEnd ?? 0,
      }
    }

    const shouldConvert = forceConvert || !isComposing
    field.onChange(shouldConvert ? convertSCToTC(value) : value)
  }

  const handleOnSelectValue = (data: NameListRecord) => {
    onSelect(data)

    const input = inputRef.current

    if (input) {
      const length = input.value.length
      input.setSelectionRange(length, length)

      skipRestoreSelectionRef.current = true
    }
  }

  useLayoutEffect(() => {
    if (
      inputRef.current &&
      selectionRef.current &&
      !skipRestoreSelectionRef.current
    ) {
      inputRef.current.setSelectionRange(
        selectionRef.current.start,
        selectionRef.current.end
      )
    }

    skipRestoreSelectionRef.current = false
  }, [field.value])

  return (
    <Autocomplete
      {...field}
      inputRef={inputRef}
      className="flex-1 rounded-l-none"
      placeholder="John Doe"
      value={field.value}
      onValueChange={handleValueChange}
      onSelectValue={handleOnSelectValue}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(e) => {
        setIsComposing(false)
        handleValueChange(e.currentTarget.value, true)
      }}
      options={options.map((option) => ({
        data: option,
        value: option.name,
        label: getNameWithTitle(option.name, option.title),
      }))}
      isLoading={status === "pending"}
      isInvalid={isInvalid}
    />
  )
}

export default NameAutocomplete
