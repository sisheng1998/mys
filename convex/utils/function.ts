import { getAuthUserId } from "@convex-dev/auth/server"
import { customCtx } from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { mutation, MutationCtx, query, QueryCtx } from "@cvx/_generated/server"

export const getAuthUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx)
  if (!userId) return null

  const user = await ctx.db.get(userId)
  if (!user) return null

  return user
}

const requireAuth = customCtx(async (ctx: QueryCtx | MutationCtx) => {
  const user = await getAuthUser(ctx)
  if (!user) throw new ConvexError("Unauthorized")

  return { user }
})

export const authQuery = zCustomQuery(query, requireAuth)

export const authMutation = zCustomMutation(mutation, requireAuth)
