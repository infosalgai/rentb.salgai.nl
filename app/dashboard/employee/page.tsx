"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { AppFooter } from "@/components/app-footer"
import { Shield, ArrowRight, FileText, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { employeeRequests, STATUS_CONFIG, getDemoContext, ROUTE_CONFIG, type DemoRole, type DemoRoute, type EmployeeRequest } from "@/lib/demo-data"

function StatusChip({ status }: { status: EmployeeRequest["status"] }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

function RequestCard({ request }: { request: EmployeeRequest }) {
  const getActionButton = () => {
    switch (request.status) {
      case "concept":
        return (
          <Button size="sm" variant="outline" className="rounded-lg bg-transparent" asChild>
            <Link href="/run/demo/form">
              Verdergaan
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )
      case "samenvatting_klaar":
        return (
          <Button size="sm" className="rounded-lg" asChild>
            <Link href="/run/demo/summary">
              Bekijk samenvatting
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )
      case "wacht_op_toestemming":
        return (
          <Button size="sm" className="rounded-lg" asChild>
            <Link href="/run/demo/share-approve">
              Toestemming geven
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )
      case "gedeeld_met_coach":
        return (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Gedeeld met</p>
            <p className="text-sm font-medium text-foreground">{request.coachName}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{request.id}</p>
            <StatusChip status={request.status} />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Aangemaakt: {request.createdDate}</span>
            {request.updatedDate !== request.createdDate && (
              <span>• Bijgewerkt: {request.updatedDate}</span>
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0 sm:pl-2">{getActionButton()}</div>
    </div>
  )
}

export default function EmployeeDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showArchived, setShowArchived] = useState(false)
  const [demoRoute, setDemoRoute] = useState<DemoRoute>("navigation")

  useEffect(() => {
    // Check if role and route are set
    const { role, route } = getDemoContext()
    if (!role) {
      router.push("/demo")
      return
    }
    if (!route) {
      router.push("/demo/what")
      return
    }
    // Also check query param for flow
    const flowParam = searchParams.get("flow") as DemoRoute | null
    setDemoRoute(flowParam || route)
  }, [router, searchParams])

  const routeConfig = ROUTE_CONFIG[demoRoute]

  // Filter active vs archived requests
  const activeRequests = employeeRequests.filter(
    r => !["afgerond", "geweigerd", "ingetrokken"].includes(r.status)
  )
  const archivedRequests = employeeRequests.filter(
    r => ["afgerond", "geweigerd", "ingetrokken"].includes(r.status)
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader role="medewerker" route={demoRoute} />

      <main className="mx-auto max-w-[900px] px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Mijn {demoRoute === "timeout" ? "Time-out aanvragen" : "Navigatiegesprekken"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {demoRoute === "timeout" 
              ? "Vraag een time-out aan of bekijk je lopende aanvragen."
              : "Vraag een gesprek aan of bekijk je lopende aanvragen."
            }
          </p>
        </div>

        {/* Primary CTA Card */}
        <Card className="mb-8 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-lg font-semibold text-foreground">
                  {demoRoute === "timeout" ? "Time-out aanvragen" : "Navigatiegesprek aanvragen"}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {demoRoute === "timeout"
                    ? "Neem een time-out voordat verzuim ontstaat. Bespreek je situatie vertrouwelijk en bepaal zelf wat je deelt."
                    : "Start een vertrouwelijk gesprek om je situatie in kaart te brengen. Jij bepaalt wat je deelt. De samenvatting gaat alleen naar je coach als jij daar toestemming voor geeft."
                  }
                </p>
                <Button className="rounded-xl" asChild>
                  <Link href={demoRoute === "timeout" ? "/timeout/start/demo" : "/start/demo"}>
                    {demoRoute === "timeout" ? "Time-out aanvragen" : "Nieuwe aanvraag starten"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Requests - only for navigation flow */}
        {demoRoute !== "timeout" && (
          <>
            <Card className="mb-6 rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Openstaande aanvragen</CardTitle>
                <CardDescription>
                  Je hebt {activeRequests.length} actieve {activeRequests.length === 1 ? "aanvraag" : "aanvragen"}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeRequests.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Je hebt geen openstaande aanvragen.
                    </p>
                  </div>
                ) : (
                  activeRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Archived Requests (Collapsible) */}
            {archivedRequests.length > 0 && (
              <Card className="rounded-2xl shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <div>
                    <h3 className="font-medium text-foreground">
                      Afgerond / Ingetrokken
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {archivedRequests.length} {archivedRequests.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  {showArchived ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {showArchived && (
                  <CardContent className="space-y-3 pt-0">
                    {archivedRequests.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </CardContent>
                )}
              </Card>
            )}
          </>
        )}
      </main>
      <AppFooter />
    </div>
  )
}
