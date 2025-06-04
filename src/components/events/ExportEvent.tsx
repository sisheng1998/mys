"use client"

import React, { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { pdf } from "@react-pdf/renderer"
import { useConvex } from "convex/react"
import { saveAs } from "file-saver"
import { Download } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Category } from "@/types/category"
import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { handleFormError } from "@/lib/error"
import { getValidFilename } from "@/lib/string"
import { useSafeArea } from "@/hooks/use-safe-area"
import { Button } from "@/components/ui/button"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { LoaderButton } from "@/components/ui/loader-button"
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

type formSchema = z.infer<typeof exportEventSchema>

const ExportEvent = ({
  _id,
  categories,
}: {
  _id: Id<"events">
  categories: Category[]
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  useSafeArea(contentRef)

  const convex = useConvex()

  const defaultValues: formSchema = {
    _id,
    category: "",
    withAmount: false,
  }

  const form = useForm<formSchema>({
    resolver: zodResolver(exportEventSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      const data = await convex.query(
        api.events.queries.getRecordsForExport,
        values
      )

      if (data.records.length === 0) {
        toast.warning("No records found")
        return
      }

      const title = `${data.name}${data.category} - ${formatDate(data.date)} (${getLunarDateInChinese(getLunarDateFromSolarDate(data.date))})`

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
              name="withAmount"
              render={({ field }) => (
                <FormItem>
                  <Label>PDF Content</Label>

                  <Label
                    htmlFor={`checkbox-${field.name}`}
                    className="cursor-pointer rounded-md border border-dashed px-3 py-2 shadow-xs"
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
