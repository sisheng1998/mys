import { migrations } from "@cvx/utils/migration"
import { convertChineseToUnicode } from "@cvx/utils/name"

export const setSearchText = migrations.define({
  table: "nameLists",
  migrateOne: async (ctx, record) => {
    if (record.searchText) return

    await ctx.db.patch(record._id, {
      searchText: convertChineseToUnicode(record.name),
    })
  },
})
