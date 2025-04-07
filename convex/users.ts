import { getAuthUserId } from "@convex-dev/auth/server"

import { query } from "@cvx/_generated/server"

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const user = await ctx.db.get(userId)
    if (!user) return null

    return user
  },
})
