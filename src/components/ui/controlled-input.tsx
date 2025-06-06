"use client"

import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { convertSCToTC } from "@/lib/string"
import { Input } from "@/components/ui/input"

interface ControlledInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  value: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const ControlledInput = forwardRef<HTMLInputElement, ControlledInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const selectionRef = useRef<{ start: number; end: number } | null>(null)

    const [isComposing, setIsComposing] = useState(false)

    useImperativeHandle(ref, () => inputRef.current!)

    const handleChange = (value: string, forceConvert = false) => {
      const input = inputRef.current

      if (input) {
        selectionRef.current = {
          start: input.selectionStart ?? 0,
          end: input.selectionEnd ?? 0,
        }
      }

      const shouldConvert = forceConvert || !isComposing
      const convertedValue = shouldConvert ? convertSCToTC(value) : value

      if (onChange) {
        const syntheticEvent = {
          target: {
            ...input,
            value: convertedValue,
          },
        } as React.ChangeEvent<HTMLInputElement>

        onChange(syntheticEvent)
      }
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
      <Input
        {...props}
        ref={inputRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e) => {
          setIsComposing(false)
          handleChange(e.currentTarget.value, true)
        }}
      />
    )
  }
)

ControlledInput.displayName = "ControlledInput"

export default ControlledInput
