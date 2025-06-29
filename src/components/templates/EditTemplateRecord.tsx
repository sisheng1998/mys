"use client"

import React, { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import { TemplateRecord } from "@/types/template"
import { isCategoryDisabled } from "@/lib/category"
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
import { LoaderButton } from "@/components/ui/loader-button"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import NameAutocomplete from "@/components/records/NameAutocomplete"

import { api } from "@cvx/_generated/api"
import { TITLES } from "@cvx/nameLists/schemas"
import { editTemplateRecordSchema } from "@cvx/templates/mutations"

const getExtendedSchema = (categories: Category[]) =>
  editTemplateRecordSchema
    .extend({
      title: editTemplateRecordSchema.shape.title.nullable(),
    })
    .superRefine((data, ctx) => {
      const selectedCategory = categories.find((c) => c.name === data.category)

      if (
        !selectedCategory ||
        !isCategoryDisabled(selectedCategory, data.title || undefined)
      )
        return

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not allowed for this donor",
        path: ["category"],
      })
    })

type formSchema = z.infer<ReturnType<typeof getExtendedSchema>>

const EditTemplateRecord = ({
  templateRecord,
  categories,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  templateRecord?: TemplateRecord
  categories: Category[]
}) => {
  const editTemplateRecord = useMutation(
    api.templates.mutations.editTemplateRecord
  )

  const defaultValues: formSchema = useMemo(
    () =>
      templateRecord ??
      ({
        _id: "",
        templateId: "",
        title: null,
        name: "",
        category: "",
        amount: NaN,
      } as formSchema),
    [templateRecord]
  )

  const form = useForm<formSchema>({
    resolver: zodResolver(getExtendedSchema(categories)),
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [form, defaultValues])

  const onSubmit = async (values: formSchema) => {
    try {
      await editTemplateRecord({ ...values, title: values.title || undefined })
      toast.success("Record updated")
      props.onOpenChange?.(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog {...props}>
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
              <DialogTitle>Edit Record</DialogTitle>

              <DialogDescription>
                The record in the template will be updated.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => {
                const triggerCategory = async () => {
                  const category = form.getValues("category")

                  if (category) {
                    await form.trigger(["category"])
                  }
                }

                return (
                  <FormItem>
                    <FormLabel>Donor</FormLabel>

                    <div className="flex items-stretch">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field: titleField }) => (
                          <FormItem>
                            <Select
                              value={titleField.value || ""}
                              onValueChange={(value) => {
                                titleField.onChange(value)
                                triggerCategory()
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className="min-w-16 justify-center rounded-r-none border-r-0 px-2 [&_svg]:hidden">
                                  <SelectValue placeholder="Title">
                                    {titleField.value || "Title"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                <SelectItem value={null!}>
                                  <span className="text-muted-foreground">
                                    Select
                                  </span>
                                </SelectItem>

                                {TITLES.map((title) => (
                                  <SelectItem key={title} value={title}>
                                    {title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormControl>
                        <NameAutocomplete
                          name="name"
                          onSelect={(data) => {
                            field.onChange(data.name)
                            form.setValue("title", data.title || null)
                            triggerCategory()
                          }}
                          isInvalid={!!fieldState.error}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <div className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)

                        const selectedCategory = categories.find(
                          (c) => c.name === value
                        )

                        if (selectedCategory && selectedCategory.amount) {
                          form.setValue("amount", selectedCategory.amount)
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full min-w-24">
                          <SelectValue placeholder="Select">
                            {field.value || "Select"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={null!}>
                          <span className="text-muted-foreground">Select</span>
                        </SelectItem>

                        {categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category.name}
                            disabled={isCategoryDisabled(
                              category,
                              form.watch("title") || undefined
                            )}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
                Update
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTemplateRecord
