import { ColumnFilter, SortingState } from "@tanstack/react-table"
import {
  createParser,
  parseAsIndex,
  parseAsInteger,
  useQueryState,
  useQueryStates,
} from "nuqs"

const paginationParsers = {
  pageIndex: parseAsIndex.withDefault(0),
  pageSize: parseAsInteger.withDefault(100),
}

const paginationUrlKeys = {
  pageIndex: "page",
  pageSize: "page-size",
}

export const usePaginationParams = () =>
  useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys,
  })

export const useSearchParams = () =>
  useQueryState("search", {
    defaultValue: "",
  })

const parseAsSorting = createParser<SortingState>({
  parse: (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null

    const keys = Array.isArray(value) ? value : [value]

    return keys.map((key) => ({
      id: key.startsWith("-") ? key.slice(1) : key,
      desc: key.startsWith("-"),
    }))
  },
  serialize: (value) =>
    value.map((v) => (v.desc ? `-${v.id}` : v.id)).join("&sort="),
  eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
}).withDefault([])

export const useSortingParams = () => useQueryState("sort", parseAsSorting)

const parseAsFilters = createParser<ColumnFilter[]>({
  parse: (value) => {
    if (!value) return []

    const pairs = Array.isArray(value) ? value : [value]

    return pairs
      .flatMap((pair) =>
        pair.split(";").map((segment: string) => {
          const [id, ...rest] = segment.split(":")
          const raw = rest.join(":")

          if (!id || raw === undefined) return null

          let value: unknown = raw

          value = raw.split(",").map((item) => {
            if (item === "") return undefined
            if (item === "true") return true
            if (item === "false") return false
            if (!isNaN(Number(item))) return Number(item)
            return item
          })

          return { id, value }
        })
      )
      .filter(Boolean)
  },
  serialize: (filters) =>
    filters.map(({ id, value }) => `${id}:${String(value)}`).join(";"),
  eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
}).withDefault([])

export const useFilterParams = () => useQueryState("filters", parseAsFilters)
