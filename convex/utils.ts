import { customCtx } from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod"
import { ConvexError } from "convex/values"

import { mutation, MutationCtx, query, QueryCtx } from "@cvx/_generated/server"
import { getAuthUser } from "@cvx/users/queries"

const requireAuth = customCtx(async (ctx: QueryCtx | MutationCtx) => {
  const user = await getAuthUser(ctx)
  if (!user) throw new ConvexError("Unauthorized")

  return { user }
})

export const authQuery = zCustomQuery(query, requireAuth)

export const authMutation = zCustomMutation(mutation, requireAuth)
