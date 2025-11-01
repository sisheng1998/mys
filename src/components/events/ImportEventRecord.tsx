"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import { Category } from "@/types/category"
import { EventRecord } from "@/types/event"
import { Title } from "@/types/nameList"
import { convertSCToTC } from "@/lib/string"
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
import ExcelDropzone from "@/components/events/ExcelDropzone"

import { Id } from "@cvx/_generated/dataModel"

const ImportEventRecord = ({
  _id,
  categories,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  _id: Id<"events">
  categories: Category[]
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUpload = async (file: File) => {
    try {
      setIsLoading(true)

      const records: Partial<EventRecord>[] = []

      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })

      workbook.SheetNames.forEach((sheetName) => {
        const category = categories.find(
          (c) => c.name === convertSCToTC(sheetName)
        )

        if (!category) return

        const worksheet = workbook.Sheets[sheetName]

        const data = XLSX.utils.sheet_to_json(worksheet, {
          header: ["title", "name", "amount"],
          defval: "",
        }) as Partial<EventRecord>[]

        data.forEach((row) =>
          records.push({
            category: category.name,
            title: row.title
              ? (convertSCToTC(row.title.trim()) as Title)
              : undefined,
            name: convertSCToTC((row.name || "").trim()),
            amount: row.amount || category.amount || 0,
          })
        )
      })

      console.log(_id)
      console.log(records)
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while uploading the file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {}

  return (
    <Dialog {...props}>
      <DialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          setIsLoading(false)
        }}
      >
        <DialogHeader>
          <DialogTitle>Import Event Record(s)</DialogTitle>

          <DialogDescription>
            Import the event record(s) from an Excel file.
          </DialogDescription>
        </DialogHeader>

        <ExcelDropzone handleUpload={handleUpload} isLoading={isLoading} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <LoaderButton
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Import
          </LoaderButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportEventRecord
