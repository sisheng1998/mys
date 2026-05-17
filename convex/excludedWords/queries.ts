import { authQuery } from "@cvx/utils/function"

export const list = authQuery({
  args: {},
  handler: (ctx) => ctx.db.query("excludedWords").order("asc").collect(),
})

export const getExcludedWords = authQuery({
  args: {},
  handler: async (ctx) => {
    const words = await ctx.db
      .query("excludedWords")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect()

    return words.map(({ word }) => word)
  },
})
