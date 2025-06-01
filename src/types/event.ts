import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

export type Event = FunctionReturnType<
  typeof api.events.queries.list
>["page"][number]

export type EventRecord = FunctionReturnType<
  typeof api.events.queries.getRecords
>[number]

export type EventRecordForExport = FunctionReturnType<
  typeof api.events.queries.getRecordsForExport
>
