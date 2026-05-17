"use client"

import React, { forwardRef, useMemo, useRef } from "react"
import { HotColumn, HotTable, HotTableRef } from "@handsontable/react-wrapper"
import { useConvex } from "convex/react"
import { registerAllModules } from "handsontable/registry"
import { useTheme } from "next-themes"

import { Category } from "@/types/category"
import { getNameWithTitle } from "@/lib/name"
import { getExcelSheetName } from "@/lib/string"

import { api } from "@cvx/_generated/api"
import { TITLES } from "@cvx/nameLists/schemas"

import "handsontable/styles/handsontable.min.css"
import "handsontable/styles/ht-theme-main.min.css"

registerAllModules()

const NO_OF_ROWS = 50
const SEARCH_DEBOUNCE_MS = 300

type SearchResult = {
  key: string
  value: string
  title?: string
  name: string
}

export type SpreadsheetRecord = (string | null)[]

const SpreadsheetEditor = forwardRef<
  HotTableRef,
  { spreadsheetRecords: SpreadsheetRecord[]; categories: Category[] }
>(({ spreadsheetRecords, categories }, ref) => {
  const convex = useConvex()

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

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const nameSource = async (
    query: string,
    callback: (
      options: {
        key: string
        value: string
      }[]
    ) => void
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        callback([])
        return
      }

      const data = await convex.query(api.nameLists.queries.search, {
        name: query,
      })

      const options: SearchResult[] = data.map((record) => {
        const nameWithTitle = getNameWithTitle(record.name, record.title)

        return {
          key: nameWithTitle,
          value: nameWithTitle,
          title: record.title,
          name: record.name,
        }
      })

      callback(options)
    }, SEARCH_DEBOUNCE_MS)
  }

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
      afterChange={(changes, source) => {
        const hot = ref && "current" in ref ? ref.current?.hotInstance : null

        if (
          !hot ||
          !changes ||
          source === "loadData" ||
          source === "updateData"
        )
          return

        changes.forEach(([row, prop, , newValue]) => {
          if (Number(prop) !== 2 || !newValue) return

          const currentTitle = hot.getDataAtCell(row, 1)
          if (currentTitle) return

          const value = newValue as SearchResult
          hot.setDataAtCell(row, 1, value.title, "updateData")
        })
      }}
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
      <HotColumn
        title="Name"
        type="autocomplete"
        source={nameSource}
        valueGetter={(value: SearchResult | string | null) => {
          if (!value) return null
          return typeof value === "string" ? value : value.name
        }}
        filter={false}
        width={150}
      />
      <HotColumn title="Amount" width={125} />
      <HotColumn title="Notes" width={250} />
    </HotTable>
  )
})

SpreadsheetEditor.displayName = "SpreadsheetEditor"

export default SpreadsheetEditor
