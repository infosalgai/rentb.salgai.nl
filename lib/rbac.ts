/**
 * RBAC: rollen en rechten voor de demo (privacy-by-design, least privilege).
 * HR = organisatiebreed geanonimiseerd; Leidinggevende = alleen team, procesniveau.
 */

import type { DemoRole } from "./demo-data"

/** Gebruikersrol (align met DemoRole in demo-context). */
export type UserRole = "employee" | "coach" | "hr" | "manager"

export const DEMO_ROLE_TO_USER_ROLE: Record<DemoRole, UserRole> = {
  medewerker: "employee",
  coach: "coach",
  hr: "hr",
  manager: "manager",
}

export type Scope = "organization" | "team"

/** Acties die een rol mag uitvoeren (resource-agnostisch voor nu). */
export type Action =
  | "view_anonymized_stats"
  | "view_organization_trends"
  | "view_team_status"
  | "view_export_anonymized"
  | "view_coach_assignment"
  | "view_employee_content"

const ROLE_SCOPE: Record<UserRole, Scope> = {
  employee: "team",
  coach: "team",
  hr: "organization",
  manager: "team",
}

/** Rechten per rol (least privilege). */
const ROLE_ACTIONS: Record<UserRole, Action[]> = {
  employee: [],
  coach: ["view_employee_content"],
  hr: [
    "view_anonymized_stats",
    "view_organization_trends",
    "view_coach_assignment",
    "view_export_anonymized",
  ],
  manager: ["view_team_status"],
}

/**
 * Controleer of een rol een actie mag uitvoeren.
 * Gebruik server-side in API routes zodra er sessie/user is.
 */
export function can(role: UserRole, action: Action): boolean {
  return ROLE_ACTIONS[role]?.includes(action) ?? false
}

/**
 * Controleer of de huidige rol in de lijst van toegestane rollen zit.
 * Handig voor route guards (bijv. alleen hr mag /dashboard/hr).
 */
export function hasRole(role: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!role) return false
  return allowedRoles.includes(role)
}

/**
 * Scope van de rol: organisation (HR) of team (leidinggevende, coach).
 */
export function getScope(role: UserRole): Scope {
  return ROLE_SCOPE[role] ?? "team"
}

/**
 * Mag deze rol geanonimiseerde exports zien? Alleen HR.
 */
export function canExportAnonymized(role: UserRole): boolean {
  return can(role, "view_export_anonymized")
}

/**
 * Mag deze rol organisatiebrede trends zien? Alleen HR.
 */
export function canViewOrganizationTrends(role: UserRole): boolean {
  return can(role, "view_organization_trends")
}

/**
 * Mag deze rol inhoudelijke antwoorden/samenvattingen zien? Alleen coach (na toestemming).
 * HR en manager mogen dit nooit.
 */
export function canViewEmployeeContent(role: UserRole): boolean {
  return can(role, "view_employee_content")
}
