import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type Event = NonNullable<
  FunctionReturnType<typeof api.events.queries.list>["page"][number]
>
