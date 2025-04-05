import React from "react"

import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Dashboard",
}

const Dashboard = () => {
  return (
    <div>
      <Breadcrumb links={[{ label: "Dashboard" }]} />
      Dashboard
    </div>
  )
}

export default Dashboard
