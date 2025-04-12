import { getAuthUserId } from "@convex-dev/auth/server"

import { query, QueryCtx } from "@cvx/_generated/server"
import { authQuery } from "@cvx/utils"

export const getAuthUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx)
  if (!userId) return null

  const user = await ctx.db.get(userId)
  if (!user) return null

  return user
}

export const getCurrentUser = query({
  args: {},
  handler: (ctx) => getAuthUser(ctx),
})

export const list = authQuery({
  args: {},
  handler: async (ctx) => {
    const users = (await ctx.db.query("users").collect()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    return users
  },
})
