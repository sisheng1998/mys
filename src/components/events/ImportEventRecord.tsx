"use client"

import React, { useMemo, useRef, useState } from "react"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useConvex, useMutation } from "convex/react"
import { FunctionReturnType } from "convex/server"
import { CircleAlert, CircleDollarSign, LayoutList, Users } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { z } from "zod"

import { Category } from "@/types/category"
import { getRowNumber } from "@/lib/data-table"
import { handleMutationError } from "@/lib/error"
import { getLabelText } from "@/lib/name"
import { formatCurrency, formatNumber } from "@/lib/number"
import { convertSCToTC, getExcelSheetName } from "@/lib/string"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { LoaderButton } from "@/components/ui/loader-button"
import {
  UnderlineTabs,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@/components/ui/underline-tab"
import { VirtualizedDataTable } from "@/components/data-table/DataTable"
import { DEFAULT_TAB } from "@/components/events/CategoryTab"
import ExcelDropzone from "@/components/events/ExcelDropzone"
import { IconWithText } from "@/components/templates/TemplateList"
import { usePrinter } from "@/contexts/printer"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"
import { importEventRecordSchema } from "@cvx/events/queries"

type EventRecord = FunctionReturnType<
  typeof api.events.queries.getRecordsForImport
>[number]

const WITH_REMARKS = "With Remarks"

const ImportEventRecord = ({
  _id,
  categories,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  _id: Id<"events">
  categories: Category[]
}) => {
  const { device, print } = usePrinter()

  const convex = useConvex()

  const importEventRecords = useMutation(
    api.events.mutations.importEventRecords
  )

  const [eventRecords, setEventRecords] = useState<EventRecord[]>([])
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_TAB)
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [printCategory, setPrintCategory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const groupedEventRecords = useMemo(() => {
    const grouped: Record<string, EventRecord[]> = {}

    for (const record of eventRecords) {
      if (!grouped[record.category]) grouped[record.category] = []
      grouped[record.category].push(record)
    }

    return grouped
  }, [eventRecords])

  const { invalidEventRecords, eventRecordsWithRemarks } = useMemo(() => {
    const invalidEventRecords: EventRecord[] = []
    const eventRecordsWithRemarks: EventRecord[] = []

    for (const record of eventRecords) {
      if (record.invalid) {
        invalidEventRecords.push(record)
      } else if (record.remarks) {
        eventRecordsWithRemarks.push(record)
      }
    }

    return {
      invalidEventRecords,
      eventRecordsWithRemarks,
    }
  }, [eventRecords])

  const handleUpload = async (file: File) => {
    try {
      setIsLoading(true)

      const records: z.infer<typeof importEventRecordSchema>["records"] = []

      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })

      workbook.SheetNames.forEach((sheetName) => {
        const category = categories.find(
          (c) => c.name === getExcelSheetName(convertSCToTC(sheetName))
        )

        if (!category) return

        const worksheet = workbook.Sheets[sheetName]

        if (worksheet["!ref"]) {
          const range = XLSX.utils.decode_range(worksheet["!ref"])

          range.s.c = 0
          range.s.r = 0

          worksheet["!ref"] = XLSX.utils.encode_range(range)
        }

        const data = XLSX.utils.sheet_to_json(worksheet, {
          header: ["title", "name", "amount", "notes"],
          defval: "",
        }) as Partial<EventRecord>[]

        data.forEach((row) =>
          records.push({
            category: category.name,
            title: row.title ? convertSCToTC(row.title.trim()) : undefined,
            name: convertSCToTC((row.name || "").trim()),
            amount: row.amount,
            notes: row.notes ? convertSCToTC(row.notes.trim()) : undefined,
          })
        )
      })

      if (records.length === 0) {
        toast.error("No record found")
        return
      }

      const data = await convex.query(api.events.queries.getRecordsForImport, {
        _id,
        records,
      })

      setEventRecords(data)
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while uploading the file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (invalidEventRecords.length !== 0) return

    setIsLoading(true)

    try {
      const records = eventRecords.map(({ remarks, invalid, ...record }) => {
        void remarks
        void invalid

        return record
      })

      await importEventRecords({ _id, records, isPaid })

      toast.success(`${eventRecords.length} record(s) imported`)

      if (device && printCategory.length !== 0) {
        const recordsToPrint = records
          .filter((record) => printCategory.includes(record.category))
          .map((record) => getLabelText(record.name, record.title || undefined))

        if (recordsToPrint.length !== 0) {
          await print(recordsToPrint)
          toast.success(`${recordsToPrint.length} sticker(s) printed`)
        }
      }

      props.onOpenChange?.(false)
    } catch (error) {
      handleMutationError(error)
    }

    setIsLoading(false)
  }

  const handleReset = () => {
    setEventRecords([])
    setSelectedTab(DEFAULT_TAB)
    setIsPaid(false)
    setPrintCategory([])
    setIsLoading(false)
  }

  return (
    <Dialog {...props}>
      <DialogContent
        className="sm:max-w-[calc(100%-2rem)] xl:max-w-5xl"
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          handleReset()
        }}
      >
        <DialogHeader>
          <DialogTitle>Import Event Record(s)</DialogTitle>

          <DialogDescription>
            Import the event record(s) from Excel file.
          </DialogDescription>
        </DialogHeader>

        {eventRecords.length === 0 ? (
          <ExcelDropzone handleUpload={handleUpload} isLoading={isLoading} />
        ) : (
          <>
            {invalidEventRecords.length !== 0 ? (
              <>
                <Alert
                  variant="destructive"
                  className="border-destructive bg-destructive/10"
                >
                  <CircleAlert />
                  <AlertTitle>Invalid record(s) found</AlertTitle>
                  <AlertDescription>
                    Please resolve all the issues before importing.
                  </AlertDescription>
                </Alert>

                <EventRecordTable records={invalidEventRecords} />
              </>
            ) : (
              <>
                <div className="flex min-w-0 flex-col gap-2">
                  <Label>Data Preview</Label>

                  <CategoryTab
                    categories={Object.keys(groupedEventRecords)}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  />
                </div>

                <EventRecordTable
                  records={
                    selectedTab === DEFAULT_TAB
                      ? eventRecords
                      : selectedTab === WITH_REMARKS
                        ? eventRecordsWithRemarks
                        : groupedEventRecords[selectedTab]
                  }
                />

                <div className="flex flex-col gap-2">
                  <Label>Payment Status</Label>

                  <Label
                    htmlFor="isPaid"
                    className="bg-background dark:bg-input/30 dark:hover:bg-input/50 cursor-pointer rounded-md border border-dashed px-3 py-2 shadow-xs"
                  >
                    <Checkbox
                      id="isPaid"
                      checked={isPaid}
                      onCheckedChange={(value) => setIsPaid(value as boolean)}
                    />

                    <Label className="pointer-events-none h-4.5 font-normal">
                      All donations are paid
                    </Label>
                  </Label>
                </div>

                {device && (
                  <div className="flex flex-col gap-2">
                    <Label>Print Sticker</Label>

                    <div className="flex flex-wrap gap-2">
                      {Object.keys(groupedEventRecords).map((category) => (
                        <Label
                          key={category}
                          htmlFor={`checkbox-${category}`}
                          className="bg-background dark:bg-input/30 dark:hover:bg-input/50 cursor-pointer rounded-md border border-dashed px-3 py-2 shadow-xs"
                        >
                          <Checkbox
                            id={`checkbox-${category}`}
                            checked={printCategory.includes(category)}
                            onCheckedChange={(value) =>
                              setPrintCategory(
                                value
                                  ? [...printCategory, category]
                                  : printCategory.filter((c) => c !== category)
                              )
                            }
                          />

                          <Label className="pointer-events-none h-4.5 font-normal">
                            {category}
                          </Label>
                        </Label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>

              <LoaderButton
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading || invalidEventRecords.length !== 0}
              >
                Import
              </LoaderButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ImportEventRecord

const CategoryTab = ({
  categories,
  selectedTab,
  setSelectedTab,
}: {
  categories: string[]
  selectedTab: string
  setSelectedTab: (tab: string) => void
}) => {
  const tabs = useMemo(
    () => [DEFAULT_TAB, ...categories, WITH_REMARKS],
    [categories]
  )

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const scrollToTab = (tab: string) => {
    const element = tabRefs.current[tab]
    if (!element) return

    element.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }

  const handleSelectTab = (value: string) => {
    setSelectedTab(value)
    scrollToTab(value)
  }

  return (
    <UnderlineTabs value={selectedTab} onValueChange={handleSelectTab}>
      <UnderlineTabsList>
        {tabs.map((category) => (
          <UnderlineTabsTrigger
            key={category}
            ref={(element) => {
              tabRefs.current[category] = element
            }}
            value={category}
          >
            {category}
          </UnderlineTabsTrigger>
        ))}
      </UnderlineTabsList>
    </UnderlineTabs>
  )
}

const EventRecordTable = ({ records }: { records: EventRecord[] }) => {
  const columns = useMemo(
    (): ColumnDef<EventRecord>[] => [
      {
        accessorKey: "index",
        header: "No.",
        cell: ({ row, table }) => getRowNumber(row, table),
        size: 64,
        meta: {
          headerClassName: cn("text-center"),
          cellClassName: cn("text-center"),
        },
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue() || "-",
        minSize: 80,
        meta: {
          flex: 0.25,
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        minSize: 128,
        meta: {
          flex: 0.5,
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        minSize: 128,
        meta: {
          flex: 0.25,
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => info.getValue() || "-",
        minSize: 80,
        meta: {
          headerClassName: cn("text-right"),
          cellClassName: cn("text-right"),
          flex: 0.25,
        },
      },
      {
        accessorKey: "notes",
        header: "Notes",
        cell: (info) => info.getValue() || "-",
        minSize: 128,
        meta: {
          flex: 0.5,
        },
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: (info) => info.getValue() || "-",
        minSize: 240,
        meta: {
          flex: 1.25,
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { totalDonors, totalAmount } = useMemo(
    () => ({
      totalDonors: new Set(records.map((row) => row.name)).size,
      totalAmount: records.reduce((sum, row) => sum + row.amount, 0),
    }),
    [records]
  )

  return (
    <>
      <VirtualizedDataTable table={table} hasFooter />

      <div className="bg-card -mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-b-md border border-t-0 p-2.5 text-sm font-medium">
        <IconWithText
          icon={LayoutList}
          text={formatNumber(records.length)}
          title="Total Records"
          side="top"
        />

        <IconWithText
          icon={Users}
          text={formatNumber(totalDonors)}
          title="Total Donors"
          side="top"
        />

        <IconWithText
          icon={CircleDollarSign}
          text={formatCurrency(totalAmount)}
          title="Total Amount"
          side="top"
        />
      </div>
    </>
  )
}
