import { defineSchema } from "convex/server"

import { authTables } from "@cvx/auth/schemas"
import { categoryTables } from "@cvx/categories/schemas"
import { nameListTables } from "@cvx/nameLists/schemas"
import { userTables } from "@cvx/users/schemas"

const schema = defineSchema({
  ...authTables,
  ...userTables,
  ...nameListTables,
  ...categoryTables,
})

export default schema
