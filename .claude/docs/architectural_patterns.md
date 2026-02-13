# Architectural Patterns

Patterns observed across multiple files in the ArcKits codebase.

## Centralized State via Custom Hooks

All application state lives in `useWeaponBuilder` (src/hooks/useWeaponBuilder.ts:6-72). It owns three `useState` calls (`gun`, `selectedGoal`, `equipped`) and exposes 6 `useCallback` actions + 1 `useMemo` derived value. `App.tsx:8-20` destructures the full return value and passes pieces down as props.

Computed values are separate hooks consumed in App:
- `useBuildCost` (src/hooks/useBuildCost.ts:5-24) — parses craft cost strings into material totals, sorted by rarity (Legendary → Common) then alphabetically, with Mechanical Components prioritized in Uncommon
- `useCumulativeEffects` (src/hooks/useCumulativeEffects.ts:18-46) — aggregates stat bonuses via regex

This keeps App as a thin wiring layer with no business logic of its own.

## Unidirectional Data Flow (Props Down, Callbacks Up)

No Context API, Redux, or any global state. Data flows strictly parent-to-child via props, and user actions flow child-to-parent via callback props.

Example chain for equipping a mod:
- `ModFamilySection` calls `onSelect(famName, tier)` (src/components/builder/ModFamilySection.tsx:23)
- `AttachmentSlot` wraps it: `onEquip(slot, famName, tier)` (src/components/builder/AttachmentSlot.tsx:57)
- `WeaponBuilder` passes through to `onEquip` prop (src/components/builder/WeaponBuilder.tsx:189)
- `App` calls `equipMod` from `useWeaponBuilder` (src/App.tsx:40)

## Inline Interface Props

Every component defines its own props interface at the top of the file, named `[ComponentName]Props`. No shared prop interfaces — each component is self-documenting. Props are always destructured in the function signature.

Files using this pattern: Header.tsx:1, Badge.tsx:1, WeaponCard.tsx:4, AmmoGroup.tsx:5, WeaponPicker.tsx:6, GoalCard.tsx:3, ModFamilySection.tsx:4, AttachmentSlot.tsx:6, WeaponHeader.tsx:5, WeaponBuilder.tsx:7.

## CSS Custom Property Theming (Dark / Light Mode)

The app supports dark and light themes via CSS custom properties toggled by a `data-theme` attribute on `<html>`. All semantic UI colors are defined in `src/index.css` in two theme blocks:

```css
:root, [data-theme="dark"] { --color-surface: #111827; ... }
[data-theme="light"]        { --color-surface: #f0ece4; ... }
```

These are registered via Tailwind CSS 4's `@theme inline` directive, enabling first-class utilities:
- `bg-surface`, `bg-surface-alt` — card/panel backgrounds
- `text-text-primary`, `text-text-secondary`, `text-text-muted` — text hierarchy
- `border-border`, `border-border-subtle` — border colors
- `bg-accent`, `text-accent-text`, `text-accent-hover` — accent (orange) colors
- `bg-danger-bg`, `text-danger-text`, `text-success` — semantic action colors

Theme state is managed by `useTheme` hook (src/hooks/useTheme.ts) which reads OS preference via `prefers-color-scheme`, persists to localStorage, and sets the `data-theme` attribute. A flash-prevention `<script>` in `index.html` sets the attribute before React loads.

## Theme-Aware Game Colors via CSS Custom Properties

Game-specific colors (ammo type, rarity, weapon class, grades) are CSS custom properties defined in `src/index.css` alongside the UI theme tokens. Each has dark and light variants that switch automatically via `[data-theme]`:

```css
[data-theme="dark"]  { --color-ammo-light: #e6da35; }
[data-theme="light"] { --color-ammo-light: #a89200; }
```

Components access game colors via inline `style` attributes using `var()` references from the lookup maps in `src/data/constants.ts`. Semi-transparent backgrounds use `color-mix()`:

```tsx
style={{
  backgroundColor: `color-mix(in srgb, ${color} 13%, transparent)`,
  color
}}
```

This pattern appears in: Badge.tsx, AmmoGroup.tsx, WeaponCard.tsx, CostPill.tsx, ModFamilySection.tsx.

Solid game color usage (no alpha) works directly since CSS vars resolve to a color value. This appears in: AttachmentSlot.tsx (tier badge bg), WeaponBuilder.tsx and StatsSummaryBar.tsx (cost qty text).

## Color Constants as Lookup Tables

All **game-specific** color values are centralized in `src/data/constants.ts` as `Record<string, string>` objects that reference CSS custom properties:
- `CLASS_COLORS` — weapon class to `var(--color-class-*)`
- `AMMO_COLORS` — ammo type to `var(--color-ammo-*)`
- `RARITY_COLORS` — rarity tier to `var(--color-rarity-*)`
- `GRADE_COLORS` — letter grade (S/A/B/C/D/F) to `var(--color-grade-*)`
- `MATERIAL_INFO` — crafting material name to `{ rarity, img }` (rarity resolves to color via `RARITY_COLORS`)

