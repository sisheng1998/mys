import { convexToZod } from "convex-helpers/server/zod"
import { paginationOptsValidator } from "convex/server"
import { z } from "zod"

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
