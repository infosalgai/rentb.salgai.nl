"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserCheck, Shield, Check, X, ArrowRight, AlertTriangle, Clock, FileCheck } from "lucide-react"
import Link from "next/link"

// Status types
type ApprovalStatus = "pending" | "allowed" | "refused" | "withdrawn"

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string }> = {
  pending: { label: "Wacht op toestemming", color: "bg-accent text-accent-foreground" },
  allowed: { label: "Gedeeld met coach", color: "bg-primary text-primary-foreground" },
  refused: { label: "Geweigerd", color: "bg-destructive/10 text-destructive" },
  withdrawn: { label: "Ingetrokken", color: "bg-destructive/10 text-destructive" },
}

export default function ShareApprovePage() {
  const [decision, setDecision] = useState<ApprovalStatus>("pending")
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  // Mocked coach info
  const coachName = "Marieke Visser"
  const coachRole = "Loopbaancoach"

  const handleAllow = () => {
    setDecision("allowed")
  }

  const handleRefuse = () => {
    setDecision("refused")
  }

  const handleWithdraw = () => {
    setShowWithdrawModal(true)
  }

  const handleConfirmWithdraw = () => {
    setDecision("withdrawn")
    setShowWithdrawModal(false)
  }

  if (decision === "allowed") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-xl px-4 py-12">
          <Card>
            <CardContent className="p-8">
              {/* Status chip */}
              <div className="mb-4 flex justify-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_CONFIG.allowed.color}`}>
                  <FileCheck className="h-3.5 w-3.5" />
                  {STATUS_CONFIG.allowed.label}
                </span>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h1 className="mb-2 text-2xl font-semibold text-foreground">
                  Samenvatting gedeeld
                </h1>
                <p className="mb-6 text-muted-foreground">
                  Je coach {coachName} kan nu je samenvatting bekijken. 
                  Je kunt altijd contact opnemen als je vragen hebt.
                </p>
              </div>
              
              {/* Withdraw option */}
              <div className="mb-6 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Je kunt je toestemming op elk moment intrekken. Je coach ziet dan geen inhoud meer.
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-auto p-0 text-destructive hover:text-destructive"
                      onClick={handleWithdraw}
                    >
                      Toestemming intrekken
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button asChild className="w-full">
                <Link href="/coach/demo/requests">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Terug naar coach dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Withdraw confirmation modal */}
          <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Toestemming intrekken?</DialogTitle>
                <DialogDescription>
                  Je coach kan de samenvatting dan niet meer zien. Je kunt later opnieuw toestemming geven als je wilt.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Annuleer
                </Button>
                <Button variant="destructive" onClick={handleConfirmWithdraw}>
                  <X className="mr-2 h-4 w-4" />
                  Ja, intrekken
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  if (decision === "refused") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-xl px-4 py-12">
          <Card>
            <CardContent className="p-8">
              {/* Status chip */}
              <div className="mb-4 flex justify-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_CONFIG.refused.color}`}>
                  <X className="h-3.5 w-3.5" />
                  {STATUS_CONFIG.refused.label}
                </span>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <X className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="mb-2 text-2xl font-semibold text-foreground">
                  Verzoek geweigerd
                </h1>
                <p className="mb-6 text-muted-foreground">
                  Je hebt ervoor gekozen om je samenvatting niet te delen. 
                  Je coach is hiervan op de hoogte gesteld.
                </p>
              </div>
              
              <div className="mb-6 rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-center text-sm text-muted-foreground">
                  Je kunt later alsnog toestemming geven als je van gedachten verandert.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" asChild>
                  <Link href="/run/demo/summary">
                    Bekijk samenvatting
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/coach/demo/requests">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Terug naar coach dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (decision === "withdrawn") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-xl px-4 py-12">
          <Card>
            <CardContent className="p-8">
              {/* Status chip */}
              <div className="mb-4 flex justify-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_CONFIG.withdrawn.color}`}>
                  <X className="h-3.5 w-3.5" />
                  {STATUS_CONFIG.withdrawn.label}
                </span>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="mb-2 text-2xl font-semibold text-foreground">
                  Toestemming ingetrokken
                </h1>
                <p className="mb-6 text-muted-foreground">
                  Je coach kan je samenvatting niet meer zien. 
                  Je kunt later opnieuw toestemming geven als je wilt.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" asChild>
                  <Link href="/run/demo/summary">
                    Bekijk samenvatting
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/coach/demo/requests">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Terug naar coach dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-12">
        {/* Main Card */}
        <Card>
          <CardContent className="p-6">
            {/* Status chip */}
            <div className="mb-4 flex justify-center">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_CONFIG.pending.color}`}>
                <Clock className="h-3.5 w-3.5" />
                {STATUS_CONFIG.pending.label}
              </span>
            </div>
            
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <UserCheck className="h-7 w-7 text-primary" />
              </div>
              <h1 className="mb-2 text-xl font-semibold text-foreground">
                Toestemming voor delen
              </h1>
              <p className="text-muted-foreground">
                Je coach wil jouw samenvatting ontvangen.
              </p>
            </div>

            {/* Coach Info */}
            <div className="mb-6 rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{coachName}</p>
                  <p className="text-sm text-muted-foreground">{coachRole}</p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-border p-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Je coach kan de samenvatting alleen zien als jij toestemming geeft.
                  Je kunt dit later altijd intrekken.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button onClick={handleAllow} className="w-full">
                <Check className="mr-2 h-4 w-4" />
                Toestaan
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRefuse}
                className="w-full bg-transparent"
              >
                <X className="mr-2 h-4 w-4" />
                Weigeren
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Hulp nodig? Neem contact op met je HR-afdeling.
        </p>
      </div>
    </div>
  )
}
