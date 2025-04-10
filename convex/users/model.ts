import { defineTable } from "convex/server"
import { v } from "convex/values"

const userTables = {
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    isAuthorized: v.boolean(),
  }).index("email", ["email"]),
}

export default userTables
