"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { NavHeader } from "@/components/nav-header"
import { AppFooter } from "@/components/app-footer"
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, Send, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getDemoContext } from "@/lib/demo-data"

// ── Options ──

const HOOFDOORZAAK_OPTIONS = [
  { id: "werkdruk", label: "Werkdruk / stress" },
  { id: "samenwerking", label: "Samenwerking of conflict" },
  { id: "prive", label: "Privé-omstandigheden" },
  { id: "energie", label: "Energie (fysiek of mentaal)" },
  { id: "combinatie", label: "Combinatie werk en privé" },
  { id: "incident", label: "Een incident" },
  { id: "anders", label: "Anders" },
]

const FACTOREN_PRIVE = [
  "Mantelzorg",
  "Relatie / thuissituatie",
  "Kinderen / gezin",
  "Financiële zorgen",
  "Rouw / verlies",
]

const FACTOREN_WERK = [
  "Slaapproblemen / uitputting",
  "Lichamelijke klachten",
  "Onzekerheid / angst / piekeren",
  "Werkdruk / uren",
  "Conflict op werk",
]

const SINDS_OPTIONS = [
  { id: "vandaag", label: "Vandaag" },
  { id: "dagen", label: "Enkele dagen" },
  { id: "weken", label: "Enkele weken" },
  { id: "maanden", label: "Enkele maanden" },
  { id: "langer", label: "Langer dan 6 maanden" },
]

const SIGNALEN_OPTIONS = [
  "Minder energie",
  "Minder concentratie",
  "Emotioneel reageren",
  "Meer fouten",
  "Terugtrekken",
  "Fysieke klachten",
]

const DOEL_OPTIONS = [
  "Rust en overzicht krijgen",
  "Helder krijgen wat er echt speelt",
  "Concrete stappen voor de komende 1-2 weken",
  "Grenzen en afspraken bepalen",
  "Gesprek met werk voorbereiden",
  "Samen oplossingen bespreken",
  "Bepalen of time-out voldoende is",
]

const WERKDRUK_DRUK = [
  "Te veel taken",
  "Deadlines / tempo",
  "Onderbezetting",
  "Emotioneel belastend werk",
  "Weinig invloed",
  "Onduidelijke prioriteiten",
]

const WERKDRUK_DUUR = [
  { id: "kort", label: "Kort" },
  { id: "weken", label: "Enkele weken" },
  { id: "maanden", label: "Enkele maanden" },
  { id: "lang", label: "Langere tijd" },
]

const WERKDRUK_GEPROBEERD = [
  "Gesprek collega",
  "Gesprek leidinggevende",
  "Taken aangepast",
  "Uren aangepast",
  "Rust genomen",
  "Nog niets",
]

const WERKDRUK_HELPT = [
  { id: "minder-taken", label: "Minder taken" },
  { id: "duidelijkheid", label: "Meer duidelijkheid" },
  { id: "rust", label: "Tijdelijke rust" },
  { id: "sparren", label: "Iemand om mee te sparren" },
  { id: "anders", label: "Anders" },
]

const CONFLICT_MET = [
  { id: "collega", label: "Collega" },
  { id: "leidinggevende", label: "Leidinggevende" },
  { id: "team", label: "Team" },
  { id: "extern", label: "Externe partij" },
]

const CONFLICT_WAAROVER = [
  "Communicatie",
  "Verwachtingen",
  "Gedrag / veiligheid",
  "Beoordeling",
  "Grenzen",
  "Vertrouwen",
]

const CONFLICT_UITKOMST = [
  { id: "voorbereiden", label: "Gesprek voorbereiden" },
  { id: "bemiddeling", label: "Bemiddeling" },
  { id: "grenzen", label: "Grenzen bepalen" },
  { id: "ordenen", label: "Verhaal ordenen" },
]

const PRIVE_WAAROVER = [
  "Mantelzorg",
  "Relatie / thuissituatie",
  "Kinderen / gezin",
  "Gezondheid",
  "Rouw / verlies",
  "Financiën",
  "Wonen",
]

const PRIVE_NODIG = [
  "Flexibele werktijden",
  "Minder uren",
  "Thuiswerken",
  "Andere taken",
  "Rust zonder uitleg",
  "Duidelijke afbakening",
]

const ENERGIE_MERKT = [
  "Vermoeidheid",
  "Slecht slapen",
  "Overprikkeld",
  "Pijn",
  "Piekeren / angst",
  "Herstel gaat traag",
]

const CLOSING_OPTIONS = [
  "Meer rust en ruimte",
  "Flexibele werktijden",
  "Tijdelijk minder uren",
  "Praktische hulp bij planning",
  "Iemand om mee te sparren",
  "Duidelijke grenzen en prioriteiten",
]

const TERUGKOPPELING_OPTIONS = [
  { id: "praktisch", label: "Ja, alleen praktisch (uren / taken / planning)" },
  { id: "thema", label: "Ja, ook het hoofdthema in één zin" },
  { id: "na-gesprek", label: "Ja, maar pas na het Time-out gesprek" },
  { id: "nee", label: "Nee, nog niet" },
]

// ── Form state ──
interface FormData {
  hoofdoorzaak: string
  andersText: string
  zwaarte: number
  factoren: string[]
  sinds: string
  risico: number
  signalen: string[]
  doelen: string[]
  belangrijkheid: number
  werkdrukDruk: string[]
  werkdrukDuur: string
  werkdrukGeprobeerd: string[]
  werkdrukHelpt: string
  werkdrukHelptAnders: string
  conflictMet: string
  conflictWaarover: string[]
  conflictVeilig: number
  conflictContact: string
  conflictUitkomst: string
  priveWaarover: string[]
  priveDelen: string
  priveDelenText: string
  priveNodig: string[]
  mantelzorgVoor: string
  mantelzorgZwaar: number
  mantelzorgKnelt: string
  relatieWat: string
  relatieMerkt: string
  kinderenWat: string
  kinderenKnelpunt: string
  energieMerkt: string[]
  energieZorg: string[]
  energieHulp: string
  combinatieVerdeling: number
  combinatieVerandering: string
  closingNodig: string[]
  closingBelangrijk: number
  randWelBereiken: string
  randNietBereiken: string
  terugkoppeling: string
  terugkoppelingAkkoord: boolean
}

const initialFormData: FormData = {
  hoofdoorzaak: "",
  andersText: "",
  zwaarte: 4,
  factoren: [],
  sinds: "",
  risico: 4,
  signalen: [],
  doelen: [],
  belangrijkheid: 4,
  werkdrukDruk: [],
  werkdrukDuur: "",
  werkdrukGeprobeerd: [],
  werkdrukHelpt: "",
  werkdrukHelptAnders: "",
  conflictMet: "",
  conflictWaarover: [],
  conflictVeilig: 4,
  conflictContact: "",
  conflictUitkomst: "",
  priveWaarover: [],
  priveDelen: "",
  priveDelenText: "",
  priveNodig: [],
  mantelzorgVoor: "",
  mantelzorgZwaar: 4,
  mantelzorgKnelt: "",
  relatieWat: "",
  relatieMerkt: "",
  kinderenWat: "",
  kinderenKnelpunt: "",
  energieMerkt: [],
  energieZorg: [],
  energieHulp: "",
  combinatieVerdeling: 50,
  combinatieVerandering: "",
  closingNodig: [],
  closingBelangrijk: 4,
  randWelBereiken: "",
  randNietBereiken: "",
  terugkoppeling: "",
  terugkoppelingAkkoord: false,
}

// ── Reusable components ──

