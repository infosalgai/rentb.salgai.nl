# Test-checklist: Hoofdoorzaak-optie tooltips (Time-out intake)

## Wat getest wordt
- Optie-meta (thema + tooltip) bij Stap 1 "Wat brengt jou tot deze aanvraag?"
- Toegankelijkheid (hover, click, keyboard, aria)
- Mobiel: tap op (i) opent tooltip; tap buiten sluit

## Handmatige checks

- [ ] **Desktop – Hover**  
  Hover over het info-icoon (i) bij een optie → tooltip opent met thema-label, uitleg en (indien aanwezig) "Waarom we dit vragen".

- [ ] **Desktop – Click**  
  Klik op (i) → tooltip opent; nogmaals klikken → sluit. Klik op de kaart (niet op (i)) → optie wordt geselecteerd, tooltip sluit niet per se (mag).

- [ ] **Mobiel / touch**  
  Tap op (i) → tooltip opent. Tap buiten de tooltip (of op (i) nogmaals) → tooltip sluit. Tap op de kaart → optie wordt geselecteerd.

- [ ] **Toetsenbord**  
  Tab naar (i), Enter/Space → tooltip opent. Tab weg of Escape (indien ondersteund) → tooltip sluit. Focus zichtbaar (focus ring).

- [ ] **Screenreader**  
  (i) heeft een aria-label zoals "Uitleg bij [optie]". Tooltip-inhoud (thema + help + why) is leesbaar.

- [ ] **Alle zeven opties**  
  Werkdruk, Samenwerking, Privé, Energie, Combinatie, Incident, Anders: bij elke optie opent (i) een tooltip met het juiste thema (Psychische / Mentale / Medische gezondheid) en B1/B2-tekst zonder diagnose-taal.

- [ ] **Geen regressie**  
  Zonder op (i) te klikken: kiezen van een optie en door naar de volgende stap gaan werkt zoals voorheen.

---

# Test-checklist: Verplichte keuze + neutrale opties (Time-out vragenlijst)

## Doel
- Keuzevragen (radio/select/checkbox) zijn verplicht: "Volgende" is disabled tot er een geldige keuze is.
- Neutrale opties ("Weet ik niet", "Niet relevant voor mij" / "Niet relevant / n.v.t.") tellen als geldige keuze.
- Bij fout: inline melding + toegankelijke feedback.

## Handmatige checks

### Radio / single choice
- [ ] **Verplicht, niets gekozen**  
  Ga naar een keuzevraag (radio of select). Kies niets → knop "Volgende" is **disabled**.

- [ ] **"Weet ik niet" gekozen**  
  Kies "Weet ik niet" → "Volgende" wordt **enabled**. Ga door → volgende stap.

- [ ] **"Niet relevant voor mij" gekozen**  
  Kies "Niet relevant voor mij" → "Volgende" wordt **enabled**. Ga door → volgende stap.

### Checkbox (multi)
- [ ] **Verplicht, niets gekozen**  
  Ga naar een multi-keuzevraag (checkbox-lijst). Vink niets aan → "Volgende" is **disabled**.

- [ ] **Alleen "Niet relevant / n.v.t."**  
  Vink alleen "Niet relevant / n.v.t." aan → "Volgende" **enabled**; andere opties zijn uit of worden uitgeschakeld.

- [ ] **n.v.t. aangevinkt, daarna andere optie**  
  Eerst "Niet relevant / n.v.t." aanvinken, daarna een andere optie aanvinken → "n.v.t." gaat **uit**, andere optie blijft aan.

- [ ] **Andere optie eerst, daarna n.v.t.**  
  Eerst een inhoudelijke optie aanvinken, daarna "Niet relevant / n.v.t." → alleen "n.v.t." blijft geselecteerd (mutual exclusive).

### Foutmelding en navigatie
- [ ] **Enter / door gaan zonder keuze**  
  Op een verplichte vraag: probeer door te gaan (bijv. Enter op de knop als die toch focus heeft, of custom navigatie) → inline melding: "Kies één optie om door te gaan. Je kunt ook 'Weet ik niet' of 'Niet relevant' kiezen."

- [ ] **Melding verdwijnt**  
  Na het maken van een geldige keuze verdwijnt de foutmelding; "Volgende" wordt enabled.

### Toegankelijkheid
- [ ] **Tab / Enter**  
  Tab door opties en knoppen: focus zichtbaar; Enter op een radio/optie selecteert; Enter op "Volgende" (wanneer enabled) gaat door.

- [ ] **Screenreader**  
  Bij tonen van de foutmelding: melding wordt voorgelezen (aria-live/role="alert"); focus gaat naar de melding of eerste optie.

- [ ] **Labels**  
  Alle radio’s/checkboxes hebben correcte labels; velden zijn met toetsenbord bereikbaar.

### Randgevallen
- [ ] **Vorige**  
  Ga een stap terug: eerder gekozen waarde (inclusief "Weet ik niet" / "Niet relevant") blijft behouden.

- [ ] **Niet-verplichte stappen**  
  Stappen zonder verplichte keuze (bijv. open tekst): "Volgende" blijft altijd enabled.

- [ ] **Terugkoppeling**  
  Stap "Mag er terugkoppeling richting je werkgever plaatsvinden?": zowel een radio-keuze als het aanvinken van de akkoord-checkbox zijn verplicht; pas dan "Volgende" enabled.

## Optioneel (als er tests draaien)
- `HOOFDOORZAAK_OPTION_META`: elke key in `HOOFDOORZAAK_OPTIONS.map(o => o.id)` bestaat in `HOOFDOORZAAK_OPTION_META`.
- `OptionMeta`: elk item heeft `themeTag`, `label`, `help`; `why` is optioneel.
