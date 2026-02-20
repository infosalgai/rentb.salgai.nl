"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { NavHeader } from "@/components/nav-header"
import { Shield, Lock, User, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

export default function StartPage() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const handleStart = () => {
    if (agreed) {
      router.push("/run/demo/form")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader showBack={false} />
      
      <main className="mx-auto max-w-[900px] px-4 py-8">
        <Card className="mx-auto max-w-2xl rounded-2xl shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {/* Title */}
            <h1 className="mb-6 text-center text-2xl font-semibold text-primary">
              Voordat je begint
            </h1>

            {/* Explanation */}
            <div className="mb-8 space-y-4 text-foreground">
              <h2 className="text-lg font-medium">
                Wat is een navigatiegesprek?
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Dit gesprek is specifiek voor jou, aanvullend op de reguliere verzuimbegeleiding.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>De focus ligt op jou, niet op verplichtingen of regels.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Een veilige setting: jij bepaalt wat je deelt.</span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                De coach is een adviseur, geen verkoper, geen druk. Alleen jouw samenvatting gaat naar de navigatiecoach, en de coach werkt onder geheimhouding.
              </p>
              
              {/* Bekijk meer button */}
              <Button
                variant="ghost"
                onClick={() => setShowMore(!showMore)}
                className="mt-2 h-auto p-0 text-primary hover:bg-transparent hover:text-primary/80"
              >
                {showMore ? (
                  <>
                    Verberg uitleg
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Bekijk meer
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
              
              {/* Expanded content */}
              {showMore && (
                <div className="mt-4 space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
                  <Image
                    src="/images/verzuimlandschap.png"
                    alt="De drie aandachtsgebieden in het verzuimlandschap: Preventie, Curatief en WIA-fase"
                    width={600}
                    height={300}
                    className="w-full rounded-lg"
                  />
                  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      Een navigatiegesprek is een verzuiminstrument wat speciaal voor jou als werknemer is ontwikkeld. Let op, het is geen vervanger van de verplichtingen die je bij verzuim volgens de Wet verbetering poortwachter hebt. Een navigatiegesprek wordt op jouw verzoek naast de standaard verzuimbegeleiding ingezet en heeft niet de wet of andere verplichtingen als focus.
                    </p>
                    <p>
                      Jij staat in het middelpunt en het gesprek gaat dus vooral over jou. Je verzuimt inmiddels al een tijd of de verwachting is dat het lang zal gaan duren en daarover ga je met jouw navigatiecoach in gesprek. Die komt jou niet vertellen wat je moet, wil je niets verkopen of opdringen, niets van dat alles.
                    </p>
                    <p>
                      Je krijgt de ruimte om te delen wat het voor je betekent om zo lang te verzuimen en wat de echte oorzaken zijn. Maar ook wat jouw interesses qua werk zijn, vooral wanneer jij daar niet naar gevraagd bent. Bij verzuim gaat het meestal over jou en steeds minder met jou. Dat kun je met een navigatiegesprek doorbreken.
                    </p>
                    <p>
                      De informatie die tijdens het gesprek naar boven komt wordt niet gedeeld tenzij jij dat expliciet aangeeft. Een navigatiegesprek is dus boven alles een veilig gesprek dat niet naar de leidinggevende of HR gaat. Of dat toch gebeurt en wanneer dat gebeurt bepaal jij en je navigatiecoach is daarvoor een adviseur die je kunt vertrouwen.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Data ownership */}
            <div className="mb-8 rounded-xl border border-border bg-secondary/50 p-4">
              <h3 className="mb-3 font-medium text-foreground">
                Wat gebeurt er met jouw gegevens?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Jij bent eigenaar van je data
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Je leidinggevende en HR ontvangen niets
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Pas na jouw goedkeuring wordt de samenvatting naar je coach gestuurd
                </li>
              </ul>
            </div>

            {/* Agreement checkbox */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-border p-4">
              <Checkbox
                id="agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="agreement"
                className="cursor-pointer text-sm leading-relaxed text-foreground"
              >
                Ik begrijp dit en ga akkoord met deze werkwijze
              </label>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleStart}
              disabled={!agreed}
              className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Start vragenlijst
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
