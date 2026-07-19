import { httpRouter } from "convex/server"

import { auth } from "@cvx/auth"
import { getNameLists } from "@cvx/nameLists/queries"

const http = httpRouter()

auth.addHttpRoutes(http)

http.route({
  path: "/nameLists",
  method: "GET",
  handler: getNameLists,
})

export default http
