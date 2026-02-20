"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NavHeader } from "@/components/nav-header"
import { Check, Send, Pencil, Loader2, Lock } from "lucide-react"

// Theme configuration for data structure
const THEMES = [
  { id: "situatie", title: "Situatie & beleving" },
  { id: "sociaal", title: "Sociale gevolgen" },
  { id: "reden", title: "Reden toen vs nu" },
  { id: "energie", title: "Energie & signalen" },
  { id: "omstandigheden", title: "Omstandigheden waar je floreert" },
  { id: "glinstering", title: "Glinstering & interesses" },
]

// Template-based theme content generation (no AI, SSR-safe)
function generateThemeContent(): Record<string, string> {
  return {
    situatie: "Je verzuim duurt nu tussen de 4 en 12 maanden. Je geeft aan dat het wisselend tot zwaar voelt. Het raakt je merkbaar in je dagelijks leven, en je merkt dat de batterij niet meer zo makkelijk oplaadt als vroeger.",
    sociaal: "In je directe omgeving is de verandering merkbaar. Je gezin thuis voelt het het sterkst. Vrienden en collega's zien ook dat er iets speelt, al is dat wat minder direct. Je hebt je best gedaan om het zo goed mogelijk te dragen, maar het kost je moeite.",
    reden: "De oorspronkelijke reden voor je verzuim — overspannenheid door werkdruk — past nog gedeeltelijk bij hoe je je nu voelt. Inmiddels omschrijf je het zelf als een combinatie van werkstress en je privésituatie. Dat past goed bij waar je nu staat.",
    energie: "Je geeft aan dat sommige dingen je energie kosten en andere juist energie geven. Rust en ontspanning lijken belangrijk voor je herstel. Je merkt signalen in je lichaam, je hoofd en je emoties — wisselend, maar wel aanwezig.",
    omstandigheden: "Uit de contrasten blijkt dat je beter functioneert in bepaalde omstandigheden. Je lijkt te gedijen bij een zekere balans: soms rust, soms actie; soms alleen, soms samen. Structuur helpt, maar met ruimte voor eigen regie.",
    glinstering: "Je hebt een aantal interesses genoemd die je energie of plezier geven. Deze kunnen richting geven aan wat je mogelijk weer zou kunnen oppakken — stapje voor stapje, in je eigen tempo.",
  }
}

// Build one flowing narrative from theme content
function buildNarrative(themes: Record<string, string>): string {
  return `${themes.situatie}

${themes.sociaal}

${themes.reden}

${themes.energie}

${themes.omstandigheden}

${themes.glinstering}`
}

// Static demo timestamp (SSR-safe)
const DEMO_TIMESTAMP = "02-02-2026 14:00"

type ConfirmStep = "none" | "first" | "second"

export default function SummaryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [summaryThemes, setSummaryThemes] = useState<Record<string, string>>({})
  const [isApproved, setIsApproved] = useState(false)
  const [confirmStep, setConfirmStep] = useState<ConfirmStep>("none")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setSummaryThemes(generateThemeContent())
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleApprove = () => {
    setConfirmStep("first")
  }

  const handleFirstConfirm = () => {
    setConfirmStep("second")
  }

  const handleSecondConfirm = () => {
    setIsApproved(true)
    setConfirmStep("none")
  }

  const handleNotApproved = () => {
    // Store themes in sessionStorage for the edit page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("summaryThemes", JSON.stringify(summaryThemes))
    }
    router.push("/run/demo/summary-edit")
  }

  // Check for returned edited themes
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      const edited = sessionStorage.getItem("summaryThemesEdited")
      if (edited) {
        setSummaryThemes(JSON.parse(edited))
        sessionStorage.removeItem("summaryThemesEdited")
      }
    }
  }, [isLoading])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader backHref="/run/demo/form" />
        <main className="mx-auto max-w-[900px] px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-primary" />
            <h1 className="mb-2 text-2xl font-semibold text-primary">
              We maken je samenvatting...
            </h1>
            <p className="text-muted-foreground">
              Even geduld, dit duurt maar een moment.
            </p>
            
            {/* Skeleton loader for narrative */}
            <Card className="mt-8 rounded-2xl">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-3/5 animate-pulse rounded bg-secondary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Approved state (read-only)
  if (isApproved) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader showBack={false} />
        <main className="mx-auto max-w-[900px] px-4 py-12">
          <div className="mx-auto max-w-2xl">
            {/* Success header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-primary">
                Verstuurd naar je navigatiecoach
              </h1>
              <p className="text-muted-foreground">
                Alleen deze samenvatting is gedeeld. Niets anders.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {DEMO_TIMESTAMP}
              </p>
            </div>
            
            {/* Read-only narrative */}
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Alleen-lezen</span>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  {THEMES.map((theme) => (
                    <div key={theme.id} className="mb-6 last:mb-0">
                      <h3 className="mb-2 text-sm font-semibold text-primary">
                        {theme.title}
                      </h3>
                      <p className="text-foreground leading-relaxed">
                        {summaryThemes[theme.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Button
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-xl"
            >
              Afsluiten
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader backHref="/run/demo/form" />
      
      <main className="mx-auto max-w-[900px] px-4 py-6">
        {/* Header */}
        <div className="mx-auto mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold text-primary">
            Jouw samenvatting
          </h1>
          <p className="mt-1 text-muted-foreground">
            Lees rustig. Jij bepaalt of dit klopt.
          </p>
          
          {/* Confidential badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Lock className="h-3 w-3" />
              Vertrouwelijk
            </span>
            <span className="text-xs text-muted-foreground">
              Alleen jij en je navigatiecoach (na akkoord).
            </span>
          </div>
        </div>

        {/* Single Narrative Card */}
        <Card className="mx-auto max-w-2xl rounded-2xl shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {/* Version label */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Conceptversie
              </span>
            </div>
            
            {/* Flowing narrative with inline headings */}
            <div className="prose prose-sm max-w-none">
              {THEMES.map((theme) => (
                <div key={theme.id} className="mb-6 last:mb-0">
                  <h3 className="mb-2 text-sm font-semibold text-primary">
                    {theme.title}
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {summaryThemes[theme.id]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handleNotApproved}
            className="rounded-xl bg-transparent"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Niet akkoord: aanpassen
          </Button>
          <Button
            onClick={handleApprove}
            className="rounded-xl bg-primary hover:bg-primary/90"
          >
            <Send className="mr-2 h-4 w-4" />
            Akkoord: stuur naar mijn navigatiecoach
          </Button>
        </div>
      </main>

      {/* First Confirmation Modal */}
      <Dialog open={confirmStep === "first"} onOpenChange={() => setConfirmStep("none")}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Weet je het zeker?</DialogTitle>
            <DialogDescription>
              Alleen deze samenvatting wordt gedeeld met je navigatiecoach. Je kunt later altijd intrekken.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmStep("none")}
              className="rounded-lg bg-transparent"
            >
              Annuleer
            </Button>
            <Button
              onClick={handleFirstConfirm}
              className="rounded-lg bg-primary hover:bg-primary/90"
            >
              Ja, ga door
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Second Confirmation Modal */}
      <Dialog open={confirmStep === "second"} onOpenChange={() => setConfirmStep("none")}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Laatste check</DialogTitle>
            <DialogDescription>
              Klopt dit verhaal zoals jij het bedoelt?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmStep("first")}
              className="rounded-lg bg-transparent"
            >
              Terug
            </Button>
            <Button
              onClick={handleSecondConfirm}
              className="rounded-lg bg-primary hover:bg-primary/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Ja, verstuur
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
