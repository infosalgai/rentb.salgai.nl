"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { NavHeader } from "@/components/nav-header"
import { ArrowLeft, ArrowRight, Sparkles, Info } from "lucide-react"

const TOTAL_STEPS = 6

// Step 1: Duration options
const DURATION_OPTIONS = [
  { value: "1-3-maanden", label: "1–3 maanden" },
  { value: "4-12-maanden", label: "4–12 maanden" },
  { value: "13-24-maanden", label: "13–24 maanden" },
  { value: "langer-dan-24-maanden", label: "Langer dan 24 maanden" },
]

// Step 2: Social impact items (updated)
const SOCIAL_ITEMS = [
  { id: "home", label: "Thuis / gezin" },
  { id: "family", label: "Familie" },
  { id: "friends", label: "Vrienden / kennissen / collega's" },
]

// Step 4: Energy items (fixed 8)
const ENERGY_ITEMS = [
  { id: "work", label: "Werk of werkachtige bezigheden" },
  { id: "physical", label: "Lichamelijke activiteit" },
  { id: "social", label: "Contact met anderen" },
  { id: "rest", label: "Rust / ontspanning" },
  { id: "admin", label: "Administratie / dingen organiseren" },
  { id: "meaningful", label: "Iets betekenisvols doen" },
  { id: "learning", label: "Nieuwe dingen leren" },
  { id: "structure", label: "Structuur / vaste planning" },
]

// Step 4: Signal categories with placeholders
const SIGNAL_CATEGORIES = [
  { id: "physical_signals", label: "Lichamelijk", placeholder: "bijv. gespannen spieren, slecht slapen" },
  { id: "mental_signals", label: "Mentaal", placeholder: "bijv. concentratie weg, piekeren" },
  { id: "emotional_signals", label: "Emotioneel", placeholder: "bijv. sneller boos, somber, snel geprikkeld" },
]

// Step 5: Contrast pairs
const CONTRASTS = [
  { id: "location", left: "Thuis", right: "Op pad" },
  { id: "pace", left: "Rust", right: "Drukte" },
  { id: "company", left: "Alleen", right: "Samen" },
  { id: "environment", left: "Binnen", right: "Buiten" },
  { id: "freedom", left: "Structuur", right: "Vrijheid" },
  { id: "tasks", left: "Korte taken", right: "Langere taken" },
  { id: "movement", left: "Licht bewegen", right: "Intens sporten" },
  { id: "stimuli", left: "Weinig prikkels", right: "Veel prikkels" },
]

// Step 6: Spark questions
const SPARK_QUESTIONS = [
  { id: "longtime", question: "Waar kun je lang mee bezig zijn?" },
  { id: "natural", question: "Wat doe je vanzelf als niemand kijkt?" },
  { id: "consume", question: "Wat kijk, lees of luister je op eigen initiatief?" },
  { id: "oldhobby", question: "Welke oude hobby zou je weer willen oppakken?" },
  { id: "learn", question: "Als je gratis iets kon leren, zonder doel, wat zou je kiezen?" },
]

interface FormData {
  // Step 1
  duration: string
  heaviness: number
  heavinessNote: string
  // Step 2
  socialImpact: Record<string, number>
  socialNote: string
  // Step 3
  originalReason: string
  originalReasonFit: number
  currentReason: string
  currentReasonFit: number
  // Step 4
  energyItems: Record<string, { type: "gives" | "neutral" | "costs"; intensity: number }>
  signals: Record<string, { level: number; example: string }>
  // Step 5
  contrasts: Record<string, { choice: "left" | "right"; helpIntensity: number; feelIntensity: number }>
  // Step 6
  sparkAnswers: Record<string, { text: string; energy: number }>
  finalNote: string
}

// "Waarom we dit vragen" component
function WhyWeAsk({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

// Transition sentence component
function TransitionSentence({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg bg-secondary/50 px-4 py-3 text-center text-sm text-muted-foreground italic">
      {children}
    </div>
  )
}

// Slider component with labels
function LikertSlider({ 
  value, 
  onChange, 
  labelMin, 
  labelMid,
  labelMax,
  showValue = true
}: { 
  value: number
  onChange: (value: number) => void
  labelMin: string
  labelMid?: string
  labelMax: string
  showValue?: boolean
}) {
  return (
    <div className="space-y-3">
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={7}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labelMin}</span>
        {labelMid && <span>{labelMid}</span>}
        <span>{labelMax}</span>
      </div>
      {showValue && (
        <div className="flex justify-center">
          <span className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {value}
          </span>
        </div>
      )}
    </div>
  )
}

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = ((currentStep) / totalSteps) * 100
  
  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between text-sm text-muted-foreground">
        <span>Stap {currentStep} van {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary">
        <div 
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Kies wat het beste past. Je kunt altijd terug.
      </p>
    </div>
  )
}

