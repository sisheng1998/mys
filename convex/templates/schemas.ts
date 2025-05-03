import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

const templateFields = {
  name: v.string(),
  dates: v.array(v.string()),
  categories: v.array(v.string()),
}

const zodFields = convexToZodFields(templateFields)

export const templateSchema = z.object({
  ...zodFields,
  name: z.string().trim().min(1, "Required"),
})

export const templateTables = {
  templates: defineTable(templateFields).index("by_name", ["name"]),
}
