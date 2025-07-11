import { v } from "convex/values"

import { internalMutation } from "@cvx/_generated/server"

export const moveRecordsToEvent = internalMutation({
  args: {
    targetId: v.id("events"),
    sourceIds: v.array(v.id("events")),
  },
  handler: async (ctx, args) => {
    const { targetId, sourceIds } = args

    const targetEvent = await ctx.db.get(targetId)
    if (!targetEvent) throw new Error("Target event not found")

    for (const sourceId of sourceIds) {
      const sourceEvent = await ctx.db.get(sourceId)
      if (!sourceEvent) throw new Error("Source event not found")

      const records = await ctx.db
        .query("eventRecords")
        .withIndex("by_event", (q) => q.eq("eventId", sourceId))
        .collect()

      for (const record of records) {
        await ctx.db.patch(record._id, { eventId: targetId })
      }
    }

    console.log("Done")
  },
})
