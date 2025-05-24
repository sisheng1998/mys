"use client"

import React, { useRef, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { CalendarIcon, CircleAlert, ExternalLink } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Event } from "@/types/event"
import {
  formatDate,
  formatISODate,
  getDateFromISODate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { handleFormError } from "@/lib/error"
import { useQuery } from "@/hooks/use-query"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"
import { upsertEventSchema } from "@cvx/events/mutations"

type formSchema = z.infer<typeof upsertEventSchema>

// TODO: For add event, implement select from template

const UpsertEvent = ({
  event,
  children,
}: {
  event?: Event
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const popOverRef = useRef<HTMLButtonElement>(null)

  const { data: categories = [], status } = useQuery(
    api.categories.queries.list
  )
  const upsertEvent = useMutation(api.events.mutations.upsertEvent)

  const isEdit = !!event

  const defaultValues: formSchema = {
    _id: event?._id,
    name: event?.name || "",
    date: event?.date || "",
    categories: (event?.categories || []) as [
      Id<"categories">,
      ...Id<"categories">[],
    ],
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(upsertEventSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await upsertEvent(values)
      toast.success(isEdit ? "Event updated" : "New event added")
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
              <DialogTitle>{isEdit ? "Edit" : "New"} Event</DialogTitle>

              <DialogDescription>
                {isEdit
                  ? "The event in the list will be updated."
                  : "New event will be added to the list."}
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
                      <Input placeholder="Donation" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>

                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="hover:bg-background h-auto min-h-9 justify-start px-3 py-1 font-normal"
                          >
                            <CalendarIcon />
                            {field.value ? (
                              `${formatDate(field.value)} (${getLunarDateInChinese(getLunarDateFromSolarDate(field.value))})`
                            ) : (
                              <span className="text-muted-foreground">
                                Pick a date
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <PopoverClose ref={popOverRef} />

                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? getDateFromISODate(field.value)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(formatISODate(date))
                              popOverRef.current?.click()
                            } else {
                              field.onChange("")
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
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
                {isEdit ? "Update" : "Add Event"}
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertEvent
