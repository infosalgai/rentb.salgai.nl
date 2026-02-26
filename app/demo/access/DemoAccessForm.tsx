"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DemoAccessForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("next", next)
    setPending(true)
    try {
      const res = await fetch("/api/demo/access", {
        method: "POST",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.redirect) {
        window.location.href = data.redirect
        return
      }
      setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.")
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg">
      <CardHeader className="text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Toegang tot de demo
        </h1>
        <p className="text-sm text-muted-foreground">
          Vul de toegangscode in om de demo te bekijken.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="sr-only">
              Toegangscode
            </label>
            <Input
              id="code"
              name="code"
              type="password"
              placeholder="Toegangscode"
              autoComplete="one-time-code"
              autoFocus
              disabled={pending}
              className="rounded-lg"
              aria-invalid={!!error}
              aria-describedby={error ? "code-error" : undefined}
            />
          </div>
          {error && (
            <Alert id="code-error" variant="destructive" className="rounded-lg">
              <AlertTitle>Toegang geweigerd</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full rounded-xl"
            size="lg"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Bezig…
              </>
            ) : (
              "Toegang"
            )}
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          <a
            href={next !== "/demo" ? `/demo/access/reset?next=${encodeURIComponent(next)}` : "/demo/access/reset"}
            className="underline hover:text-foreground"
          >
            Code opnieuw invoeren
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
