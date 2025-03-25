import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const publicRoutes = createRouteMatcher(["/login"])

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const isPublicRoute = publicRoutes(request)
    const isAuthenticated = await convexAuth.isAuthenticated()

    if (isPublicRoute && isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/")
    }

    if (!isPublicRoute && !isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/login")
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } }
)

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
