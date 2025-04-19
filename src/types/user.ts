import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type User = NonNullable<
  FunctionReturnType<typeof api.users.queries.getCurrentUser>
>
