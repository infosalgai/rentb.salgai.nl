"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, RefreshCw, Info, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ROLE_CONFIG, ROUTE_CONFIG, type DemoRole, type DemoRoute } from "@/lib/demo-data"

interface DashboardHeaderProps {
  role: DemoRole
  route?: DemoRoute
  showBack?: boolean
  backHref?: string
}

export function DashboardHeader({ role, route, showBack = false, backHref = "/" }: DashboardHeaderProps) {
  const roleConfig = ROLE_CONFIG[role]
  const routeConfig = route ? ROUTE_CONFIG[route] : null
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card safe-area-inset-top">
      <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-[900px] items-center justify-between gap-2 px-4 sm:gap-4">
        {/* Left: Logo */}
        <Link href="/demo" className="flex shrink-0 items-center min-h-[44px] min-w-[44px]">
          <Image
            src="/images/rentb-logo.png"
            alt="Reith & Ten Böhmer Accountants en Belastingadviseurs"
            width={420}
            height={103}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>

        {/* Center: Role + Route Badge - hidden on very small, visible from sm */}
        <TooltipProvider>
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 sm:flex sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground sm:gap-1.5 sm:px-3 sm:text-sm">
                  <span className="truncate">{roleConfig.label}</span>
                  <Info className="h-3 w-3 shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{roleConfig.tooltip}</p>
              </TooltipContent>
            </Tooltip>
            {routeConfig && (
              <div className="shrink-0 rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent sm:px-3 sm:text-sm">
                {routeConfig.shortLabel}
              </div>
            )}
          </div>
        </TooltipProvider>

        {/* Right: Actions - touch-friendly */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-accent sm:min-w-0 sm:px-3"
          >
            <Link href="/demo">
              <RefreshCw className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Switch rol</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-accent sm:min-w-0 sm:px-3"
          >
            <Link href="/demo/what">
              <Repeat className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Switch route</span>
            </Link>
          </Button>
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-accent sm:min-w-0 sm:px-3"
            >
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Terug</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
