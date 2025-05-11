import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type Template = NonNullable<
  FunctionReturnType<typeof api.templates.queries.list>[number]
>

export type TemplateRecord = NonNullable<
  FunctionReturnType<typeof api.templates.queries.getRecords>[number]
>
