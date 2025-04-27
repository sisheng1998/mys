import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddNewUser from "@/components/users/AddNewUser"
import UserTable from "@/components/users/UserTable"
import { Breadcrumb } from "@/contexts/breadcrumb"

export const metadata = {
  title: "Users",
}

const Users = () => (
  <>
    <Breadcrumb links={[{ label: "Users" }]} />

    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Users</CardTitle>
          <CardDescription>Create and manage users</CardDescription>
        </div>

        <AddNewUser />
      </CardHeader>
    </Card>

    <Card className="flex-1">
      <CardContent className="flex flex-1 flex-col">
        <UserTable />
      </CardContent>
    </Card>
  </>
)

export default Users
