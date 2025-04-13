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

export const userSchema = z.object({
  ...convexToZodFields(userFields),
  name: z.string().default(""),
  email: z.string().email(),
  isAuthorized: z.boolean().default(false),
})

export const userTables = {
  users: defineTable(userFields).index("email", ["email"]),
}
