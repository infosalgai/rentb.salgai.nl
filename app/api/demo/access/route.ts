import { NextResponse } from "next/server"

const DEMO_ACCESS_COOKIE = "demo_access"
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export async function POST(request: Request) {
  let code = ""
  let nextUrl = "/demo"

  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}))
    code = (body.code ?? "").trim()
    if (body.next && typeof body.next === "string") nextUrl = body.next.trim() || "/demo"
  } else {
    const formData = await request.formData()
    code = (formData.get("code") as string)?.trim() ?? ""
    const next = formData.get("next") as string
    if (next?.trim()) nextUrl = next.trim()
  }

  const expected = (process.env.DEMO_ACCESS_CODE ?? "").trim()
  if (!expected) {
    console.error("DEMO_ACCESS_CODE is not set")
    return NextResponse.json(
      { error: "Toegang kon niet worden gecontroleerd. Probeer het later opnieuw." },
      { status: 500 }
    )
  }

  if (code !== expected) {
    return NextResponse.json(
      { error: "Onjuiste code. Probeer het opnieuw." },
      { status: 400 }
    )
  }

  const res = NextResponse.json({ redirect: nextUrl })
  res.cookies.set(DEMO_ACCESS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
  return res
}
