"use client"

import React, { useEffect, useMemo, useRef } from "react"
import { useQueryState } from "nuqs"

import { Category } from "@/types/category"
import {
  UnderlineTabs,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@/components/ui/underline-tab"
import { CATEGORY_KEY } from "@/components/events/TableFilters"
import { useDataTable } from "@/contexts/data-table"

export const DEFAULT_TAB = "All"

export const useTabParams = () =>
  useQueryState("tab", {
    defaultValue: DEFAULT_TAB,
  })

const CategoryTab = ({ categories }: { categories: Category[] }) => {
  const { table } = useDataTable()

  const [selectedTab, setSelectedTab] = useTabParams()

  const tabs = useMemo(
    () => [DEFAULT_TAB, ...categories.map((category) => category.name)],
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
    if (!table) return

    table.setColumnFilters((prev) => {
      const filters = prev.filter((filter) => filter.id !== CATEGORY_KEY)

      return value === DEFAULT_TAB
        ? filters
        : [...filters, { id: CATEGORY_KEY, value: [value] }]
    })

    setSelectedTab(value)
    scrollToTab(value)
  }

  useEffect(() => {
    scrollToTab(selectedTab)
  }, [selectedTab])

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

export default CategoryTab
