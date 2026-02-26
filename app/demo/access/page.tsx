import { redirect } from "next/navigation"
import { DemoAccessForm } from "./DemoAccessForm"

type Props = {
  searchParams: Promise<{ next?: string; reset?: string }>
}

export default async function DemoAccessPage({ searchParams }: Props) {
  const params = await searchParams
  const next = params.next ?? "/demo"

  if (params.reset === "1") {
    redirect(
      `/demo/access/reset${next !== "/demo" ? `?next=${encodeURIComponent(next)}` : ""}`
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <DemoAccessForm next={next} />
    </div>
  )
}
