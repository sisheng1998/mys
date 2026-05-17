import { convexToZodFields } from "convex-helpers/server/zod"
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { z } from "zod"

const excludedWordFields = {
  word: v.string(),
  isActive: v.boolean(),
}

const zodFields = convexToZodFields(excludedWordFields)

export const excludedWordSchema = z.object({
  ...zodFields,
  word: z.string().trim().min(1, "Required"),
  isActive: zodFields.isActive.default(true),
})

export const excludedWordTables = {
  excludedWords: defineTable(excludedWordFields),
}
