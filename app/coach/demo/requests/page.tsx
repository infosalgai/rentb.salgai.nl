"use client"

import React from "react"

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
import { User, Clock, CheckCircle, XCircle, Send, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mocked employee data with realistic statuses
const MOCK_EMPLOYEES = [
  {
    id: "1",
    name: "Anna de Vries",
    department: "Marketing",
    startDate: "2026-01-15",
    status: "gedeeld",
    hasShared: true,
  },
  {
    id: "2",
    name: "Pieter Jansen",
    department: "IT",
    startDate: "2026-01-20",
    status: "wachten",
    hasShared: false,
  },
  {
    id: "3",
    name: "Sophie van den Berg",
    department: "HR",
    startDate: "2026-01-25",
    status: "samenvatting_klaar",
    hasShared: false,
  },
  {
    id: "4",
    name: "Thomas Bakker",
    department: "Finance",
    startDate: "2026-01-28",
    status: "geweigerd",
    hasShared: false,
  },
  {
    id: "5",
    name: "Lisa Mulder",
    department: "Operations",
    startDate: "2026-02-01",
    status: "ingetrokken",
    hasShared: false,
  },
  {
    id: "6",
    name: "Mark de Jong",
    department: "Sales",
    startDate: "2026-01-30",
    status: "akkoord",
    hasShared: true,
  },
]

type EmployeeStatus = "ingevuld" | "samenvatting_klaar" | "wachten" | "akkoord" | "gedeeld" | "geweigerd" | "ingetrokken"

const STATUS_CONFIG: Record<EmployeeStatus, { label: string; color: string; icon: React.ElementType }> = {
  ingevuld: {
    label: "Ingevuld",
    color: "bg-secondary text-secondary-foreground",
    icon: User,
  },
  samenvatting_klaar: {
    label: "Samenvatting klaar",
    color: "bg-secondary text-secondary-foreground",
    icon: User,
  },
  wachten: {
    label: "Wacht op toestemming",
    color: "bg-accent text-accent-foreground",
    icon: Clock,
  },
  akkoord: {
    label: "Akkoord gegeven",
    color: "bg-primary/10 text-primary",
    icon: CheckCircle,
  },
  gedeeld: {
    label: "Gedeeld met coach",
    color: "bg-primary text-primary-foreground",
    icon: CheckCircle,
  },
  geweigerd: {
    label: "Geweigerd",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
  ingetrokken: {
    label: "Ingetrokken",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
}

export default function CoachDashboardPage() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  const handleRequestSummary = (employeeId: string) => {
    setSelectedEmployee(employeeId)
    setShowRequestModal(true)
    
    // Update employee status to "wachten"
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, status: "wachten" as EmployeeStatus } : emp
    ))
  }

  const getSelectedEmployeeName = () => {
    const employee = employees.find(emp => emp.id === selectedEmployee)
    return employee?.name || ""
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Coach-dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Je ziet pas inhoud nadat de werknemer toestemming geeft.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Totaal", value: employees.length, color: "text-foreground" },
            { label: "Wachtend", value: employees.filter(e => e.status === "wachten").length, color: "text-accent-foreground" },
            { label: "Gedeeld", value: employees.filter(e => e.status === "gedeeld" || e.status === "akkoord").length, color: "text-primary" },
            { label: "Geweigerd/Ingetrokken", value: employees.filter(e => e.status === "geweigerd" || e.status === "ingetrokken").length, color: "text-destructive" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employee List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Werknemers</h2>
          
          {employees.map((employee) => {
            const statusConfig = STATUS_CONFIG[employee.status as EmployeeStatus]
            const StatusIcon = statusConfig.icon
            
            return (
              <Card key={employee.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {employee.department} • Sinds {new Date(employee.startDate).toLocaleDateString("nl-NL")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig.label}
                      </span>
                      
                      {employee.status === "wachten" && (
                        <span className="text-xs text-muted-foreground">
                          Inhoud nog niet zichtbaar
                        </span>
                      )}
                      
                      {employee.status === "samenvatting_klaar" && (
                        <Button
                          size="sm"
                          onClick={() => handleRequestSummary(employee.id)}
                        >
                          <Send className="mr-1.5 h-3.5 w-3.5" />
                          Vraag samenvatting op
                        </Button>
                      )}
                      
                      {(employee.status === "akkoord" || employee.status === "gedeeld") && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href="/hr/demo/summary">
                            Bekijk samenvatting
                          </Link>
                        </Button>
                      )}
                      
                      {employee.status === "geweigerd" && (
                        <span className="text-xs text-muted-foreground">
                          Werknemer heeft geweigerd
                        </span>
                      )}
                      
                      {employee.status === "ingetrokken" && (
                        <span className="text-xs text-muted-foreground">
                          Toestemming ingetrokken
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Request Modal */}
        <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verzoek verstuurd</DialogTitle>
              <DialogDescription>
                Er is een verzoek naar {getSelectedEmployeeName()} gestuurd.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                De werknemer beslist zelf of de samenvatting wordt gedeeld.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1"
                >
                  Sluiten
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/run/demo/share-approve">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Bekijk werknemer akkoord scherm
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
