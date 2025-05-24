import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { eventSchema } from "@cvx/events/schemas"
import { authMutation } from "@cvx/utils/function"

export const upsertEventSchema = eventSchema.extend({
  _id: zid("events").optional(),
  templateId: zid("templates").optional(),
})

export const upsertEvent = authMutation({
  args: upsertEventSchema.shape,
  handler: async (ctx, args) => {
    const { _id, templateId, ...fields } = args

    if (_id) {
      const existingEvent = await ctx.db.get(_id)
      if (!existingEvent) throw new ConvexError("Event not found")

      return ctx.db.patch(_id, fields)
    }

    if (templateId) {
      const existingTemplate = await ctx.db.get(templateId)
      if (!existingTemplate) throw new ConvexError("Template not found")

      // TODO: Handle copying from template
      const newEvent = eventSchema.parse(fields)
      return ctx.db.insert("events", newEvent)
    }

    const newEvent = eventSchema.parse(fields)
    return ctx.db.insert("events", newEvent)
  },
})

export const deleteEvent = authMutation({
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

    for (const record of records) {
      await ctx.db.delete(record._id)
    }

    return ctx.db.delete(_id)
  },
})
