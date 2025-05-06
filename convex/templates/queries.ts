import { authQuery } from "@cvx/utils/function"

export const list = authQuery({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query("templates")
      .withIndex("by_name")
      .order("asc")
      .collect()

    return templates.map((template) => ({
      ...template,
      totalDonors: 0,
      totalRecords: 0,
      totalAmount: 0,
    }))
  },
})
