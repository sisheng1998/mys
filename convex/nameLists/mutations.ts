import { filter } from "convex-helpers/server/filter"
import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { nameListSchema } from "@cvx/nameLists/schemas"
import { authMutation } from "@cvx/utils/function"

export const upsertNameListRecordSchema = nameListSchema
  .pick({
    title: true,
    name: true,
  })
  .extend({
    _id: zid("nameLists").optional(),
  })

export const upsertNameListRecord = authMutation({
  args: upsertNameListRecordSchema.shape,
  handler: async (ctx, args) => {
    const { _id, title, name } = args

    if (_id) {
      const existingNameListRecord = await ctx.db.get(_id)
      if (!existingNameListRecord) throw new ConvexError("Record not found")

      const existingWithSameName = await filter(
        ctx.db.query("nameLists"),
        (q) => q.name.toLowerCase() === name.toLowerCase() && q._id !== _id
      ).unique()

      if (existingWithSameName)
        throw new ConvexError("Another record with this name already exists")

      return ctx.db.patch(_id, { title, name })
    }

    const existingNameListRecord = await filter(
      ctx.db.query("nameLists"),
      (q) => q.name.toLowerCase() === name.toLowerCase()
    ).unique()

    if (existingNameListRecord) throw new ConvexError("Record already exists")

    const newNameListRecord = nameListSchema.parse({
      title,
      name,
    })

    return ctx.db.insert("nameLists", newNameListRecord)
  },
})

export const deleteNameListRecord = authMutation({
  args: {
    _id: zid("nameLists"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const nameListRecord = await ctx.db.get(_id)
    if (!nameListRecord) throw new ConvexError("Record not found")

    return ctx.db.delete(_id)
  },
})
