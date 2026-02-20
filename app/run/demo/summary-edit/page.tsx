"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { NavHeader } from "@/components/nav-header"
import { Check, ArrowRight } from "lucide-react"

// Theme configuration matching summary page
const THEMES = [
  { id: "situatie", title: "Situatie & beleving" },
  { id: "sociaal", title: "Sociale gevolgen" },
  { id: "reden", title: "Reden toen vs nu" },
  { id: "energie", title: "Energie & signalen" },
  { id: "omstandigheden", title: "Omstandigheden waar je floreert" },
  { id: "glinstering", title: "Glinstering & interesses" },
]

const MAX_CHARS = 600

export default function SummaryEditPage() {
  const router = useRouter()
  const [themes, setThemes] = useState<Record<string, string>>({})
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({})

  // Load themes from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("summaryThemes")
      if (stored) {
        setThemes(JSON.parse(stored))
      } else {
        // Fallback if no data (shouldn't happen in normal flow)
        router.push("/run/demo/summary")
      }
    }
  }, [router])

  const handleThemeChange = (themeId: string, value: string) => {
    setThemes({ ...themes, [themeId]: value.slice(0, MAX_CHARS) })
    // Clear saved status when editing
    setSavedStatus({ ...savedStatus, [themeId]: false })
  }

  const handleSaveTheme = (themeId: string) => {
    setSavedStatus({ ...savedStatus, [themeId]: true })
  }

  const handleDone = () => {
    // Store edited themes and go back to summary
    if (typeof window !== "undefined") {
      sessionStorage.setItem("summaryThemesEdited", JSON.stringify(themes))
      sessionStorage.removeItem("summaryThemes")
    }
    router.push("/run/demo/summary")
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader backHref="/run/demo/summary" />
      
      <main className="mx-auto max-w-[900px] px-4 py-6">
        {/* Header */}
        <div className="mx-auto mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold text-primary">
            Samenvatting aanpassen
          </h1>
          <p className="mt-1 text-muted-foreground">
            Pas elk onderdeel aan zoals jij het zou zeggen. Maximaal {MAX_CHARS} tekens per thema.
          </p>
        </div>

        {/* Editable theme sections */}
        <div className="mx-auto max-w-2xl space-y-4">
          {THEMES.map((theme) => (
            <Card key={theme.id} className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-foreground">
                    {theme.title}
                  </CardTitle>
                  {savedStatus[theme.id] && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Check className="h-3.5 w-3.5" />
                      Opgeslagen
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={themes[theme.id] || ""}
                  onChange={(e) => handleThemeChange(theme.id, e.target.value)}
                  className="min-h-32 resize-none"
                  placeholder="Schrijf hier je eigen tekst..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {(themes[theme.id] || "").length} / {MAX_CHARS} tekens
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveTheme(theme.id)}
                    className="rounded-lg"
                    disabled={savedStatus[theme.id]}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Opslaan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Done button */}
        <div className="mx-auto mt-8 max-w-2xl">
          <Button
            onClick={handleDone}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 sm:w-auto"
          >
            Klaar met aanpassen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Je keert terug naar je samenvatting met de aangepaste teksten.
          </p>
        </div>
      </main>
    </div>
  )
}
