import { filter } from "convex-helpers/server/filter"
import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { categorySchema } from "@cvx/categories/schemas"
import { authMutation } from "@cvx/utils/function"

export const upsertCategorySchema = categorySchema.extend({
  _id: zid("categories").optional(),
})

export const upsertCategory = authMutation({
  args: upsertCategorySchema.shape,
  handler: async (ctx, args) => {
    const { _id, name, amount, titles } = args

    if (_id) {
      const existingCategory = await ctx.db.get(_id)
      if (!existingCategory) throw new ConvexError("Category not found")

      const existingWithSameName = await filter(
        ctx.db.query("categories"),
        (q) => q.name.toLowerCase() === name.toLowerCase() && q._id !== _id
      ).unique()

      if (existingWithSameName)
        throw new ConvexError("Another category with this name already exists")

      return ctx.db.patch(_id, { name, amount, titles })
    }

    const existingCategory = await filter(
      ctx.db.query("categories"),
      (q) => q.name.toLowerCase() === name.toLowerCase()
    ).unique()

    if (existingCategory) throw new ConvexError("Category already exists")

    const newCategory = categorySchema.parse({
      name,
      amount,
      titles,
    })

    return ctx.db.insert("categories", newCategory)
  },
})

export const deleteCategory = authMutation({
  args: {
    _id: zid("categories"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const category = await ctx.db.get(_id)
    if (!category) throw new ConvexError("Category not found")

    return ctx.db.delete(_id)
  },
})
