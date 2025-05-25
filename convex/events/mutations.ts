import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { eventRecordSchema, eventSchema } from "@cvx/events/schemas"
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

    const newEvent = eventSchema.parse(fields)
    const eventId = await ctx.db.insert("events", newEvent)

    if (templateId) {
      const existingTemplate = await ctx.db.get(templateId)
      if (!existingTemplate) throw new ConvexError("Template not found")

      const templateRecords = await ctx.db
        .query("templateRecords")
        .withIndex("by_template", (q) => q.eq("templateId", templateId))
        .order("asc")
        .collect()

      for (const record of templateRecords) {
        const newEventRecord = eventRecordSchema.parse({
          eventId,
          title: record.title,
          name: record.name,
          category: record.category,
          amount: record.amount,
        })

        await ctx.db.insert("eventRecords", newEventRecord)
      }
    }

    return eventId
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
