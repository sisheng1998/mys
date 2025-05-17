"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import { Title } from "@/types/nameList"
import { isCategoryDisabled } from "@/lib/category"
import { handleFormError } from "@/lib/error"
import { CURRENCY_FORMAT_OPTIONS, formatCurrency } from "@/lib/number"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import NameAutocomplete from "@/components/templates/NameAutocomplete"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"
import { TITLES } from "@cvx/nameLists/schemas"
import { addTemplateRecordSchema } from "@cvx/templates/mutations"

const extendedSchema = addTemplateRecordSchema.extend({
  title: addTemplateRecordSchema.shape.title.nullable(),
  records: z.array(
    addTemplateRecordSchema.shape.records.element.extend({
      id: z.number(),
    })
  ),
})

type formSchema = z.infer<typeof extendedSchema>

const AddTemplateRecord = ({ categories }: { categories: Category[] }) => {
  const { _id } = useParams<{ _id: Id<"templates"> }>()
  const [open, setOpen] = useState<boolean>(false)

  const addTemplateRecord = useMutation(
    api.templates.mutations.addTemplateRecord
  )

  const defaultValues: formSchema = {
    templateId: _id,
    title: null,
    name: "",
    records: [{ id: Date.now(), category: "", amount: NaN }],
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(extendedSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "records",
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await addTemplateRecord({
        ...values,
        title: values.title || undefined,
        records: values.records.map(({ id, ...record }) => {
          void id
          return record
        }),
      })
      toast.success("Record(s) added")
      setOpen(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  const getAvailableCategories = (currentIndex: number) => {
    const selectedCategories = form
      .getValues()
      .records.map((record, i) => (i !== currentIndex ? record.category : null))
      .filter(Boolean)

    const title = form.watch("title") || undefined

    return categories.filter(
      (category) =>
        !isCategoryDisabled(category, title) &&
        !selectedCategories.includes(category.name)
    )
  }

  const totalAmount = form
    .watch("records")
    .reduce((acc, record) => acc + (record.amount || 0), 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>New Record(s)</span>
        </Button>
      </DialogTrigger>

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
              <DialogTitle>New Record(s)</DialogTitle>

              <DialogDescription>
                New record(s) will be added to the list.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                const resetCategoryIfDisabled = (title?: Title) => {
                  const records = form.getValues("records")

                  records.forEach((record, index) => {
                    const selectedCategory = categories.find(
                      (c) => c.name === record.category
                    )

                    if (
                      selectedCategory &&
                      isCategoryDisabled(selectedCategory, title)
                    ) {
                      form.setValue(`records.${index}.category`, null!)
                    }
                  })
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
                                resetCategoryIfDisabled(
                                  (value || undefined) as Title
                                )
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className="min-w-16 justify-center rounded-r-none border-r-0 [&_svg]:hidden">
                                  <SelectValue placeholder="Title" />
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
                          onSelect={(data) => {
                            field.onChange(data.name)
                            form.setValue("title", data.title || null)
                            resetCategoryIfDisabled(data.title)
                          }}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <div className="-mt-1 flex flex-col gap-4">
              <div className="-mb-1 flex items-center justify-between gap-2 sm:-mb-2">
                <FormLabel>Item(s)</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    append({ id: Date.now(), category: "", amount: NaN })
                  }
                >
                  <Plus />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_1fr_auto] items-start gap-2 sm:gap-4"
                >
                  <FormField
                    control={form.control}
                    name={`records.${index}.category`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && (
                          <FormLabel className="mb-1">Category</FormLabel>
                        )}

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
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value={null!}>
                              <span className="text-muted-foreground">
                                Select
                              </span>
                            </SelectItem>

                            {getAvailableCategories(index).map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category.name}
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
                    name={`records.${index}.amount`}
                    render={({ field }) => {
                      const category = form.watch(`records.${index}.category`)
                      const selectedCategory = categories.find(
                        (c) => c.name === category
                      )
                      const isDisabled = selectedCategory?.amount !== undefined

                      return (
                        <FormItem>
                          {index === 0 && (
                            <FormLabel className="mb-1">Amount</FormLabel>
                          )}

                          <FormControl>
                            <NumberField
                              placeholder="Enter amount"
                              formatOptions={CURRENCY_FORMAT_OPTIONS}
                              minValue={1}
                              isDisabled={isDisabled}
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
                      )
                    }}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "-mx-2 transition-colors",
                          index === 0 && "mt-[1.625rem]"
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
              ))}
            </div>

            <DialogFooter>
              <p className="order-1 self-center sm:order-none sm:mr-auto">
                <span className="text-sm">Total:</span>{" "}
                <span className="font-semibold">
                  {formatCurrency(totalAmount)}
                </span>
              </p>

              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <LoaderButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                Add Record(s)
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTemplateRecord
