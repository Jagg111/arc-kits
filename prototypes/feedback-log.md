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
