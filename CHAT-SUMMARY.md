# WirWeitWeg – Projekt-Zusammenfassung (Stand: 17. Mai 2026)

## Anweisung an Claude
Effizient und tokensparend. Keine Erklärungen, keine Zusammenfassungen. Kurze Statusmeldungen. Einfach machen.

---

## Projekt-Übersicht

- **Blog:** https://wirweitweg.blog
- **GitHub:** https://github.com/Schnipi1984/wirweitweglive (Branch: `main`)
- **Deployment:** GitHub Push → Cloudflare Pages (~20–60 Sek. automatisch)
- **Betreiber:** Fabienne & Marc aus Solothurn (Schreibweise: Fabienne immer vor Marc)
- **Abflug:** 30. Juni 2026, Reise durch Asien
- **GitHub-Token:** gespeichert unter `/Users/marcammann/.claude/projects/-Users-marcammann/gh_token`

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

**Neue Dateien (noch nicht auf GitHub):** sha-Abfrage weglassen, PUT ohne `sha`-Feld.

---

## Datei-Übersicht (lokal: `/Users/marcammann/Desktop/wirweitweglive/`)

### Kern-Dateien
| Datei | Beschreibung |
|-------|-------------|
| `index.html` | **GESPERRT** – nur mit expliziter Erlaubnis anfassen |
| `_worker.js` | Cloudflare Worker – Newsletter-Function. **NIEMALS löschen!** |
| `functions/newsletter.js` | Backup (wird von _worker.js überschrieben) |
| `style.css?v=3` | Gemeinsames CSS aller Planungsseiten |
| `script.js` | Gemeinsames JS |
| `sitemap.xml` | Alle Seiten, bei Google Search Console eingereicht |
| `robots.txt` | `Allow: /`, zeigt auf sitemap.xml |
| `CLAUDE.md` | Projektregeln für Claude |

### Utility-Seiten
| Datei | URL | Beschreibung |
|-------|-----|-------------|
| `danke.html` | /danke | Newsletter-Bestätigung, im newsletter.html-Stil |
| `danke-packliste.html` | /danke-packliste | Packliste-Download-Bestätigung |
| `404.html` | automatisch | Custom 404 im newsletter.html-Stil |
| `email-doubleoptin.html` | — | Brevo E-Mail-Template (lokal + auf GitHub) |

### Planungsseiten
`weltreise-planung.html` (**GESPERRT**), `idee-zeitplan.html` (**GESPERRT**), `budget-kosten.html`, `job-auto-wohnung.html`, `dokumente.html`, `auslandskrankenversicherung.html`, `kreditkarten.html`, `impfungen.html`, `routenplanung-visum.html`, `packliste.html`, `technik-auf-reisen.html`, `wichtige-apps.html`

### Länderguides
`thailand.html`, `vietnam.html`, `indonesien.html`, `japan.html`, `malaysia.html`, `singapur.html`, `kambodscha.html`, `laos.html`, `philippinen.html`
> `kambotscha.html` = Duplikat → löschen!

### Weitere Seiten
`laenderguides.html`, `reisetipps.html`, `sim-karten.html`, `transport.html`, `unterkuenfte.html`, `lifehacks.html`, `reiseblog.html`, `ueber-uns.html`, `newsletter.html`, `kontakt.html`, `impressum.html`, `datenschutz.html`

---

## CSS Design-System

### ZWEI getrennte Welten – nie mischen!

| | `index.html` | Planungsseiten | newsletter/danke/404 |
|---|---|---|---|
| `--green` | `#3d7a5c` | `#2d6a4f` | `#0e9f6e` |
| `--ink` | `#1a1611` | `#151210` | `#1e1e2e` |
| CSS-Quelle | Inline | `style.css?v=3` + inline | `style.css?v=3` + inline |

### newsletter.html-Stil CSS-Variablen
```css
:root {
  --white:#fff; --off:#fff9ee; --ink:#1e1e2e;
  --mid:#6b7280; --light:#b0b8c8; --border:#e2e8f0;
  --green:#0e9f6e; --greenlt:#d1fae5; --mint:#6ee7b7;
  --r:12px; --rLg:20px; --maxW:1280px;
}
```

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
„Weit" = grün (`span`), „Wir" + „Weg" = dunkel.

