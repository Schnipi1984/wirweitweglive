# WirWeitWeg – Projekt-Zusammenfassung (Stand: 19. Mai 2026)

## Anweisung an Claude
Effizient und tokensparend. Keine Erklärungen, keine Zusammenfassungen. Kurze Statusmeldungen. Einfach machen. Keine Rückfragen ausser bei wirklich kritischen Aktionen.

---

## Projekt-Übersicht

- **Blog:** https://wirweitweg.blog
- **GitHub:** https://github.com/Schnipi1984/wirweitweglive (Branch: `main`)
- **Deployment:** GitHub Push → Cloudflare Pages (~20–60 Sek. automatisch)
- **Betreiber:** Fabienne & Marc aus Solothurn (Schreibweise: Fabienne immer vor Marc)
- **Abflug:** 30. Juni 2026, Reise durch Asien
- **GitHub-Token:** gespeichert unter `/Users/marcammann/.claude/projects/-Users-marcammann/gh_token`
- **Brevo API-Key:** In Cloudflare Pages als Umgebungsvariable `BREVO_API_KEY` gesetzt (nicht hier speichern)

---

## Deploy-Script (Python)

```python
import urllib.request, json, base64

token = open('/Users/marcammann/.claude/projects/-Users-marcammann/gh_token').read().strip()
with open('dateiname.html', 'rb') as f:
    content = base64.b64encode(f.read()).decode()

req = urllib.request.Request(
    'https://api.github.com/repos/Schnipi1984/wirweitweglive/contents/dateiname.html',
    headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}
)
sha = json.loads(urllib.request.urlopen(req).read())['sha']
data = json.dumps({'message': 'beschreibung', 'content': content, 'sha': sha}).encode()
req2 = urllib.request.Request(
    'https://api.github.com/repos/Schnipi1984/wirweitweglive/contents/dateiname.html',
    data=data, method='PUT',
    headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json'}
)
print(urllib.request.urlopen(req2).status)  # 200 = OK
```

**Neue Dateien (noch nicht auf GitHub):** SHA-Abfrage weglassen, PUT ohne `sha`-Feld.

---

## Datei-Übersicht (lokal: `/Users/marcammann/Desktop/wirweitweglive/`)

### Kern-Dateien
| Datei | Beschreibung |
|-------|-------------|
| `index.html` | **GESPERRT** – nur mit expliziter Erlaubnis anfassen |
| `_worker.js` | Cloudflare Worker – Newsletter-Function. **NIEMALS löschen!** |
| `functions/newsletter.js` | Backup (wird von _worker.js überschrieben) |
| `style.css` | Gemeinsames CSS aller Planungsseiten |
| `script.js` | Gemeinsames JS |
| `sitemap.xml` | Alle Seiten, bei Google Search Console eingereicht |
| `robots.txt` | `Allow: /`, zeigt auf sitemap.xml |
| `CLAUDE.md` | Projektregeln für Claude |
| `AgodaPartnerVerification.html` | Agoda Partner-Verifizierung |
| `map-preview.html` | Lokale Preview-Datei (nicht auf GitHub, kann gelöscht werden) |

### Utility-Seiten
| Datei | URL | Beschreibung |
|-------|-----|-------------|
| `danke.html` | /danke | Newsletter-Bestätigung |
| `danke-packliste.html` | /danke-packliste | Packliste-Download-Bestätigung |
| `404.html` | automatisch | Custom 404 |
| `email-doubleoptin.html` | — | Brevo E-Mail-Template (lokal + auf GitHub + in Brevo Template 2 eingespielt) |

### Planungsseiten
`weltreise-planung.html` (**GESPERRT**), `idee-zeitplan.html` (**GESPERRT**), `budget-kosten.html`, `job-auto-wohnung.html`, `dokumente.html`, `auslandskrankenversicherung.html`, `kreditkarten.html`, `impfungen.html`, `routenplanung-visum.html`, `packliste.html`, `technik-auf-reisen.html`, `wichtige-apps.html`

### Länderguides
`thailand.html`, `vietnam.html`, `indonesien.html`, `japan.html`, `malaysia.html`, `singapur.html`, `kambodscha.html`, `laos.html`, `philippinen.html`

### Weitere Seiten
`laenderguides.html`, `reisetipps.html`, `sim-karten.html`, `transport.html`, `unterkuenfte.html`, `lifehacks.html`, `reiseblog.html`, `ueber-uns.html`, `newsletter.html`, `kontakt.html`, `impressum.html`, `datenschutz.html`

---

## CSS Design-System

### ZWEI getrennte Welten – nie mischen!

| | `index.html` | Planungsseiten | newsletter/danke/404 |
|---|---|---|---|
| `--green` | `#3d7a5c` | `#2d6a4f` | `#0e9f6e` |
| `--ink` | `#1a1611` | `#151210` | `#1e1e2e` |
| CSS-Quelle | Inline | `style.css` + inline | `style.css` + inline |
| Vorlage | — | `auslandskrankenversicherung.html` | — |