Components import the relevant map and index into it at render time. Never hardcode game color values in components. The actual hex values for each theme live in CSS custom properties in `src/index.css`.

Crafting cost pills use the `CostPill` shared component (src/components/shared/CostPill.tsx) which parses cost strings like `"6x Metal Parts"`, looks up the material in `MATERIAL_INFO`, and renders a rarity-colored pill with an icon thumbnail. Total cost sections in WeaponBuilder and StatsSummaryBar use `MATERIAL_INFO` directly for icon + color lookup.

## Immutable State Updates

All state mutations in `useWeaponBuilder` use immutable patterns:
- **Add/update**: spread operator — `{ ...prev, [slot]: { fam, tier } }` (src/hooks/useWeaponBuilder.ts:36)
- **Remove**: clone then delete — `const next = { ...prev }; delete next[slot]; return next;` (src/hooks/useWeaponBuilder.ts:42-45)
- **Reset**: replace with empty object — `setEquipped({})` (src/hooks/useWeaponBuilder.ts:50)

All use functional updater form `setPrev((prev) => ...)` for safe concurrent updates.

## Memoization in Hooks Only

`useMemo` and `useCallback` are used exclusively in custom hooks, never in component files:
- `useWeaponBuilder`: 1 `useMemo` (gunObj lookup, line 11), 6 `useCallback` (all actions)
- `useBuildCost`: entire return wrapped in `useMemo` (line 6)
- `useCumulativeEffects`: entire return wrapped in `useMemo` (line 19)

Components create inline arrow functions for event handlers without memoization. No `React.memo()` wrappers on any component. This is intentional — the component tree is shallow enough that re-renders are cheap.

## Regex-Based Data Parsing

Game data uses human-readable strings for effects and costs. Two hooks parse these with regex:

**Cost parsing** (src/hooks/useBuildCost.ts:16):
- Pattern: `/(\d+)x\s+(.+)/` matches strings like `"6x Metal Parts"`
- Input comes from `TierData.cr` field, comma-separated
- Parsed material names are also used by `CostPill` and total cost sections to resolve rarity color + icon via `MATERIAL_INFO` in constants.ts
- After accumulation, materials are sorted by `RARITY_ORDER` (descending — rare first) then alphabetically, with "Mechanical Components" always first among Uncommon materials (craftable at the refiner). The returned `Record` has a stable display order via JS insertion-order iteration

**Effect parsing** (src/hooks/useCumulativeEffects.ts:5-16):
- `STAT_PATTERNS` array of `{ stat, pattern, unit }` objects
- Patterns like `/(\d+)%\s+Reduced\s+(?:H-|V-)?Recoil/i` extract numeric values
- Each effect string is tested against all patterns; first match wins (`break` after match)

##  Feature-Based Component Organization

Components are grouped by feature domain, not by component type:
- `components/layout/` — app chrome (Header)
- `components/weapons/` — weapon selection flow (WeaponPicker → AmmoGroup → WeaponCard)
- `components/builder/` — mod builder flow (WeaponBuilder → AttachmentSlot → ModFamilySection)
- `components/goals/` — goal/preset display (WeaponHeader, GoalCard)
- `components/shared/` — reusable leaf components (Badge)

Each folder contains related components that form a feature-specific subtree.

## Conditional Rendering Patterns

Three consistent patterns for conditional rendering:

**Early return guards** — when a component should render nothing:
- `if (weapons.length === 0) return null;` (AmmoGroup.tsx:12)
- `if (!build) return null;` (GoalCard.tsx:19)

**Ternary operators** — for binary show/hide of different UI:
- Equipped vs picker view (AttachmentSlot.tsx:39-61)
- Collapsed vs expanded goal view (WeaponBuilder.tsx:64-116)
- No-slots vs builder layout (WeaponBuilder.tsx:48-202)

**Logical AND** — for simple presence-based rendering:
- `{hasWeapon && <button>...` (Header.tsx:13)
- `{weapon.weakness && <div>...` (WeaponHeader.tsx:25)
- `{cumulativeEffects.length > 0 && <div>...` (WeaponBuilder.tsx:120)

## 11. Naming Conventions

| Category | Convention | Examples |
|----------|-----------|----------|
| Components | PascalCase | `WeaponBuilder`, `AttachmentSlot` |
| Props interfaces | `[Component]Props` | `HeaderProps`, `BadgeProps` |
| Hooks | `use[Feature]` | `useWeaponBuilder`, `useBuildCost` |
| Data constants | `UPPER_SNAKE_CASE` | `WEAPONS`, `MOD_FAMILIES`, `GOAL_PRESETS` |
| Color maps | `[TYPE]_COLORS` | `CLASS_COLORS`, `AMMO_COLORS` |
| Handler functions | `handle[Action]` | `handleSelectGoal`, `handleClearGoal` |
| Callback props | `on[Action]` | `onSelect`, `onEquip`, `onRemove` |
| Weapon IDs | lowercase single word | `tempest`, `bobcat`, `vulcano` |
