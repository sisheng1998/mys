import { SortingState } from "@tanstack/react-table"
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
  pageSize: "page_size",
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
