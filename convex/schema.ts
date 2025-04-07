import { defineSchema } from "convex/server"

import { authTables } from "@cvx/schemas/auth"
import { userTables } from "@cvx/schemas/users"

const schema = defineSchema({
  ...authTables,
  ...userTables,
})

export default schema
