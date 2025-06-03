"use client"

import React, { useLayoutEffect, useRef } from "react"

import { convertSCToTC } from "@/lib/string"
import { Input } from "@/components/ui/input"

interface ControlledInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const ControlledInput = React.forwardRef<
  HTMLInputElement,
  ControlledInputProps
>(
  (
    { value, onChange, ...props },
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const selectionRef = useRef<{ start: number; end: number } | null>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputRef.current) {
        selectionRef.current = {
          start: inputRef.current.selectionStart ?? 0,
          end: inputRef.current.selectionEnd ?? 0,
        }
      }

      const convertedValue = convertSCToTC(e.target.value)
      onChange({ ...e, target: { ...e.target, value: convertedValue } })
    }

    useLayoutEffect(() => {
      if (inputRef.current && selectionRef.current) {
        inputRef.current.setSelectionRange(
          selectionRef.current.start,
          selectionRef.current.end
        )
      }
    }, [value])

    return (
      <Input {...props} ref={inputRef} value={value} onChange={handleChange} />
    )
  }
)

ControlledInput.displayName = "ControlledInput"

export default ControlledInput
