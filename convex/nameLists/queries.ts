import { authQuery } from "@cvx/utils/function"

export const list = authQuery({
  args: {},
  handler: (ctx) =>
    ctx.db.query("nameLists").withIndex("by_name").order("asc").collect(),
})
