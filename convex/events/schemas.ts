import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

import { Id } from "@cvx/_generated/dataModel"
import { nameListFields } from "@cvx/nameLists/schemas"

const eventFields = {
  name: v.string(),
  date: v.string(),
  categories: v.array(v.id("categories")),
}

const eventZodFields = convexToZodFields(eventFields)

export const eventSchema = z.object({
  ...eventZodFields,
  name: z.string().trim().min(1, "Required"),
  date: z.string().min(1, "Required"),
  categories: z.array(z.custom<Id<"categories">>()).nonempty("Required"),
})

const eventRecordFields = {
  ...nameListFields,
  eventId: v.id("events"),
  category: v.string(),
  amount: v.number(),
  isPaid: v.boolean(),
}

const eventRecordZodFields = convexToZodFields(eventRecordFields)

export const eventRecordSchema = z.object({
  ...eventRecordZodFields,
  name: z.string().trim().min(1, "Required"),
  amount: z
    .number({
      invalid_type_error: "Required",
    })
    .min(1, "Required"),
  category: z.string().min(1, "Required"),
  isPaid: z.boolean().default(false),
})

export const eventTables = {
  events: defineTable(eventFields).index("by_date", ["date"]),
  eventRecords: defineTable(eventRecordFields)
    .index("by_event_name_category", ["eventId", "name", "category"])
    .index("by_event", ["eventId"]),
}
