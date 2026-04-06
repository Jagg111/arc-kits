# ArcKits

**Weapon loadout builder and advisor for [Arc Raiders](https://www.arcraiders.com/)**

[![Live App](https://img.shields.io/badge/Live%20App-arc--kits-blue?style=flat-square)](https://jagg111.github.io/arc-kits/)
[![Deploy](https://github.com/Jagg111/arc-kits/actions/workflows/deploy.yml/badge.svg)](https://github.com/Jagg111/arc-kits/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

ArcKits is a static single-page app for planning weapon loadouts in Arc Raiders. Pick a weapon, equip mods across attachment slots, and see stat changes and crafting costs update in real time. The Weapon Advisor recommends optimal weapon pairings for your scenario — no account, no backend, no ads.

## Features

- **Weapon Browser** — all weapons organized by ammo type (Light, Medium, Heavy) with stats, DPS, and range band info
- **Mod Builder** — attach mods to each slot and see cumulative stat bonuses and crafting costs update live
- **Goal Presets** — apply curated builds for common goals: Fix, Budget, Recoil, Stealth, PvP, ARC penetration
- **Shareable URLs** — every build is encoded in the URL; copy and share directly
- **Weapon Advisor** — filter by location, squad size, engagement range, and rarity budget to get ranked weapon pairing recommendations with synergy tags
- **Dark / Light Mode** — follows OS preference, persists across sessions

## Getting Started

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev       # Dev server at http://localhost:5173/arc-kits/
```

```bash
npm run build     # TypeScript check + production build → dist/
npm run preview   # Serve production build locally
```

## Tech Stack

| Tool | Version |
|---|---|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 7 |
| Tailwind CSS | 4 |

## Project Structure

```
src/
  App.tsx              — Root component, tab routing
  data/                — Hardcoded game data (weapons, mods, presets, advisor config)
  hooks/               — Business logic (builder state, cost, effects, URL sync, theme)
  advisor/engine/      — Deterministic weapon pairing recommendation engine
  components/          — UI components organized by feature domain
    layout/            — Header, nav
    weapons/           — Weapon picker
    builder/           — Mod builder and stat display
    advisor/           — Advisor page, filters, results
    shared/            — Reusable leaf components
```

See [CLAUDE.md](CLAUDE.md) for full architecture detail, type system documentation, and instructions for adding new game content.

## Deployment

Automatically deploys to [GitHub Pages](https://jagg111.github.io/arc-kits/) on every push to `master` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Adding Game Content

Weapons, mods, presets, advisor locations, and scoring weights are all in `src/data/`. See the **"How to Add Game Content"** section in [CLAUDE.md](CLAUDE.md) for step-by-step instructions on each content type.
