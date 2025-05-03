import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

const userFields = {
  name: v.string(),
  email: v.string(),
  image: v.optional(v.string()),
  isAuthorized: v.boolean(),
}

const zodFields = convexToZodFields(userFields)

export const userSchema = z.object({
  ...zodFields,
  name: z.string().trim().default(""),
  email: z
    .string()
    .email()
    .transform((e) => e.toLowerCase()),
  isAuthorized: zodFields.isAuthorized.default(false),
})

export const userTables = {
  users: defineTable(userFields)
    .index("by_name", ["name"])
    .index("by_email", ["email"]),
}
