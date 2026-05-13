---
title: The Gaze — Two-Rule Duels Redesign
type: feat
date: 2026-05-12
brainstorm: docs/brainstorms/2026-05-12-gaze-redesign-brainstorm.md
---

# The Gaze — Two-Rule Duels Redesign

## Overview

Strip `gaze.html` of its static 16×16 map, fixed sprite array, and tangled multi-state gaze recognition. Replace with a four-room run structure: each room is a 1-on-1 duel governed by one of two atomic inversions of the gaze rule (**Doppelganger** / **The Mute**). A run takes 90s-3min. Procgen lives at the configuration layer (which rooms, what order, room geometry, enemy parameters) — not at the dungeon layer. Each phase is independently shippable and playtestable. Keep the raycaster, input handling, and `genDynamicEyes`; rewrite everything else.

## Problem Statement

The current `gaze.html` (v0.5.1, 1003 lines) markets itself as a "procedural roguelike about desire, mirrors, and the gap" but is actually a static raycaster: one hand-drawn 16×16 map (gaze.html:514-532), seven enemies at fixed positions (gaze.html:535-541), four pickup orbs at fixed positions (gaze.html:542-548). Every run plays identically. There is no win condition — players can only lose. The gaze mechanic itself (mutual gaze dissolves enemies) is genuinely novel and worth preserving, but the game built around it is thin.

The brainstorm (`docs/brainstorms/2026-05-12-gaze-redesign-brainstorm.md`) settled the design: **two atomic rules, four rooms per run, Devil Daggers-style density**. This plan turns that into a phased implementation that ships value at each milestone.

## Proposed Solution

A four-room run loop with two room types, randomized per run:

```
Title  →  Room 1  →  Corridor  →  Room 2  →  Corridor  →  Room 3  →  Corridor  →  Room 4  →  Win Screen
                                                                                          (or Dead, any room)
```

Each room procgens a small (~10-12 tile) mirror-symmetric or front/back-axial layout matching its rule type. Enemy AI is room-type-specific. Desire resets to full each room. Death sends player back to room 1 with a fresh procgen chain. Visual refresh strips the etched scratchboard hatching down to bolder silhouettes that telegraph each room's rule.

## Technical Approach

### Architecture

The current single-file structure works and the user wants to keep no-build-step simplicity. The redesign reorganizes the file internally rather than splitting it.

**File sections (gaze.html, new organization):**

```
1. <head> + CSS                    (lines 1-60ish, mostly unchanged)
2. <body> + overlays               (title, hud, error, win screens)
3. <script>:
   3a. Error handler (existing)
   3b. Constants + difficulty curves
   3c. PRNG (seeded mulberry32)
   3d. Engine primitives (raycaster, render, input — survives)
   3e. Texture generators (mostly survives; Phase 4 refresh)
   3f. Run state + Room state structures
   3g. Room generators (genDoppelgangerRoom, genMuteRoom, genCorridor)
   3h. Per-room update functions (updateDoppelganger, updateMute, updateCorridor)
   3i. Render dispatcher (renders eye sprite based on enemy.kind)
   3j. Game loop + state machine
```

**New state model:**

```js
// gaze.html — runtime state
var run = {
  seed: 0,                  // run-level PRNG seed (Date.now() at run start)
  chain: [],                // ["doppelganger","mute","doppelganger","mute"] — shuffled per run
  roomIndex: 0,             // 0..3
  startTime: 0,             // ms timestamp at run start
  deaths: 0                 // total deaths this session
};

var room = {
  type: null,               // "doppelganger" | "mute" | "corridor" | "win"
  map: null,                // 2D array, 0=open / 1=wall / 2=pillar
  mapSize: 0,               // typically 10-12
  exitDoor: null,           // {x, y} — appears when room complete
  complete: false,
  startTime: 0,             // ms timestamp at room entry
  enemy: null,              // see Enemy schema below
  pillars: []               // [{x, y}] for geometry telegraphs
};

var enemy = {
  kind: "doppelganger",     // determines update + render behavior
  x: 0, y: 0, angle: 0,
  gazeFrames: 0,            // counter for THIS enemy's gaze on player (Doppelganger)
  dissolveFrames: 0,        // animation phase
  dissolving: false,
  // Doppelganger-specific:
  mirrorAxisX: 0,           // x-coordinate of mirror axis
  inputBuffer: [],          // 12-frame ring buffer of player deltas (for lag mirror)
  // Mute-specific:
  rotationRate: 0,          // current angular velocity (rad/frame)
  rotationTimer: 0,         // frames until next direction change
  visionLockFrames: 0       // frames spent with player in vision cone
};
```

