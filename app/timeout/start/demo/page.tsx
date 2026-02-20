"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavHeader } from "@/components/nav-header"
import { AppFooter } from "@/components/app-footer"
import { Clock, ArrowRight, Heart, ArrowLeft, UserCheck } from "lucide-react"
import { getDemoContext } from "@/lib/demo-data"

export default function TimeoutStartPage() {
  const router = useRouter()

  useEffect(() => {
    const { role, route } = getDemoContext()
    if (!role || route !== "timeout") {
      router.push("/demo")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavHeader showBack backHref="/dashboard/employee?flow=timeout" />
      
      <main className="mx-auto w-full max-w-[900px] flex-1 px-4 py-8">
        <Card className="mx-auto max-w-2xl rounded-2xl shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">Wat is Time-out?</h1>
              </div>
            </div>

            {/* Main explanation */}
            <div className="mb-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Time-out is een preventief interventiemoment dat je als werknemer kan aanvragen <strong className="text-foreground">voordat verzuim ontstaat</strong>. Het is onderdeel van het Mensgericht Casemanagement - een filosofie waarbij de werkgever de werknemer centraal durft te plaatsen, met aandacht voor het geheel van mens, werk en context.
              </p>
              <p>
                Het gaat dus verder dan het wettelijk verplichte verzuimproces en het begint al in de fase waarin iemand signaleert: <em>{"\"dit gaat richting verzuim als er niets verandert.\""}</em>
              </p>
            </div>

            {/* Verzuimlandschap image */}
            <div className="mb-8 overflow-hidden rounded-xl border border-border">
              <Image
                src="/images/verzuimlandschap-timeout.png"
                alt="De drie aandachtsgebieden in het verzuimlandschap: Preventie (voor het verzuim), Curatief (tijdens het verzuim), en WIA-fase (na langdurig verzuim)"
                width={800}
                height={400}
                className="w-full"
              />
            </div>

            {/* Kern van de aanpak */}
            <h2 className="mb-4 text-lg font-semibold text-foreground">Kern van de aanpak</h2>

            <div className="mb-6 space-y-4">
              {/* Block 1 */}
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Niet standaard medisch, wel mensgericht</h3>
                </div>
                <ul className="space-y-1.5 pl-7 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Er worden geen medische diagnoses uitgevraagd
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Focus ligt op signalen, knelpunten en wat jij nodig hebt
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Taal op B1-B2 niveau: begrijpelijk, empathisch maar zakelijk
                  </li>
                </ul>
              </div>

              {/* Block 2 */}
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Onafhankelijke coach</h3>
                </div>
                <ul className="space-y-1.5 pl-7 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Het gesprek is met een time-out coach, niet met de leidinggevende
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Vertrouwelijk en veilig
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    Jij bepaalt wat er wel of niet gedeeld wordt met de werkgever
                  </li>
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" asChild className="rounded-xl bg-transparent">
                <Link href="/dashboard/employee?flow=timeout">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar dashboard
                </Link>
              </Button>
              <Button
                onClick={() => router.push("/timeout/run/demo/form")}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Verder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  )
}
