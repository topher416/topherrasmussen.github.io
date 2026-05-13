---
date: 2026-05-12
topic: gaze-redesign
---

# The Gaze — Redesign Brainstorm

## What We're Building

A tight, two-rule mechanical-duel game built on the existing raycaster engine. Each run is a chain of 4 short rooms (~30s each, ~90s–3min total). Every room is a 1-on-1 confrontation governed by one of two atomic inversions of the gaze mechanic. Variety per run comes from procedural shuffling of room order, enemy speed, geometry, and starting positions — not from a large room catalog. Death restarts the chain. Clearing 4 rooms wins the run.

The conceptual frame ("desire, mirrors, the gap") is dropped. The game stands on mechanics, not philosophy. The etched horror aesthetic stays but gets stripped back so visuals communicate which rule applies in each room.

## Why This Approach

Considered three run shapes (descent / maze hunt / survival arena / vignette chain) and three concept stances (load-bearing / aesthetic-only / drop entirely). User chose **vignette chain + drop the frame**. Then iterated on rooms: every "complication on top of base rule" got rejected (Cyclops, Faster, Liar, Crowd, Hall of Mirrors, Silence, Basilisk, Voyeur). Every **inversion of the base rule** got accepted (Doppelganger, Mute). User explicitly rejected expanding to a third rule (Echo) — preferring two atomic rules with deep expression over many shallow rules.

Result: a Devil-Daggers-style design density. Small rule space, infinite variation through configuration.

## Key Decisions

- **Two atomic rules, no more.** Doppelganger (it mirrors your inputs; mutual gaze duel) and The Mute (never looks at you; dissolve from its blind side). Both are clean inversions of the base gaze rule.
- **4 rooms per run.** Each picked from the 2 templates with parameter variation. Run length: 90s–3min.
- **Procgen lives at the configuration layer**, not the level layer. No random dungeons. Authored room templates; randomized room order, speed scaling, geometry, enemy positions.
- **Desire resets to full each room.** Each room is a contained test. No resource management across the chain.
- **Hard win condition.** Clear 4 rooms → ending screen with stats → back to title. Not endless.
- **~5s corridor between rooms.** A breath, not a level. Visual transition.
- **Visual refresh, not rebuild.** Keep etched aesthetic but strip detail. Bolder silhouettes. Each room's geometry visually telegraphs its rule (Doppelganger room is mirror-symmetric; Mute room has a clear "behind" axis with eyes only on the front-facing side).
- **Drop everything else.** Pickup orbs, mutual-gaze recognition phase, multi-enemy logic, the 16×16 hardcoded map, the static sprite array — all replaced. The current `genDynamicEyes`, raycasting renderer, and the gaze state machine survive in some form.

## Open Questions

- How does Doppelganger handle the *mirroring* mechanically? Mirrors-your-inputs is conceptually clean but needs definition (mirrors movement direction? rotation? both?). Worth nailing in planning phase.
- What does "dissolve from blind side" mean precisely? Player faces enemy's back AND holds gaze for N seconds? Or AND the enemy must not turn during that time?
- What's the "ending screen"? Stats only, or does the game say something?
- Audio: keep current Tone.js footsteps? Add room-specific audio cues? Total silence except footsteps?
- Difficulty curve across the 4 rooms: parameter scaling formula?
- Procgen seeds and run sharing — daily challenge? Or skip?

## Next Steps

→ `/compound-engineering:workflows:plan` for implementation plan (architecture, file changes, what dies vs. what survives in gaze.html)

Or, if you want to test one room in isolation before committing to the redesign, we could prototype the Doppelganger encounter in a branch first.
