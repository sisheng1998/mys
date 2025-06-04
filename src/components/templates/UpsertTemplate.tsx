"use client"

import React, { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { ChevronDown, CircleAlert, ExternalLink, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Template } from "@/types/template"
import {
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
  getSolarDateFromLunarDate,
  isSelectedLunarDate,
  sortLunarDates,
} from "@/lib/date"
import { handleFormError } from "@/lib/error"
import { cn } from "@/lib/utils"
import { useQuery } from "@/hooks/use-query"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import ControlledInput from "@/components/ui/controlled-input"
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
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"
import { upsertTemplateSchema } from "@cvx/templates/mutations"

type formSchema = z.infer<typeof upsertTemplateSchema>

const UpsertTemplate = ({
  template,
  children,
}: {
  template?: Template
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState<boolean>(false)

  const { data: categories = [], status } = useQuery(
    api.categories.queries.list
  )
  const upsertTemplate = useMutation(api.templates.mutations.upsertTemplate)

  const isEdit = !!template

  const defaultValues: formSchema = {
    _id: template?._id,
    name: template?.name || "",
    dates: (template?.dates || []) as [string, ...string[]],
    categories: (template?.categories || []) as [
      Id<"categories">,
      ...Id<"categories">[],
    ],
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(upsertTemplateSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await upsertTemplate(values)
      toast.success(isEdit ? "Template updated" : "New template added")
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
              <DialogTitle>{isEdit ? "Edit" : "New"} Template</DialogTitle>

              <DialogDescription>
                {isEdit
                  ? "The template in the list will be updated."
                  : "New template will be added to the list."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <ControlledInput placeholder="Donation" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => {
                  const hasValue = field.value.length > 0

                  return (
                    <FormItem>
                      <FormLabel>Lunar Date(s)</FormLabel>

                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="hover:bg-background h-auto min-h-9 px-3 py-1 font-normal"
                            >
                              <div
                                className={cn(
                                  "flex flex-1 flex-wrap items-center gap-1",
                                  hasValue && "-ml-1"
                                )}
                              >
                                {hasValue ? (
                                  field.value.map((date) => (
                                    <Badge key={date} variant="secondary">
                                      {getLunarDateInChinese(date)}
                                      <div
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          field.onChange(
                                            field.value.filter(
                                              (d) => d !== date
                                            )
                                          )
                                        }}
                                      >
                                        <X className="size-3" />
                                      </div>
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select
                                  </span>
                                )}
                              </div>

                              {hasValue && (
                                <>
                                  <div
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      field.onChange([])
                                    }}
                                  >
                                    <X className="size-4" />
                                  </div>

                                  <Separator orientation="vertical" />
                                </>
                              )}

                              <ChevronDown className="size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="multiple"
                            defaultMonth={
                              field.value.length > 0
                                ? getSolarDateFromLunarDate(field.value[0])
                                : undefined
                            }
                            selected={field.value.map((date) =>
                              getSolarDateFromLunarDate(date)
                            )}
                            onSelect={(dates) =>
                              field.onChange(
                                sortLunarDates(
                                  (dates ?? []).map((date) =>
                                    getLunarDateFromSolarDate(date)
                                  )
                                )
                              )
                            }
                            disabled={(day: Date) =>
                              isSelectedLunarDate(day, field.value)
                            }
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel>Category(s)</FormLabel>

                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0! text-xs leading-none"
                        asChild
                      >
                        <Link href="/categories">
                          Manage
                          <ExternalLink className="size-3.5" />
                        </Link>
                      </Button>
                    </div>

                    <FormControl>
                      {status === "pending" ? (
                        <Skeleton className="h-9" />
                      ) : categories.length > 0 ? (
                        <MultiSelect
                          placeholder="Select"
                          options={categories.map((category) => ({
                            value: category._id,
                            label: category.name,
                          }))}
                          isInvalid={!!fieldState.error}
                          modal
                          {...field}
                        />
                      ) : (
                        <Alert className="items-center px-3 py-1.5 [&>svg]:translate-y-0">
                          <CircleAlert />
                          <AlertTitle className="py-px">
                            No categories yet
                          </AlertTitle>
                        </Alert>
                      )}
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
                {isEdit ? "Update" : "Add Template"}
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertTemplate
