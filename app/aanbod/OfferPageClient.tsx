"use client"

import { useState, useCallback, FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Printer } from "lucide-react"

export interface OfferModule {
  id: string
  title: string
  description: string
  oneTime: number
  monthly: number
  defaultSelected: boolean
  isOptional: boolean
}

const MODULES: OfferModule[] = [
  {
    id: "timeout-employee",
    title: "Time-out knop werknemers",
    description:
      "Dit betreft het meldingsdeel voor de werknemers die daarmee een knelpunt kunnen bespreken en oplossen om te voorkomen dat verzuim ontstaat.",
    oneTime: 3595,
    monthly: 95,
    defaultSelected: true,
    isOptional: false,
  },
  {
    id: "timeout-manager",
    title: "Time-out knop leidinggevenden / werkgever",
    description:
      "Dit betreft het meldingsdeel voor de leidinggevende die een knelpunt mbt een werknemer wil aankaarten en bespreken (voor MKB-ondernemingen waar de directeur/eigenaar ook de leidinggevende is).",
    oneTime: 1495,
    monthly: 95,
    defaultSelected: false,
    isOptional: true,
  },
  {
    id: "verzuimreflectie",
    title: "Knop Verzuimreflectie werknemer",
    description:
      "Deze knop ondersteunt de werknemer en laat de gevolgen van een verzuimmelding versus een Time-out zien.",
    oneTime: 495,
    monthly: 55,
    defaultSelected: false,
    isOptional: true,
  },
  {
    id: "navigatie",
    title: "Navigatie knop",
    description:
      "Met deze knop kan de werknemer tijdens het verzuim een gesprek aanvragen.",
    oneTime: 2475,
    monthly: 95,
    defaultSelected: false,
    isOptional: true,
  },
  {
    id: "vitalr-nexus",
    title: "VitalR Nexus – verbindend middelpunt",
    description:
      "Op dit platform komen de aanvragen binnen die met de coaches en de specialisten verbonden moeten worden.",
    oneTime: 1975,
    monthly: 95,
    defaultSelected: true,
    isOptional: true,
  },
]

function formatCurrency(value: number): string {
  const formatted = value.toLocaleString("nl-NL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `€ ${formatted},-`
}

function formatCurrencyDecimal(value: number): string {
  const formatted = value.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `€ ${formatted}`
}

export function OfferPageClient() {
  const [selected, setSelected] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    MODULES.forEach((m) => {
      if (m.defaultSelected) initial.add(m.id)
    })
    return initial
  })

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const toggleModule = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectedModules = MODULES.filter((m) => selected.has(m.id))
  const totalOneTime = selectedModules.reduce((sum, m) => sum + m.oneTime, 0)
  const totalMonthly = selectedModules.reduce((sum, m) => sum + m.monthly, 0)

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitSuccess(null)
    setSubmitError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const honeypot = website.trim()

    if (!trimmedName) {
      setSubmitError("Vul je naam in.")
      return
    }
    if (!trimmedEmail) {
      setSubmitError("Vul je e-mailadres in.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setSubmitError("Vul een geldig e-mailadres in.")
      return
    }
    if (selectedModules.length === 0) {
      setSubmitError("Selecteer minimaal één onderdeel voor de offerte.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/offer/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: trimmedName,
            email: trimmedEmail,
          },
          selectedModules: selectedModules.map((module) => ({
            id: module.id,
            title: module.title,
            oneTime: module.oneTime,
            monthly: module.monthly,
          })),
          totals: {
            oneTimeTotal: totalOneTime,
            monthlyTotal: totalMonthly,
          },
          additionalRates: {
            adjustmentsHourly: 125,
            travelTimeHourly: 65,
            travelCostPerKm: 0.45,
          },
          proposal: {
            title: "Time-out offerte van Salgai voor Vrieling VitalR",
          },
          meta: {
            source: "vrieling.salgai.nl/aanbod",
            createdAt: new Date().toISOString(),
          },
          website: honeypot,
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setSubmitError(
          data?.error ??
            "Er is iets misgegaan bij het versturen van de offerte. Probeer het later opnieuw."
        )
        return
      }

      setSubmitSuccess("De offerte is verzonden. Je ontvangt deze per e-mail.")
    } catch {
      setSubmitError(
        "Er is een technische fout opgetreden bij het versturen van de offerte. Probeer het later opnieuw."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:py-8 print:py-4">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        {/* Left: toelichting + doelstelling + modules */}
        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6">
            <h1 className="mb-3 text-xl font-semibold text-primary sm:text-2xl print:text-foreground">
              Time-out offerte van Salgai voor Vrieling VitalR
            </h1>
            <p className="text-sm leading-relaxed text-foreground">
              Met deze offerte investeert u in het <strong>voorkómen van verzuim</strong>. Door
              werknemers en leidinggevenden vroegtijdig te ondersteunen met gerichte interventies –
              nog vóór er sprake is van verzuim – lost u knelpunten op waar ze ontstaan. Het
              resultaat: minder verzuim, gezondere medewerkers en lagere kosten voor uw organisatie.
            </p>
          </div>

          {/* Doelstelling */}
          <Card className="rounded-2xl shadow-sm print:shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Doelstelling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Werknemers ondersteunen door met behulp van Time-out en eigen casemanagers en
                specialisten gerichte interventies in te zetten nog voordat er sprake is van
                verzuim. Voordeel voor de werkgever is het voorkomen van toekomstig verzuim door
                knelpunten vroegtijdig op te lossen.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm print:shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className={`rounded-xl border p-4 print:border-0 print:border-b print:rounded-none print:py-3 ${
                    selected.has(module.id)
                      ? "border-primary/30 bg-primary/5"
                      : "border-border print:opacity-60"
                  } ${!selected.has(module.id) ? "print:hidden" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="print:hidden pt-0.5">
                      <Checkbox
                        id={module.id}
                        checked={selected.has(module.id)}
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={module.id}
                        className="flex flex-wrap items-center gap-2 cursor-pointer print:cursor-default"
                      >
                        <span className="font-medium text-foreground">{module.title}</span>
                        {module.isOptional && (
                          <Badge variant="secondary" className="print:hidden">
                            Optioneel
                          </Badge>
                        )}
                      </label>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {module.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
                        <span>Eenmalig: {formatCurrency(module.oneTime)} ex.</span>
                        <span className="flex items-center gap-1">
                          Maandelijks: {formatCurrency(module.monthly)} ex.
                          {module.monthly === 95 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
                                  aria-label="Toelichting maandbedrag"
                                >
                                  <Info className="h-3 w-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Maandbedrag per aangesloten klant.</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </span>
                      </div>
                      {module.id === "vitalr-nexus" && (
                        <div className="mt-3 space-y-2 text-sm">
                          <p className="font-medium text-foreground">
                            Registratie- en gebruikstarieven VitalR Nexus
                          </p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Omschrijving</TableHead>
                                <TableHead className="text-right">Tarief</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Eigen coach (bij inschrijving 2 credits)</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrencyDecimal(4.95)} per maand ex.
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Eigen specialist (bij inschrijving 2 credits)</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrencyDecimal(4.95)} per maand ex.
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Credits (min. 10 per keer)</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrencyDecimal(4.95)} ex. per opdracht
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator className="print:hidden" />

          {/* Aanvullende tarieven (los van VitalR Nexus) */}
          <Card className="rounded-2xl shadow-sm print:shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Aanvullende tarieven</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Omschrijving</TableHead>
                    <TableHead className="text-right">Tarief</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Aanpassingen / implementatie / overleg</TableCell>
                    <TableCell className="text-right">{formatCurrency(125)} ex. per uur</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reistijd</TableCell>
                    <TableCell className="text-right">{formatCurrency(65)} per uur</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reiskosten</TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyDecimal(0.45)} per kilometer
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>

        {/* Rechts: samenvatting + offerte per e-mail */}
        <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <Card className="rounded-2xl shadow-sm print:shadow-none print:static">
            <CardHeader>
              <CardTitle className="text-lg">Samenvatting en offerte per e-mail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Geselecteerde onderdelen
                </p>
                {selectedModules.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Geen modules geselecteerd
                  </p>
                ) : (
                  <ul className="space-y-3 text-sm">
                    {selectedModules.map((module) => (
                      <li
                        key={module.id}
                        className="border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <span className="font-medium text-foreground">{module.title}</span>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span>Eenmalig: {formatCurrency(module.oneTime)}</span>
                          <span className="flex items-center gap-1">
                            Maandelijks: {formatCurrency(module.monthly)}
                            {module.monthly === 95 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex h-3.5 w-3.5 items-center justify-center text-muted-foreground hover:text-foreground"
                                    aria-label="Toelichting maandbedrag"
                                  >
                                    <Info className="h-3 w-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Maandbedrag per aangesloten klant.</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Totaal eenmalig</span>
                  <span className="font-medium">{formatCurrency(totalOneTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Totaal per maand</span>
                  <span className="font-medium">{formatCurrency(totalMonthly)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">Alle bedragen excl. btw</p>

              <Separator className="print:hidden" />

              {/* Offerte per e-mail ontvangen (samengevoegd) */}
              <form className="space-y-4 print:hidden" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-name">Naam*</Label>
                  <Input
                    id="offer-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-email">E-mail*</Label>
                  <Input
                    id="offer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                {/* Honeypot */}
                <div className="hidden">
                  <Label htmlFor="offer-website">Website</Label>
                  <Input
                    id="offer-website"
                    name="website"
                    type="text"
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}
                {submitSuccess && !submitError && (
                  <p className="text-sm text-emerald-700">{submitSuccess}</p>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Bezig met versturen..." : "Verstuur offerte per e-mail"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
