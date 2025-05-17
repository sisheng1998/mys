import { z } from "zod"

import { authQuery } from "@cvx/utils/function"

export const list = authQuery({
  args: {},
  handler: (ctx) =>
    ctx.db.query("nameLists").withIndex("by_name").order("asc").collect(),
})

export const search = authQuery({
  args: {
    name: z.string(),
  },
  handler: (ctx, args) => {
    const { name } = args
    const query = ctx.db.query("nameLists")

    return (
      name
        ? query.withSearchIndex("search_name", (q) => q.search("name", name))
        : query.withIndex("by_name").order("asc")
    ).take(10)
  },
})
