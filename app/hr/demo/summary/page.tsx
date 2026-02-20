"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Building2, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

// Mocked HR version of summary - more neutral, less personal detail
const HR_SUMMARY = {
  medewerkerInfo: {
    afdeling: "Marketing",
    functie: "Marketing Specialist",
    startDatumUitval: "15 januari 2026",
    duurUitval: "2-4 weken",
  },
  situatieOverzicht: "Medewerker is uitgevallen en geeft aan dat de oorspronkelijke factoren nog deels van toepassing zijn. Er is sprake van een matige tot sterke impact op het dagelijks functioneren.",
  werkgerelateerd: "Uit de analyse blijkt dat creatieve werkzaamheden en nieuwe uitdagingen als energiegevend worden ervaren. Routinematige taken en langdurige vergaderingen worden als belastend ervaren.",
  omgevingsfactoren: "Medewerker heeft voorkeur voor een werkomgeving met balans tussen structuur en autonomie. Samenwerking wordt gewaardeerd, maar voldoende rust is belangrijk.",
  aanbevelingen: "Aanbevolen wordt om een geleidelijke re-integratie te overwegen, beginnend met taken die als energiegevend worden ervaren. Korte contactmomenten met het team kunnen ondersteunend werken.",
  status: "Samenvatting is door medewerker goedgekeurd en gedeeld met coach.",
}

export default function HRSummaryPage() {
  const [hasPermission, setHasPermission] = useState(false)

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-foreground">
                Extra toestemming vereist
              </h1>
              <p className="mb-6 text-muted-foreground">
                De HR-versie van de samenvatting bevat geanonimiseerde informatie 
                en is alleen toegankelijk met extra toestemming.
              </p>
              
              <div className="mb-6 rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center justify-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Dit is een demo-simulatie. In productie zou dit een echte toestemmingscontrole zijn.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Switch
                  id="permission"
                  checked={hasPermission}
                  onCheckedChange={setHasPermission}
                />
                <Label htmlFor="permission" className="cursor-pointer">
                  Simuleer extra toestemming
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Button variant="ghost" asChild>
              <Link href="/coach/demo/requests">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar coach dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">
                Samenvatting voor HR
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Minder persoonlijk, wel praktisch.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Met toestemming</span>
          </div>
        </div>
        
        {/* Permission notice */}
        <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Alleen zichtbaar omdat jij hier apart toestemming voor hebt gegeven.
            </p>
          </div>
        </div>

        {/* Employee Info Card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Medewerker informatie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Afdeling</p>
                <p className="font-medium text-foreground">{HR_SUMMARY.medewerkerInfo.afdeling}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Functie</p>
                <p className="font-medium text-foreground">{HR_SUMMARY.medewerkerInfo.functie}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start uitval</p>
                <p className="font-medium text-foreground">{HR_SUMMARY.medewerkerInfo.startDatumUitval}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duur uitval</p>
                <p className="font-medium text-foreground">{HR_SUMMARY.medewerkerInfo.duurUitval}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Sections */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Situatie overzicht</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {HR_SUMMARY.situatieOverzicht}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Werkgerelateerde factoren</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {HR_SUMMARY.werkgerelateerd}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Omgevingsfactoren</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {HR_SUMMARY.omgevingsfactoren}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Aanbevelingen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {HR_SUMMARY.aanbevelingen}
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>{HR_SUMMARY.status}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/coach/demo/requests">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar coach dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