### Social Icons (Reihenfolge fest)
Instagram → TikTok → YouTube → Pinterest. Kein Facebook, kein WhatsApp.

| Plattform | URL |
|-----------|-----|
| Instagram | https://www.instagram.com/_wir_weit_weg_/ |
| TikTok | https://www.tiktok.com/@wir_weit_weg |
| YouTube | https://www.youtube.com/@Wirweitweg555 |
| Pinterest | https://pinterest.com/wirweitweg |

---

## Newsletter (Brevo)

- **Endpoint:** `POST /functions/newsletter` (gehandelt von `_worker.js`)
- **Request-Body:** `{ vorname, email, quelle }` — `quelle` = `"newsletter"` oder `"packliste"`
- **Listen:** ID 2 (Newsletter), ID 5 (Packliste)
- **Template ID:** 2 (Double Opt-In)
- **Umgebungsvariable in Cloudflare Pages:** `BREVO_API_KEY`
- **Absender:** wirweitweg555@gmail.com

### Formular-IDs Startseite (index.html)
`id="nlVorname"`, `id="nlEmail"`, `id="nlBtn"` + `onclick="nlSubmit()"`

### Formular-IDs newsletter.html
`id="nlVorname"`, `id="nlEmail"`, `id="nlBtn"` + `onsubmit="nlSubmit(event)"`

### Double Opt-In E-Mail
- Datei: `email-doubleoptin.html` (lokal + auf GitHub)
- In Brevo: Template 2 → HTML-Editor → alles ersetzen → speichern → testen
- Logo: `https://wirweitweg.blog/logo-email.png`
- Placeholder Bestätigungs-Link: `{{ doubleoptin }}`
- TikTok-Link: `https://www.tiktok.com/@wir_weit_weg`

---

## Google Analytics

- **Measurement ID:** `G-1HJNKXTYYZ`
- Auf allen Seiten eingebaut (gtag.js)

---

## Google Search Console

- **Verifiziert:** Ja (Datei `googleb1e14db7408d15a8.html`)
- **Sitemap:** https://wirweitweg.blog/sitemap.xml — eingereicht, 34 Seiten erkannt

---

## SEO – erledigt

- Canonical-Tags auf allen Seiten
- Open Graph Meta-Tags auf allen Seiten
- JSON-LD: `WebSite`, `Organization`, `BreadcrumbList` auf allen Seiten
- Meta-Title + Description auf allen Seiten optimiert
- `sitemap.xml` erstellt und eingereicht
- `robots.txt` mit Sitemap-Verweis

---

## Cloudflare

- **Account ID:** `3b0dcf517e5e9a8a02b13c54700023c4`
- **Account:** Schnipi12@gmail.com's Account
- Auto-Deploy via GitHub Push auf `main`

---

## Logos (lokal)

| Datei | Verwendung |
|-------|-----------|
| `logo.png` | Favicon |
| `logo-schwarz.png` | Footer aller Seiten |
| `logo-white.png` | — |
| `logo-email.png` | Brevo E-Mail (auf GitHub hochgeladen) |

---

## Wichtige Regeln

1. **`index.html` NIE ohne explizite Erlaubnis anfassen**
2. **`weltreise-planung.html`** und **`idee-zeitplan.html`** ebenfalls gesperrt
3. **`_worker.js` NIE löschen** – Newsletter bricht sonst zusammen
4. Vor jeder Änderung: genau beschreiben was geändert wird → Marc bestätigt
5. Vorlage neue Planungsseiten: `auslandskrankenversicherung.html`
6. Nach Push: `_worker.js` auf GitHub verifizieren (noch vorhanden?)

---

## Offene To-dos

- [ ] `kambotscha.html` löschen (Duplikat von `kambodscha.html`)
- [ ] `ueber-uns.html` – wartet auf Fotos von Fabienne & Marc
- [ ] Brevo Template 2 – `email-doubleoptin.html` einkopieren und testen
- [ ] YouTube Video-IDs – sobald erste Videos live: `loadYT(this,'VIDEO_ID')` in `index.html` (erst nach Marcs expliziter Erlaubnis!)
- [ ] Favicon – transparente Version bevorzugt (aktuell schwarzes PNG)
- [ ] Blog-Artikel – 3× „Bald verfügbar" auf Startseite → echte Artikel während der Reise
