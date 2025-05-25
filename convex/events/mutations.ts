import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"
import { z } from "zod"

import { eventRecordSchema, eventSchema } from "@cvx/events/schemas"
import { createNameListRecord } from "@cvx/nameLists/mutations"
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

export const addEventRecordByDonorSchema = eventRecordSchema
  .pick({
    eventId: true,
    title: true,
    name: true,
  })
  .extend({
    records: z.array(
      z.object(
        eventRecordSchema.pick({
          category: true,
          amount: true,
        }).shape
      )
    ),
  })

export const addEventRecordByDonor = authMutation({
  args: addEventRecordByDonorSchema.shape,
  handler: async (ctx, args) => {
    const { eventId, title, name, records } = args

    const event = await ctx.db.get(eventId)
    if (!event) throw new ConvexError("Event not found")

    const categorySet = new Set()

    for (const record of records) {
      if (categorySet.has(record.category)) {
        throw new ConvexError(`Duplicate category "${record.category}" found`)
      }

      categorySet.add(record.category)
    }

    for (const record of records) {
      const { category, amount } = record

      const duplicatedRecord = await ctx.db
        .query("eventRecords")
        .withIndex("by_event_name_category", (q) =>
          q.eq("eventId", eventId).eq("name", name).eq("category", category)
        )
        .unique()

      if (duplicatedRecord)
        throw new ConvexError(
          `Another record with this donor and category "${category}" already exists`
        )

      const newEventRecord = eventRecordSchema.parse({
        eventId,
        title,
        name,
        category,
        amount,
      })

      await ctx.db.insert("eventRecords", newEventRecord)
    }

    await createNameListRecord(ctx, { name, title })
  },
})

export const addEventRecordByCategorySchema = eventRecordSchema
  .pick({
    eventId: true,
    category: true,
    amount: true,
  })
  .extend({
    records: z.array(
      z.object(
        eventRecordSchema.pick({
          title: true,
          name: true,
          amount: true,
        }).shape
      )
    ),
  })

export const addEventRecordByCategory = authMutation({
  args: addEventRecordByCategorySchema.shape,
  handler: async (ctx, args) => {
    const { eventId, category, amount, records } = args

    const event = await ctx.db.get(eventId)
    if (!event) throw new ConvexError("Event not found")

    const nameSet = new Set()

    for (const record of records) {
      if (nameSet.has(record.name)) {
        throw new ConvexError(`Duplicate name "${record.name}" found`)
      }

      nameSet.add(record.name)
    }

    for (const record of records) {
      const { title, name } = record

      const duplicatedRecord = await ctx.db
        .query("eventRecords")
        .withIndex("by_event_name_category", (q) =>
          q.eq("eventId", eventId).eq("name", name).eq("category", category)
        )
        .unique()

      if (duplicatedRecord)
        throw new ConvexError(
          `Another record with this category and donor "${name}" already exists`
        )

      await createNameListRecord(ctx, { name, title })

      const newEventRecord = eventRecordSchema.parse({
        eventId,
        title,
        name,
        category,
        amount,
      })

      await ctx.db.insert("eventRecords", newEventRecord)
    }
  },
})

export const editEventRecordSchema = eventRecordSchema.extend({
  _id: zid("eventRecords"),
  isPaid: z.boolean(),
})

export const editEventRecord = authMutation({
  args: editEventRecordSchema.shape,
  handler: async (ctx, args) => {
    const { _id, title, name, category, ...fields } = args

    const existingEventRecord = await ctx.db.get(_id)
    if (!existingEventRecord) throw new ConvexError("Record not found")

    const potentialDuplicates = await ctx.db
      .query("eventRecords")
      .withIndex("by_event_name_category", (q) =>
        q
          .eq("eventId", existingEventRecord.eventId)
          .eq("name", name)
          .eq("category", category)
      )
      .collect()

    const duplicatedRecord = potentialDuplicates.find(
      (record) => record._id !== _id
    )

    if (duplicatedRecord) {
      throw new ConvexError(
        "Another record with this donor and category already exists"
      )
    }

    await createNameListRecord(ctx, { name, title })

    return ctx.db.patch(_id, { title, name, category, ...fields })
  },
})

export const updateEventRecordAmountSchema = eventRecordSchema
  .pick({
    amount: true,
  })
  .extend({
    ids: z.array(zid("eventRecords")),
  })

export const updateEventRecordAmount = authMutation({
  args: updateEventRecordAmountSchema.shape,
  handler: async (ctx, args) => {
    const { ids, amount } = args

    for (const _id of ids) {
      const existingEventRecord = await ctx.db.get(_id)
      if (!existingEventRecord) throw new ConvexError("Record not found")

      await ctx.db.patch(_id, { amount })
    }
  },
})

export const deleteEventRecords = authMutation({
  args: {
    ids: z.array(zid("eventRecords")),
  },
  handler: async (ctx, args) => {
    const { ids } = args

    for (const _id of ids) {
      const existingEventRecord = await ctx.db.get(_id)
      if (!existingEventRecord) throw new ConvexError("Record not found")

      await ctx.db.delete(_id)
    }
  },
})
