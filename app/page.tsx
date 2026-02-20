import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to demo role selection as the entry point
  redirect("/demo")
}
