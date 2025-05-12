import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"
import { TITLES } from "@cvx/nameLists/schemas"

export type NameListRecord = NonNullable<
  FunctionReturnType<typeof api.nameLists.queries.list>[number]
>

export type Title = (typeof TITLES)[number]