### Fonts (alle Seiten ausser index.html)
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```
- **Fraunces** → Headlines, Logo
- **Nunito** → Fliesstext, Buttons

### Logo (überall identisch)
```html
<a class="logo" href="/">Wir<span>Weit</span>Weg</a>
```

### Social Icons (Reihenfolge fest)
Instagram → TikTok → YouTube → Pinterest. Kein Facebook, kein WhatsApp.

| Plattform | URL |
|-----------|-----|
| Instagram | https://www.instagram.com/_wir_weit_weg_/ |
| TikTok | https://www.tiktok.com/@wir_weit_weg |
| YouTube | https://www.youtube.com/@Wirweitweg555 |
| Pinterest | https://pinterest.com/wirweitweg |

### Buy Me a Coffee Button
- **Hintergrund:** `#6EE7B7`
- **Schriftfarbe:** `#1E1E2E`
- Klasse: `.bmc-btn` — in `style.css` und in jedem HTML inline definiert

---

## Newsletter (Brevo)

- **Endpoint:** `POST /functions/newsletter` (gehandelt von `_worker.js`)
- **Request-Body:** `{ vorname, email, quelle }` — `quelle` = `"newsletter"` oder `"packliste"`
- **Listen:** ID 2 (Newsletter), ID 5 (Packliste)
- **Template ID:** 2 (Double Opt-In) — aktualisiert mit `email-doubleoptin.html`
- **Umgebungsvariable in Cloudflare Pages:** `BREVO_API_KEY`
- **Absender:** wirweitweg555@gmail.com

### Formular-IDs Startseite (index.html)
`id="nlVorname"`, `id="nlEmail"`, `id="nlBtn"` + `onclick="nlSubmit()"`

### Formular-IDs newsletter.html
`id="nlVorname"`, `id="nlEmail"`, `id="nlBtn"` + `onsubmit="nlSubmit(event)"`

### Sidebar-Formular (alle Planungsseiten)
`id="sbVorname"`, `id="sbEmail"`, `id="sbBtn"` + `onclick="sbSubmit()"`

---

## Interaktive Weltkarte (index.html)

- **Library:** D3.js v7 + TopoJSON
- **Datensatz:** `countries-50m.json` (world-atlas@2) — 50m für Hongkong-Support
- **Projektion:** `geoNaturalEarth1`, Scale `w/4.83`, Translate `[w*0.5, h*0.53]`
- **Höhe:** 650px Desktop / 435px Tablet / 325px Mobile
- **Zoom:** Scrollen zum Zoomen (1×–10×), Drag zum Verschieben, Doppelklick zum Zurücksetzen
- **Farben:** Heimat (Schweiz) `#2d6a4f`, Reiseziele `#a8d5b5`, andere `#ddd8d0`
- **Hover:** Alle Ländernamen auf Deutsch (~170 Länder)
- **Stecknadel:** Rot (`#e63946`), Spitze zeigt auf Schweiz-Zentroid `[8.2, 46.8]`, bleibt beim Zoomen konstant gross
- **Legende Reihenfolge:** „Da sind wir jetzt" (Stecknadel) → „Schweiz (Heimat)" → „Geplante Destinationen"
- **Aktueller Standort:** Schweiz (bis Abflug 30. Juni 2026)

### Reiseziel-IDs (ISO 3166-1 numerisch)
| Land | ID | Link |
|------|----|------|
| Thailand | 764 | /thailand.html |
| Vietnam | 704 | /vietnam.html |
| Indonesien | 360 | /indonesien.html |
| Malaysia | 458 | /malaysia.html |
| Singapur | 702 | /singapur.html |
| Kambodscha | 116 | /kambodscha.html |
| Laos | 418 | /laos.html |
| Philippinen | 608 | /philippinen.html |
| Japan | 392 | /japan.html |

---

## Externe Dienste

### Google Analytics
- **Measurement ID:** `G-1HJNKXTYYZ` — auf allen Seiten

### Google Search Console
- **Verifiziert:** Ja (`googleb1e14db7408d15a8.html`)
- **Sitemap:** https://wirweitweg.blog/sitemap.xml — 34 Seiten erkannt

### Buy Me a Coffee
- **URL:** https://buymeacoffee.com/wirweitweg
- **Login:** wirweitweg555@gmail.com
- Auf allen Seiten als fixierter Button eingebaut

### Agoda Partner
- **Status:** Manuelle Verifizierung eingereicht (dauert bis 1 Woche)
- **Seiten-ID:** 1965690
- **Verifikationsdatei:** `/AgodaPartnerVerification.html` — live
- **Problem:** Cloudflare blockt Agoda-Crawler → manuelle Bestätigung nötig

---

## Cloudflare
- **Account ID:** `3b0dcf517e5e9a8a02b13c54700023c4`
- **Account:** Schnipi12@gmail.com's Account
- Auto-Deploy via GitHub Push auf `main`

---

## Logos (lokal)

