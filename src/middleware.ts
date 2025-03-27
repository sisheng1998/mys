import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

import { CONVEX_AUTH_API_ROUTE } from "@/app/providers"
import { env } from "@/env"

const isSignInPage = createRouteMatcher(["/sign-in"])
const isPublicRoute = createRouteMatcher([
  "/terms-of-service",
  "/privacy-policy",
])

export const middleware = async (req: NextRequest, event: NextFetchEvent) => {
  if (req.nextUrl.pathname.startsWith("/api/auth"))
    return NextResponse.redirect(
      `${env.CONVEX_SITE_URL}${req.nextUrl.pathname}${req.nextUrl.search}`
    )

  return convexAuthNextjsMiddleware(
    async (request, { convexAuth }) => {
      const isAuthenticated = await convexAuth.isAuthenticated()

      if (isSignInPage(request) && isAuthenticated)
        return nextjsMiddlewareRedirect(request, "/")

      if (!isSignInPage(request) && !isPublicRoute(request) && !isAuthenticated)
        return nextjsMiddlewareRedirect(request, "/sign-in")
    },
    {
      apiRoute: CONVEX_AUTH_API_ROUTE,
      cookieConfig: { maxAge: 60 * 60 * 24 * 30 },
    }
  )(req, event)
}

export const config = {
  matcher: ["/((?!icon|.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
