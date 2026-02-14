---
name: weapon-descriptor
description: Generates suggested weapon descriptions and weaknesses to be used for player knowledge.
---

# Skill: Weapon Description Writer

## Goal
Invoke this skill when writing, rewriting, or reviewing `desc` and `weakness` fields for weapons in `src/data/weapons.ts`. Whenever this is called a specific indiviudal weapon will need to be researched, then it will generate 3 examples of both descriptions and weaknesses for review. Research is to be performed by first finding the weapon on the Arc Raiders wiki (https://arcraiders.wiki/wiki/Weapons) which will serve as a baseline understanding of the weapon. From there it is encouraged to search through other websites, online resources, and discussion boards to gain a more holistic understanding of how the wider player community views the weapon and uses it.

---

## Description Structure

The `desc` field should always begin with the opening identity point, and end with the upgrade weapon point. All others points can be arranged in whatever way yields a flow that feels natural and best matches findings from the reseach done about the weapon. No description should ever be more that 450 characters at the most, but you can use that full character limit when warranted. Keep the description focused on the weapon itself, not consumables, shields or other quick use items.

1. **Opening identity** — Lead with the weapon's defining trait, role, or standout characteristic. One sentence that tells the reader what this weapon *is*.
   > "Massive magazine capacity designed for suppressive fire and lane control."
   > "Single-action pistol with a built-in silencer that excels at stealth utility rather than combat."

2. **Core mechanic / playstyle** — How the weapon feels to use. Fire rhythm, engagement style, what it rewards.
   > "Lever-action mechanics require manual cycling between shots, rewarding deliberate aim over spray-and-pray."
   > "The 12 round base capacity paired with 2-bullet reload means you'll want to be constantly reloading to keep a full mag."

3. **Honest weakness tradeoff** — State downsides openly, not buried or softened. Acknowledge when a weapon is outclassed.
   > "Base reload speed is slow, so you'll want to upgrade it to improve."
   > "Most players shy away from it and scrap it for parts, but don't let that stop you from trying it."

4. **Practical gameplay advice** — Weapon pairing suggestions, situational tips, squad vs solo context.
   > "Pairs well with close-range secondaries to cover all engagement distances."
   > "Either upgrade the base weapon for more capacity or carry a sidearm as insurance."

5. **Economy & upgrade path** — Craft/repair costs, budget viability.
   > "Best as an entry into Epic-tier weapons if your economy can support it."
   > "Absurdly cost-effective for its power, making it a go-to pick for players trying to grow their economy on a budget."

6. **Upgrading weapon** — When upgrading the weapon list what perks/stats change, but never mention another about durability for this point. It should ALWAYS begin with the words as "Upgrading it"
   > "Upgrading it increases fire rate and dispersion recovery time."
   > "Upgrading it increases mag size and fire rate."

---

## Recurring Description Content Patterns

These should appear across most descriptions. Include them where relevant:

- **PvP vs PvE distinction** — Nearly every description calls out how the weapon performs in each context. Use the weapon's `arc` grade as guides. Be cautious around PvP performance since ongoing meta shifts can change this.
- **Cross-weapon comparisons by name** — When it makes sense you can cross-reference other weapons. "outclassed by simply spraying with a Stitcher or Rattler", "even a Ferro will outperform against ARC". Reference specific weapons, not vague categories.
- **Weapon pairing recommendations by name** — "Pairs well with Ferro or Renegade", "Works beautifully with a silencer for stealth play". Suggest complements where there is clear consensus from your research.
- **Concrete numbers when relevant** — "2.5x headshot multiplier", "12 round base capacity", "14 kilograms". Use sparingly but don't avoid them.
- **Economy-conscious framing** — Cost-effectiveness, budget builds, repair burden, whether investment is justified. Players care about their resources.

---

## Tone & Voice Rules

- **Meta agnostic** — Never include specific mentions about specific patches, current meta, or qualities of the weapon that are likely to change due to ongoing game balancing like specific damage numbers. The descriptions should hold up as the meta evolves in the game.
- **Conversational and opinionated** — Should reads like a well thought out TLDR from an experienced player.
- **Second-person address** — "you'll be dumping resources", "your economy", "if your primary doesn't finish a target".
- **Brutally honest without being dismissive** — bad weapons are called out, but their niche is acknowledged. Never mock the player for using something that isn't generally favored.
  > Good: "Most people scrap it for parts, but don't let that stop you from trying it."
  > Bad: "This weapon is just not good and you shouldn't use it."
- **No hype** — strengths stated matter-of-factly. Never oversell.
  > Good: "Exceptional stability makes it laser-like at mid-range."
  > Bad: "This incredible weapon will dominate every fight!"
- **Game vocabulary used naturally** — ARC penetration, TTK, DPS, alpha damage, peek-fighting, mag dump, third-partying, choke, bloom, dispersion, recoil. Don't define these terms.
- **Off limit words** — Never include the name of the weapon or the ammo it uses. If you ever include a mention about an extended magazines never include the ammo type along side it.
  > Good: "Its 12-round capacity is crippling without an extended mag"
  > Bad: "Its 12-round base magazine is crippling without an extended light magazine"

---

## Weakness Field Guidelines

The `weakness` field is a separate short string. Rules:

- **No more than 15 words max**, punchy and direct
- **Do not directly recommend or advise any specific attachments**, just focus on stating the weaknesses
- **Focus on feel/experience** over raw stats
  > Good: "Feels out of control during full-auto", "Burns through magazines"
  > Bad: "Low DPS", "7 damage per shot"
- Can use a **comma join** for complex weapons with multiple distinct issues
  > "Recoil & dispersion risk missing mid-burst. Requires investment to make competitive"
- Should capture the *frustration point* — the thing that makes a player put the weapon down
- Not mandatory, but ideally hint towards traits that can be addressed through attachments

---

## Anti-Patterns — What NOT to Do

- **Don't write wiki-style neutral prose.** Every description should have an opinion. "Moderate damage output with average range" is dead writing.
- **Don't use marketing language.** No "unleash devastating power" or "dominate the battlefield".
- **Don't omit downsides.** Even S-tier weapons have tradeoffs (cost, weight, ammo). Mention them.
- **Don't sugarcoat bad weapons.** If something is outclassed, say so — then note its niche if one exists.
- **Don't write generic descriptions.** Every sentence should reference something specific to Arc Raiders (ARC machines, Raider economy, specific play styles, game mechanics).
- **Don't forget economy/cost.** Repair costs, crafting investment, and budget viability are core to weapon evaluation in this game.