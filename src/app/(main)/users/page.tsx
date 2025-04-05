import React from "react"

import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Users",
}

const Users = () => {
  return (
    <div>
      <Breadcrumb links={[{ label: "Users" }]} />
      Users
    </div>
  )
}

export default Users
