"use client"

import React, { useMemo, useState } from "react"
import { saveAs } from "file-saver"
import { Info } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import { EventDetails, EventRecord } from "@/types/event"
import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { getExcelSheetName, getValidFilename } from "@/lib/string"
import { useQuery } from "@/hooks/use-query"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { LoaderButton } from "@/components/ui/loader-button"

import { api } from "@cvx/_generated/api"

const ExportEventRecord = ({
  event,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  event: EventDetails
}) => {
  const { data = [] } = useQuery(api.events.queries.getRecords, {
    _id: event._id,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const groupedData = useMemo(() => {
    const grouped: Record<string, EventRecord[]> = {}

    for (const cat of event.categories) {
      grouped[cat.name] = []
    }

    for (const record of data) {
      const category = record.category

      if (!grouped[category]) grouped[category] = []

      grouped[category].push(record)
    }

    return grouped
  }, [data, event.categories])

  const handleExport = async () => {
    try {
      setIsLoading(true)

      const wb = XLSX.utils.book_new()

      Object.entries(groupedData).forEach(([category, records]) => {
        if (records.length === 0) return

        const sheetName = getExcelSheetName(category)

        const ws = XLSX.utils.json_to_sheet(
          records.map((r) => ({
            title: r.title || "",
            name: r.name,
            amount: r.amount,
          })),
          {
            skipHeader: true,
          }
        )

        XLSX.utils.book_append_sheet(wb, ws, sheetName)
      })

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

      const title = `${event.name} - ${formatDate(event.date)} (${getLunarDateInChinese(getLunarDateFromSolarDate(event.date))})`

      const filename = `${getValidFilename(title)}.xlsx`
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename)

      toast.success("Excel file exported")
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while exporting the file")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog {...props}>
      <DialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          setIsLoading(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Export Event Record(s)</DialogTitle>

          <DialogDescription>
            Export all the event record(s) to an Excel file.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-primary/10 border-primary text-primary">
          <Info />
          <AlertTitle>Total {data.length} record(s)</AlertTitle>
          <AlertDescription className="text-primary">
            All record(s) will be exported.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <LoaderButton
            onClick={handleExport}
            isLoading={isLoading}
            disabled={data.length === 0 || isLoading}
          >
            Export
          </LoaderButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportEventRecord
