"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { AppFooter } from "@/components/app-footer"
import { Shield, Send, Eye, Clock, User, Info, EyeOff } from "lucide-react"
import { coachRequests, STATUS_CONFIG, getDemoContext, ROUTE_CONFIG, type DemoRole, type DemoRoute, type CoachRequest } from "@/lib/demo-data"

type Tab = "nieuw" | "lopend" | "afgerond"

function StatusChip({ status }: { status: CoachRequest["status"] }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

function RequestCard({ 
  request, 
  onRequestSummary 
}: { 
  request: CoachRequest
  onRequestSummary: (id: string) => void 
}) {
  const getActionContent = () => {
    if (!request.hasSummaryAccess) {
      if (request.status === "wacht_op_toestemming") {
        return (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <EyeOff className="h-3.5 w-3.5" />
              Inhoud nog niet zichtbaar
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg bg-transparent"
              onClick={() => onRequestSummary(request.id)}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Vraag samenvatting op
            </Button>
          </div>
        )
      }
      if (request.status === "geweigerd" || request.status === "ingetrokken") {
        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <EyeOff className="h-3.5 w-3.5" />
            Geen toegang
          </div>
        )
      }
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <EyeOff className="h-3.5 w-3.5" />
          Wacht op toestemming
        </div>
      )
    }

    // Has summary access
    return (
      <Button size="sm" variant="outline" className="rounded-lg bg-transparent" asChild>
        <Link href="/run/demo/summary?view=coach">
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Bekijk samenvatting
        </Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">{request.employeeCode}</p>
            <StatusChip status={request.status} />
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>ID: {request.id}</span>
            <span>• {request.createdDate}</span>
          </div>
        </div>
      </div>
      {getActionContent()}
    </div>
  )
}

export default function CoachDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>("nieuw")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestedEmployee, setRequestedEmployee] = useState<string>("")
  const [demoRoute, setDemoRoute] = useState<DemoRoute>("navigation")

  useEffect(() => {
    const { role, route } = getDemoContext()
    if (!role) {
      router.push("/demo")
      return
    }
    if (!route) {
      router.push("/demo/what")
      return
    }
    const flowParam = searchParams.get("flow") as DemoRoute | null
    setDemoRoute(flowParam || route)
  }, [router, searchParams])

  const routeConfig = ROUTE_CONFIG[demoRoute]

  const handleRequestSummary = (employeeCode: string) => {
    setRequestedEmployee(employeeCode)
    setShowRequestModal(true)
  }

  // Filter requests by tab
  const getFilteredRequests = () => {
    switch (activeTab) {
      case "nieuw":
        return coachRequests.filter(r => 
          ["wacht_op_toestemming", "toestemming_gegeven", "gedeeld_met_coach"].includes(r.status) &&
          r.status !== "lopend"
        )
      case "lopend":
        return coachRequests.filter(r => r.status === "lopend")
      case "afgerond":
        return coachRequests.filter(r => 
          ["afgerond", "geweigerd", "ingetrokken"].includes(r.status)
        )
      default:
        return []
    }
  }

  const filteredRequests = getFilteredRequests()

  const TABS: { value: Tab; label: string }[] = [
    { value: "nieuw", label: "Nieuw / Te beoordelen" },
    { value: "lopend", label: "Lopend" },
    { value: "afgerond", label: "Afgerond" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader role="coach" route={demoRoute} />

      <main className="mx-auto max-w-[900px] px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Coach Dashboard - {routeConfig.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {demoRoute === "timeout"
              ? "Bekijk en beheer time-out aanvragen van medewerkers."
              : "Bekijk en beheer navigatiegesprekken van medewerkers."
            }
          </p>
        </div>

        {/* Privacy Callout */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Privacy-informatie</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Je ziet alleen de samenvatting nadat de medewerker toestemming geeft. 
              Persoonlijke gegevens zijn niet zichtbaar zonder expliciete toestemming.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-secondary p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {TABS.find(t => t.value === activeTab)?.label}
            </CardTitle>
            <CardDescription>
              {filteredRequests.length} {filteredRequests.length === 1 ? "aanvraag" : "aanvragen"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Geen aanvragen in deze categorie.
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  onRequestSummary={() => handleRequestSummary(request.employeeCode)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </main>

      {/* Request Sent Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verzoek verstuurd</DialogTitle>
            <DialogDescription>
              Er is een verzoek naar {requestedEmployee} gestuurd.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                De medewerker beslist zelf of de samenvatting wordt gedeeld. 
                Je ontvangt een melding zodra er een beslissing is genomen.
              </p>
            </div>
            <Button 
              onClick={() => setShowRequestModal(false)} 
              className="w-full rounded-xl"
            >
              Begrepen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AppFooter />
    </div>
  )
}
