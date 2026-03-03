import { NextResponse } from "next/server"

const CACHE_HEADERS = {
  "Cache-Control": "no-store",
}

interface OfferModulePayload {
  id: string
  title: string
  oneTime: number
  monthly: number
}

interface OfferSubmitPayload {
  customer?: {
    name?: unknown
    email?: unknown
    company?: unknown
  }
  selectedModules?: OfferModulePayload[]
  totals?: {
    oneTimeTotal?: unknown
    monthlyTotal?: unknown
  }
  additionalRates?: {
    adjustmentsHourly?: unknown
    travelTimeHourly?: unknown
    travelCostPerKm?: unknown
  }
  proposal?: {
    title?: unknown
    deliveryWindow?: unknown
  }
  meta?: {
    source?: unknown
    createdAt?: unknown
  }
  website?: unknown
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OfferSubmitPayload

    const name = typeof body.customer?.name === "string" ? body.customer.name.trim() : ""
    const email = typeof body.customer?.email === "string" ? body.customer.email.trim() : ""
    const company =
      typeof body.customer?.company === "string" && body.customer.company.trim().length > 0
        ? body.customer.company.trim()
        : null

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Naam is verplicht." },
        { status: 400, headers: CACHE_HEADERS }
      )
    }

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "E-mailadres is verplicht." },
        { status: 400, headers: CACHE_HEADERS }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "E-mailadres is ongeldig." },
        { status: 400, headers: CACHE_HEADERS }
      )
    }

    if (!Array.isArray(body.selectedModules) || body.selectedModules.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Er moeten één of meer onderdelen geselecteerd zijn." },
        { status: 400, headers: CACHE_HEADERS }
      )
    }

    const oneTimeTotal =
      typeof body.totals?.oneTimeTotal === "number" ? body.totals.oneTimeTotal : NaN
    const monthlyTotal =
      typeof body.totals?.monthlyTotal === "number" ? body.totals.monthlyTotal : NaN

    if (!Number.isFinite(oneTimeTotal) || !Number.isFinite(monthlyTotal)) {
      return NextResponse.json(
        { ok: false, error: "Totaalbedragen ontbreken of zijn ongeldig." },
        { status: 400, headers: CACHE_HEADERS }
      )
    }

    const honeypot = typeof body.website === "string" ? body.website.trim() : ""
    if (honeypot !== "") {
      return NextResponse.json(
        { ok: false, error: "Aanvraag kon niet worden verwerkt." },
        { status: 400, headers: CACHE_HEADERS }
      )
    }

    const n8nUrl = process.env.N8N_OFFER_WEBHOOK_URL
    if (!n8nUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "De e-mailservice voor offertes is nog niet geconfigureerd.",
        },
        { status: 500, headers: CACHE_HEADERS }
      )
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
    }, 10_000)

    try {
      const forwardedPayload = {
        customer: {
          name,
          email,
          company,
        },
        selectedModules: body.selectedModules,
        totals: {
          oneTimeTotal,
          monthlyTotal,
        },
        additionalRates: body.additionalRates,
        proposal: body.proposal ?? {
          title: "Time-out offerte van Salgai voor Vrieling VitalR",
        },
        meta: {
          source:
            typeof body.meta?.source === "string"
              ? body.meta.source
              : "vrieling.salgai.nl/aanbod",
          createdAt:
            typeof body.meta?.createdAt === "string"
              ? body.meta.createdAt
              : new Date().toISOString(),
        },
      }

      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forwardedPayload),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "De offerte kon niet worden verzonden via de e-mailservice. Probeer het later opnieuw.",
          },
          { status: 502, headers: CACHE_HEADERS }
        )
      }

      return NextResponse.json({ ok: true }, { status: 200, headers: CACHE_HEADERS })
    } catch {
      clearTimeout(timeout)
      return NextResponse.json(
        {
          ok: false,
          error:
            "Er is een technische fout opgetreden bij het versturen van de offerte. Probeer het later opnieuw.",
        },
        { status: 502, headers: CACHE_HEADERS }
      )
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "De verstuurde gegevens zijn ongeldig.",
      },
      { status: 400, headers: CACHE_HEADERS }
    )
  }
}

