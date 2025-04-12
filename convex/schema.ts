import { defineSchema } from "convex/server"

import { authTables } from "@cvx/auth/schemas"
import { userTables } from "@cvx/users/schemas"

const schema = defineSchema({
  ...authTables,
  ...userTables,
})

export default schema
