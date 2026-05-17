import { defineSchema } from "convex/server"

import { authTables } from "@cvx/auth/schemas"
import { categoryTables } from "@cvx/categories/schemas"
import { eventTables } from "@cvx/events/schemas"
import { excludedWordTables } from "@cvx/excludedWords/schemas"
import { nameListTables } from "@cvx/nameLists/schemas"
import { templateTables } from "@cvx/templates/schemas"
import { userTables } from "@cvx/users/schemas"

const schema = defineSchema({
  ...authTables,
  ...userTables,
  ...nameListTables,
  ...categoryTables,
  ...templateTables,
  ...eventTables,
  ...excludedWordTables,
})

export default schema
