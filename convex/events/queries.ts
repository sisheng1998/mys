import { filter } from "convex-helpers/server/filter"
import { convexToZod, zid } from "convex-helpers/server/zod"
import { paginationOptsValidator } from "convex/server"
import { ConvexError } from "convex/values"
import { z } from "zod"

import { eventRecordSchema } from "@cvx/events/schemas"
import { authQuery } from "@cvx/utils/function"

export const list = authQuery({
  args: {
    past: z.boolean().default(false),
    paginationOpts: convexToZod(paginationOptsValidator),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0]

    const results = await ctx.db
      .query("events")
      .withIndex("by_date", (q) =>
        args.past ? q.lt("date", today) : q.gte("date", today)
      )
      .order(args.past ? "desc" : "asc")
      .paginate(args.paginationOpts)

    const pageWithStats = await Promise.all(
      results.page.map(async (event) => {
        const records = await ctx.db
          .query("eventRecords")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect()

        const totalAmount = records.reduce((sum, r) => sum + r.amount, 0)
        const totalDonors = new Set(records.map((r) => r.name)).size
        const totalRecords = records.length

        return {
          ...event,
          totalAmount,
          totalDonors,
          totalRecords,
        }
      })
    )

    return {
      ...results,
      page: pageWithStats,
    }
  },
})

export const get = authQuery({
  args: {
    _id: zid("events"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const event = await ctx.db.get(_id)
    if (!event) throw new ConvexError("Event not found")

    const categories = (
      await Promise.all(
        event.categories.map((category) => ctx.db.get(category))
      )
    )
      .filter((category) => !!category)
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      ...event,
      categories,
    }
  },
})

export const getName = authQuery({
  args: {
    _id: zid("events"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const event = await ctx.db.get(_id)
    if (!event) throw new ConvexError("Event not found")

    return event.name
  },
})

export const getStats = authQuery({
  args: {
    _id: zid("events"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const event = await ctx.db.get(_id)
    if (!event) throw new ConvexError("Event not found")

    const records = await ctx.db
      .query("eventRecords")
      .withIndex("by_event", (q) => q.eq("eventId", _id))
      .collect()

    const totalAmount = records.reduce((acc, record) => acc + record.amount, 0)
    const totalDonors = new Set(records.map((record) => record.name)).size
    const totalRecords = records.length
    const totalPaid = records.filter((record) => record.isPaid).length
    const totalPaidPercentage =
      totalPaid !== 0
        ? Math.min(100, Math.max(0, (totalPaid / totalRecords) * 100))
        : 0

    const categories = (
      await Promise.all(
        event.categories.map((category) => ctx.db.get(category))
      )
    )
      .filter((category) => !!category)
      .sort((a, b) => a.name.localeCompare(b.name))

    const categoryStats = categories.map((category) => {
      const categoryRecords = records.filter(
        (record) => record.category === category.name
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
      totalAmount,
      totalDonors,
      totalRecords,
      totalPaid,
      totalPaidPercentage,
      categoryStats,
    }
  },
})

export const getRecords = authQuery({
  args: {
    _id: zid("events"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const event = await ctx.db.get(_id)
    if (!event) throw new ConvexError("Event not found")

    const records = await ctx.db
      .query("eventRecords")
      .withIndex("by_event", (q) => q.eq("eventId", _id))
      .order("asc")
      .collect()

    return records
  },
})

export const exportEventSchema = eventRecordSchema
  .pick({
    category: true,
  })
  .extend({
    _id: zid("events"),
    withAmount: z.boolean(),
  })

export const getRecordsForExport = authQuery({
  args: exportEventSchema.shape,
  handler: async (ctx, args) => {
    const { _id, category, withAmount } = args

    const event = await ctx.db.get(_id)
    if (!event) throw new ConvexError("Event not found")

    const records = await filter(
      ctx.db
        .query("eventRecords")
        .withIndex("by_event", (q) => q.eq("eventId", _id))
        .order("asc"),
      (q) => q.category === category
    ).collect()

    return {
      name: event.name,
      date: event.date,
      category,
      records: records.map((record) => ({
        name: record.name,
        title: record.title,
        amount: withAmount ? record.amount : undefined,
      })),
    }
  },
})
