import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEMO_ROLE_COOKIE = "demoRole"
const DEMO_ACCESS_COOKIE = "demo_access"

/** Dashboard path -> required demo role value in cookie */
const DASHBOARD_ROLE: Record<string, string> = {
  "/dashboard/hr": "hr",
  "/dashboard/leidinggevende": "manager",
  "/dashboard/employee": "medewerker",
  "/dashboard/coach": "coach",
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Demo access gate: /demo and subroutes require demo_access cookie, except /demo/access
  if (path === "/demo" || path.startsWith("/demo/")) {
    if (path === "/demo/access" || path.startsWith("/demo/access/")) {
      return NextResponse.next()
    }
    const hasAccess = request.cookies.get(DEMO_ACCESS_COOKIE)?.value
    if (!hasAccess) {
      const url = request.nextUrl.clone()
      url.pathname = "/demo/access"
      url.searchParams.set("next", path)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const requiredRole = DASHBOARD_ROLE[path]
  if (!requiredRole) return NextResponse.next()

  const role = request.cookies.get(DEMO_ROLE_COOKIE)?.value
  if (!role || role !== requiredRole) {
    const url = request.nextUrl.clone()
    url.pathname = "/demo"
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/hr",
    "/dashboard/leidinggevende",
    "/dashboard/employee",
    "/dashboard/coach",
    "/demo",
    "/demo/:path*",
  ],
}
