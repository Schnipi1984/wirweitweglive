# WirWeitWeg – Projektregeln für Claude Code

## ABSOLUTES VERBOT: Gesperrte Seiten

Die folgenden Seiten dürfen **NIE** ohne ausdrückliche schriftliche Erlaubnis von Marc geändert werden:

- **`index.html`** (https://wirweitweg.blog/)
- **`weltreise-planung.html`** (https://wirweitweg.blog/weltreise-planung)
- **`idee-zeitplan.html`** (https://wirweitweg.blog/idee-zeitplan)

## GRUNDREGEL: Keine Änderung ohne expliziten Auftrag

**Jede Änderung an einer Seite braucht einen klaren, expliziten Auftrag von Marc.**

- Niemals etwas zu einer Seite hinzufügen, weil es sich "logisch" anfühlt oder weil eine allgemeine Option ausgewählt wurde.
- Vor dem Schreiben von Code immer genau beschreiben **was** geändert wird — Marc muss das absegnen.
- Gilt für ALLE Seiten, auch nicht gesperrte.
- Kein Deploy ohne Marcs Bestätigung der Änderungen.

**Vor jeder Änderung an diesen Dateien IMMER zuerst fragen:** „Darf ich [Dateiname] anpassen?"  
Keine Ausnahmen — auch keine „kleinen" CSS-Fixes, Font-Änderungen oder Struktur-Anpassungen.

Diese drei Seiten gelten als **Referenz und Vorlage** für alle weiteren Seiten.

---

## Projekt-Übersicht

- **Blog:** https://wirweitweg.blog
- **GitHub:** Schnipi1984/wirweitweglive
- **Deployment:** GitHub Push → Cloudflare Pages (~20 Sek.)
- **Betreiber:** Fabienne & Marc aus Solothurn (Abflug: 30. Juni 2026)
- **Schreibweise:** Fabienne immer vor Marc. Du-Form. Locker aber professionell. Kein Emoji in Fliesstext.

---

## CSS-System: ZWEI getrennte Welten — niemals mischen

| | `index.html` | Planungsseiten |
|---|---|---|
| `--maxW` | `1280px` | `1280px` |
| `--green` | `#3d7a5c` | `#2d6a4f` |
| `--ink` | `#1a1611` | `#151210` |
| CSS-Quelle | Inline `<style>` | `style.css?v=2` + inline `<style>` |
| Vorlage | — | `auslandskrankenversicherung.html` |

---

## Design-System (Planungsseiten)

### CSS-Variablen (`:root`)
```css
--ink:    #151210;
--off:    #f7f6f2;
--white:  #fff;
--mid:    #5a5550;
--light:  #b0aba5;
--border: #e6e3dc;
--green:  #2d6a4f;
--greenlt:#e6f2ec;
--mint:   #a8d5b5;
--sand:   #c9a96e;
--sandlt: #f5edd8;
--r:      12px;
--rLg:    20px;
--maxW:   1280px;
```

### Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=Nunito:wght@400;600;700&family=Caveat:wght@400;600&display=swap" rel="stylesheet">
```
- **Fraunces** — Headlines (h1, h2, h3, Logo)
- **Nunito** — Fliesstext, Nav, Buttons
- **Caveat** — Handschrift-Akzente (sparsam)

### Body & Links
```css
body { font-family: 'Nunito', sans-serif; font-size: 1rem; line-height: 1.84; color: var(--ink); background: var(--white); -webkit-font-smoothing: antialiased; }
a { text-decoration: none; color: inherit; }
```
Artikel-Links explizit: `.art-content a { color: var(--green); font-weight: 700; }`

---

## Logo — überall identisch

```html
<a class="logo" href="/">Wir<span>Weit</span>Weg</a>
```
```css
.logo { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.5rem; letter-spacing: -.04em; color: var(--ink); }
.logo span { color: var(--green); }
```
- „Wir" und „Weg" → `var(--ink)` (dunkel)
- „Weit" → `var(--green)` (grün)
- **Niemals** die Farbe, den Font oder die Struktur des Logos ändern.

---

## Navigation — exakte Struktur

```css
.nav { position: sticky; top: 0; z-index: 900; background: rgba(255,255,255,.96); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: var(--maxW); margin: 0 auto; padding: 0 1.5rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-link { font-size: .84rem; font-weight: 700; color: var(--mid); padding: .45rem .85rem; border-radius: 9px; display: flex; align-items: center; gap: .25rem; }
.nav-link:hover, .nav-link.active { background: var(--off); color: var(--ink); }
.nav-arr { font-size: .6rem; transition: transform .2s; }
.nav-item:hover .nav-arr { transform: rotate(180deg); }
.nav-drop { position: absolute; top: 100%; left: 0; background: white; border: 1px solid var(--border); border-radius: var(--r); padding: .5rem; min-width: 220px; box-shadow: 0 8px 32px rgba(0,0,0,.1); opacity: 0; pointer-events: none; transform: translateY(-8px); transition: all .2s; }
.nav-item:hover .nav-drop { opacity: 1; pointer-events: all; transform: translateY(0); }
.nav-cta { background: var(--green); color: white !important; border-radius: 100px; padding: .45rem 1.15rem; font-size: .84rem; font-weight: 700; }
```

Nav-HTML-Struktur:
```html
<nav class="nav">
  <div class="nav-inner">
    <a class="logo" href="/">Wir<span>Weit</span>Weg</a>
    <ul class="nav-menu">
      <li class="nav-item">
        <a class="nav-link" href="/weltreise-planung.html">Weltreise planen <span class="nav-arr">▾</span></a>
        <div class="nav-drop">
          <a href="/idee-zeitplan.html">💡 Idee & Zeitplan</a>
          <a href="/budget-kosten.html">💰 Budget & Kosten</a>
          <!-- ... -->
        </div>
      </li>
      <!-- weitere nav-items -->
      <li class="nav-item"><a class="nav-link nav-cta" href="/newsletter.html">Newsletter</a></li>
    </ul>
    <button class="nav-burger" onclick="document.getElementById('mob').classList.add('open')">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-mobile" id="mob">
  <button class="nav-mobile-close" onclick="document.getElementById('mob').classList.remove('open')">✕</button>
  <!-- mobile links -->
</div>
```

**Wichtig:**
- Klasse `.logo` (nicht `.nav-logo`)
- Klasse `.nav-drop` (nicht `.nav-dropdown`)
- Keine `.nav-dd-link`-Klasse — plain `<a>` im Dropdown
- Dropdown: opacity/transform (nicht display:none/block)
- Mobile Nav: `id="mob"`, Klasse `.nav-mobile`
- Stepbar: `.step-pill` + `.step-pill.active` (NICHT `.stepbtn`/`.stepsep`)

---

## Seiten-Struktur (Planungsseite)

```
.nav (sticky, 64px)
  └── .nav-inner → .logo + .nav-menu + .nav-burger
.nav-mobile#mob (fixed fullscreen)
.stepbar (sticky, top:64px)
  └── .stepbar-inner → .stepbtn + .stepsep
.breadcrumb (max-width 1280px, padding 1rem 1.5rem)
.art-hero (55vh, min-height 380px)
  └── img + .art-hero-overlay + .art-hero-content
        └── .art-eyebrow + .art-h1 + .art-meta-row
.art-main (grid: 1fr 320px, padding 2.5rem 1.5rem 4rem)
  ├── .art-content (artikel)
  └── .art-sidebar (sticky, top:128px)
.footer
```

### Hero
```css
.art-hero { height: 55vh; min-height: 380px; position: relative; overflow: hidden; }
.art-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,16,12,.75) 40%, rgba(20,16,12,.1) 100%); }
.art-hero-content { position: absolute; bottom: 0; left: 0; right: 0; max-width: var(--maxW); margin: 0 auto; padding: 2.5rem 1.5rem; }
.art-eyebrow { background: var(--green); color: #fff; font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: .3rem .75rem; border-radius: 100px; }
.art-h1 { font-family: 'Fraunces', serif; font-weight: 900; font-size: clamp(1.9rem, 4vw, 3rem); color: #fff; line-height: 1.15; }
.art-h1 em { font-weight: 300; font-style: italic; color: var(--mint); }
```

### Typografie (Artikel)
```css
.art-content { color: #3a3530; }
.art-content a { color: var(--green); font-weight: 700; }
.art-content h2 { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.85rem; letter-spacing: -.03em; color: var(--ink); margin: 3rem 0 1rem; line-height: 1.15; }
.art-content h2 em { font-weight: 300; font-style: italic; color: var(--green); }
.art-content h3 { font-family: 'Fraunces', serif; font-weight: 700; font-size: 1.25rem; color: var(--ink); margin: 2.25rem 0 .75rem; }
.art-content p { margin-bottom: 1.3rem; }
.art-content ul, .art-content ol { padding-left: 1.5rem; margin-bottom: 1.3rem; }
.art-content li { margin-bottom: .65rem; padding-left: .25rem; }
.art-content strong { font-weight: 700; color: var(--ink); }
```

---

## Social / Follow-Buttons

Auf **jeder** Seite denselben Block verwenden. Reihenfolge: Instagram → TikTok → YouTube → Pinterest. Kein Facebook, kein WhatsApp.

```css
.share-row { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 1.25rem 0; margin: 2.5rem 0; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.share-label { font-size: .78rem; font-weight: 700; color: var(--mid); margin-right: .25rem; }
.share-icon { display: inline-flex; flex-direction: column; align-items: center; gap: .3rem; text-decoration: none; background: none; border: none; cursor: pointer; font-family: 'Nunito', sans-serif; padding: 0; }
.share-icon:hover .share-icon-box { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.22); }
.share-icon-box { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,.18); transition: transform .2s, box-shadow .2s; }
.share-icon-box svg { width: 22px; height: 22px; }
.share-icon-label { font-size: .65rem; font-weight: 700; color: var(--mid); }
```

```html
<div class="share-row">
  <span class="share-label">Folge uns:</span>
  <a href="https://instagram.com/wirweitweg" target="_blank" rel="noopener" class="share-icon">
    <div class="share-icon-box" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/></svg>
    </div>
    <span class="share-icon-label">Instagram</span>
  </a>
  <a href="https://tiktok.com/@wirweitweg" target="_blank" rel="noopener" class="share-icon">
    <div class="share-icon-box" style="background:#010101">
      <svg viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.28 8.28 0 004.84 1.55V7.07a4.85 4.85 0 01-1.07-.38z"/></svg>
    </div>
    <span class="share-icon-label">TikTok</span>
  </a>
  <a href="https://www.youtube.com/@Wirweitweg555" target="_blank" rel="noopener" class="share-icon">
    <div class="share-icon-box" style="background:#FF0000">
      <svg viewBox="0 0 24 24" fill="white"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.52V8.48L15.83 12l-6.08 3.52z"/></svg>
    </div>
    <span class="share-icon-label">YouTube</span>
  </a>
  <a href="https://pinterest.com/pin/create/button/?url=PAGE_URL&description=PAGE_TITLE" target="_blank" rel="noopener" class="share-icon">
    <div class="share-icon-box" style="background:#e60023">
      <svg viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
    </div>
    <span class="share-icon-label">Pinterest</span>
  </a>
</div>
```
> Pinterest: `PAGE_URL` und `PAGE_TITLE` je Seite anpassen.

---

## Newsletter-Formular (Sidebar)

- Provider: Brevo
- Endpoint: `/functions/newsletter.js`
- Felder: `VORNAME` (nicht FIRSTNAME!), E-Mail
- Bestätigungsseite: `/danke.html`
- IDs im Sidebar-Formular: `sbVorname`, `sbEmail`, `sbBtn`

---

## Deploy-Workflow

```python
import urllib.request, json, base64

token = 'TOKEN_AUS_WIRWEITWEG-SESSION-SUMMARY-NEU.md'
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
print(urllib.request.urlopen(req2).status)
```

---

## Checkliste neue Planungsseite

Vor dem Erstellen einer neuen Seite:

- [ ] `auslandskrankenversicherung.html` als Vorlage laden
- [ ] CSS-Variablen korrekt: `--maxW:1280px`, `--green:#2d6a4f`, `--ink:#151210`
- [ ] `body`: inkl. `-webkit-font-smoothing: antialiased`
- [ ] `a { color: inherit }` global, Artikel-Links explizit grün
- [ ] Logo: `<a class="logo">` mit `color: var(--ink)` explizit
- [ ] Nav: `.nav-drop` (nicht `.nav-dropdown`), `.logo` (nicht `.nav-logo`), `id="mob"` für Mobile
- [ ] Stepbar: `.stepbtn` + `.stepsep`
- [ ] Padding überall `1.5rem` (nicht `2rem`)
- [ ] Hero: `art-hero` mit Overlay + `art-hero-content`
- [ ] Social-Buttons: Instagram, TikTok, YouTube, Pinterest — in dieser Reihenfolge
- [ ] Footer: `--green` hardcoded als `#2d6a4f` (nicht `#3d7a5c`)
- [ ] Vor dem Push: HTML im Browser testen

---

## Offene To-dos

- `kambotscha.html` löschen (identisches Duplikat von `kambodscha.html`)
- `ueber-uns.html` — wartet auf Fotos von Fabienne & Marc
- Blog-Karten — 3× „Bald verfügbar" → echte Artikel während der Reise
- YouTube Video-IDs — sobald erste Videos online: `loadYT(this,'VIDEO_ID')` in `index.html` eintragen (erst nach Marcs Erlaubnis!)
- Favicon: transparente Version bevorzugt (aktuell schwarzes PNG)
- Alle anderen Planungsseiten: Social-Buttons, Typografie und Nav an `idee-zeitplan.html` angleichen
