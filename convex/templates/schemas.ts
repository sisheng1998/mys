import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

const templateFields = {
  name: v.string(),
  dates: v.array(v.string()),
  categories: v.array(v.string()),
}

export const templateSchema = z.object({
  ...convexToZodFields(templateFields),
  name: z.string().trim().min(1, "Required"),
})

export const templateTables = {
  templates: defineTable(templateFields).index("by_name", ["name"]),
}