function SelectCard({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function CheckboxList({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
        >
          <Checkbox checked={selected.includes(opt)} onCheckedChange={() => onToggle(opt)} />
          <span className="text-sm text-muted-foreground">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function ChipSelect({ options, selected, onToggle, max }: { options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt)
        const isDisabled = !isSelected && max !== undefined && selected.length >= max
        return (
          <button
            key={opt}
            type="button"
            onClick={() => !isDisabled && onToggle(opt)}
            disabled={isDisabled}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-primary"
                : isDisabled
                  ? "cursor-not-allowed border-border bg-card text-muted-foreground/40"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function ScaleSlider({ value, onChange, labelLeft, labelMid, labelRight }: { value: number; onChange: (v: number) => void; labelLeft: string; labelMid: string; labelRight: string }) {
  return (
    <div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={1} max={7} step={1} className="w-full" />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>1 = {labelLeft}</span>
        <span>4 = {labelMid}</span>
        <span>7 = {labelRight}</span>
      </div>
    </div>
  )
}

// ── Step definition ──
// Each "screen" the user sees is one focused question block

interface Screen {
  id: string
  group: string // For the top progress bar
  title: string
  subtitle?: string
  render: (fd: FormData, update: (p: Partial<FormData>) => void, toggleMulti: (field: keyof FormData, value: string, max?: number) => void) => React.ReactNode
  isVisible?: (fd: FormData) => boolean
}

function buildScreens(): Screen[] {
  return [
    // ─── GROUP 1: SITUATIE ───
    {
      id: "hoofdoorzaak",
      group: "Situatie",
      title: "Wat brengt jou tot deze aanvraag?",
      subtitle: "Kies wat nu het meest speelt.",
      render: (fd, update) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {HOOFDOORZAAK_OPTIONS.map((opt) => (
              <SelectCard key={opt.id} selected={fd.hoofdoorzaak === opt.id} onClick={() => update({ hoofdoorzaak: opt.id })} label={opt.label} />
            ))}
          </div>
          {fd.hoofdoorzaak === "anders" && (
            <div className="mt-4">
              <Input value={fd.andersText} onChange={(e) => update({ andersText: e.target.value })} placeholder="Kort omschrijven..." maxLength={100} />
            </div>
          )}
        </>
      ),
    },
    {
      id: "zwaarte",
      group: "Situatie",
      title: "Hoe zwaar voelt dit voor je op dit moment?",
      render: (fd, update) => (
        <ScaleSlider value={fd.zwaarte} onChange={(v) => update({ zwaarte: v })} labelLeft="Licht" labelMid="Gemiddeld" labelRight="Zeer zwaar" />
      ),
    },
    {
      id: "factoren",
      group: "Situatie",
      title: "Spelen er nog andere factoren mee?",
      subtitle: "Meerdere mogelijk, optioneel.",
      render: (fd, _, toggleMulti) => (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Priv\u00e9 / persoonlijk</h4>
            <CheckboxList options={FACTOREN_PRIVE} selected={fd.factoren} onToggle={(v) => toggleMulti("factoren", v)} />
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Werk & energie</h4>
            <CheckboxList options={FACTOREN_WERK} selected={fd.factoren} onToggle={(v) => toggleMulti("factoren", v)} />
          </div>
        </div>
      ),
    },
    {
      id: "sinds",
      group: "Situatie",
      title: "Sinds wanneer speelt dit?",
      render: (fd, update) => (
        <RadioGroup value={fd.sinds} onValueChange={(v) => update({ sinds: v })} className="space-y-2">
          {SINDS_OPTIONS.map((opt) => (
            <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value={opt.id} id={`sinds-${opt.id}`} />
              <Label htmlFor={`sinds-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "risico",
      group: "Situatie",
      title: "Hoe groot is de kans dat dit zonder verandering richting verzuim gaat?",
      render: (fd, update) => (
        <ScaleSlider value={fd.risico} onChange={(v) => update({ risico: v })} labelLeft="Nauwelijks" labelMid="Twijfel" labelRight="Zeer groot" />
      ),
    },
    {
      id: "signalen",
      group: "Situatie",
      title: "Welke signalen herken je bij jezelf op het werk?",
      subtitle: "Meerdere mogelijk.",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={SIGNALEN_OPTIONS} selected={fd.signalen} onToggle={(v) => toggleMulti("signalen", v)} />
      ),
    },
    {
      id: "doelen",
      group: "Situatie",
      title: "Wat wil je uit het eerste gesprek halen?",
      subtitle: "Kies maximaal 2.",
      render: (fd, update, toggleMulti) => (
        <>
          <ChipSelect options={DOEL_OPTIONS} selected={fd.doelen} onToggle={(v) => toggleMulti("doelen", v, 2)} max={2} />
          {fd.doelen.length >= 2 && (
            <p className="mt-2 text-xs text-muted-foreground">Maximum bereikt. Deselecteer er een om te wisselen.</p>
          )}
        </>
      ),
    },
    {
      id: "belangrijkheid",
      group: "Situatie",
      title: "Hoe belangrijk is dit gesprek voor je op dit moment?",
      render: (fd, update) => (
        <ScaleSlider value={fd.belangrijkheid} onChange={(v) => update({ belangrijkheid: v })} labelLeft="Handig" labelMid="Belangrijk" labelRight="Noodzakelijk" />
      ),
    },

    // ─── GROUP 2: VERDIEPING ───

    // Route A: Werkdruk
    {
      id: "werkdruk-druk",
      group: "Verdieping",
      title: "Wat geeft je nu de meeste druk?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "werkdruk" || fd.hoofdoorzaak === "incident",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={WERKDRUK_DRUK} selected={fd.werkdrukDruk} onToggle={(v) => toggleMulti("werkdrukDruk", v)} />
      ),
    },
    {
      id: "werkdruk-duur",
      group: "Verdieping",
      title: "Hoe lang speelt dit al?",
      isVisible: (fd) => fd.hoofdoorzaak === "werkdruk" || fd.hoofdoorzaak === "incident",
      render: (fd, update) => (
        <RadioGroup value={fd.werkdrukDuur} onValueChange={(v) => update({ werkdrukDuur: v })} className="space-y-2">
          {WERKDRUK_DUUR.map((opt) => (
            <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value={opt.id} id={`wd-${opt.id}`} />
              <Label htmlFor={`wd-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "werkdruk-geprobeerd",
      group: "Verdieping",
      title: "Wat heb je al geprobeerd?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "werkdruk" || fd.hoofdoorzaak === "incident",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={WERKDRUK_GEPROBEERD} selected={fd.werkdrukGeprobeerd} onToggle={(v) => toggleMulti("werkdrukGeprobeerd", v)} />
      ),
    },
    {
      id: "werkdruk-helpt",
      group: "Verdieping",
      title: "Wat zou de komende 1-2 weken het meest helpen?",
      isVisible: (fd) => fd.hoofdoorzaak === "werkdruk" || fd.hoofdoorzaak === "incident",
      render: (fd, update) => (
        <>
          <RadioGroup value={fd.werkdrukHelpt} onValueChange={(v) => update({ werkdrukHelpt: v })} className="space-y-2">
            {WERKDRUK_HELPT.map((opt) => (
              <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value={opt.id} id={`wh-${opt.id}`} />
                <Label htmlFor={`wh-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {fd.werkdrukHelpt === "anders" && (
            <Input className="mt-3" value={fd.werkdrukHelptAnders} onChange={(e) => update({ werkdrukHelptAnders: e.target.value })} placeholder="Wat zou helpen?" maxLength={200} />
          )}
        </>
      ),
    },

    // Route B: Samenwerking
    {
      id: "conflict-met",
      group: "Verdieping",
      title: "Met wie speelt dit vooral?",
      isVisible: (fd) => fd.hoofdoorzaak === "samenwerking",
      render: (fd, update) => (
        <RadioGroup value={fd.conflictMet} onValueChange={(v) => update({ conflictMet: v })} className="space-y-2">
          {CONFLICT_MET.map((opt) => (
            <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value={opt.id} id={`cm-${opt.id}`} />
              <Label htmlFor={`cm-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "conflict-waarover",
      group: "Verdieping",
      title: "Waar gaat het vooral over?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "samenwerking",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={CONFLICT_WAAROVER} selected={fd.conflictWaarover} onToggle={(v) => toggleMulti("conflictWaarover", v)} />
      ),
    },
    {
      id: "conflict-veilig",
      group: "Verdieping",
      title: "Hoe veilig voelt het om dit intern te bespreken?",
      isVisible: (fd) => fd.hoofdoorzaak === "samenwerking",
      render: (fd, update) => (
        <ScaleSlider value={fd.conflictVeilig} onChange={(v) => update({ conflictVeilig: v })} labelLeft="Onveilig" labelMid="Neutraal" labelRight="Veilig" />
      ),
    },
    {
      id: "conflict-contact",
      group: "Verdieping",
      title: "Mag er contact zijn met je leidinggevende hierover?",
      isVisible: (fd) => fd.hoofdoorzaak === "samenwerking",
      render: (fd, update) => (
        <RadioGroup value={fd.conflictContact} onValueChange={(v) => update({ conflictContact: v })} className="space-y-2">
          {[{ id: "ja", label: "Ja" }, { id: "nee", label: "Nee" }, { id: "weet-niet", label: "Weet ik nog niet" }].map((opt) => (
            <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value={opt.id} id={`cc-${opt.id}`} />
              <Label htmlFor={`cc-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "conflict-uitkomst",
      group: "Verdieping",
      title: "Gewenste uitkomst van het gesprek",
      isVisible: (fd) => fd.hoofdoorzaak === "samenwerking",
      render: (fd, update) => (
        <RadioGroup value={fd.conflictUitkomst} onValueChange={(v) => update({ conflictUitkomst: v })} className="space-y-2">
          {CONFLICT_UITKOMST.map((opt) => (
            <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value={opt.id} id={`cu-${opt.id}`} />
              <Label htmlFor={`cu-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },

    // Route C: Privé
    {
      id: "prive-waarover",
      group: "Verdieping",
      title: "Waar gaat het vooral over?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "prive",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={PRIVE_WAAROVER} selected={fd.priveWaarover} onToggle={(v) => toggleMulti("priveWaarover", v)} />
      ),
    },
    {
      id: "prive-delen",
      group: "Verdieping",
      title: "Wil je vooraf al iets delen?",
      isVisible: (fd) => fd.hoofdoorzaak === "prive",
      render: (fd, update) => (
        <>
          <RadioGroup value={fd.priveDelen} onValueChange={(v) => update({ priveDelen: v })} className="space-y-2">
            {[{ id: "ja", label: "Ja, kort" }, { id: "gesprek", label: "Liever tijdens het gesprek" }, { id: "niet", label: "Liever niet" }].map((opt) => (
              <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value={opt.id} id={`pd-${opt.id}`} />
                <Label htmlFor={`pd-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {fd.priveDelen === "ja" && (
            <Textarea className="mt-3" value={fd.priveDelenText} onChange={(e) => update({ priveDelenText: e.target.value })} placeholder="Vertel kort wat je wilt delen..." maxLength={300} rows={3} />
          )}
        </>
      ),
    },
    {
      id: "prive-nodig",
      group: "Verdieping",
      title: "Wat heb je vanuit werk het meest nodig?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "prive",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={PRIVE_NODIG} selected={fd.priveNodig} onToggle={(v) => toggleMulti("priveNodig", v)} />
      ),
    },
    // Privé sub-questions
    {
      id: "mantelzorg",
      group: "Verdieping",
      title: "Mantelzorg - extra vragen",
      subtitle: "Omdat je mantelzorg hebt aangevinkt.",
      isVisible: (fd) => fd.hoofdoorzaak === "prive" && fd.priveWaarover.includes("Mantelzorg"),
      render: (fd, update) => (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm">Voor wie zorg je?</Label>
            <Input value={fd.mantelzorgVoor} onChange={(e) => update({ mantelzorgVoor: e.target.value })} placeholder="Bijv. ouder, partner, kind..." maxLength={100} />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Hoe zwaar is dit?</Label>
            <ScaleSlider value={fd.mantelzorgZwaar} onChange={(v) => update({ mantelzorgZwaar: v })} labelLeft="Licht" labelMid="Gemiddeld" labelRight="Zeer zwaar" />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Wat knelt het meest?</Label>
            <Input value={fd.mantelzorgKnelt} onChange={(e) => update({ mantelzorgKnelt: e.target.value })} placeholder="Bijv. combinatie met werk, emotioneel..." maxLength={200} />
          </div>
        </div>
      ),
    },
    {
      id: "relatie",
      group: "Verdieping",
      title: "Relatie / thuis - extra vragen",
      subtitle: "Omdat je relatie/thuissituatie hebt aangevinkt.",
      isVisible: (fd) => fd.hoofdoorzaak === "prive" && fd.priveWaarover.includes("Relatie / thuissituatie"),
      render: (fd, update) => (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm">Wat past het best?</Label>
            <Input value={fd.relatieWat} onChange={(e) => update({ relatieWat: e.target.value })} placeholder="Kort omschrijven..." maxLength={200} />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Waar merk je dit vooral in?</Label>
            <Input value={fd.relatieMerkt} onChange={(e) => update({ relatieMerkt: e.target.value })} placeholder="Bijv. concentratie, slaap, stemming..." maxLength={200} />
          </div>
        </div>
      ),
    },
    {
      id: "kinderen",
      group: "Verdieping",
      title: "Kinderen / gezin - extra vragen",
      subtitle: "Omdat je kinderen/gezin hebt aangevinkt.",
      isVisible: (fd) => fd.hoofdoorzaak === "prive" && fd.priveWaarover.includes("Kinderen / gezin"),
      render: (fd, update) => (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm">Wat speelt vooral?</Label>
            <Input value={fd.kinderenWat} onChange={(e) => update({ kinderenWat: e.target.value })} placeholder="Kort omschrijven..." maxLength={200} />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Grootste knelpunt richting verzuim?</Label>
            <Input value={fd.kinderenKnelpunt} onChange={(e) => update({ kinderenKnelpunt: e.target.value })} placeholder="Bijv. tijd, energie, stress..." maxLength={200} />
          </div>
        </div>
      ),
    },

    // Route D: Energie
    {
      id: "energie-merkt",
      group: "Verdieping",
      title: "Wat merk je vooral?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "energie",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={ENERGIE_MERKT} selected={fd.energieMerkt} onToggle={(v) => toggleMulti("energieMerkt", v)} />
      ),
    },
    {
      id: "energie-zorg",
      group: "Verdieping",
      title: "Wat is je grootste zorg als dit zo doorgaat?",
      subtitle: "Meerdere opties mogelijk.",
      isVisible: (fd) => fd.hoofdoorzaak === "energie",
      render: (fd, _, toggleMulti) => (
        <CheckboxList
          options={["Uitval / verzuim", "Relatie onder druk", "Niet meer kunnen functioneren", "Geen energie meer voor priv\u00e9", "Fouten op het werk"]}
          selected={fd.energieZorg}
          onToggle={(v) => toggleMulti("energieZorg", v)}
        />
      ),
    },
    {
      id: "energie-hulp",
      group: "Verdieping",
      title: "Is er al professionele hulp gezocht?",
      isVisible: (fd) => fd.hoofdoorzaak === "energie",
      render: (fd, update) => (
        <RadioGroup value={fd.energieHulp} onValueChange={(v) => update({ energieHulp: v })} className="space-y-2">
          {[{ id: "ja", label: "Ja" }, { id: "nee", label: "Nee" }, { id: "liever-niet", label: "Liever niet zeggen" }].map((opt) => (
            <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
              <RadioGroupItem value={opt.id} id={`eh-${opt.id}`} />
              <Label htmlFor={`eh-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },

    // Route E: Combinatie
    {
      id: "combinatie-verdeling",
      group: "Verdieping",
      title: "Hoe verdeelt de belasting zich?",
      subtitle: "Schuif de verdeling tussen werk en priv\u00e9.",
      isVisible: (fd) => fd.hoofdoorzaak === "combinatie",
      render: (fd, update) => (
        <div>
          <Slider value={[fd.combinatieVerdeling]} onValueChange={([v]) => update({ combinatieVerdeling: v })} min={0} max={100} step={5} className="w-full" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Werk {fd.combinatieVerdeling}%</span>
            <span>Priv\u00e9 {100 - fd.combinatieVerdeling}%</span>
          </div>
        </div>
      ),
    },
    {
      id: "combinatie-verandering",
      group: "Verdieping",
      title: "Wat zou een eerste kleine verandering zijn die direct lucht geeft?",
      isVisible: (fd) => fd.hoofdoorzaak === "combinatie",
      render: (fd, update) => (
        <Input value={fd.combinatieVerandering} onChange={(e) => update({ combinatieVerandering: e.target.value })} placeholder="Optioneel - kort omschrijven..." maxLength={200} />
      ),
    },

    // Anders fallback
    {
      id: "anders-info",
      group: "Verdieping",
      title: "Je hebt 'Anders' gekozen",
      isVisible: (fd) => fd.hoofdoorzaak === "anders",
      render: () => (
        <div className="rounded-xl border border-border bg-secondary/20 p-5">
          <p className="text-sm text-muted-foreground">
            In het gesprek met je time-out coach kun je hier dieper op ingaan. Ga verder naar de volgende vraag.
          </p>
        </div>
      ),
    },

    // Closing (all routes)
    {
      id: "closing-nodig",
      group: "Verdieping",
      title: "Wat kunnen we nu doen om te voorkomen dat dit richting verzuim gaat?",
      subtitle: "Meerdere opties mogelijk.",
      render: (fd, _, toggleMulti) => (
        <CheckboxList options={CLOSING_OPTIONS} selected={fd.closingNodig} onToggle={(v) => toggleMulti("closingNodig", v)} />
      ),
    },
    {
      id: "closing-belangrijk",
      group: "Verdieping",
      title: "Hoe belangrijk is dat voor je?",
      render: (fd, update) => (
        <>
          <ScaleSlider value={fd.closingBelangrijk} onChange={(v) => update({ closingBelangrijk: v })} labelLeft="Handig" labelMid="Belangrijk" labelRight="Noodzakelijk" />
          <p className="mt-3 text-xs text-muted-foreground italic">
            We vragen dit zodat dit een concreet onderwerp wordt in het Time-out gesprek.
          </p>
        </>
      ),
    },

    // ─── GROUP 3: RANDVOORWAARDEN ───
    {
      id: "rand-wel",
      group: "Randvoorwaarden",
      title: "Wat wil je absoluut wel bereiken met deze time-out?",
      render: (fd, update) => (
        <>
          <Textarea value={fd.randWelBereiken} onChange={(e) => update({ randWelBereiken: e.target.value })} placeholder="Bijv. rust en overzicht, duidelijke afspraken..." maxLength={200} rows={3} />
          <p className="mt-1 text-xs text-muted-foreground">{fd.randWelBereiken.length}/200</p>
        </>
      ),
    },
    {
      id: "rand-niet",
      group: "Randvoorwaarden",
      title: "Wat wil je absoluut niet dat dit gesprek wordt?",
      render: (fd, update) => (
        <>
          <Textarea value={fd.randNietBereiken} onChange={(e) => update({ randNietBereiken: e.target.value })} placeholder="Bijv. geen beoordelingsgesprek, geen diagnose..." maxLength={200} rows={3} />
          <p className="mt-1 text-xs text-muted-foreground">{fd.randNietBereiken.length}/200</p>
        </>
      ),
    },
    {
      id: "terugkoppeling",
      group: "Randvoorwaarden",
      title: "Mag er terugkoppeling richting je werkgever plaatsvinden?",
      render: (fd, update) => (
        <>
          <RadioGroup value={fd.terugkoppeling} onValueChange={(v) => update({ terugkoppeling: v })} className="space-y-2">
            {TERUGKOPPELING_OPTIONS.map((opt) => (
              <div key={opt.id} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value={opt.id} id={`tk-${opt.id}`} />
                <Label htmlFor={`tk-${opt.id}`} className="flex-1 cursor-pointer text-sm">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <p className="mt-3 text-xs text-muted-foreground italic">
            Er gaat geen terugkoppeling richting de werkgever zonder jouw expliciete toestemming.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <Checkbox checked={fd.terugkoppelingAkkoord} onCheckedChange={(c) => update({ terugkoppelingAkkoord: c === true })} className="mt-0.5" />
            <span className="text-sm text-muted-foreground">Ik begrijp dat deze voorwaarden leidend zijn voor het gesprek</span>
          </label>
        </>
      ),
    },
  ]
}

// ── Mock summary ──
function generateSummary(fd: FormData): string {
  const oorzaakLabel = HOOFDOORZAAK_OPTIONS.find(o => o.id === fd.hoofdoorzaak)?.label || fd.andersText || "onbekend"
  const sindsLabel = SINDS_OPTIONS.find(o => o.id === fd.sinds)?.label || "onbekend"

  let summary = `## Wat speelt er\nDe hoofdoorzaak van deze time-out aanvraag is **${oorzaakLabel.toLowerCase()}**. Dit speelt al **${sindsLabel.toLowerCase()}**.`
  if (fd.factoren.length > 0) summary += ` Daarnaast spelen er factoren als ${fd.factoren.join(", ").toLowerCase()}.`

  summary += `\n\n## Signalen\n`
  summary += fd.signalen.length > 0 ? `Op het werk zijn de volgende signalen merkbaar: ${fd.signalen.join(", ").toLowerCase()}.` : `Er zijn geen specifieke signalen op het werk aangegeven.`

  summary += `\n\n## Inschatting risico\nDe zwaarte wordt ingeschat op **${fd.zwaarte} van 7**. De kans op verzuim zonder verandering is ingeschat op **${fd.risico} van 7**.`

  summary += `\n\n## Verdieping\n`
  if (fd.hoofdoorzaak === "werkdruk" || fd.hoofdoorzaak === "incident") {
    if (fd.werkdrukDruk.length > 0) summary += `De druk komt vooral door ${fd.werkdrukDruk.join(", ").toLowerCase()}.`
    if (fd.werkdrukGeprobeerd.length > 0) summary += ` Al geprobeerd: ${fd.werkdrukGeprobeerd.join(", ").toLowerCase()}.`
  } else if (fd.hoofdoorzaak === "samenwerking") {
    const metLabel = CONFLICT_MET.find(o => o.id === fd.conflictMet)?.label || ""
    if (metLabel) summary += `Dit speelt vooral met: ${metLabel.toLowerCase()}.`
    if (fd.conflictWaarover.length > 0) summary += ` Het gaat over: ${fd.conflictWaarover.join(", ").toLowerCase()}.`
  } else if (fd.hoofdoorzaak === "prive") {
    if (fd.priveWaarover.length > 0) summary += `Het gaat over: ${fd.priveWaarover.join(", ").toLowerCase()}.`
    if (fd.priveNodig.length > 0) summary += ` Vanuit werk is nodig: ${fd.priveNodig.join(", ").toLowerCase()}.`
  } else if (fd.hoofdoorzaak === "energie") {
    if (fd.energieMerkt.length > 0) summary += `Merkbaar: ${fd.energieMerkt.join(", ").toLowerCase()}.`
  } else if (fd.hoofdoorzaak === "combinatie") {
    summary += `Belasting: ${fd.combinatieVerdeling}% werk, ${100 - fd.combinatieVerdeling}% priv\u00e9.`
  }

  summary += `\n\n## Doelen\n`
  if (fd.doelen.length > 0) summary += fd.doelen.map(d => `- ${d}`).join("\n")
  summary += `\nBelangrijkheid: **${fd.belangrijkheid} van 7**.`

  summary += `\n\n## Randvoorwaarden\n`
  if (fd.randWelBereiken) summary += `Wil bereiken: "${fd.randWelBereiken}". `
  if (fd.randNietBereiken) summary += `Wil niet: "${fd.randNietBereiken}". `
  const tkLabel = TERUGKOPPELING_OPTIONS.find(o => o.id === fd.terugkoppeling)?.label || "niet ingevuld"
  summary += `\nTerugkoppeling werkgever: ${tkLabel.toLowerCase()}.`

  return summary
}

// ── Main component ──

const GROUP_LABELS = ["Situatie", "Verdieping", "Randvoorwaarden", "Samenvatting"]

export default function TimeoutFormPage() {
  const router = useRouter()
  const [screenIndex, setScreenIndex] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [summaryText, setSummaryText] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSummaryStep, setIsSummaryStep] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { role, route } = getDemoContext()
    if (!role || route !== "timeout") {
      router.push("/demo")
    }
  }, [router])

  const allScreens = buildScreens()
  const visibleScreens = allScreens.filter((s) => !s.isVisible || s.isVisible(formData))
  const currentScreen = visibleScreens[screenIndex]
  const totalVisible = visibleScreens.length

  // Figure out which group we're in for progress bar
  const currentGroup = currentScreen?.group || "Samenvatting"
  const groupIndex = GROUP_LABELS.indexOf(isSummaryStep ? "Samenvatting" : currentGroup)

  const update = useCallback((partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }, [])

  const toggleMulti = useCallback((field: keyof FormData, value: string, max?: number) => {
    setFormData((prev) => {
      const current = prev[field] as string[]
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) }
      }
      if (max && current.length >= max) return prev
      return { ...prev, [field]: [...current, value] }
    })
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNext = async () => {
    if (isSummaryStep) return

    if (screenIndex < totalVisible - 1) {
      setScreenIndex(screenIndex + 1)
      scrollToTop()
    } else {
      // Last question screen -> generate summary via AI
      setIsSummaryStep(true)
      setIsGenerating(true)
      scrollToTop()
      try {
        const res = await fetch("/api/timeout/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData }),
        })
        const data = await res.json()
        setSummaryText(data.summary)
      } catch {
        // Fallback to mock if API fails
        setSummaryText(generateSummary(formData))
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const handleBack = () => {
    if (isSummaryStep) {
      setIsSummaryStep(false)
      setIsGenerating(false)
      scrollToTop()
      return
    }
    if (screenIndex > 0) {
      setScreenIndex(screenIndex - 1)
      scrollToTop()
    }
  }

  const handleConfirmSend = () => {
    setShowConfirmModal(false)
    setIsSubmitted(true)
  }

  // Progress within current group
  const screensInCurrentGroup = visibleScreens.filter(s => s.group === currentGroup)
  const indexInGroup = screensInCurrentGroup.findIndex(s => s.id === currentScreen?.id)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavHeader showBack backHref="/timeout/start/demo" />

      <main className="mx-auto w-full max-w-[900px] flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Top progress bar - groups */}
          {!isSubmitted && (
            <div className="mb-8">
              <div className="mb-3 flex justify-between">
                {GROUP_LABELS.map((label, i) => {
                  const isActive = i === groupIndex
                  const isDone = i < groupIndex
                  return (
                    <div key={label} className="flex flex-1 flex-col items-center gap-1">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${isDone ? "bg-primary text-primary-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {isDone ? <CheckCircle className="h-4 w-4" /> : i + 1}
                      </div>
                      <span className={`text-center text-xs ${isActive || isDone ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-1">
                {GROUP_LABELS.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= groupIndex ? "bg-primary" : "bg-secondary"}`} />
                ))}
              </div>

              {/* Sub-progress within group */}
              {!isSummaryStep && screensInCurrentGroup.length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Vraag {indexInGroup + 1} van {screensInCurrentGroup.length}
                  </span>
                  <div className="flex gap-1">
                    {screensInCurrentGroup.map((_, i) => (
                      <div key={i} className={`h-1 w-4 rounded-full transition-colors ${i <= indexInGroup ? "bg-primary/60" : "bg-secondary"}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Summary step ── */}
          {isSummaryStep ? (
            <>
              {isGenerating ? (
                <Card className="rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center p-12">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" />
                    <h2 className="mb-2 text-xl font-semibold text-foreground">We maken je samenvatting...</h2>
                    <p className="text-center text-muted-foreground">Even geduld, we verwerken je antwoorden.</p>
                    <div className="mt-8 w-full space-y-3">
                      <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-11/12 animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-10/12 animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-9/12 animate-pulse rounded bg-secondary" />
                    </div>
                  </CardContent>
                </Card>
              ) : isSubmitted ? (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold text-foreground">Je samenvatting is gedeeld.</h2>
                  <p className="mb-8 text-muted-foreground">De voorbereiding is afgerond.</p>
                  <Button variant="outline" onClick={() => router.push("/dashboard/employee?flow=timeout")} className="rounded-xl bg-transparent">
                    Terug naar dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-center">
                    <h2 className="mb-1 text-xl font-semibold text-foreground">Samenvatting voor het gesprek</h2>
                    <p className="text-sm text-muted-foreground">Lees rustig. Jij bepaalt of dit klopt.</p>
                  </div>

                  <Card className="mb-4 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none">
                        {summaryText.split("\n").map((line, i) => {
                          if (line.startsWith("## ")) return <h3 key={i} className="mb-2 mt-4 text-base font-semibold text-primary first:mt-0">{line.replace("## ", "")}</h3>
                          if (line.startsWith("- ")) return <p key={i} className="mb-1 pl-4 text-sm text-foreground">&#8226; {line.replace("- ", "")}</p>
                          if (line.trim() === "") return <div key={i} className="h-2" />
                          const parts = line.split(/(\*\*.*?\*\*)/)
                          return (
                            <p key={i} className="mb-2 text-sm leading-relaxed text-foreground">
                              {parts.map((part, j) => part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}
                            </p>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mb-6 rounded-2xl border-accent/30 bg-accent/5">
                    <CardContent className="p-4">
                      <p className="text-center text-sm font-medium text-foreground">
                        Is deze samenvatting juist en volledig genoeg voor het gesprek?
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={handleBack} className="rounded-xl bg-transparent">
                      Nee, ik wil aanpassen
                    </Button>
                    <Button onClick={() => setShowConfirmModal(true)} className="rounded-xl">
                      <Send className="mr-2 h-4 w-4" />
                      Ja, dit klopt - delen met time-out coach
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* ── Question screen ── */}
              <Card ref={cardRef} className="rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="mb-1 text-xl font-semibold text-foreground">{currentScreen?.title}</h2>
                  {currentScreen?.subtitle && (
                    <p className="mb-6 text-sm text-muted-foreground">{currentScreen.subtitle}</p>
                  )}
                  {!currentScreen?.subtitle && <div className="mb-6" />}
                  {currentScreen?.render(formData, update, toggleMulti)}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={screenIndex === 0}
                  className="rounded-xl bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Vorige
                </Button>
                <Button onClick={handleNext} className="rounded-xl">
                  {screenIndex === totalVisible - 1 ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Maak samenvatting
                    </>
                  ) : (
                    <>
                      Volgende
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <AppFooter />

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Weet je het zeker?</DialogTitle>
            <DialogDescription className="space-y-3">
              <p>Alleen deze samenvatting wordt gedeeld met je time-out coach.</p>
              <p className="font-medium text-foreground">Klopt dit verhaal zoals jij het bedoelt?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="rounded-xl bg-transparent">
              Nog even checken
            </Button>
            <Button onClick={handleConfirmSend} className="rounded-xl">
              <Send className="mr-2 h-4 w-4" />
              Ja, versturen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
