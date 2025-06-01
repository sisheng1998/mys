import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type Category = FunctionReturnType<
  typeof api.categories.queries.list
>[number]
