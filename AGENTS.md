# AGENTS.md

## Session Startup
Before making any changes in a new Codex session, read `SESSION_HANDOFF.md` first.
Use it as the cross-session source of truth for current status, known issues, and active roadmap context.

## Core Working References
After reading `SESSION_HANDOFF.md`, use these files as needed:
1. `CLAUDE.md`
2. `.claude/docs/architectural_patterns.md`
3. `.claude/docs/weapon_advisor_feature.md` (when working on advisor scope)

## Execution Guidance
- Preserve existing hook-centric architecture and data-driven design.
- Keep theming aligned with `src/index.css` token system.
- When editing presets/mods, validate tier compatibility against `src/data/mods.ts`.
- End each task with changed files + behavior impact summary.
