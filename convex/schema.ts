import { defineSchema } from "convex/server"

import authTables from "@cvx/auth/model"
import userTables from "@cvx/users/model"

const schema = defineSchema({
  ...authTables,
  ...userTables,
})

export default schema