export default function FormPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Initialize form data with realistic demo defaults
  const [formData, setFormData] = useState<FormData>({
    duration: "4-12-maanden",
    heaviness: 5,
    heavinessNote: "",
    socialImpact: {
      home: 5,
      family: 3,
      friends: 4,
    },
    socialNote: "",
    originalReason: "Overspannenheid door werkdruk",
    originalReasonFit: 4,
    currentReason: "Combinatie van werkstress en privésituatie",
    currentReasonFit: 6,
    energyItems: ENERGY_ITEMS.reduce((acc, item) => ({
      ...acc,
      [item.id]: { type: "neutral" as const, intensity: 4 }
    }), {}),
    signals: SIGNAL_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: { level: 4, example: "" }
    }), {}),
    contrasts: CONTRASTS.reduce((acc, c) => ({
      ...acc,
      [c.id]: { choice: "left" as const, helpIntensity: 4, feelIntensity: 4 }
    }), {}),
    sparkAnswers: SPARK_QUESTIONS.reduce((acc, q) => ({
      ...acc,
      [q.id]: { text: "", energy: 4 }
    }), {}),
    finalNote: "",
  })

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      sessionStorage.setItem("navigatieFormData", JSON.stringify(formData))
      router.push("/run/demo/summary")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/start/demo")
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      // Step 1: Duration & Personal Experience
      case 1:
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-2 text-xl font-semibold text-primary">
                Stap 1 — Duur en beleving
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Hoe lang duurt je verzuim en hoe zwaar voelt het?
              </p>
              
              <WhyWeAsk>
                De duur en zwaarte van je verzuim helpen je coach om beter te begrijpen waar je nu staat. Dit is puur voor inzicht, niet voor beoordeling.
              </WhyWeAsk>
              
              {/* Duration */}
              <div className="mb-8">
                <Label className="mb-3 block font-medium text-foreground">
                  Hoe lang duurt je verzuim tot nu toe?
                </Label>
                <RadioGroup
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  className="space-y-3"
                >
                  {DURATION_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer text-foreground">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Heaviness */}
              <div className="mb-6">
                <Label className="mb-3 block font-medium text-foreground">
                  Hoe zwaar voelt dit voor jou op dit moment?
                </Label>
                <LikertSlider
                  value={formData.heaviness}
                  onChange={(value) => setFormData({ ...formData, heaviness: value })}
                  labelMin="1 = Het is te doen"
                  labelMid="4 = Wisselend"
                  labelMax="7 = Heel zwaar"
                />
              </div>
              
              {/* Optional note */}
              <div>
                <Label className="mb-2 block text-sm text-muted-foreground">
                  Optioneel: een korte toelichting (max 140 tekens)
                </Label>
                <Input
                  placeholder="bijv. gefrustreerd, onder druk, niet gehoord"
                  value={formData.heavinessNote}
                  onChange={(e) => setFormData({ ...formData, heavinessNote: e.target.value.slice(0, 140) })}
                  maxLength={140}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Geen namen, geen medische details.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      // Step 2: Social Impact (renamed)
      case 2:
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-2 text-xl font-semibold text-primary">
                Stap 2 — Wat merk je om je heen door je verzuim?
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Verzuim heeft vaak invloed op je dagelijks leven. Niet alleen op jou, maar ook op je omgeving. We vragen dit omdat het helpt om te begrijpen waar je steun krijgt en waar het extra ingewikkeld wordt.
              </p>
              
              <WhyWeAsk>
                Je omgeving zegt vaak iets over waar de druk zit en waar je steun vindt. Dit helpt je coach om een completer beeld te krijgen.
              </WhyWeAsk>
              
              <div className="space-y-8">
                {SOCIAL_ITEMS.map((item) => (
                  <div key={item.id}>
                    <Label className="mb-3 block font-medium text-foreground">
                      {item.label}
                    </Label>
                    <LikertSlider
                      value={formData.socialImpact[item.id]}
                      onChange={(value) => setFormData({
                        ...formData,
                        socialImpact: { ...formData.socialImpact, [item.id]: value }
                      })}
                      labelMin="1 = Bijna geen verandering"
                      labelMid="4 = Duidelijke verandering"
                      labelMax="7 = Heel grote verandering"
                    />
                  </div>
                ))}
              </div>
              
              {/* Optional note */}
              <div className="mt-8">
                <Label className="mb-2 block text-sm text-muted-foreground">
                  Als je wilt: 1 korte toelichting (geen namen, max 140 tekens)
                </Label>
                <Input
                  placeholder="Eventuele toelichting..."
                  value={formData.socialNote}
                  onChange={(e) => setFormData({ ...formData, socialNote: e.target.value.slice(0, 140) })}
                  maxLength={140}
                />
              </div>
            </CardContent>
          </Card>
        )

      // Step 3: Reason then vs now
      case 3:
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              {/* Transition from step 2 */}
              <TransitionSentence>
                Wat er om je heen gebeurt zegt vaak iets over waar de druk zit. Daarom kijken we nu naar de kernreden: toen en nu.
              </TransitionSentence>
              
              <h2 className="mb-2 text-xl font-semibold text-primary">
                Stap 3 — De reden voor je verzuim: toen en nu
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Je situatie kan veranderen. Soms is de reden van toen nog hetzelfde, soms verschuift het. Dit helpt je coach om beter aan te sluiten bij waar jij nu staat.
              </p>
              
              <WhyWeAsk>
                De oorspronkelijke reden en hoe je het nu ervaart kunnen verschillen. Dit inzicht helpt om de juiste ondersteuning te vinden.
              </WhyWeAsk>
              
              {/* Original reason */}
              <div className="mb-8">
                <Label className="mb-2 block font-medium text-foreground">
                  De reden die je toen doorgaf (kort)
                </Label>
                <Input
                  placeholder="max 120 tekens"
                  value={formData.originalReason}
                  onChange={(e) => setFormData({ ...formData, originalReason: e.target.value.slice(0, 120) })}
                  maxLength={120}
                  className="mb-2"
                />
                <p className="mb-4 text-xs text-muted-foreground">
                  Geen medische details. Beschrijf liever in gewone woorden wat het met je doet of wat je belemmert.
                </p>
                <Label className="mb-3 block text-sm text-muted-foreground">
                  Past dit nu nog?
                </Label>
                <LikertSlider
                  value={formData.originalReasonFit}
                  onChange={(value) => setFormData({ ...formData, originalReasonFit: value })}
                  labelMin="1 = Past helemaal niet meer"
                  labelMax="7 = Past nog precies"
                />
              </div>
              
              {/* Current reason */}
              <div>
                <Label className="mb-2 block font-medium text-foreground">
                  Als je het nu zou omschrijven: wat is nu de kern? (kort)
                </Label>
                <Input
                  placeholder="max 120 tekens"
                  value={formData.currentReason}
                  onChange={(e) => setFormData({ ...formData, currentReason: e.target.value.slice(0, 120) })}
                  maxLength={120}
                  className="mb-2"
                />
                <p className="mb-4 text-xs text-muted-foreground">
                  Geen medische details. Beschrijf liever in gewone woorden wat het met je doet of wat je belemmert.
                </p>
                <Label className="mb-3 block text-sm text-muted-foreground">
                  Hoe goed past dit?
                </Label>
                <LikertSlider
                  value={formData.currentReasonFit}
                  onChange={(value) => setFormData({ ...formData, currentReasonFit: value })}
                  labelMin="1 = Past niet"
                  labelMax="7 = Past heel goed"
                />
              </div>
            </CardContent>
          </Card>
        )

      // Step 4: Energy & Signals
      case 4:
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              {/* Transition from step 3 */}
              <TransitionSentence>
                Als we weten wat de kern is, helpt het om te zien wat je belast en wat je juist helpt herstellen.
              </TransitionSentence>
              
              <h2 className="mb-2 text-xl font-semibold text-primary">
                Stap 4 — Energie: wat kost en wat helpt?
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Als je weet wat energie kost en wat energie geeft, kun je beter doseren. Dit is geen test; het is bedoeld om je coach inzicht te geven in wat jou helpt herstellen.
              </p>
              
              <WhyWeAsk>
                Inzicht in je energiebalans helpt om te begrijpen wat je nodig hebt om te herstellen en waar je grenzen liggen.
              </WhyWeAsk>
              
              {/* Energy items */}
              <div className="mb-8 space-y-6">
                <h3 className="font-medium text-foreground">Energie-items</h3>
                {ENERGY_ITEMS.map((item) => {
                  const itemData = formData.energyItems[item.id]
                  return (
                    <div key={item.id} className="rounded-lg border border-border p-4">
                      <Label className="mb-3 block font-medium text-foreground">
                        {item.label}
                      </Label>
                      <RadioGroup
                        value={itemData.type}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          energyItems: {
                            ...formData.energyItems,
                            [item.id]: { ...itemData, type: value as "gives" | "neutral" | "costs" }
                          }
                        })}
                        className="mb-3 flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gives" id={`${item.id}-gives`} />
                          <Label htmlFor={`${item.id}-gives`} className="cursor-pointer text-sm">Geeft energie</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="neutral" id={`${item.id}-neutral`} />
                          <Label htmlFor={`${item.id}-neutral`} className="cursor-pointer text-sm">Neutraal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="costs" id={`${item.id}-costs`} />
                          <Label htmlFor={`${item.id}-costs`} className="cursor-pointer text-sm">Kost energie</Label>
                        </div>
                      </RadioGroup>
                      {itemData.type !== "neutral" && (
                        <LikertSlider
                          value={itemData.intensity}
                          onChange={(value) => setFormData({
                            ...formData,
                            energyItems: {
                              ...formData.energyItems,
                              [item.id]: { ...itemData, intensity: value }
                            }
                          })}
                          labelMin="1 = Beetje"
                          labelMax="7 = Heel veel"
                          showValue={false}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Signals */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground">Hoe merk je dat je over je grens gaat?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Soms geeft je lichaam of je hoofd eerder signalen dan je zelf doorhebt. Kies hoe duidelijk je dit herkent en geef (als je wilt) een kort voorbeeld.
                  </p>
                </div>
                {SIGNAL_CATEGORIES.map((cat) => {
                  const signalData = formData.signals[cat.id]
                  return (
                    <div key={cat.id} className="rounded-lg border border-border p-4">
                      <Label className="mb-3 block font-medium text-foreground">
                        {cat.label}
                      </Label>
                      <LikertSlider
                        value={signalData.level}
                        onChange={(value) => setFormData({
                          ...formData,
                          signals: {
                            ...formData.signals,
                            [cat.id]: { ...signalData, level: value }
                          }
                        })}
                        labelMin="1 = Ik herken dit nauwelijks"
                        labelMax="7 = Heel duidelijk"
                      />
                      <Input
                        placeholder={cat.placeholder}
                        value={signalData.example}
                        onChange={(e) => setFormData({
                          ...formData,
                          signals: {
                            ...formData.signals,
                            [cat.id]: { ...signalData, example: e.target.value.slice(0, 80) }
                          }
                        })}
                        maxLength={80}
                        className="mt-3"
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )

      // Step 5: Contrasts (reframed)
      case 5:
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-2 text-xl font-semibold text-primary">
                Stap 5 — Wanneer heb je het minste last?
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                We willen begrijpen in welke situaties je klachten minder op de voorgrond staan. Dat zegt vaak iets over wat voor jou werkt. Kies per paar wat het beste past en geef aan hoe dat voor je voelt.
              </p>
              
              <WhyWeAsk>
                Begrijpen wanneer je klachten minder zijn, helpt om te ontdekken welke omstandigheden jou goed doen.
              </WhyWeAsk>
              
              <div className="space-y-6">
                {CONTRASTS.map((contrast) => {
                  const contrastData = formData.contrasts[contrast.id]
                  return (
                    <div key={contrast.id} className="rounded-lg border border-border p-4">
                      <div className="mb-4 flex items-center justify-center gap-4">
                        <span className={`rounded px-3 py-1.5 text-sm font-medium ${contrastData.choice === "left" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                          {contrast.left}
                        </span>
                        <span className="text-muted-foreground">of</span>
                        <span className={`rounded px-3 py-1.5 text-sm font-medium ${contrastData.choice === "right" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                          {contrast.right}
                        </span>
                      </div>
                      <RadioGroup
                        value={contrastData.choice}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          contrasts: {
                            ...formData.contrasts,
                            [contrast.id]: { ...contrastData, choice: value as "left" | "right" }
                          }
                        })}
                        className="mb-4 flex justify-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="left" id={`${contrast.id}-left`} />
                          <Label htmlFor={`${contrast.id}-left`} className="cursor-pointer text-sm">{contrast.left}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="right" id={`${contrast.id}-right`} />
                          <Label htmlFor={`${contrast.id}-right`} className="cursor-pointer text-sm">{contrast.right}</Label>
                        </div>
                      </RadioGroup>
                      
                      {/* Scale 1: How much does this help? */}
                      <div className="mb-4">
                        <Label className="mb-2 block text-sm text-muted-foreground">
                          Hoe helpt dit jou (minste last)?
                        </Label>
                        <LikertSlider
                          value={contrastData.helpIntensity}
                          onChange={(value) => setFormData({
                            ...formData,
                            contrasts: {
                              ...formData.contrasts,
                              [contrast.id]: { ...contrastData, helpIntensity: value }
                            }
                          })}
                          labelMin="1 = Helpt bijna niet"
                          labelMax="7 = Helpt heel erg"
                          showValue={false}
                        />
                      </div>
                      
                      {/* Scale 2: How does it feel? */}
                      <div>
                        <Label className="mb-2 block text-sm text-muted-foreground">
                          Hoe voelt dat voor je?
                        </Label>
                        <LikertSlider
                          value={contrastData.feelIntensity}
                          onChange={(value) => setFormData({
                            ...formData,
                            contrasts: {
                              ...formData.contrasts,
                              [contrast.id]: { ...contrastData, feelIntensity: value }
                            }
                          })}
                          labelMin="1 = Onprettig / zwaar"
                          labelMax="7 = Prettig / licht"
                          showValue={false}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )

      // Step 6: Spark / Interest
      case 6:
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-2 text-xl font-semibold text-primary">
                Stap 6 — Wat geeft je een vonk?
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Vijf korte vragen over wat je energie of plezier geeft.
              </p>
              
              <WhyWeAsk>
                Wat je energie geeft zegt iets over wat je drijft. Dit helpt om te kijken naar mogelijkheden die bij je passen.
              </WhyWeAsk>
              
              <div className="space-y-6">
                {SPARK_QUESTIONS.map((q) => {
                  const sparkData = formData.sparkAnswers[q.id]
                  return (
                    <div key={q.id} className="rounded-lg border border-border p-4">
                      <Label className="mb-3 block font-medium text-foreground">
                        {q.question}
                      </Label>
                      <Input
                        placeholder="max 120 tekens"
                        value={sparkData.text}
                        onChange={(e) => setFormData({
                          ...formData,
                          sparkAnswers: {
                            ...formData.sparkAnswers,
                            [q.id]: { ...sparkData, text: e.target.value.slice(0, 120) }
                          }
                        })}
                        maxLength={120}
                        className="mb-4"
                      />
                      <Label className="mb-2 block text-sm text-muted-foreground">
                        Hoeveel energie of plezier geeft dit je?
                      </Label>
                      <LikertSlider
                        value={sparkData.energy}
                        onChange={(value) => setFormData({
                          ...formData,
                          sparkAnswers: {
                            ...formData.sparkAnswers,
                            [q.id]: { ...sparkData, energy: value }
                          }
                        })}
                        labelMin="1 = Weinig"
                        labelMax="7 = Heel veel"
                        showValue={false}
                      />
                    </div>
                  )
                })}
              </div>
              
              {/* Final optional note */}
              <div className="mt-8">
                <Label className="mb-2 block text-sm text-muted-foreground">
                  Is er nog iets belangrijks voor je samenvatting? (max 140 tekens)
                </Label>
                <Textarea
                  placeholder="Optioneel..."
                  value={formData.finalNote}
                  onChange={(e) => setFormData({ ...formData, finalNote: e.target.value.slice(0, 140) })}
                  maxLength={140}
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader backHref="/start/demo" />
      
      <main className="mx-auto max-w-[900px] px-4 py-6">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        {renderStep()}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-xl bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90"
          >
            {currentStep === TOTAL_STEPS ? (
              <>
                <Sparkles className="h-4 w-4" />
                Maak samenvatting
              </>
            ) : (
              <>
                Volgende
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        {currentStep === TOTAL_STEPS && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            De samenvatting is een concept. Jij controleert en beslist of het klopt.
          </p>
        )}
      </main>
    </div>
  )
}
