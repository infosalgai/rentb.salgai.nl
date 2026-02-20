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
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-[900px] items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/demo" className="flex items-center">
          <Image
            src="/images/verzuimdynamiek-logo.png"
            alt="Verzuimdynamiek"
            width={160}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Center: Role + Route Badge */}
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  {roleConfig.label}
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{roleConfig.tooltip}</p>
              </TooltipContent>
            </Tooltip>
            {routeConfig && (
              <div className="rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
                {routeConfig.shortLabel}
              </div>
            )}
          </div>
        </TooltipProvider>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-accent"
          >
            <Link href="/demo">
              <RefreshCw className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Switch rol</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-accent"
          >
            <Link href="/demo/what">
              <Repeat className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Switch route</span>
            </Link>
          </Button>
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-accent"
            >
              <Link href={backHref}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Terug</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