**Game state machine:**

```
runState = "title"
            ↓ (tap)
          "playing"  (loops through room types)
            ↓
       room.complete?  → corridor → next room
            ↓ (room.roomIndex === 4)
          "won"
            ↓ (tap)
          "title"

Any state with desire ≤ 0 OR visionLockFrames over threshold → "dead"
                                                                  ↓ (tap)
                                                              "title"
```

**PRNG (seeded mulberry32):**

```js
function mulberry32(seed) {
  return function() {
    var t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Per-run PRNG so chain order and room geometry are reproducible from seed.
var rng = mulberry32(run.seed);
```

This is ~6 lines of well-known JavaScript PRNG. Avoids `Math.random()` for procgen so runs are reproducible from a seed (enables future daily-seed feature, makes debugging deterministic).

### Doppelganger Mechanic Spec

**Room geometry:**
- 12×12 tile room
- Mirror-symmetric across a vertical axis at x = mapSize/2
- 1-3 pillars placed symmetrically (each pillar pair mirrored across axis)
- Player spawns at (2, mapSize/2). Enemy spawns at (mapSize - 2, mapSize/2). Both face each other.

**Enemy AI (Doppelganger):**
- Every frame, compute player's delta movement `(dpx, dpy)` and delta rotation `dθ`
- Push into `enemy.inputBuffer` (length 12)
- Pop oldest entry, apply mirrored deltas to enemy:
  - `enemy.x -= dpx_old` (mirrored across vertical axis: x-axis flipped)
  - `enemy.y += dpy_old`
  - `enemy.angle += -dθ_old`  (rotation mirrored)
