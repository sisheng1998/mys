import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"

import EventPage from "@/components/events/EventPage"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ _id: Id<"events"> }>
}): Promise<Metadata> => {
  try {
    const { _id } = await params

    const title = await fetchQuery(
      api.events.queries.getName,
      { _id },
      { token: await convexAuthNextjsToken() }
    )

    return { title }
  } catch {
    return {
      title: "Event",
    }
  }
}

const Event = async ({
  params,
}: {
  params: Promise<{ _id: Id<"events"> }>
}) => {
  try {
    const { _id } = await params

    const preloadedEvent = await preloadQuery(
      api.events.queries.get,
      { _id },
      { token: await convexAuthNextjsToken() }
    )

    return <EventPage preloadedEvent={preloadedEvent} />
  } catch {
    redirect("/")
  }
}

export default Event
