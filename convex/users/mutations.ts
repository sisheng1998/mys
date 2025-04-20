import { zid } from "convex-helpers/server/zod"
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

export const deleteUser = authMutation({
  args: {
    userId: zid("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args

    const user = await ctx.db.get(userId)
    if (!user) throw new ConvexError("User not found")

    const authSessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect()

    for (const session of authSessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect()

      for (const token of refreshTokens) {
        await ctx.db.delete(token._id)
      }

      await ctx.db.delete(session._id)
    }

    const authAccounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect()

    for (const account of authAccounts) {
      const verificationCodes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect()

      for (const code of verificationCodes) {
        await ctx.db.delete(code._id)
      }

      await ctx.db.delete(account._id)
    }

    return ctx.db.delete(userId)
  },
})
