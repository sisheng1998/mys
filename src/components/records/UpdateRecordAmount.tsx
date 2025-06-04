"use client"

import React, { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { handleFormError } from "@/lib/error"
import { CURRENCY_FORMAT_OPTIONS } from "@/lib/number"
import { useSafeArea } from "@/hooks/use-safe-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoaderButton } from "@/components/ui/loader-button"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"

const formSchema = z.object({
  amount: z
    .number({
      invalid_type_error: "Required",
    })
    .min(1, "Required"),
})

const UpdateRecordAmount = ({
  ids,
  handleUpdateAmount,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  ids: string[]
  handleUpdateAmount: (amount: number) => Promise<void>
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  useSafeArea(contentRef)

  const defaultValues: z.infer<typeof formSchema> = {
    amount: NaN,
  }

  const form = useForm<typeof defaultValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (values: typeof defaultValues) => {
    try {
      await handleUpdateAmount(values.amount)
      toast.success(`${ids.length} record(s) updated`)
      props.onOpenChange?.(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog {...props}>
      <DialogContent
        ref={contentRef}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          form.reset(defaultValues)
        }}
      >
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle>Edit Amount</DialogTitle>

              <DialogDescription>
                The amount for the selected record(s) will be updated.
              </DialogDescription>
            </DialogHeader>

            <Alert className="bg-primary/10 border-primary text-primary -my-1.5">
              <Info className="size-4" />
              <AlertTitle>{ids.length} record(s) selected</AlertTitle>
              <AlertDescription className="text-primary">
                The amount will be applied to all selected record(s).
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>

                  <FormControl>
                    <NumberField
                      placeholder="Enter amount"
                      formatOptions={CURRENCY_FORMAT_OPTIONS}
                      minValue={1}
                      isInvalid={!!fieldState.error}
                      {...field}
                    >
                      <NumberFieldGroup>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldGroup>
                    </NumberField>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <LoaderButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                Update
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateRecordAmount
