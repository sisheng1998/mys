import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

import { TITLES } from "@cvx/nameLists/schemas"

const categoryFields = {
  name: v.string(),
  amount: v.optional(v.number()),
  titles: v.array(v.union(...TITLES.map((title) => v.literal(title)))),
}

export const categorySchema = z.object({
  ...convexToZodFields(categoryFields),
  name: z.string().trim().min(1, "Required"),
  amount: z
    .union([z.number().min(1), z.nan().transform(() => undefined)])
    .optional()
    .transform((val) =>
      typeof val === "number" && !isNaN(val) ? val : undefined
    ),
})

export const categoryTables = {
  categories: defineTable(categoryFields).index("by_name", ["name"]),
}
