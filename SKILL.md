---
name: wirweitweg
description: Kontext und Standards für das Schweizer Reiseblog WirWeitWeg von Fabienne & Marc. Enthält Brand Voice, Design-System, gesperrte Seiten und Arbeitsregeln.
---

# WirWeitWeg – Cowork Kontext

## Projekt
- **Blog:** https://wirweitweg.blog
- **GitHub:** Schnipi1984/wirweitweglive
- **Deployment:** GitHub Push → Cloudflare Pages (~20 Sek.)
- **Betreiber:** Fabienne & Marc aus Solothurn (Abflug: 30. Juni 2026)

---

## Schreibweise & Tonalität

- Immer **Fabienne & Marc** (Fabienne zuerst)
- Du-Form, locker aber professionell
- Kein Emoji im Fliesstext
- Schweizer Perspektive: CHF-Preise, Schweizer Institutionen (KVG, AHV, RAV, Pensionskasse)
- Lakonisch-trockener Humor (Pedro Lenz / Patti Basler)
- Seriös-informativ zuerst, Emotion als zweite Ebene
- **Keine** Dreier-Aufzählungen, keine symmetrischen Absätze, keine zusammenfassenden Schlusssätze
- Inhaltslücken markieren mit `[Marc & Fabienne: bitte ergänzen]` — **nie erfinden**
- Kein Twitter/X — nie empfehlen

---

## Gesperrte Seiten (nie ohne explizite Erlaubnis ändern)

- `index.html`
- `weltreise-planung.html`
- `idee-zeitplan.html`

**Vor jeder Änderung an diesen Seiten fragen:** „Darf ich [Dateiname] anpassen?"

---

## Design-System

### CSS-Variablen
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
--sandlt: #f5edd8;   /* Footer-Hintergrund */
--r:      12px;
--maxW:   1280px;
```

### Fonts
- **Fraunces** → Headlines (h1, h2, h3, Logo)
- **Nunito** → Fliesstext, Nav, Buttons
- **Caveat** → Handschrift-Akzente (sparsam)

### Logo (immer identisch)
```html
<a class="logo" href="/">Wir<span>Weit</span>Weg</a>
```
- „Weit" → `var(--green)`, Rest → `var(--ink)`
- Font: Fraunces 900, niemals ändern

---

## Seitenstruktur (Planungsseiten)

Vorlage: `auslandskrankenversicherung.html`

```
Nav (sticky, 64px)
Stepbar (sticky, top:64px) → .stepbtn + .stepsep
Breadcrumb
Hero (55vh, min-height 380px) → Bild + Overlay + .art-hero-content
  └── .art-eyebrow + .art-h1 + .art-meta-row
Hauptbereich (Grid: 1fr 320px)
  ├── .art-content
  └── .art-sidebar (sticky, top:128px)
Footer (Hintergrund: #f5edd8, dunkle Schrift)
```

---

## Wichtige CSS-Klassen (nie umbenennen)

| Richtig | Falsch |
|---|---|
| `.logo` | `.nav-logo` |
| `.nav-drop` | `.nav-dropdown` |
| `id="mob"` | andere IDs für Mobile-Nav |
| `.stepbtn` + `.stepsep` | `.step-pill` / `.stepbtn` |

---

## Social-Buttons

Reihenfolge auf jeder Seite: **Instagram → TikTok → YouTube → Pinterest**
Kein Facebook, kein WhatsApp, kein Twitter/X.

---

## Newsletter

- Provider: Brevo
- Endpoint: `/functions/newsletter.js`
- Felder: `VORNAME` (nicht FIRSTNAME!), E-Mail
- Bestätigungsseite: `/danke.html`
- Sidebar-IDs: `sbVorname`, `sbEmail`, `sbBtn`

---

## Arbeitsweise

- **Immer HTML-Vorschau zeigen** bevor etwas geändert oder deployed wird
- Keine Änderung ohne expliziten Auftrag
- Vor dem Push: HTML im Browser testen
- `index.html` nur mit expliziter Genehmigung anfassen

---

## Offene To-dos

- `ueber-uns.html` wartet auf Fotos
- Blog-Karten: 3× „Bald verfügbar" → echte Artikel während Reise ersetzen
- YouTube Video-IDs eintragen sobald erste Videos live (nur mit Marcs Erlaubnis)
- Social-Buttons auf allen Planungsseiten an `idee-zeitplan.html` angleichen
