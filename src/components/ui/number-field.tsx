"use client"

import * as React from "react"
import { useButton } from "@react-aria/button"
import { useLocale } from "@react-aria/i18n"
import {
  AriaNumberFieldProps,
  useNumberField,
  type NumberFieldAria,
} from "@react-aria/numberfield"
import {
  NumberFieldStateOptions,
  useNumberFieldState,
} from "@react-stately/numberfield"
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberFieldContextValue {
  numberFieldProps: NumberFieldAria
  inputRef: React.RefObject<HTMLInputElement>
  buttonPosition?: "inside" | "outside"
}
const NumberFieldContext = React.createContext<NumberFieldContextValue>(
  {} as NumberFieldContextValue
)

const useNumberFieldContext = () => {
  const numberFieldContext = React.useContext(NumberFieldContext)

  if (!numberFieldContext)
    throw new Error("useNumberFieldContext must be used within a NumberField")

  return numberFieldContext
}

function NumberField({
  className,
  buttonPosition = "inside",
  locale: customLocale,
  validationBehavior = "native",
  children,
  ...props
}: React.PropsWithChildren<
  Partial<AriaNumberFieldProps> & {
    name?: string
    className?: string
    buttonPosition?: "inside" | "outside"
  } & Partial<Pick<NumberFieldStateOptions, "locale">>
>) {
  const hookLocale = useLocale().locale
  const locale = customLocale || hookLocale
  props.label = props.label || props.name || "label"

  const state = useNumberFieldState({
    ...props,
    locale,
    validationBehavior,
  })

  const inputRef = React.useRef<HTMLInputElement>(null)
  const numberFieldProps = useNumberField(
    { ...props, validationBehavior },
    state,
    inputRef
  )

  numberFieldProps.inputProps.name = props.name

  return (
    <NumberFieldContext.Provider
      value={{
        numberFieldProps,
        inputRef: inputRef as React.RefObject<HTMLInputElement>,
        buttonPosition,
      }}
    >
      <div
        data-slot="number-field"
        {...numberFieldProps.groupProps}
        className={cn("grid grid-cols-1 grid-rows-[auto_1fr_auto]", className)}
      >
        {children}
      </div>
    </NumberFieldContext.Provider>
  )
}

function NumberFieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    numberFieldProps: { groupProps },
  } = useNumberFieldContext()

  return (
    <div
      data-slot="number-field-group"
      className={cn("relative flex gap-1", className)}
      {...groupProps}
      {...props}
    />
  )
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const {
    numberFieldProps: { incrementButtonProps },
    buttonPosition,
  } = useNumberFieldContext()

  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(incrementButtonProps, buttonRef)

  return (
    <Button
      ref={buttonRef}
      data-slot="number-field-increment"
      variant="outline"
      className={cn(
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        buttonPosition === "outside"
          ? "px-3 py-2"
          : "absolute top-0 right-0 flex h-1/2 w-6 items-center justify-center rounded-l-none rounded-b-none border-b-0 border-l-0 p-0 focus-visible:outline-none",
        className
      )}
      {...buttonProps}
      {...props}
    >
      {children || buttonPosition === "outside" ? (
        <Plus className="size-3 opacity-50" />
      ) : (
        <ChevronUp className="size-3 opacity-50" />
      )}
    </Button>
  )
}

function NumberFieldDecrement({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const {
    numberFieldProps: { decrementButtonProps },
    buttonPosition,
  } = useNumberFieldContext()

  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(decrementButtonProps, buttonRef)

  return (
    <Button
      ref={buttonRef}
      data-slot="number-field-decrement"
      variant="outline"
      className={cn(
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        buttonPosition === "outside"
          ? "px-3 py-2"
          : "absolute right-0 bottom-0 flex h-1/2 w-6 items-center justify-center rounded-t-none rounded-l-none border-l-0 p-0 focus-visible:outline-none",
        className
      )}
      {...buttonProps}
      {...props}
    >
      {children || buttonPosition === "outside" ? (
        <Minus className="size-3 opacity-50" />
      ) : (
        <ChevronDown className="size-3 opacity-50" />
      )}
    </Button>
  )
}

function NumberFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const {
    numberFieldProps: { inputProps, isInvalid },
    inputRef,
    buttonPosition,
  } = useNumberFieldContext()

  return (
    <Input
      ref={inputRef}
      data-slot="number-field-input"
      type="number"
      className={cn(
        { "focus-visible:ring-destructive": isInvalid },
        buttonPosition === "inside" && "relative z-10 mr-6 rounded-r-none",
        className
      )}
      {...inputProps}
      {...props}
    />
  )
}

export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
}
