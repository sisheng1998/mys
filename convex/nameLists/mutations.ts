import { filter } from "convex-helpers/server/filter"
import { ConvexError } from "convex/values"

import { nameListSchema } from "@cvx/nameLists/schemas"
import { authMutation } from "@cvx/utils/function"

export const createNameListRecordSchema = nameListSchema.pick({
  title: true,
  name: true,
})

export const createNameListRecord = authMutation({
  args: createNameListRecordSchema.shape,
  handler: async (ctx, args) => {
    const { title, name } = args

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
