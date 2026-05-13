import { z } from "zod"

import { authQuery } from "@cvx/utils/function"
import {
  convertChineseToUnicode,
  convertSCToTC,
  convertTCToSC,
} from "@cvx/utils/name"

export const list = authQuery({
  args: {},
  handler: (ctx) =>
    ctx.db.query("nameLists").withIndex("by_name").order("asc").collect(),
})

const LIMIT = 15

export const search = authQuery({
  args: {
    name: z.string(),
  },
  handler: (ctx, args) => {
    const { name } = args
    const query = ctx.db.query("nameLists")

    if (!name) return query.withIndex("by_name").order("asc").take(LIMIT)

    const variants = Array.from(
      new Set([name, convertSCToTC(name), convertTCToSC(name)].filter(Boolean))
    )

    const searchTerms = variants.map(convertChineseToUnicode).join(" ").trim()

    return query
      .withSearchIndex("search_text", (q) =>
        q.search("searchText", searchTerms)
      )
      .take(LIMIT)
  },
})
