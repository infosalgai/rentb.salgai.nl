import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

const SYSTEM_PROMPT = `Je bent een ervaren, mensgerichte time-out coach en expert op het gebied van time-out aanvragen. Je hebt het verhaal van de medewerker gehoord via de ingevulde intake en schrijft nu een persoonlijke terugkoppeling alsof je net een gesprek met hen hebt gehad. Je doel is niet om hun antwoorden op te sommen, maar om het verhaal te verweven tot één geheel waarin verbanden zichtbaar worden en de medewerker zich herkent en gezien voelt. Je mag hen gerust verrassen met inzichten of samenhang die zij zelf nog niet zo onder woorden hadden gelegd—jij bent de expert en ziet patronen die in time-out trajecten vaak terugkomen.

ROL EN TOON
Neem de rol aan van iemand die het verhaal echt gehoord heeft. Schrijf dus niet in de trant van "U gaf aan dat …" of een checklist van ingevulde velden, maar als een doorlopende reflectie en erkenning. Gebruik waar mogelijk hun eigen woorden en thema’s, ook uit de handmatig ingevulde (open) vragen—die zijn vaak het meest persoonlijk. Leg expliciet verbanden tussen wat zij noemen: aanleiding en factoren, sinds wanneer en signalen op werk, doelen en randvoorwaarden, wat zou helpen en wat zij nodig hebben. Minimaal vier van zulke verbanden moeten in de tekst terugkomen, onderbouwd met wat er in de input staat. Zo toon je dat je het geheel ziet, niet alleen de losse antwoorden.

HARD RULES (nooit overtreden)
1) Gebruik uitsluitend informatie die in de input staat. Verbanden onderbouw je met concrete antwoorden uit de input; voeg geen nieuwe feiten of aannames toe.
2) Geen medische termen, diagnoses of medische conclusies. Geen behandeladviezen, medicatie of therapie. Gebruik alledaagse taal (bijv. "slechter slapen", "weinig energie", "moe", "spanning").
3) Anonimiseer: geen namen, bedrijfsnamen, locaties of herkenbare details. Gebruik neutrale termen ("een collega", "een leidinggevende", "thuis", "werk").
4) Noem NOOIT cijfers of schalen ("1–7", "X van 7", "score", "risico-score", enz.). Schaalwaarden vertaal je alleen naar mensentaal.
5) Niet ingevulde velden: benoem neutraal of laat weg; vul niets in.
6) Respectvol en niet-veroordelend. Geen dramatiek, geen schuldvraag.
7) Adviezen alleen binnen preventieve begeleiding en werkcontext. Geen medische adviezen.

OPMAAK EN STIJL
- Schrijf in vloeiende, doorlopende tekst. Geen vaste formules of telkens dezelfde lead-zinnen (zoals "De kern in één zin" of "Wat je nu draagt"). Varieer je zinnen en opbouw; laat de inhoud de structuur bepalen.
- Geen bulletlists, geen Markdown-koppen (# / ##). Geen verplichte bold; gewone lopende tekst is prima.
- Het mag uit meerdere paragrafen bestaan (met witregels), maar hoeft niet precies 3–6 te zijn—zolang het één samenhangend geheel is en geen opsomming.
- Je mag concrete gesprekspunten of een eerste stap voor 1–2 weken voorstellen (grenzen, prioriteiten, rust, afspraken, communicatie), in keuzetaal ("je kunt overwegen …", "een logische stap is …").
- Tot circa 1000 woorden bij rijke input; geen herhaling. Alleen de tekst, geen meta-uitleg.`;

// Label-mapping: ids uit de vragenlijst → leesbare tekst voor de prompt (sluit aan op formulier)
const HOOFDOORZAAK_LABELS: Record<string, string> = {
  werkdruk: "Werkdruk / stress",
  samenwerking: "Samenwerking of conflict",
  prive: "Privé-omstandigheden",
  energie: "Energie (fysiek of mentaal)",
  combinatie: "Combinatie werk en privé",
  incident: "Een incident",
  anders: "Anders",
}
const SINDS_LABELS: Record<string, string> = {
  vandaag: "Vandaag",
  dagen: "Enkele dagen",
  weken: "Enkele weken",
  maanden: "Enkele maanden",
  langer: "Langer dan 6 maanden",
}
const CONFLICT_MET_LABELS: Record<string, string> = {
  collega: "Collega",
  leidinggevende: "Leidinggevende",
  team: "Team",
  extern: "Externe partij",
}
const CONFLICT_UITKOMST_LABELS: Record<string, string> = {
  voorbereiden: "Gesprek voorbereiden",
  bemiddeling: "Bemiddeling",
  grenzen: "Grenzen bepalen",
  ordenen: "Verhaal ordenen",
}
const WERKDRUK_DUUR_LABELS: Record<string, string> = {
  kort: "Kort",
  weken: "Enkele weken",
  maanden: "Enkele maanden",
  lang: "Langere tijd",
}
const WERKDRUK_HELPT_LABELS: Record<string, string> = {
  "minder-taken": "Minder taken",
  duidelijkheid: "Meer duidelijkheid",
  rust: "Tijdelijke rust",
  sparren: "Iemand om mee te sparren",
  anders: "Anders",
}
const PRIVE_DELEN_LABELS: Record<string, string> = {
  ja: "Ja, kort",
  gesprek: "Liever tijdens het gesprek",
  niet: "Liever niet",
}
const TERUGKOPPELING_LABELS: Record<string, string> = {
  praktisch: "Ja, alleen praktisch (uren / taken / planning)",
  thema: "Ja, ook het hoofdthema in één zin",
  "na-gesprek": "Ja, maar pas na het Time-out gesprek",
  nee: "Nee, nog niet",
}

