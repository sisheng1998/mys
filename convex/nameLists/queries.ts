import { z } from "zod"

import { authQuery } from "@cvx/utils/function"
import { convertChineseToUnicode } from "@cvx/utils/name"

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
        ? query.withSearchIndex("search_text", (q) =>
            q.search("searchText", convertChineseToUnicode(name))
          )
        : query.withIndex("by_name").order("asc")
    ).take(10)
  },
})
