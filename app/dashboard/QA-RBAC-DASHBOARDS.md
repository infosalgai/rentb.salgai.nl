# QA-checklist: RBAC en dashboards (HR vs Leidinggevende)

## Doel
- HR en Leidinggevende zijn twee aparte rollen met eigen dashboards en rechten.
- Alleen de juiste rol mag bij het juiste dashboard; directe URL-toegang wordt geblokkeerd.

## Handmatige checks

### Onboarding (eerste pagina)
- [ ] **Vier rollen zichtbaar**  
  Op /demo staan vier opties: Medewerker, Coach, HR, Leidinggevende (niet meer "HR/Leidinggevende" gecombineerd).

- [ ] **Tekst HR**  
  HR: "Bekijk geanonimiseerde rapportages en trends. Geen medische details of vrije tekst van medewerkers."

- [ ] **Tekst Leidinggevende**  
  Leidinggevende: "Zie alleen status en voortgang van je team op procesniveau. Geen inhoudelijke of gevoelige antwoorden."

### Routing na route-keuze
- [ ] **HR → /dashboard/hr**  
  Kies HR, kies Time-out of Navigatiegesprek, Start demo → kom op /dashboard/hr.

- [ ] **Leidinggevende → /dashboard/leidinggevende**  
  Kies Leidinggevende, kies route, Start demo → kom op /dashboard/leidinggevende.

### Authorisatie (directe URL)
- [ ] **/dashboard/hr zonder HR-rol**  
  Zet rol op Medewerker (of clear cookie + localStorage), ga direct naar /dashboard/hr → redirect naar /demo.

- [ ] **/dashboard/leidinggevende zonder manager-rol**  
  Zet rol op HR, ga direct naar /dashboard/leidinggevende → redirect naar /demo.

- [ ] **Middleware + cookie**  
  Na het kiezen van een rol (Ga verder) wordt een cookie gezet. Bij direct openen van /dashboard/hr in nieuwe tab zonder eerst rol te kiezen → redirect /demo.

### HR-dashboard
- [ ] **Alleen geanonimiseerde data**  
  HR-dashboard toont aantallen, thema’s, funnel; geen namen of vrije tekst.

- [ ] **Privacy-callout**  
  Tekst over privacy-bescherming en geanonimiseerde weergave is zichtbaar.

### Leidinggevende-dashboard
- [ ] **Drie+ widgets**  
  Minimaal: lopende trajecten in team, status-overzicht, volgende acties (placeholder data mag).

- [ ] **Geen organisatiebrede trends**  
  Geen grafieken over hele organisatie; alleen team-scope.

- [ ] **Geen exports**  
  Melding of afwezigheid van export voor leidinggevenden.

- [ ] **Privacy-callout**  
  Tekst dat alleen procesniveau wordt getoond, geen medische details of vrije tekst.

### Header en navigatie
- [ ] **Badge HR**  
  Op /dashboard/hr toont de header "HR" met tooltip "Alleen geanonimiseerde data, geen medische details".

- [ ] **Badge Leidinggevende**  
  Op /dashboard/leidinggevende toont de header "Leidinggevende" met tooltip over team-scope en procesniveau.

### Edge cases
- [ ] **Rol wisselen**  
  "Switch rol" in header → terug naar /demo; kies andere rol → juiste dashboard voor die rol.

- [ ] **Geen gevoelige data in logs**  
  Geen vrije tekst of medische gegevens in console/server logs (handmatig controleren bij gebruik).
