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
    <header className="sticky top-0 z-50 border-b border-border bg-card safe-area-inset-top">
      <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-[900px] items-center justify-between gap-2 px-4">
        <Link href="/demo" className="flex min-h-[44px] min-w-[44px] shrink-0 items-center">
          <Image
            src="/images/rentb-logo.png"
            alt="Reith & Ten Böhmer Accountants en Belastingadviseurs"
            width={420}
            height={103}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>
        {showBack && (
          <Link
            href={backHref}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent sm:min-w-0 sm:justify-start sm:pr-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </Link>
        )}
      </div>
    </header>
  )
}
