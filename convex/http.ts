import { httpRouter } from "convex/server"

import { auth } from "@cvx/auth"

const http = httpRouter()

auth.addHttpRoutes(http)

export default http
