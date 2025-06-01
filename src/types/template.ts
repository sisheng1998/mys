import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type Template = FunctionReturnType<
  typeof api.templates.queries.list
>[number]

export type TemplateRecord = FunctionReturnType<
  typeof api.templates.queries.getRecords
>[number]