function scaleToWords(
  value: unknown,
  kind: "zwaarte" | "risico" | "belangrijkheid" | "veiligheid"
): string {
  const n = typeof value === "number" ? value : Number(value);
  const band =
    Number.isFinite(n) && n <= 2
      ? "licht / beperkt"
      : n === 3
      ? "aanwezig, maar nog te dragen"
      : n === 4
      ? "middelmatig / duidelijk aanwezig"
      : n === 5
      ? "zwaar / fors"
      : n === 6
      ? "heel zwaar / dringend"
      : n >= 7
      ? "extreem zwaar / acuut"
      : "Niet ingevuld";

  if (band === "Niet ingevuld") return band;

  if (kind === "zwaarte") return `dit weegt ${band}`;
  if (kind === "risico") return `de kans dat dit je werk gaat raken is ${band}`;
  if (kind === "belangrijkheid") return `dit gesprek voelt ${band} belangrijk`;
  if (kind === "veiligheid") return `je voelt je ${band} veilig om dit te bespreken`;

  return band;
}

function pushLine(lines: string[], label: string, value: unknown) {
  if (value === undefined || value === null) return;
  const s = String(value).trim();
  if (!s) return;
  lines.push(`${label}: ${s}`);
}

function pushArray(lines: string[], label: string, value: unknown) {
  const arr = Array.isArray(value) ? value : [];
  const cleaned = arr.map(String).map((x) => x.trim()).filter(Boolean);
  if (cleaned.length > 0) lines.push(`${label}: ${cleaned.join(", ")}`);
}

function label<T extends Record<string, string>>(map: T, id: unknown): string {
  const s = String(id ?? "").trim();
  return (map as Record<string, string>)[s] ?? (s || "");
}

