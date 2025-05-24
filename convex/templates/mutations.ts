import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"
import { z } from "zod"

import { createNameListRecord } from "@cvx/nameLists/mutations"
import { templateRecordSchema, templateSchema } from "@cvx/templates/schemas"
import { authMutation } from "@cvx/utils/function"

export const upsertTemplateSchema = templateSchema.extend({
  _id: zid("templates").optional(),
})

export const upsertTemplate = authMutation({
  args: upsertTemplateSchema.shape,
  handler: async (ctx, args) => {
    const { _id, ...fields } = args

    if (_id) {
      const existingTemplate = await ctx.db.get(_id)
      if (!existingTemplate) throw new ConvexError("Template not found")

      return ctx.db.patch(_id, fields)
    }

    const newTemplate = templateSchema.parse(fields)
    return ctx.db.insert("templates", newTemplate)
  },
})

export const deleteTemplate = authMutation({
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

    for (const record of records) {
      await ctx.db.delete(record._id)
    }

    return ctx.db.delete(_id)
  },
})

export const addTemplateRecordByDonorSchema = templateRecordSchema
  .pick({
    templateId: true,
    title: true,
    name: true,
  })
  .extend({
    records: z.array(
      z.object(
        templateRecordSchema.pick({
          category: true,
          amount: true,
        }).shape
      )
    ),
  })

export const addTemplateRecordByDonor = authMutation({
  args: addTemplateRecordByDonorSchema.shape,
  handler: async (ctx, args) => {
    const { templateId, title, name, records } = args

    const template = await ctx.db.get(templateId)
    if (!template) throw new ConvexError("Template not found")

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
        .query("templateRecords")
        .withIndex("by_template_name_category", (q) =>
          q
            .eq("templateId", templateId)
            .eq("name", name)
            .eq("category", category)
        )
        .unique()

      if (duplicatedRecord)
        throw new ConvexError(
          `Another record with this donor and category "${category}" already exists`
        )

      const newTemplateRecord = templateRecordSchema.parse({
        templateId,
        title,
        name,
        category,
        amount,
      })

      await ctx.db.insert("templateRecords", newTemplateRecord)
    }

    await createNameListRecord(ctx, { name, title })
  },
})

export const addTemplateRecordByCategorySchema = templateRecordSchema
  .pick({
    templateId: true,
    category: true,
    amount: true,
  })
  .extend({
    records: z.array(
      z.object(
        templateRecordSchema.pick({
          title: true,
          name: true,
          amount: true,
        }).shape
      )
    ),
  })

export const addTemplateRecordByCategory = authMutation({
  args: addTemplateRecordByCategorySchema.shape,
  handler: async (ctx, args) => {
    const { templateId, category, amount, records } = args

    const template = await ctx.db.get(templateId)
    if (!template) throw new ConvexError("Template not found")

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
        .query("templateRecords")
        .withIndex("by_template_name_category", (q) =>
          q
            .eq("templateId", templateId)
            .eq("name", name)
            .eq("category", category)
        )
        .unique()

      if (duplicatedRecord)
        throw new ConvexError(
          `Another record with this category and donor "${name}" already exists`
        )

      await createNameListRecord(ctx, { name, title })

      const newTemplateRecord = templateRecordSchema.parse({
        templateId,
        title,
        name,
        category,
        amount,
      })

      await ctx.db.insert("templateRecords", newTemplateRecord)
    }
  },
})

export const editTemplateRecordSchema = templateRecordSchema.extend({
  _id: zid("templateRecords"),
})

export const editTemplateRecord = authMutation({
  args: editTemplateRecordSchema.shape,
  handler: async (ctx, args) => {
    const { _id, title, name, category, ...fields } = args

    const existingTemplateRecord = await ctx.db.get(_id)
    if (!existingTemplateRecord) throw new ConvexError("Record not found")

    const potentialDuplicates = await ctx.db
      .query("templateRecords")
      .withIndex("by_template_name_category", (q) =>
        q
          .eq("templateId", existingTemplateRecord.templateId)
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

export const updateTemplateRecordAmountSchema = templateRecordSchema
  .pick({
    amount: true,
  })
  .extend({
    ids: z.array(zid("templateRecords")),
  })

export const updateTemplateRecordAmount = authMutation({
  args: updateTemplateRecordAmountSchema.shape,
  handler: async (ctx, args) => {
    const { ids, amount } = args

    for (const _id of ids) {
      const existingTemplateRecord = await ctx.db.get(_id)
      if (!existingTemplateRecord) throw new ConvexError("Record not found")

      await ctx.db.patch(_id, { amount })
    }
  },
})

export const deleteTemplateRecords = authMutation({
  args: {
    ids: z.array(zid("templateRecords")),
  },
  handler: async (ctx, args) => {
    const { ids } = args

    for (const _id of ids) {
      const existingTemplateRecord = await ctx.db.get(_id)
      if (!existingTemplateRecord) throw new ConvexError("Record not found")

      await ctx.db.delete(_id)
    }
  },
})
