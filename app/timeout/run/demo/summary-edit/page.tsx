"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { NavHeader } from "@/components/nav-header"
import { Check, ArrowRight } from "lucide-react"
import { getDemoContext } from "@/lib/demo-data"

interface EditableSections {
  aanleiding: string
  signalen: string
  watHelpt: string
  randvoorwaarden: string
}

export default function TimeoutSummaryEditPage() {
  const router = useRouter()
  const [sections, setSections] = useState<EditableSections>({
    aanleiding: "",
    signalen: "",
    watHelpt: "",
    randvoorwaarden: "",
  })
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const { role, route } = getDemoContext()
    if (!role || route !== "timeout") {
      router.push("/demo")
      return
    }

    // Parse narrative into sections
    const narrative = sessionStorage.getItem("timeoutNarrative") || ""
    const paragraphs = narrative.split("\n\n")

    // Simple split into 4 sections
    setSections({
      aanleiding: paragraphs[0] || "Je hebt een time-out aangevraagd vanwege werkdruk en stress.",
      signalen: paragraphs.slice(1, 3).join("\n\n") || "Je merkt vooral minder concentratie en spanning in je lijf.",
      watHelpt: paragraphs[3] || "Je doel is rust en overzicht krijgen.",
      randvoorwaarden: paragraphs[4] || "Alleen je time-out coach mag deze samenvatting zien.",
    })
  }, [router])

  const handleSave = (field: keyof EditableSections) => {
    setSavedSections(new Set([...savedSections, field]))
    // Auto-hide the checkmark after 2 seconds
    setTimeout(() => {
      setSavedSections((prev) => {
        const next = new Set(prev)
        next.delete(field)
        return next
      })
    }, 2000)
  }

  const handleFinish = () => {
    // Rebuild narrative from edited sections
    const newNarrative = [
      sections.aanleiding,
      sections.signalen,
      sections.watHelpt,
      sections.randvoorwaarden,
    ].join("\n\n")

    sessionStorage.setItem("timeoutNarrative", newNarrative)
    router.push("/timeout/run/demo/summary")
  }

  const renderEditableSection = (
    title: string,
    field: keyof EditableSections,
    placeholder: string
  ) => (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={sections[field]}
          onChange={(e) =>
            setSections({ ...sections, [field]: e.target.value.slice(0, 600) })
          }
          placeholder={placeholder}
          className="min-h-32 resize-none"
          maxLength={600}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {sections[field].length}/600
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSave(field)}
            className="rounded-lg"
          >
            {savedSections.has(field) ? (
              <>
                <Check className="mr-1 h-4 w-4 text-green-600" />
                Opgeslagen
              </>
            ) : (
              "Opslaan"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <NavHeader showBack backHref="/timeout/run/demo/summary" />

      <main className="mx-auto max-w-[900px] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-semibold text-primary">
              Samenvatting aanpassen
            </h1>
            <p className="text-muted-foreground">
              Pas de tekst aan zodat het klopt met jouw verhaal.
            </p>
          </div>

          {/* Editable sections */}
          <div className="space-y-4">
            {renderEditableSection(
              "Aanleiding & context",
              "aanleiding",
              "Beschrijf de aanleiding voor je time-out aanvraag..."
            )}
            {renderEditableSection(
              "Signalen & impact",
              "signalen",
              "Beschrijf welke signalen je merkt en wat de impact is..."
            )}
            {renderEditableSection(
              "Wat nu helpt (1–2 weken)",
              "watHelpt",
              "Beschrijf wat je zou helpen de komende tijd..."
            )}
            {renderEditableSection(
              "Randvoorwaarden & delen",
              "randvoorwaarden",
              "Beschrijf je voorkeuren over wat er gedeeld mag worden..."
            )}
          </div>

          {/* Finish button */}
          <div className="mt-8 flex justify-center">
            <Button onClick={handleFinish} className="rounded-xl" size="lg">
              Klaar met aanpassen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