function buildUserPrompt(fd: Record<string, unknown>): string {
  const lines: string[] = [];
  const hoofdoorzaak = String(fd.hoofdoorzaak ?? "").toLowerCase();

  // —— Aanleiding (sluit aan op vraag "Wat brengt jou tot deze aanvraag?") ——
  const oorzaakLabel = label(HOOFDOORZAAK_LABELS, fd.hoofdoorzaak) || String(fd.hoofdoorzaak ?? "");
  pushLine(lines, "Wat brengt je tot deze aanvraag (aanleiding)", oorzaakLabel);
  pushLine(lines, "Toelichting bij aanleiding", fd.hoofdoorzaakToelichting);
  if (hoofdoorzaak === "anders") pushLine(lines, "Toelichting anders", fd.andersText);

  lines.push(`Hoe zwaar voelt dit nu: ${scaleToWords(fd.zwaarte, "zwaarte")}`);

  // —— Factoren, sinds wanneer, risico (Situatie) ——
  pushArray(lines, "Spelen er nog andere factoren mee", fd.factoren);
  pushLine(lines, "Toelichting factoren", fd.factorenToelichting);
  const sindsLabel = label(SINDS_LABELS, fd.sinds) || String(fd.sinds ?? "");
  pushLine(lines, "Sinds wanneer is dit een probleem", sindsLabel);
  lines.push(`Kans dat dit richting verzuim gaat (inschatting medewerker): ${scaleToWords(fd.risico, "risico")}`);

  // —— Signalen en doelen ——
  pushArray(lines, "Signalen die je herkent op werk", fd.signalen);
  pushLine(lines, "Toelichting signalen", fd.signalenToelichting);
  pushArray(lines, "Wat wil je uit het eerste gesprek halen (doelen)", fd.doelen);
  pushLine(lines, "Toelichting doelen", fd.doelenToelichting);
  lines.push(`Hoe belangrijk is dit gesprek voor je: ${scaleToWords(fd.belangrijkheid, "belangrijkheid")}`);

  // —— Route-specifiek ——
  if (hoofdoorzaak === "werkdruk" || hoofdoorzaak === "incident") {
    pushArray(lines, "Wat geeft je nu de meeste druk", fd.werkdrukDruk);
    pushLine(lines, "Hoe lang speelt dit al", label(WERKDRUK_DUUR_LABELS, fd.werkdrukDuur) || fd.werkdrukDuur);
    pushArray(lines, "Wat heb je al geprobeerd", fd.werkdrukGeprobeerd);
    const helptLabel = label(WERKDRUK_HELPT_LABELS, fd.werkdrukHelpt) || String(fd.werkdrukHelpt ?? "");
    pushLine(lines, "Wat zou de komende 1–2 weken het meest helpen", helptLabel);
    pushLine(lines, "Wat zou helpen (eigen woorden)", fd.werkdrukHelptAnders);
  } else if (hoofdoorzaak === "samenwerking") {
    pushLine(lines, "Met wie speelt dit vooral", label(CONFLICT_MET_LABELS, fd.conflictMet) || fd.conflictMet);
    pushArray(lines, "Waar gaat het vooral over", fd.conflictWaarover);
    lines.push(`Hoe veilig voelt het om dit intern te bespreken: ${scaleToWords(fd.conflictVeilig, "veiligheid")}`);
    pushLine(lines, "Mag er contact zijn met leidinggevende hierover", fd.conflictContact);
    pushLine(lines, "Gewenste uitkomst van het gesprek", label(CONFLICT_UITKOMST_LABELS, fd.conflictUitkomst) || fd.conflictUitkomst);
  } else if (hoofdoorzaak === "prive" || hoofdoorzaak === "combinatie") {
    pushArray(lines, "Waar gaat het vooral over (privé)", fd.priveWaarover);
    pushLine(lines, "Wil je vooraf al iets delen", label(PRIVE_DELEN_LABELS, fd.priveDelen) || fd.priveDelen);
    pushLine(lines, "Wat wil je delen (toelichting)", fd.priveDelenText);
    pushArray(lines, "Wat heb je vanuit werk het meest nodig", fd.priveNodig);

    pushLine(lines, "Mantelzorg: voor wie zorg je", fd.mantelzorgVoor);
    if (fd.mantelzorgZwaar !== undefined && fd.mantelzorgZwaar !== null) {
      lines.push(`Mantelzorg hoe zwaar: ${scaleToWords(fd.mantelzorgZwaar, "zwaarte")}`);
    }
    pushLine(lines, "Mantelzorg: wat knelt het meest", fd.mantelzorgKnelt);

    pushLine(lines, "Relatie/thuis: wat past het best", fd.relatieWat);
    pushLine(lines, "Relatie/thuis: waar merk je dit vooral", fd.relatieMerkt);
    pushLine(lines, "Kinderen/gezin: wat speelt vooral", fd.kinderenWat);
    pushLine(lines, "Kinderen/gezin: grootste knelpunt richting verzuim", fd.kinderenKnelpunt);
  } else if (hoofdoorzaak === "energie") {
    pushArray(lines, "Wat merk je vooral", fd.energieMerkt);
    pushArray(lines, "Grootste zorg als dit zo doorgaat", fd.energieZorg);
    pushLine(lines, "Is er al professionele hulp gezocht", fd.energieHulp);
  }

  if (hoofdoorzaak === "combinatie") {
    const pctWerk = typeof fd.combinatieVerdeling === "number" ? fd.combinatieVerdeling : Number(fd.combinatieVerdeling);
    if (Number.isFinite(pctWerk)) {
      const pctPrive = Math.max(0, Math.min(100, 100 - pctWerk));
      lines.push(`Verdeling belasting: ongeveer ${pctWerk}% werk en ${pctPrive}% privé`);
    }
    pushLine(lines, "Eerste kleine verandering die lucht zou geven", fd.combinatieVerandering);
  }

  // —— Wat nodig is om verzuim te voorkomen + randvoorwaarden ——
  pushArray(lines, "Wat kunnen we nu doen om verzuim te voorkomen", fd.closingNodig);
  pushLine(lines, "Toelichting hierop", fd.closingToelichting);
  if (fd.closingBelangrijk !== undefined && fd.closingBelangrijk !== null) {
    lines.push(`Hoe belangrijk is dat voor je: ${scaleToWords(fd.closingBelangrijk, "belangrijkheid")}`);
  }
  pushLine(lines, "Wat wil je absoluut wel bereiken met deze time-out", fd.randWelBereiken);
  pushLine(lines, "Wat wil je absoluut niet dat dit gesprek wordt", fd.randNietBereiken);
  const tkLabel = label(TERUGKOPPELING_LABELS, fd.terugkoppeling) || String(fd.terugkoppeling ?? "");
  pushLine(lines, "Terugkoppeling richting werkgever", tkLabel);

  return lines.join("\n");
}

export async function POST(req: Request) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY ontbreekt in environment variables." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const formData = (body?.formData ?? {}) as Record<string, unknown>;

    const userPrompt = buildUserPrompt(formData);

    const resp = await client.responses.create({
      model: "gpt-5.2",
      reasoning: { effort: "high" },
      max_output_tokens: 1800,
      input: [
        { role: "developer", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const summary = (resp.output_text ?? "").trim();
    return Response.json({ summary });
  } catch (err: any) {
    console.error("timeout/summarize error:", err?.message ?? err);
    return new Response(
      JSON.stringify({ error: "Summarize failed", detail: err?.message ?? String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
