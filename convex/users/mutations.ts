import { ConvexError } from "convex/values"

import { userSchema } from "@cvx/users/schemas"
import { authMutation } from "@cvx/utils/function"

export const createUserSchema = userSchema.pick({
  email: true,
})

export const createUser = authMutation({
  args: createUserSchema.shape,
  handler: async (ctx, args) => {
    const { email } = args

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()

    if (existingUser) throw new ConvexError("User already exists")

    const newUser = userSchema.parse({
      email,
      isAuthorized: true,
    })

    return ctx.db.insert("users", newUser)
  },
})
