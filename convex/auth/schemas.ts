import { defineTable } from "convex/server"
import { v } from "convex/values"

const authSessionFields = {
  userId: v.id("users"),
  expirationTime: v.number(),
}

const authAccountFields = {
  userId: v.id("users"),
  provider: v.string(),
  providerAccountId: v.string(),
}

const authRefreshTokenFields = {
  sessionId: v.id("authSessions"),
  expirationTime: v.number(),
  firstUsedTime: v.optional(v.number()),
  parentRefreshTokenId: v.optional(v.id("authRefreshTokens")),
}

const authVerificationCodeFields = {
  accountId: v.id("authAccounts"),
  provider: v.string(),
  code: v.string(),
  expirationTime: v.number(),
  verifier: v.optional(v.string()),
}

const authVerifierFields = {
  sessionId: v.optional(v.id("authSessions")),
  signature: v.optional(v.string()),
}

export const authTables = {
  authSessions: defineTable(authSessionFields).index("userId", ["userId"]),
  authAccounts: defineTable(authAccountFields)
    .index("userIdAndProvider", ["userId", "provider"])
    .index("providerAndAccountId", ["provider", "providerAccountId"]),
  authRefreshTokens: defineTable(authRefreshTokenFields)
    .index("sessionId", ["sessionId"])
    .index("sessionIdAndParentRefreshTokenId", [
      "sessionId",
      "parentRefreshTokenId",
    ]),
  authVerificationCodes: defineTable(authVerificationCodeFields)
    .index("accountId", ["accountId"])
    .index("code", ["code"]),
  authVerifiers: defineTable(authVerifierFields).index("signature", [
    "signature",
  ]),
}
