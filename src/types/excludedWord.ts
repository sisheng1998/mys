import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type ExcludedWord = FunctionReturnType<
  typeof api.excludedWords.queries.list
>[number]
