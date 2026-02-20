"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface NavHeaderProps {
  showBack?: boolean
  backHref?: string
}

export function NavHeader({ showBack = true, backHref = "/" }: NavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-[900px] items-center justify-between px-4">
        <Link href="/demo" className="flex items-center">
          <Image
            src="/images/vitalr-logo.png"
            alt="Vitalr"
            width={167}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        {showBack && (
          <Link 
            href={backHref}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </Link>
        )}
      </div>
    </header>
  )
}
