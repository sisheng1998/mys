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
import { handleFormError } from "@/lib/error"
import { isTitleDisabled } from "@/lib/name"
import { CURRENCY_FORMAT_OPTIONS } from "@/lib/number"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
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
import { addEventRecordByCategorySchema } from "@cvx/events/mutations"
import { TITLES } from "@cvx/nameLists/schemas"

const getExtendedSchema = (categories: Category[]) =>
  addEventRecordByCategorySchema
    .extend({
      records: z.array(
        addEventRecordByCategorySchema.shape.records.element.extend({
          id: z.number(),
          title:
            addEventRecordByCategorySchema.shape.records.element.shape.title.nullable(),
          isPaid: z.boolean(),
        })
      ),
    })
    .superRefine((data, ctx) => {
      const selectedCategory = categories.find((c) => c.name === data.category)

      if (!selectedCategory) return

      data.records.forEach((record, index) => {
        if (!isTitleDisabled(record.title ?? undefined, selectedCategory))
          return

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not allowed for this category",
          path: ["records", index, "name"],
        })
      })
    })

type formSchema = z.infer<ReturnType<typeof getExtendedSchema>>

const EventRecordFormByCategory = ({
  categories,
  handleClose,
}: {
  categories: Category[]
  handleClose: () => void
}) => {
  const { _id } = useParams<{ _id: Id<"events"> }>()

  const addEventRecord = useMutation(
    api.events.mutations.addEventRecordByCategory
  )

  const defaultValues: formSchema = {
    eventId: _id,
    category: "",
    amount: NaN,
    records: [
      { id: Date.now(), title: null, name: "", amount: NaN, isPaid: false },
    ],
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
        records: values.records.map(({ id, ...record }) => {
          void id
          return {
            ...record,
            title: record.title || undefined,
          }
        }),
      })
      toast.success("Record(s) added")
      handleClose()
    } catch (error) {
      handleFormError(error, form.setError)
    }
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

                  if (selectedCategory) {
                    if (selectedCategory.amount) {
                      form.setValue("amount", selectedCategory.amount)
                    }

                    form.getValues("records").forEach(async (record, index) => {
                      if (!record.amount && selectedCategory.amount) {
                        form.setValue(
                          `records.${index}.amount`,
                          selectedCategory.amount
                        )
                      }

                      if (record.name) {
                        await form.trigger([`records.${index}.name`])
                      }
                    })
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
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="-mt-1 flex flex-col gap-4">
          <div className="-mb-1 flex flex-wrap items-center justify-between gap-2">
            <FormLabel>Donation(s)</FormLabel>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  ...defaultValues.records[0],
                  id: Date.now(),
                  amount: form.watch("amount"),
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
              {index === 0 && <Separator className="-mb-2 sm:col-span-2" />}

              <FormField
                control={form.control}
                name={`records.${index}.name`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Donor</FormLabel>

                    <div className="flex items-stretch">
                      <FormField
                        control={form.control}
                        name={`records.${index}.title`}
                        render={({ field: titleField }) => (
                          <FormItem>
                            <Select
                              value={titleField.value || ""}
                              onValueChange={titleField.onChange}
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
                                  <SelectItem
                                    key={title}
                                    value={title}
                                    disabled={isTitleDisabled(
                                      title,
                                      categories.find(
                                        (c) => c.name === form.watch("category")
                                      )
                                    )}
                                  >
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
                          name={`records.${index}.name`}
                          onSelect={async (data) => {
                            field.onChange(data.name)
                            form.setValue(
                              `records.${index}.title`,
                              data.title || null
                            )

                            await form.trigger([
                              `records.${index}.name`,
                              `records.${index}.title`,
                            ])
                          }}
                          isInvalid={!!fieldState.error}
                          autoFocus
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`records.${index}.amount`}
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
                        onChange={(value) => {
                          field.onChange(value)

                          if (
                            !form.watch("amount") ||
                            form.watch("records").length === 1
                          ) {
                            form.setValue("amount", value)
                          }
                        }}
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

              <div className="flex items-start justify-between gap-4 sm:col-span-2 sm:-mt-1.5 sm:-mb-2">
                <FormField
                  control={form.control}
                  name={`records.${index}.isPaid`}
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor={`checkbox-${field.name}`}
                        className="min-h-9 cursor-pointer"
                      >
                        <FormControl>
                          <Checkbox
                            id={`checkbox-${field.name}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <FormLabel className="pointer-events-none font-normal">
                          Mark as Paid
                        </FormLabel>
                      </Label>
                    </FormItem>
                  )}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="-mx-2 transition-colors"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent side="left">Remove</TooltipContent>
                </Tooltip>
              </div>

              <Separator className="-mb-2 sm:col-span-2" />
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

export default EventRecordFormByCategory
