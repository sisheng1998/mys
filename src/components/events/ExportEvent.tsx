"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { pdf } from "@react-pdf/renderer"
import { useConvex } from "convex/react"
import { saveAs } from "file-saver"
import { CalendarIcon, Download } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import {
  formatDate,
  getEndOfDay,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
  getStartOfDay,
  isSameDay,
} from "@/lib/date"
import { handleFormError } from "@/lib/error"
import { getValidFilename } from "@/lib/string"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { LoaderButton } from "@/components/ui/loader-button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import EventRecordPDF from "@/components/events/EventRecordPDF"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"
import { exportEventSchema } from "@cvx/events/queries"

const extendedSchema = exportEventSchema.extend({
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
})

type formSchema = z.infer<typeof extendedSchema>

const ExportEvent = ({
  _id,
  categories,
  _creationTime,
}: {
  _id: Id<"events">
  categories: Category[]
  _creationTime: number
}) => {
  const convex = useConvex()

  const today = new Date()
  const minDate = new Date(_creationTime)

  const defaultValues: formSchema = {
    _id,
    category: "",
    withAmount: false,
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(extendedSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      const { dateRange, ...body } = values

      const startDate = dateRange
        ? getStartOfDay(dateRange.from).valueOf()
        : undefined

      const endDate = dateRange
        ? getEndOfDay(dateRange.to).valueOf()
        : undefined

      const data = await convex.query(api.events.queries.getRecordsForExport, {
        ...body,
        startDate,
        endDate,
      })

      if (data.records.length === 0) {
        toast.warning("No records found")
        return
      }

      let title = `${data.name}${data.category} - ${formatDate(data.date)} (${getLunarDateInChinese(getLunarDateFromSolarDate(data.date))})`

      if (dateRange) {
        title += ` [${formatDate(dateRange.from)}${!isSameDay(dateRange.from, dateRange.to) ? `-${formatDate(dateRange.to)}` : ""}]`
      }

      const blob = await pdf(
        <EventRecordPDF
          title={title}
          data={data}
          withAmount={values.withAmount}
        />
      ).toBlob()

      const filename = `${getValidFilename(`${title}${values.withAmount ? " (A)" : ""}`)}.pdf`
      saveAs(blob, filename)

      toast.success("PDF exported")
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Download />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">Export</TooltipContent>
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
              <DialogTitle>Export Event</DialogTitle>

              <DialogDescription>
                Export the event as a PDF file.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
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

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>

                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="hover:bg-background h-auto min-h-9 justify-start px-3 py-1 text-left font-normal whitespace-normal"
                        >
                          <CalendarIcon />
                          {field.value ? (
                            <span>
                              {`${formatDate(field.value.from)} (${getLunarDateInChinese(getLunarDateFromSolarDate(field.value.from))})`}
                              {!isSameDay(field.value.from, field.value.to) &&
                                ` - ${formatDate(field.value.to)} (${getLunarDateInChinese(getLunarDateFromSolarDate(field.value.to))})`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date / range
                            </span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <PopoverClose className="hidden" />

                      <Calendar
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        startMonth={minDate}
                        endMonth={today}
                        disabled={{
                          before: minDate,
                          after: today,
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  <FormDescription className="text-xs">
                    Leave blank to export all records
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="withAmount"
              render={({ field }) => (
                <FormItem>
                  <Label>PDF Content</Label>

                  <Label
                    htmlFor={`checkbox-${field.name}`}
                    className="bg-background dark:bg-input/30 dark:hover:bg-input/50 cursor-pointer rounded-md border border-dashed px-3 py-2 shadow-xs"
                  >
                    <FormControl>
                      <Checkbox
                        id={`checkbox-${field.name}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel className="pointer-events-none h-4.5 font-normal">
                      Include donation amount
                    </FormLabel>
                  </Label>
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
                Export
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ExportEvent
