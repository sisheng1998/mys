import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"

import { MutationCtx } from "@cvx/_generated/server"

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
      const profile = {
        name: typeof args.profile.name === "string" ? args.profile.name : "",
        email: args.profile.email || "",
        image:
          typeof args.profile.image === "string"
            ? args.profile.image
            : undefined,
      }

      if (args.existingUserId) {
        await ctx.db.patch(args.existingUserId, profile)
        return args.existingUserId
      }

      return ctx.db.insert("users", {
        ...profile,
        isAuthorized: false,
      })
    },
  },
})
