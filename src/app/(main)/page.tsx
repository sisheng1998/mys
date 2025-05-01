import React from "react"

import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Events",
}

const Events = () => {
  return (
    <div>
      <Breadcrumb links={[{ label: "Events" }]} />
      Events
    </div>
  )
}

export default Events
