import { NextResponse } from "next/server"

const DEMO_ACCESS_COOKIE = "demo_access"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const next = (searchParams.get("next") ?? "/demo").trim() || "/demo"

  const redirectUrl =
    next === "/demo" ? "/demo/access" : `/demo/access?next=${encodeURIComponent(next)}`

  const res = NextResponse.redirect(new URL(redirectUrl, request.url))
  res.cookies.set(DEMO_ACCESS_COOKIE, "", {
    path: "/",
    maxAge: 0,
  })
  return res
}