- Apply same collision detection as player (enemy can't pass through walls/pillars)

**Win/lose:**
- Both player and enemy have independent `gazeFrames` counters
- Each frame, evaluate mutual gaze: `enemy in player's PLAYER_FOV cone AND player in enemy's PLAYER_FOV cone AND LOS clear (no wall between via castRay)`
- If mutual gaze: increment both counters
- If NOT mutual gaze: reset both counters to 0
- Enemy's counter has 12-frame deadband (only ticks after mutual gaze held for 12+ frames) — this is the input lag advantage
- **Win**: player's `gazeFrames >= 90` (1.5s) — enemy dissolves, exit door opens
- **Lose**: enemy's `gazeFrames >= 90` — Desire instant-drains, room failed
- Touching enemy (distance < 0.8) drains Desire at 1.0/frame — secondary failure mode

**Difficulty parameters (scaled across rooms 1→4):**
- `mirrorLag`: 12 → 8 frames (less head-start as game progresses)
- `gazeWinThreshold`: 90 → 120 frames (must hold longer)
- `pillarCount`: 1 → 3 pairs (more LOS interruptions)

### The Mute Mechanic Spec

**Room geometry:**
- 12×12 tile room, generally open with a clear directional axis
- 0-2 pillars (asymmetric, used for hide-behind LOS breaks)
- Player spawns at one edge. Enemy spawns in room center.
- Enemy starts facing a random cardinal direction.

**Enemy AI (Mute):**
- Rotates at `rotationRate` rad/frame
- Every `rotationTimer` frames (initially 120-180), picks new rotation direction (sign flip with random magnitude)
- Does NOT move (stationary)
- Has a 180° forward "vision cone" (±90° from `enemy.angle`) and 180° rear "blind cone"

**Player visibility states:**
- `inVisionCone`: player's position is within ±90° of enemy.angle from enemy's position, AND LOS clear
- `inBlindCone`: complement

**Win/lose:**
- `gazeFrames` ticks when: `inBlindCone` AND player facing enemy (enemy in player's PLAYER_FOV) AND LOS clear
- `gazeFrames` resets to 0 if any condition fails
- `visionLockFrames` ticks when: `inVisionCone`. Resets when not.
- **Win**: `gazeFrames >= 90` — enemy dissolves
- **Lose (gaze)**: `visionLockFrames >= 60` (1s) — Desire drains rapidly while spotted; if Desire hits 0, room fails
- Touching enemy (distance < 0.8) also drains Desire — secondary failure mode

**Visual telegraph (Phase 4):**
- Enemy sprite has eyes on FRONT (vision cone direction) only — back is a blank silhouette
- This makes the blind side instantly readable

**Difficulty parameters:**
- `rotationRate`: 0.008 → 0.02 rad/frame
- `rotationIntervalRange`: [150, 200] → [60, 100] frames
- `visionDrainRate`: 0.5 → 1.5 Desire/frame
- `gazeWinThreshold`: 90 → 120 frames

### Corridor Spec

Procedural 3×8 tile corridor, walked end-to-end. No enemy. Optional Desire pickup at midpoint (gives full Desire — purely cosmetic since Desire resets each room, but acts as visual reward).

After ~5s walk or reaching the far door: trigger next room generation, fade transition (0.4s), reset player position.

### Implementation Phases

#### Phase 1: Architectural Skeleton + Doppelganger Room (target v0.6)

**Goal:** Working Doppelganger encounter that the user can playtest in isolation. If the mechanic doesn't feel good, iterate here before building more.

**Tasks:**
- [x] Add PRNG (mulberry32, ~6 lines, at top of script)
- [x] Define `run`, `room`, `enemy` state objects (replace `MAP`, `sprites` globals)
- [x] Delete static `MAP` and `sprites` array
- [x] Delete `updateSprites` entirely — replaced by `updateDoppelganger` + `updateRoom` dispatcher
- [x] Write `generateDoppelgangerRoom(difficulty, rng)` — 12×12 mirror-symmetric map, pillars, perpendicular spawn (player faces south, enemy mirrored east)
- [x] Write `updateDoppelganger()` — position-lag mirror AI (rotation tracks player; perfect angular mirror was geometrically paradoxical)
- [x] Refactor `renderSprites` to render single enemy from `room.enemy` + fix axis-aligned projection bug
- [x] Refactor `castRay` + `inBounds` to read from `room.map` (drop global `MAP_SIZE`)
- [x] Add `isLOSClear(x1,y1,x2,y2)` helper for mutual gaze occlusion checks
- [x] Update `gameLoop` to call `updateRoom()` dispatcher; add `room.complete` → won state
- [x] Update `enterGame` to seed PRNG and call `startDoppelgangerRoom(0.3)`
- [x] Add `showWinScreen()` (Phase 1 placeholder; tap → fresh room with bumped difficulty)
- [x] Update title screen copy + version label (v0.6)
- [x] Death screen: "THE MIRROR HELD YOUR GAZE" copy, tap restarts run from room 1

**Design decision during implementation:** Plan called for perfect angular mirror (`enemy.angle -= dT_player`). Math showed this creates either auto-win (spawn facing each other) or geometric impossibility (spawn perpendicular). Pivoted to: spatial mirror only, enemy always faces player. Movement mirroring + 11-frame position lag preserves the "doppelganger" feel; rotation tracking gives the player real agency to engage/disengage by turning.

**Success criteria:**
- Title → click → Doppelganger room appears with mirror-symmetric geometry
- Enemy mirrors your motion through center axis with visible ~200ms lag
- Holding clean mutual gaze for ~1.5s dissolves enemy with existing fade animation
- Failing to hold gaze (turn/move/break LOS) resets counters
- Death screen on Desire = 0; tap restarts
- No regression: existing input (WASD, mouse, touch joystick) still works

**Playtest gate before Phase 2:** Does the Doppelganger duel actually feel good? Is the lag advantage discoverable? Is winning satisfying?

#### Phase 2: The Mute Room (target v0.7)

**Tasks:**
- [ ] Write `generateMuteRoom(difficulty, rng)` — 12×12 open-ish map with optional pillars, enemy in center
- [ ] Write `updateMute()` — slow rotation AI, vision/blind cone detection, lock-on drain logic
- [ ] Add room.type dispatch in `gameLoop`, `renderSprites`, etc.
- [ ] Temporarily test in isolation: hardcode `run.chain = ["mute"]` for QA
- [ ] Add visual marker to enemy back (until Phase 4 redesign) so blind side is identifiable

**Success criteria:**
- Mute room generates with stationary, rotating enemy
- Player can approach from behind and hold gaze to dissolve
- If player enters vision cone, Desire drains visibly (lock-on indicator?)
- Player can break lock-on by re-entering blind cone

**Playtest gate before Phase 3:** Do both rules feel distinct? Is the Mute fair given current rotation speed and cone widths?

#### Phase 3: Chain + Corridors + Win Screen (target v0.8)

**Tasks:**
- [ ] Implement `generateCorridor()` — 3×8 procedural corridor with start/end doors
- [ ] Wire room-transition state machine: room cleared → fade → corridor → walk → fade → next room
- [ ] Procgen `run.chain`: shuffle `["doppelganger", "doppelganger", "mute", "mute"]` per run
- [ ] Add difficulty scaling formula: pass `roomIndex / 4` to generators as `difficulty` param
- [ ] Win screen: after room 4 clear, show "THE GAZE IS BROKEN" + run time + rooms cleared, tap returns to title
- [ ] Track session stats: deaths, fastest run time (localStorage)

**Success criteria:**
- Full run plays end-to-end: 4 rooms with corridors between
- Different procgen each run (visibly different room orders, geometry)
- Win screen on completion, death screen on Desire=0, both restart cleanly

**Playtest gate before Phase 4:** Does a full run feel like ~3 minutes? Is the difficulty curve appropriate?

#### Phase 4: Visual Refresh (target v0.9)

**Tasks:**
- [ ] Rewrite `genStone()`, `genMirror()`, `genDoor()` with bolder silhouettes, less hatching
- [ ] Add room-specific wall textures: Doppelganger rooms have mirror-motif walls; Mute rooms have plain dark walls
- [ ] Redesign enemy sprite for Mute: clear front (eyes) vs back (blank/silhouette only)
- [ ] Redesign enemy sprite for Doppelganger: symmetric, no clear front/back
- [ ] Update `genDynamicEyes` to support kind-specific eye styles
- [ ] Strip down `hatch()` density usage across all texture generators
- [ ] Test on mobile: ensure rules are still readable at small screen sizes

**Success criteria:**
- A new player can identify which room type they're in within 1 second of entering
- Mute enemy's blind side is unambiguous from any angle
- Doppelganger room's mirror axis is visually obvious
- Performance: 60fps held on mobile (textures aren't heavier than before)

#### Phase 5: Polish (target v1.0)

**Tasks:**
- [ ] Room-specific audio: Doppelganger has a detuned drone that shifts with mutual gaze; Mute has silence with subtle heartbeat
- [ ] Hit/win/loss audio stings
- [ ] Tab-blur pause (currently runs continuously)
- [ ] Pointer-lock loss recovery (Esc shouldn't break the game)
- [ ] Optional: daily seed mode (`?seed=YYYYMMDD` URL param)
- [ ] Update title screen subtitle + version label
- [ ] Mobile QA pass: iOS Safari, Android Chrome, various screen sizes

## Alternative Approaches Considered

- **Multi-file split (React or ES modules)**: rejected. The current single-file no-build-step model fits the project's static-site hosting model. Adding a build step is a separate concern.
- **Three or more room rules**: rejected during brainstorm. User explicitly chose "ship with two rules" — accept that mechanical density beats variety.
- **Endless mode (procedurally harder rooms forever)**: rejected during brainstorm. Hard win condition makes the game completable in 3 minutes, which is what the user wanted.
- **Desire as a run-long resource (carries between rooms)**: rejected during brainstorm. Reset-each-room makes rooms standalone tests.
- **Random dungeon layouts (BSP, Wave Function Collapse)**: rejected. Each room is small (12×12) and rule-specific; full procedural levels would dilute the focused encounter feel.

## Acceptance Criteria

### Functional Requirements

- [ ] Run state machine cleanly cycles: title → 4 rooms → win → title
- [ ] Both room types generate distinctly different layouts per run (mirror-symmetric vs open-with-axis)
- [ ] Doppelganger enemy mirrors player movement with visible lag; mutual gaze resolves in player's favor with clean play
- [ ] Mute enemy rotates predictably; blind-side approach + gaze dissolves it; vision cone entry drains Desire
- [ ] Corridor transitions occur between every pair of rooms (4 rooms → 3 corridors)
- [ ] Win screen fires after room 4 completion; shows run time + deaths
- [ ] Death screen fires on Desire = 0; tap restarts run from room 1
- [ ] All input methods (keyboard, mouse with pointer lock, touch joystick) work in both room types
- [ ] No `ReferenceError` or `SyntaxError` on first frame (regression guard from previous bug)
- [ ] Error overlay still surfaces uncaught errors (preserved from current build)

### Non-Functional Requirements

- [ ] 60 fps target on 2020-era mobile (iPhone XR class)
- [ ] Initial page load < 1s on broadband (textures inlined as base64 — same as current)
- [ ] One run completable in 90s-3min by a player who has learned the rules
- [ ] Procgen reproducible from `run.seed`: same seed → same chain + same room layouts
- [ ] Visual telegraph: a new player can identify room type within 1 second (validated by Phase 4 visual refresh)

### Quality Gates

- [ ] Each phase ships to `main` independently (git history shows phase-by-phase)
- [ ] After Phase 1: user playtests Doppelganger; explicit go/no-go before Phase 2
- [ ] After Phase 2: user playtests both rules; explicit go/no-go before Phase 3
- [ ] After Phase 3: full-run playtest; difficulty curve evaluated before Phase 4
- [ ] Node syntax check passes after every change (`node -e "..."` script from previous bug session)
- [ ] Manual smoke test in headed browser after every phase

## Edge Cases & Risks

### Identified during planning

| Risk | Mitigation |
|------|------------|
| Doppelganger feels like a deterministic standoff (boring) | Phase 1 playtest gate. 12-frame lag advantage + counter reset on LOS break should make it dynamic. If not, iterate before Phase 2. |
| Mute room becomes unwinnable due to procgen (enemy positioned so blind cone always against wall) | `generateMuteRoom` validates: after placement, simulate that there exists a player path reaching enemy's blind cone with LOS. Re-roll if not. |
| Player camps in corner of Doppelganger room | Mirror enemy camps mirror corner. Mutual gaze still applies. Pillars (1-3 pairs per room) break LOS, forcing movement. |
| Win/loss counters tie at same frame | 12-frame lag advantage guarantees player counter always reaches threshold first if conditions equal. Impossible to tie. |
| Tab blur during run | Phase 5 adds pause-on-blur. Until then, run continues. |
| Pointer lock lost mid-room (Esc, alt-tab) | Mouse turn falls back to normal (non-locked) mouse movement. Player can re-click to reacquire. |
| Mobile orientation change mid-run | Out of scope for v0.6-v0.9. Document as known limitation. |
| AudioContext suspended on mobile until user gesture | Already handled in current code via `initAudio()` called from `enterGame()`. Preserve. |
| Bug regression: undeclared globals breaking gameLoop (previous session's bug) | Always `var`-declare. Node syntax check + first-frame load test before each commit. |

### Discovered by code structure analysis

- The current `genDynamicEyes` cache var `_eyeCanvas` is shared across enemies. With single-enemy rooms, this is fine. If we ever want multi-enemy rooms (we don't), revisit.
- The existing wall texture loading uses Promise gating (`texturesReady`). Keep this; room generation happens after textures load.
- The existing `castRay` reads from global `MAP`. Refactor to take `map` parameter so rooms can swap.

## Success Metrics

After Phase 5 ships (target v1.0):

- **Replayability**: 70%+ of runs complete in under 3 minutes (telemetry not built; gut-check via personal playtest)
- **Win rate**: Solid player wins ~30% of attempts on first try; ~70% after 5 attempts (rooms feel learnable but not trivial)
- **First-time clarity**: A new player understands both rules within 2 deaths (visual telegraph works)
- **Mobile**: Plays at 60fps on iPhone XR-class hardware
- **Code health**: gaze.html stays under 1800 lines (currently 1003; Phase 1-5 should add maybe 500-800 net lines)

## Dependencies & Prerequisites

- No external dependencies added. Continue using Tone.js (CDN, already loaded) for audio.
- No new texture assets. All graphics generated procedurally in `gen*()` functions.
- No build step. File served as static asset to GitHub Pages.
- Browser support target unchanged: any browser supporting Canvas 2D + Pointer Lock API (graceful fall-back to non-locked mouse already in place).

## Future Considerations

Explicitly out of scope for this plan, but documented for possible later expansion:

- **Daily seed challenge**: `?seed=YYYYMMDD` URL param shares procgen state. Implementable in <50 lines on top of the mulberry32 PRNG already in Phase 1.
- **Third or fourth rule**: rejected for this redesign, but the architecture (`updateDoppelganger`/`updateMute` as parallel modules) means adding `updateEcho` or `updateBasilisk` later costs ~200 lines per rule.
- **Boss room** (room 5 with combined rules): out of scope. The win-at-4 design is the brainstorm decision.
- **Run-long progression** (e.g., "you start each run with a different starting Desire"): out of scope. Brainstorm chose reset-each-room.

## Documentation Plan

- [ ] Update title screen version label (v0.5.1 → v0.6 → v0.7 → ...) each phase
- [ ] Update `CLAUDE.md`'s "Known Issues" section to remove obsolete entries
- [ ] After v1.0: replace the README-style commit history pattern with one summary commit message per phase
- [ ] No external docs needed (single-file static page, source IS documentation)

## References

### Current code (will be modified or deleted)

- `gaze.html:86-95` — constants (will be extended with difficulty curves + PRNG)
- `gaze.html:102-405` — texture generators (mostly survive Phase 1-3; Phase 4 refresh)
- `gaze.html:514-532` — static `MAP` (DELETE in Phase 1)
- `gaze.html:535-548` — static `sprites` array (DELETE in Phase 1)
- `gaze.html:570-643` — input handlers (SURVIVE unchanged)
- `gaze.html:649-810` — raycaster + render (refactor to read from `room.map` instead of global `MAP`)
- `gaze.html:811-838` — `updateMovement` (SURVIVES; collision detection refactor only)
- `gaze.html:839-936` — current gaze state machine (DELETE in Phase 1, replace with per-room AIs)
- `gaze.html:943-999` — game loop + title/death screens (refactor to dispatch by `room.type` + `runState`)

### Design references

- `docs/brainstorms/2026-05-12-gaze-redesign-brainstorm.md` — source brainstorm with all design decisions
- Devil Daggers (2016) — primary tonal reference for "single mechanic, infinite expression"
- *Hyper Light Drifter* (2016) — reference for "vignette chain that's mechanical, not narrative"
- *Inside* (2016) — reference for telegraph-everything-visually design discipline

### Codebase patterns

- No existing PRNG in repo. Mulberry32 introduced in Phase 1.
- No existing procgen patterns (horrortarot has random card draws, not relevant).
- No existing test infrastructure for canvas games. QA via headed browser smoke tests.

---

## Implementation Notes for the Coder

When this plan reaches `/workflows:work`:

1. **Don't refactor everything at once.** Phase 1 is the architectural shift. Do that, ship it, playtest the Doppelganger duel. The user has explicitly said past attempts grew without getting better — this plan ships value at each phase.

2. **Phase 1 deletion is large.** ~120 lines of static map + 100 lines of `updateSprites` come out. That's fine; the brainstorm endorsed it. Don't try to preserve pieces that don't fit.

3. **Test on the actual URL after each phase.** GitHub Pages hosts directly; no staging. Push, then smoke-test at topherrasmussen.com/gaze.html.

4. **Honor the no-build-step rule.** Single file, vanilla JS, no transpilation. CDN Tone.js OK.
