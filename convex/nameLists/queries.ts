import { v } from "convex/values"
import { z } from "zod"

import { internal } from "@cvx/_generated/api"
import { httpAction, internalQuery } from "@cvx/_generated/server"
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

export const findSimilar = internalQuery({
  args: {
    name: v.string(),
    count: v.number(),
  },
  handler: async (ctx, { name, count }) => {
    const variants = Array.from(
      new Set([name, convertSCToTC(name), convertTCToSC(name)].filter(Boolean))
    )

    const exact = (
      await Promise.all(
        variants.map((v) =>
          ctx.db
            .query("nameLists")
            .withIndex("by_name", (q) => q.eq("name", v))
            .collect()
        )
      )
    )
      .flat()
      .filter((doc, i, arr) => arr.findIndex((d) => d._id === doc._id) === i)

    if (exact.length > 0)
      return exact.map(({ title = null, name }) => ({ title, name }))

    const searchTerms = variants.map(convertChineseToUnicode).join(" ").trim()

    const matches = await ctx.db
      .query("nameLists")
      .withSearchIndex("search_text", (q) =>
        q.search("searchText", searchTerms)
      )
      .take(count)

    return matches.map(({ title = null, name }) => ({
      title,
      name,
    }))
  },
})

export const getNameLists = httpAction(async (ctx, request) => {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey || apiKey !== process.env.MYS_API_KEY)
    return new Response("Unauthorized", {
      status: 401,
    })

  const url = new URL(request.url)
  const names = [
    ...new Set(
      (url.searchParams.get("names") ?? "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    ),
  ]

  if (names.length === 0)
    return new Response("Names are required", {
      status: 400,
    })

  const results = await Promise.all(
    names.map(async (name) => {
      const matches = await ctx.runQuery(
        internal.nameLists.queries.findSimilar,
        { name, count: 3 }
      )

      return {
        input: name,
        matches,
      }
    })
  )

  return new Response(JSON.stringify(results), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  })
})
