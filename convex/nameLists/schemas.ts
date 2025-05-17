import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

export const TITLES = [
  "义子",
  "弟子",
  "信女",
  "合家",
  "花男",
  "花女",
  "已故",
] as const

export const nameListFields = {
  title: v.optional(v.union(...TITLES.map((title) => v.literal(title)))),
  name: v.string(),
}

const zodFields = convexToZodFields(nameListFields)

export const nameListSchema = z.object({
  ...zodFields,
  name: z.string().trim().min(1, "Required"),
})

export const nameListTables = {
  nameLists: defineTable(nameListFields)
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
    }),
}
