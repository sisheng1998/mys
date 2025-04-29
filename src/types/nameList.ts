import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type NameListRecord = NonNullable<
  FunctionReturnType<typeof api.nameLists.queries.list>[number]
>
