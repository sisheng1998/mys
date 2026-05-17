import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { excludedWordSchema } from "@cvx/excludedWords/schemas"
import { authMutation } from "@cvx/utils/function"

export const addExcludedWordSchema = excludedWordSchema.pick({
  word: true,
})

export const addExcludedWord = authMutation({
  args: addExcludedWordSchema.shape,
  handler: async (ctx, args) => {
    const { word } = args

    const existingExcludedWord = await ctx.db
      .query("excludedWords")
      .filter((q) => q.eq(q.field("word"), word))
      .unique()

    if (existingExcludedWord)
      throw new ConvexError("Excluded word already exists")

    const newExcludedWord = excludedWordSchema.parse({
      word,
      isActive: true,
    })

    return ctx.db.insert("excludedWords", newExcludedWord)
  },
})

const updateExcludedWordSchema = excludedWordSchema.partial().extend({
  _id: zid("excludedWords"),
})

export const updateExcludedWord = authMutation({
  args: updateExcludedWordSchema.shape,
  handler: async (ctx, args) => {
    const { _id, ...fields } = args

    const excludedWord = await ctx.db.get(_id)
    if (!excludedWord) throw new ConvexError("Excluded word not found")

    if (Object.keys(fields).length === 0)
      throw new ConvexError("No fields to update")

    return ctx.db.patch(_id, fields)
  },
})

export const deleteExcludedWord = authMutation({
  args: {
    _id: zid("excludedWords"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const excludedWord = await ctx.db.get(_id)
    if (!excludedWord) throw new ConvexError("Excluded word not found")

    return ctx.db.delete(_id)
  },
})
