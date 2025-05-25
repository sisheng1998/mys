import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type Event = NonNullable<
  FunctionReturnType<typeof api.events.queries.list>["page"][number]
>

export type EventRecord = NonNullable<
  FunctionReturnType<typeof api.events.queries.getRecords>[number]
>
