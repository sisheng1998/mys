import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"

import { MutationCtx } from "@cvx/_generated/server"
import { userSchema } from "@cvx/users/schemas"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    createOrUpdateUser: async (ctx: MutationCtx, args) => {
      const profile = userSchema.omit({ isAuthorized: true }).parse({
        name: args.profile.name,
        email: args.profile.email,
        image: args.profile.image,
      })

      if (args.existingUserId) {
        await ctx.db.patch(args.existingUserId, profile)
        return args.existingUserId
      }

      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", profile.email))
        .unique()

      if (existingUser) {
        await ctx.db.patch(existingUser._id, profile)
        return existingUser._id
      }

      return ctx.db.insert("users", { ...profile, isAuthorized: false })
    },
  },
})
