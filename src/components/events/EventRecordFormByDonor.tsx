"use client"

import React from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import { isCategoryDisabled } from "@/lib/category"
import { handleFormError } from "@/lib/error"
import { CURRENCY_FORMAT_OPTIONS } from "@/lib/number"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import NameAutocomplete from "@/components/records/NameAutocomplete"
import { FormFooter } from "@/components/templates/AddTemplateRecord"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"
import { addEventRecordByDonorSchema } from "@cvx/events/mutations"
import { TITLES } from "@cvx/nameLists/schemas"

const getExtendedSchema = (categories: Category[]) =>
  addEventRecordByDonorSchema
    .extend({
      title: addEventRecordByDonorSchema.shape.title.nullable(),
      records: z.array(
        addEventRecordByDonorSchema.shape.records.element.extend({
          id: z.number(),
        })
      ),
    })
    .superRefine((data, ctx) => {
      data.records.forEach((record, index) => {
        const selectedCategory = categories.find(
          (c) => c.name === record.category
        )

        if (
          !selectedCategory ||
          !isCategoryDisabled(selectedCategory, data.title || undefined)
        )
          return

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not allowed for this donor",
          path: ["records", index, "category"],
        })
      })
    })

type formSchema = z.infer<ReturnType<typeof getExtendedSchema>>

const EventRecordFormByDonor = ({
  categories,
  handleClose,
}: {
  categories: Category[]
  handleClose: () => void
}) => {
  const { _id } = useParams<{ _id: Id<"events"> }>()

  const addEventRecord = useMutation(api.events.mutations.addEventRecordByDonor)

  const defaultValues: formSchema = {
    eventId: _id,
    title: null,
    name: "",
    records: [{ id: Date.now(), category: "", amount: NaN }],
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(getExtendedSchema(categories)),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "records",
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await addEventRecord({
        ...values,
        title: values.title || undefined,
        records: values.records.map(({ id, ...record }) => {
          void id
          return record
        }),
      })
      toast.success("Record(s) added")
      handleClose()
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  const getAvailableCategories = (currentIndex: number) => {
    const selectedCategories = form
      .getValues()
      .records.map((record, i) => (i !== currentIndex ? record.category : null))
      .filter(Boolean)

    return categories.filter(
      (category) => !selectedCategories.includes(category.name)
    )
  }

  const totalAmount = form
    .watch("records")
    .reduce((acc, record) => acc + (record.amount || 0), 0)

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => {
            const triggerCategories = () =>
              form.getValues("records").forEach(async (record, index) => {
                if (record.category) {
                  await form.trigger([`records.${index}.category`])
                }
              })

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
                            triggerCategories()
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="min-w-16 justify-center rounded-r-none border-r-0 [&_svg]:hidden">
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
                        triggerCategories()
                      }}
                      isInvalid={!!fieldState.error}
                      autoFocus
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <div className="-mt-1 flex flex-col gap-4">
          <div className="-mb-1 flex flex-wrap items-center justify-between gap-2 sm:-mb-2">
            <FormLabel>Donation(s)</FormLabel>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  ...defaultValues.records[0],
                  id: Date.now(),
                })
              }
            >
              <Plus />
              Add Donation
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid items-start gap-4 sm:grid-cols-2"
            >
              {index === 0 && <Separator className="-mb-2 sm:hidden" />}

              <FormField
                control={form.control}
                name={`records.${index}.category`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(
                        "sm:mb-1 sm:hidden",
                        index === 0 && "flex!"
                      )}
                    >
                      Category
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)

                        const selectedCategory = categories.find(
                          (c) => c.name === value
                        )

                        if (selectedCategory && selectedCategory.amount) {
                          form.setValue(
                            `records.${index}.amount`,
                            selectedCategory.amount
                          )
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

                        {getAvailableCategories(index).map((category) => (
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

              <div className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name={`records.${index}.amount`}
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormLabel
                        className={cn(
                          "sm:mb-1 sm:hidden",
                          index === 0 && "flex!"
                        )}
                      >
                        Amount
                      </FormLabel>

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

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "-mx-2 mt-[1.375rem] transition-colors sm:mt-0",
                        index === 0 && "sm:mt-[1.625rem]"
                      )}
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent side="left">Remove</TooltipContent>
                </Tooltip>
              </div>

              <Separator className="-mb-2 sm:hidden" />
            </div>
          ))}
        </div>

        <FormFooter
          totalAmount={totalAmount}
          isLoading={form.formState.isSubmitting}
        />
      </form>
    </Form>
  )
}

export default EventRecordFormByDonor
