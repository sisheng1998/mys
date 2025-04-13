import { query } from "@cvx/_generated/server"
import { authQuery, getAuthUser } from "@cvx/utils/function"

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
