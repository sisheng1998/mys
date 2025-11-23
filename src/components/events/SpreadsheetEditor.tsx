"use client"

import React, { forwardRef, useMemo } from "react"
import { HotColumn, HotTable, HotTableRef } from "@handsontable/react-wrapper"
import { registerAllModules } from "handsontable/registry"
import { useTheme } from "next-themes"

import { Category } from "@/types/category"
import { getExcelSheetName } from "@/lib/string"

import { TITLES } from "@cvx/nameLists/schemas"

import "handsontable/styles/handsontable.min.css"
import "handsontable/styles/ht-theme-main.min.css"

registerAllModules()

const NO_OF_ROWS = 50

export type SpreadsheetRecord = (string | null)[]

const SpreadsheetEditor = forwardRef<
  HotTableRef,
  { spreadsheetRecords: SpreadsheetRecord[]; categories: Category[] }
>(({ spreadsheetRecords, categories }, ref) => {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const source = useMemo(
    () =>
      Array.from(
        new Set(categories.map((category) => getExcelSheetName(category.name)))
      ),
    [categories]
  )

  const data = useMemo(() => {
    const rows = [...spreadsheetRecords]

    while (rows.length < NO_OF_ROWS) {
      rows.push([null, null, null, null, null])
    }

    if (rows.length > NO_OF_ROWS) {
      return rows.slice(0, NO_OF_ROWS)
    }

    return rows
  }, [spreadsheetRecords])

  return (
    <HotTable
      ref={ref}
      data={data}
      themeName={`ht-theme-main${isDarkMode ? "-dark" : ""}`}
      licenseKey="non-commercial-and-evaluation"
      stretchH="all"
      height="20rem"
      rowHeaders={true}
      colHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
    >
      <HotColumn
        title="Category"
        type="select"
        selectOptions={source}
        width={125}
      />
      <HotColumn
        title="Title"
        type="select"
        selectOptions={["", ...TITLES]}
        width={100}
      />
      <HotColumn title="Name" width={150} />
      <HotColumn title="Amount" width={125} />
      <HotColumn title="Notes" width={250} />
    </HotTable>
  )
})

SpreadsheetEditor.displayName = "SpreadsheetEditor"

export default SpreadsheetEditor
