import Google from "@auth/core/providers/google"
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server"

import { query } from "@cvx/_generated/server"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
})

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const user = await ctx.db.get(userId)
    if (!user) return null

    return {
      id: user._id,
      email: user.email || "",
      name: user.name || "",
      image: user.image,
    }
  },
})
