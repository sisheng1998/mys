"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { HelpCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import { handleFormError } from "@/lib/error"
import { CURRENCY_FORMAT_OPTIONS } from "@/lib/number"
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
import { Input } from "@/components/ui/input"
import { LoaderButton } from "@/components/ui/loader-button"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { api } from "@cvx/_generated/api"
import { upsertCategorySchema } from "@cvx/categories/mutations"
import { TITLES } from "@cvx/nameLists/schemas"

type formSchema = z.infer<typeof upsertCategorySchema>

const UpsertCategory = ({
  category,
  children,
}: {
  category?: Category
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const upsertCategory = useMutation(api.categories.mutations.upsertCategory)

  const isEdit = !!category

  const defaultValues = {
    _id: category?._id,
    name: category?.name || "",
    amount: category?.amount ?? NaN,
    titles: category?.titles || [],
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(upsertCategorySchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await upsertCategory(values)
      toast.success(isEdit ? "Category updated" : "New category added")
      setOpen(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

      <DialogContent
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
              <DialogTitle>{isEdit ? "Edit" : "New"} Category</DialogTitle>

              <DialogDescription>
                {isEdit
                  ? "The category in the list will be updated."
                  : "New category will be added to the list."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="grid items-start gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input placeholder="Donation" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>Amount</span>

                        <Tooltip>
                          <TooltipTrigger
                            className="cursor-help opacity-50"
                            asChild
                          >
                            <HelpCircle className="size-3.5" />
                          </TooltipTrigger>

                          <TooltipContent
                            className="max-w-60 text-center"
                            side="bottom"
                          >
                            Default amount for this category. Leave empty for
                            any amount.
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>

                      <FormControl>
                        <NumberField
                          placeholder="Any amount"
                          formatOptions={CURRENCY_FORMAT_OPTIONS}
                          minValue={1}
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
              </div>

              <FormField
                control={form.control}
                name="titles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Available To</span>

                      <Tooltip>
                        <TooltipTrigger
                          className="cursor-help opacity-50"
                          asChild
                        >
                          <HelpCircle className="size-3.5" />
                        </TooltipTrigger>

                        <TooltipContent
                          className="max-w-60 text-center"
                          side="bottom"
                        >
                          Choose who can use this category. Leave empty for
                          everyone.
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>

                    <FormControl>
                      <MultiSelect
                        placeholder="Everyone"
                        options={TITLES.map((title) => ({
                          value: title,
                          label: title,
                        }))}
                        modal
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <LoaderButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                {isEdit ? "Update" : "Add Category"}
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertCategory
