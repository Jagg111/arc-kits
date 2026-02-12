# Architectural Patterns

Patterns observed across multiple files in the ArcKits codebase.

## 1. Centralized State via Custom Hooks

All application state lives in `useWeaponBuilder` (src/hooks/useWeaponBuilder.ts:6-72). It owns three `useState` calls (`gun`, `selectedGoal`, `equipped`) and exposes 6 `useCallback` actions + 1 `useMemo` derived value. `App.tsx:8-20` destructures the full return value and passes pieces down as props.

Computed values are separate hooks consumed in App:
- `useBuildCost` (src/hooks/useBuildCost.ts:5-24) — parses craft cost strings into material totals
- `useCumulativeEffects` (src/hooks/useCumulativeEffects.ts:18-46) — aggregates stat bonuses via regex

This keeps App as a thin wiring layer with no business logic of its own.

## 2. Unidirectional Data Flow (Props Down, Callbacks Up)

No Context API, Redux, or any global state. Data flows strictly parent-to-child via props, and user actions flow child-to-parent via callback props.

Example chain for equipping a mod:
- `ModFamilySection` calls `onSelect(famName, tier)` (src/components/builder/ModFamilySection.tsx:23)
- `AttachmentSlot` wraps it: `onEquip(slot, famName, tier)` (src/components/builder/AttachmentSlot.tsx:57)
- `WeaponBuilder` passes through to `onEquip` prop (src/components/builder/WeaponBuilder.tsx:189)
- `App` calls `equipMod` from `useWeaponBuilder` (src/App.tsx:40)

## 3. Inline Interface Props

Every component defines its own props interface at the top of the file, named `[ComponentName]Props`. No shared prop interfaces — each component is self-documenting. Props are always destructured in the function signature.

Files using this pattern: Header.tsx:1, Badge.tsx:1, WeaponCard.tsx:4, AmmoGroup.tsx:5, WeaponPicker.tsx:6, GoalCard.tsx:3, ModFamilySection.tsx:4, AttachmentSlot.tsx:6, WeaponHeader.tsx:5, WeaponBuilder.tsx:7.

## 4. Tailwind + Inline Styles for Dynamic Colors

Static layout and spacing use Tailwind utility classes. Dynamic colors (which come from data/constants lookup tables) use inline `style` attributes with a consistent pattern:

```
style={{ backgroundColor: COLOR + "22", color: COLOR }}
```

The `"22"` suffix is a hex alpha value (~13% opacity) for semi-transparent backgrounds. This pattern appears in:
- Badge.tsx:9
- AmmoGroup.tsx:18-21
- WeaponCard.tsx:22-25
- GoalCard.tsx:24-28
- AttachmentSlot.tsx:45
- ModFamilySection.tsx:26

## 5. Color Constants as Lookup Tables

All color values are centralized in `src/data/constants.ts` as `Record<string, string>` objects:
- `CLASS_COLORS` — weapon class to hex color
- `AMMO_COLORS` — ammo type to hex color
- `RARITY_COLORS` — rarity tier to hex color
- `TIER_COLORS` — mod tier (1/2/3/3+) to hex color
- `GRADE_COLORS` — letter grade (S/A/B/C/D/F) to hex color

Components import the relevant map and index into it at render time. Never hardcode color values in components.

## 6. Immutable State Updates

All state mutations in `useWeaponBuilder` use immutable patterns:
- **Add/update**: spread operator — `{ ...prev, [slot]: { fam, tier } }` (src/hooks/useWeaponBuilder.ts:36)
- **Remove**: clone then delete — `const next = { ...prev }; delete next[slot]; return next;` (src/hooks/useWeaponBuilder.ts:42-45)
- **Reset**: replace with empty object — `setEquipped({})` (src/hooks/useWeaponBuilder.ts:50)

All use functional updater form `setPrev((prev) => ...)` for safe concurrent updates.

## 7. Memoization in Hooks Only

`useMemo` and `useCallback` are used exclusively in custom hooks, never in component files:
- `useWeaponBuilder`: 1 `useMemo` (gunObj lookup, line 11), 6 `useCallback` (all actions)
- `useBuildCost`: entire return wrapped in `useMemo` (line 6)
- `useCumulativeEffects`: entire return wrapped in `useMemo` (line 19)

Components create inline arrow functions for event handlers without memoization. No `React.memo()` wrappers on any component. This is intentional — the component tree is shallow enough that re-renders are cheap.

## 8. Regex-Based Data Parsing

Game data uses human-readable strings for effects and costs. Two hooks parse these with regex:

**Cost parsing** (src/hooks/useBuildCost.ts:16):
- Pattern: `/(\d+)x\s+(.+)/` matches strings like `"6x Metal Parts"`
- Input comes from `TierData.cr` field, comma-separated

**Effect parsing** (src/hooks/useCumulativeEffects.ts:5-16):
- `STAT_PATTERNS` array of `{ stat, pattern, unit }` objects
- Patterns like `/(\d+)%\s+Reduced\s+(?:H-|V-)?Recoil/i` extract numeric values
- Each effect string is tested against all patterns; first match wins (`break` after match)

## 9. Feature-Based Component Organization

Components are grouped by feature domain, not by component type:
- `components/layout/` — app chrome (Header)
- `components/weapons/` — weapon selection flow (WeaponPicker → AmmoGroup → WeaponCard)
- `components/builder/` — mod builder flow (WeaponBuilder → AttachmentSlot → ModFamilySection)
- `components/goals/` — goal/preset display (WeaponHeader, GoalCard)
- `components/shared/` — reusable leaf components (Badge)

Each folder contains related components that form a feature-specific subtree.

## 10. Conditional Rendering Patterns

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
