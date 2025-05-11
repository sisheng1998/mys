import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"

import EventTemplate from "@/components/templates/EventTemplate"

import { api } from "@cvx/_generated/api"
import { Id } from "@cvx/_generated/dataModel"

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ _id: Id<"templates"> }>
}): Promise<Metadata> => {
  const { _id } = await params

  const title = await fetchQuery(
    api.templates.queries.getName,
    { _id },
    { token: await convexAuthNextjsToken() }
  )

  return { title }
}

const Template = async ({
  params,
}: {
  params: Promise<{ _id: Id<"templates"> }>
}) => {
  try {
    const { _id } = await params

    const preloadedTemplate = await preloadQuery(
      api.templates.queries.get,
      { _id },
      { token: await convexAuthNextjsToken() }
    )

    return <EventTemplate preloadedTemplate={preloadedTemplate} />
  } catch {
    redirect("/templates")
  }
}

export default Template
