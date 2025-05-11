import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { authQuery } from "@cvx/utils/function"

export const list = authQuery({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query("templates")
      .withIndex("by_name")
      .order("asc")
      .collect()

    return templates.map((template) => ({
      ...template,
      totalDonors: 0,
      totalAmount: 0,
      totalRecords: 0,
    }))
  },
})

export const get = authQuery({
  args: {
    _id: zid("templates"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const template = await ctx.db.get(_id)
    if (!template) throw new ConvexError("Template not found")

    const categories = (
      await Promise.all(
        template.categories.map((category) => ctx.db.get(category))
      )
    ).filter((category) => !!category)

    return {
      ...template,
      categories,
    }
  },
})

export const getName = authQuery({
  args: {
    _id: zid("templates"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const template = await ctx.db.get(_id)
    if (!template) throw new ConvexError("Template not found")

    return template.name
  },
})

export const getStats = authQuery({
  args: {
    _id: zid("templates"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const template = await ctx.db.get(_id)
    if (!template) throw new ConvexError("Template not found")

    const records = await ctx.db
      .query("templateRecords")
      .withIndex("by_template", (q) => q.eq("templateId", _id))
      .collect()

    const totalDonors = new Set(records.map((record) => record.name)).size
    const totalAmount = records.reduce((acc, record) => acc + record.amount, 0)
    const totalRecords = records.length

    const categories = (
      await Promise.all(
        template.categories.map((category) => ctx.db.get(category))
      )
    ).filter((category) => !!category)

    const categoryStats = categories.map((category) => {
      const categoryRecords = records.filter(
        (record) => record.category === category._id
      )

      const amount = categoryRecords.reduce(
        (acc, record) => acc + record.amount,
        0
      )

      const percentage =
        amount !== 0
          ? Math.min(100, Math.max(0, (amount / totalAmount) * 100))
          : 0

      return {
        name: category.name,
        amount,
        percentage,
      }
    })

    return {
      totalDonors,
      totalAmount,
      totalRecords,
      categoryStats,
    }
  },
})

export const getRecords = authQuery({
  args: {
    _id: zid("templates"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const template = await ctx.db.get(_id)
    if (!template) throw new ConvexError("Template not found")

    const records = await ctx.db
      .query("templateRecords")
      .withIndex("by_template", (q) => q.eq("templateId", _id))
      .collect()

    return records
  },
})
