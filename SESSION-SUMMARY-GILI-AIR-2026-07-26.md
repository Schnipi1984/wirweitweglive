# Gili Air Redesign – Übergabe

**Stand:** Commit `da0bbf3`, gepusht auf `main`, live auf https://wirweitweg.blog/gili-air

## Repos
- `/Users/marcammann/Desktop/wirweitweglive/` – Arbeitskopie
- `/Users/marcammann/wirweitweglive/` – echtes Git-Repo, verbunden mit GitHub (`Schnipi1984/wirweitweglive`) + Cloudflare Pages (Auto-Deploy ~20 Sek. nach Push)
- Beide Ordner müssen synchron gehalten werden (Datei kopieren, dann im echten Repo committen/pushen)

## Was gemacht wurde
`gili-air.html` komplett neu aufgebaut, Vorbild: **betterbeyond.de/indonesien** (Struktur) + **geh-mal-reisen.de** (Ton), aber mit WirWeitWeg-Farben/-Fonts (Fraunces, Grün/Mint) – keine 1:1-Kopie.

- Hero als randabgesetzte Karte, Indonesien-Flagge (rund, 84px)
- Schlichte Anchor-Nav-Zeile (kein dunkler Balken)
- Karussells nur bei Intro + Highlights; alle anderen Bild-Abschnitte (Ankommen, Anreise, Menschen) sind Fliesstext + Bildreihen mit Bildunterschrift
- Highlights als gestapelte Text+Bild-Zeilen (nicht Karten-Raster)
- Akkordeons mit Card-Look (Hintergrund, Schatten, runder Chevron-Badge)
- Divider-Linien vor jeder Sektion
- Nach-oben-Button (unten rechts, über Kaffee-Button)
- **21 echte Fotos** von Marc & Fabienne in `img/gili-air/` (Hero-Luftaufnahme, Schildkröte, Unterwasser-Statuen, Warungs, Mie Goreng, Pool, Katze, mehrere Sonnenuntergänge, Marc beim Schnorcheln, verlassener Pool, Holzschild) – ersetzen die meisten Stock-Fotos
- Keine Emojis mehr im Content (Nav-Dropdown-Icons und "Kaffee spendieren"-Button bleiben, weil site-weit einheitlich)
- Neue Sektion "Was wir ehrlich sagen müssen" (E-Roller, Müll, Korallen, Cidomo-Tierwohl)

## Wichtige Fakten-Korrektur (bestätigt von Marc)
Gili Air: **von Anfang an 2 Wochen gebucht** (nicht "3 Nächte, dann verlängert" – das stand in einer älteren Version).

## Offene Punkte
- Keine bekannten offenen Bugs
- `gili-air.html` ist als Pilot-Template gedacht für weitere Insel-Guides (Bali, Lombok, Java, Flores, Sulawesi)

## Standing Rules (auch im Memory-System hinterlegt)
- Autonom arbeiten, nicht bei jedem Schritt nach OK fragen – nur vor dem eigentlichen `git push` kurz Bescheid geben
- Keine Emojis, ausser Marc verlangt es explizit
- `index.html`, `weltreise-planung.html`, `idee-zeitplan.html` bleiben gesperrt (nie ohne Erlaubnis ändern)
- `_worker.js` niemals löschen (Newsletter-Funktion)
