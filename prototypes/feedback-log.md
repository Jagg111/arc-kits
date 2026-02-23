# Weapon Advisor Prototype Feedback Log

Purpose: Capture iterative feedback for prototype rounds in one place without losing prior artifacts.

## Naming Rules
- Prototype files are immutable once generated.
- Use: `prototypes/advisor-concept-YYYYMMDD-HHMM-<theme>.html`

## Round Template
Copy this block for each review cycle.

```md
## Round <id> - <YYYY-MM-DD>

Reviewed Files
- prototypes/advisor-concept-YYYYMMDD-HHMM-<concept-a>.html
- prototypes/advisor-concept-YYYYMMDD-HHMM-<concept-b>.html
- prototypes/advisor-concept-YYYYMMDD-HHMM-<concept-c>.html

### <Concept A>
Like
- 
Dislike
- 

### <Concept B>
Like
- 
Dislike
- 

### <Concept C>
Like
- 
Dislike
- 

Feedback for Next Round
-
```

## Round 1 — 2026-02-16

Reviewed Files
- prototypes/advisor-concept-20260214-2109-dense.html
- prototypes/advisor-concept-20260214-2112-spacious.html

### Dense
Like
- 2-column form grid with inline row labels + pill groups (Where?, Squad?, Focus?, Range?, Damage?, Stealth?)
- Compact Budget & Availability section with checkbox pills
- Overall density — everything above the fold without feeling cramped

Dislike
- Result cards too flat — simple mod tags without weapon context (no stats block, no rarity badge on weapon)
- Full-width CTA button felt generic

### Spacious
Like
- Loadout result cards: side-by-side weapon blocks with Primary/Secondary labels, class + rarity badges, mod tags with roman numeral tiers
- Reasoning block with info icon — feels like the advisor is explaining itself
- Rounded pill CTA with orange glow shadow
- Action buttons per loadout (Open in Builder)

Dislike
- Form section too spread out — one card per question group takes up too much vertical space
- Location cards with meta tags (map size, terrain) add clutter that isn't actionable yet

### Hybrid (advisor-concept-20260216-1430-hybrid.html)
Created by combining dense form + spacious results/CTA. Additional tweaks applied:
- Removed "Showing recommendations for" criteria summary (redundant — user just filled in the form)
- Removed DMG, Range/DPS, PVP/ARC grade stats from weapon cards (too noisy — the reasoning text already justifies the pick)

## Round 2 — 2026-02-16

Reviewed Files
- prototypes/advisor-concept-20260216-1430-hybrid.html

### Hybrid v2 (advisor-concept-20260216-1530-hybrid-v2.html)
Changes from hybrid v1:
- Removed common crafting materials (Metal Parts, Plastic Parts, Rubber Parts, Wires) from Budget filters — these are abundant and not worth filtering on
- Added 20px wiki-hosted mod icons inline with each mod tag in result cards (sourced from arcraiders.wiki, same as existing builder)
- Added 16px wiki-hosted material icons next to each material checkbox pill in Budget section
- No weapon images available (wiki has none in codebase data)

## Round 3 — 2026-02-19

Reviewed Files
- prototypes/advisor-concept-20260216-1530-hybrid-v2.html

### Hybrid v3 (advisor-concept-20260219-1000-hybrid-v3.html)
Changes from hybrid v2:
- Removed 'Damage?' row from Playstyle section — Playstyle now has only Range? and Stealth?
- Added clarifying hint text under Budget & Availability header: "Available materials determine which attachments we can recommend for your weapons."
- Compressed vertical spacing throughout to get first loadout card above the fold at 1920x1080:
  - Main top padding: 1.5rem → 1rem
  - Page subtitle margin-bottom: 1.25rem → 0.75rem
  - Form grid gap: 1rem → 0.75rem; margin-bottom: 1.25rem → 0.75rem
  - CTA section padding: 1rem 0 2rem → 0.5rem 0 0.5rem (biggest offender)
  - Results section margin-top: 1rem → 0
  - Loadout body padding: 1.5rem → 1rem
  - Weapon row margin-bottom: 1.25rem → 0.75rem
  - Loadout header padding: 1rem 1.5rem → 0.75rem 1.5rem

## Round 4 — 2026-02-20

Reviewed Files
- prototypes/advisor-concept-20260220-1200-gunsmith.html
- prototypes/advisor-concept-20260220-1300-terminal.html
- prototypes/advisor-concept-20260220-1400-dossier.html

### Gunsmith (advisor-concept-20260220-1200-gunsmith.html)
Inspiration: Gunsmith/Blueprints screen (screenshots 131–134)
3-column fixed layout: dark form panel left | weapon silhouette center | cream blueprint paper panel right.
Features: game-style [CLASS][RARITY] badge pairs, 6-stat bars (Damage/FireRate/Range/Stability/Agility/Stealth),
yellow [E] ANALYZE CTA button, warm brownish-black workshop palette, all-caps weapon names.
Like
-
Dislike
-

### Tactical Terminal (advisor-concept-20260220-1300-terminal.html)
Inspiration: Inventory/Loadout screen (screenshots 129–130)
4-panel layout: icon strip | PREFERENCES panel | RECOMMENDED LOADOUT main | ACTIVE FILTERS right.
Features: rarity-colored top stripe on weapon equipment slots, ammo type + mod slot icons per weapon,
blue-grey dark palette, orange accent, compact filter summary on right.
Like
-
Dislike
-

### Field Dossier (advisor-concept-20260220-1400-dossier.html)
Inspiration: Tooltip/hover cards (screenshots 130, 132–134)
Single-column centered layout. Scanline CSS overlay texture. Monospace Courier labels.
Features: orange left-border accent on question cards, yellow [E] full-width ANALYZE button,
dossier rank cards (01/02/03) with gold/silver/bronze gradient stripes, colored stat bars per stat type,
FIELD ASSESSMENT reasoning block, ⟳ REQUEST ADDITIONAL OPTIONS shuffle button.
Like
-
Dislike
-

Feedback for Next Round
-