| Datei | Verwendung |
|-------|-----------|
| `logo.png` | Favicon (transparentes PNG, 500×500px) |
| `logo-schwarz.png` | Footer aller Seiten |
| `logo-white.png` | — |
| `logo-email.png` | Brevo E-Mail (auf GitHub) |

---

## Affiliate-Programme

### Bereits eingerichtet
| Programm | Status |
|----------|--------|
| Agoda | Verifizierung ausstehend (manuell, ~1 Woche) |

### Noch anzumelden (Priorität)
| # | Programm | Provision | Anmeldung | Seiten |
|---|----------|-----------|-----------|--------|
| 1 | Booking.com | 25-40% | booking.com/affiliate-program | unterkuenfte, Länderguides |
| 2 | Klook | 5% | affiliate.klook.com | alle Länderguides (Asien!) |
| 3 | SafetyWing | 10% | safetywing.com/affiliate | auslandskrankenversicherung |
| 4 | Airalo | 9% | airalo.com/affiliate-program | sim-karten, Länderguides |
| 5 | Holafly | 20% | holafly.com/affiliate | sim-karten, Länderguides |
| 6 | 12Go Asia | 60% | 12go.asia/affiliate | transport, Länderguides |
| 7 | Wise | £50/Kunde | wise.com/refer | kreditkarten |
| 8 | GetYourGuide | 8% | supply.getyourguide.com | alle Länderguides |
| 9 | Hostelworld | 40% | hostelworld.com/affiliate | unterkuenfte |
| 10 | Airbnb | ~$75 | airbnb.com/associates | unterkuenfte |
| 11 | Skyscanner | variabel | skyscanner.net/affiliates | routenplanung-visum |
| 12 | NordVPN | 30-40% | nordvpn.com/affiliate | technik, wichtige-apps |
| 13 | Amazon.de | 3-10% | affiliate-program.amazon.de | packliste, technik |
| 14 | Trip.com | 4-6% | trip.com/affiliate | Länderguides (Asien) |
| 15 | Viator | 8% | viator.com/partner | alle Länderguides |

---

## Wichtige Regeln

1. **`index.html` NIE ohne explizite Erlaubnis anfassen**
2. **`weltreise-planung.html`** und **`idee-zeitplan.html`** ebenfalls gesperrt
3. **`_worker.js` NIE löschen** – Newsletter bricht sonst zusammen
4. Keine Änderungen ohne expliziten Auftrag
5. Vorlage neue Planungsseiten: `auslandskrankenversicherung.html`
6. Nach Push: `_worker.js` auf GitHub verifizieren

---

## Bereits durchgeführte Korrekturen

### Mai 2026
- **Singapur im Dropdown-Menü** ergänzt (`index.html` Desktop-Nav + `routenplanung-visum.html` Mobile-Nav)
- **h3-CSS** nachgepflegt in allen 8 Länderguides
- **Buy Me a Coffee Button** Farbe geändert: `#FFDD00`/schwarz → `#6EE7B7`/`#1E1E2E` (alle 36 Dateien)
- **Logo** durch transparente Version ersetzt (`logo.png`, 500×500px)
- **Agoda META-Tag** in `index.html` eingefügt
- **`AgodaPartnerVerification.html`** erstellt und gepusht
- **Brevo Double Opt-In Template 2** via API aktualisiert
- **Interaktive Weltkarte** überarbeitet:
  - Zoom/Pan per Maus (Scrollen, Doppelklick reset)
  - Karte 25% grösser (650px, Scale w/4.83)
  - Alle Ländernamen auf Deutsch (~170 Länder) im Hover
  - Datensatz auf `countries-50m.json` umgestellt (Hongkong sichtbar)
  - Rote Stecknadel auf Schweiz (aktueller Standort)
  - Legende: „Da sind wir jetzt" als erstes, grösser

---

## Agoda Verifizierung – Status

- Datei live: `https://wirweitweg.blog/AgodaPartnerVerification.html` ✓
- Automatische Verifizierung schlägt fehl: **Cloudflare blockt Agoda-Crawler**
- **Lösung:** Manuelle Verifizierung eingereicht – dauert bis zu 1 Woche
- Seiten-ID: `1965690`

---

## Offene To-dos

- [ ] Agoda Verifizierung abwarten (~1 Woche)
- [ ] Affiliate-Links bei den restlichen Programmen anmelden und einbauen
- [ ] `ueber-uns.html` – wartet auf Fotos von Fabienne & Marc
- [ ] YouTube Video-IDs – sobald erste Videos live: `loadYT(this,'VIDEO_ID')` in `index.html`
- [ ] Blog-Artikel – 3× „Bald verfügbar" → echte Artikel während der Reise
- [ ] `kambotscha.html` löschen (Duplikat von `kambodscha.html`)
- [ ] `map-preview.html` löschen (lokale Vorschau-Datei, nicht auf GitHub)
- [ ] Stecknadel-Koordinaten anpassen wenn Reise startet (aktuell: Schweiz `[8.2, 46.8]`)
