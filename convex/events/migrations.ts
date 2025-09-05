import { internal } from "@cvx/_generated/api"
import { migrations } from "@cvx/utils/migration"

export const setCreatedAt = migrations.define({
  table: "eventRecords",
  migrateOne: async (ctx, record) => {
    if (record.createdAt) return

    await ctx.db.patch(record._id, {
      createdAt: record._creationTime,
    })
  },
})

export const runSetCreatedAt = migrations.runner(
  internal.events.migrations.setCreatedAt
)
