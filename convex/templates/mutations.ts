import { filter } from "convex-helpers/server/filter"
import { zid } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { nameListSchema } from "@cvx/nameLists/schemas"
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

    return ctx.db.delete(_id)
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

    const duplicatedRecord = await ctx.db
      .query("templateRecords")
      .withIndex("by_template", (q) =>
        q.eq("templateId", existingTemplateRecord.templateId)
      )
      .filter((q) =>
        q.and(
          q.neq(q.field("_id"), _id),
          q.eq(q.field("name"), name),
          q.eq(q.field("category"), category)
        )
      )
      .first()

    if (duplicatedRecord)
      throw new ConvexError(
        "Another record with this donor and category already exists"
      )

    const existingNameListRecord = await filter(
      ctx.db
        .query("nameLists")
        .withSearchIndex("search_name", (q) => q.search("name", name)),
      (q) => q.name.toLowerCase() === name.toLowerCase()
    ).unique()

    if (!existingNameListRecord) {
      const newNameListRecord = nameListSchema.parse({
        title,
        name,
      })

      await ctx.db.insert("nameLists", newNameListRecord)
    }

    return ctx.db.patch(_id, { title, name, category, ...fields })
  },
})

export const deleteTemplateRecord = authMutation({
  args: {
    _id: zid("templateRecords"),
  },
  handler: async (ctx, args) => {
    const { _id } = args

    const templateRecord = await ctx.db.get(_id)
    if (!templateRecord) throw new ConvexError("Record not found")

    return ctx.db.delete(_id)
  },
})
