import type { Metadata } from "next"
import { OfferPageClient } from "./OfferPageClient"

export const metadata: Metadata = {
  title: "Time-out offerte | Salgai voor Vrieling VitalR",
  description:
    "Offerte voor Time-out modules en VitalR Nexus van Salgai voor Vrieling VitalR.",
}

export default function AanbodPage() {
  return (
    <div className="min-h-screen bg-background">
      <OfferPageClient />
    </div>
  )
}
