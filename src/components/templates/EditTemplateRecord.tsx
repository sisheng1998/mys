"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Edit } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import { Title } from "@/types/nameList"
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
import { TITLES } from "@cvx/nameLists/schemas"
import { editTemplateRecordSchema } from "@cvx/templates/mutations"

const extendedSchema = editTemplateRecordSchema.extend({
  title: editTemplateRecordSchema.shape.title.nullable(),
})

type formSchema = z.infer<typeof extendedSchema>

const EditTemplateRecord = ({
  templateRecord,
  categories,
}: {
  templateRecord: TemplateRecord
  categories: Category[]
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const editTemplateRecord = useMutation(
    api.templates.mutations.editTemplateRecord
  )

  const defaultValues = templateRecord

  const form = useForm<formSchema>({
    resolver: zodResolver(extendedSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await editTemplateRecord({ ...values, title: values.title || undefined })
      toast.success("Record updated")
      setOpen(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Edit />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">Edit</TooltipContent>
      </Tooltip>

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
                The record in the list will be updated.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={() => (
                <FormItem>
                  <FormLabel>Donor</FormLabel>

                  <div className="flex items-stretch">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                              field.onChange(value)

                              const category = form.watch("category")
                              const selectedCategory = categories.find(
                                (c) => c.name === category
                              )

                              if (
                                selectedCategory &&
                                isCategoryDisabled(
                                  selectedCategory,
                                  (value || undefined) as Title
                                )
                              ) {
                                form.setValue("category", null!)
                              }
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
                      <NameAutocomplete categories={categories} />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
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
                          <SelectValue placeholder="Select" />
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
                render={({ field }) => {
                  const category = form.watch("category")
                  const selectedCategory = categories.find(
                    (c) => c.name === category
                  )
                  const isDisabled = selectedCategory?.amount !== undefined

                  return (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>

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
