import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEMO_ROLE_COOKIE = "demoRole"

/** Dashboard path -> required demo role value in cookie */
const DASHBOARD_ROLE: Record<string, string> = {
  "/dashboard/hr": "hr",
  "/dashboard/leidinggevende": "manager",
  "/dashboard/employee": "medewerker",
  "/dashboard/coach": "coach",
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
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
  matcher: ["/dashboard/hr", "/dashboard/leidinggevende", "/dashboard/employee", "/dashboard/coach"],
}
