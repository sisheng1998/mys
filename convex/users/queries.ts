import { query } from "@cvx/_generated/server"
import { authQuery, getAuthUser } from "@cvx/utils/function"

export const getCurrentUser = query({
  args: {},
  handler: (ctx) => getAuthUser(ctx),
})

export const list = authQuery({
  args: {},
  handler: (ctx) =>
    ctx.db.query("users").withIndex("by_name").order("asc").collect(),
})
