import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { templateSchema } from "@cvx/templates/schemas"
import { authMutation } from "@cvx/utils/function"

export const upsertTemplateSchema = templateSchema.extend({
  _id: zid("templates").optional(),
})

export const upsertTemplate = authMutation({
  args: upsertTemplateSchema.shape,
  handler: async (ctx, args) => {
    const { _id, ...fields } = args

    if (_id) {
      const existingTemplate = await ctx.db.get(_id)
      if (!existingTemplate) throw new ConvexError("Template not found")

      return ctx.db.patch(_id, fields)
    }

    const newTemplate = templateSchema.parse(fields)
    return ctx.db.insert("templates", newTemplate)
  },
})

export const deleteTemplate = authMutation({
  args: {
    _id: zid("templates"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const template = await ctx.db.get(_id)
    if (!template) throw new ConvexError("Template not found")

    return ctx.db.delete(_id)
  },
})
