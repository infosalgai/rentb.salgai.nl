import OpenAI from "openai"
import { taskFromSummarySchema, type TaskFromSummary } from "./taskSchema"
import { TASK_FROM_CONFIRMED_SUMMARY_PROMPT } from "./taskPrompt"

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

export async function generateTaskFromSummary(
  confirmedSummary: string
): Promise<{ task: TaskFromSummary } | { error: string }> {
  const client = getClient()
  if (!client) {
    return { error: "OPENAI_API_KEY ontbreekt" }
  }

  const userPrompt = `Hier is de bevestigde samenvatting van de werknemer:\n\n${confirmedSummary}\n\nGenereer de opdracht als geldig JSON volgens het gevraagde schema.`

  try {
    const resp = await client.responses.create({
      model: "gpt-5.2",
      reasoning: { effort: "medium" },
      max_output_tokens: 2000,
      input: [
        { role: "developer", content: TASK_FROM_CONFIRMED_SUMMARY_PROMPT },
        { role: "user", content: userPrompt },
      ],
    })

    const rawText = (resp as { output_text?: string }).output_text?.trim()

    if (!rawText) {
      return { error: "Geen antwoord van het model" }
    }

    let jsonStr = rawText
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) jsonStr = jsonMatch[1].trim()

    const parsed = JSON.parse(jsonStr)

    const result = taskFromSummarySchema.safeParse(parsed)
    if (!result.success) {
      return { error: "Validatie mislukt" }
    }

    return { task: result.data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("generateTaskFromSummary error:", msg)
    return { error: msg }
  }
}
