import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

import { Id } from "@cvx/_generated/dataModel"
import { nameListFields } from "@cvx/nameLists/schemas"

const templateFields = {
  name: v.string(),
  dates: v.array(v.string()),
  categories: v.array(v.id("categories")),
}

const templateZodFields = convexToZodFields(templateFields)

export const templateSchema = z.object({
  ...templateZodFields,
  name: z.string().trim().min(1, "Required"),
  dates: z.array(z.string()).nonempty("Required"),
  categories: z.array(z.custom<Id<"categories">>()).nonempty("Required"),
})

const templateRecordFields = {
  ...nameListFields,
  templateId: v.id("templates"),
  category: v.string(),
  amount: v.number(),
}

const templateRecordZodFields = convexToZodFields(templateRecordFields)

export const templateRecordSchema = z.object({
  ...templateRecordZodFields,
  name: z.string().trim().min(1, "Required"),
  amount: z
    .number({
      invalid_type_error: "Required",
    })
    .min(1, "Required"),
  category: z.string().min(1, "Required"),
})

export const templateTables = {
  templates: defineTable(templateFields).index("by_name", ["name"]),
  templateRecords: defineTable(templateRecordFields)
    .index("by_template", ["templateId"])
    .index("by_name", ["name"])
    .index("by_category", ["category"]),
}
