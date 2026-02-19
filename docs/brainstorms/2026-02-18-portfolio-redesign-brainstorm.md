---
date: 2026-02-18
topic: portfolio-redesign
---

# Portfolio Redesign: Mood-First Gallery Experience

## What We're Building

A complete redesign of topherrasmussen.com from a single-page scrolling catalog into an atmospheric, explorable gallery. The homepage becomes a mood-first entryway — dark, minimal, almost no text — where the rooms aren't labeled navigation but discoverable objects: a photograph, a waveform, a sentence fragment. Each leads into a distinct "room" with a magazine-style layout tailored to the medium.

The goal is to enthrall the visitor. Not impress a hiring manager. Not organize a CV. Make someone curious enough to click around and get lost.

## Why This Approach

The current site is a chronological, filterable catalog — 66 entries (and growing) in one long scroll. It treats every entry equally and reads like a database. Adding Medium essays, SoundCloud, visual art, and slowed-down videos would only make the scroll longer.

We considered three approaches:
- **Gallery Model (Hub + Spokes)** — Atmospheric homepage as entryway, distinct pages/rooms per medium. Chosen.
- **Magazine Model** — One page but with varied editorial layout and visual rhythm. Incorporated into rooms.
- **Constellation Model** — Spatial/masonry layout. Rejected as primary — too dense, less atmospheric.

The hybrid of Gallery (for structure) + Magazine (for room interiors) gives the best of both: an enthralling first impression and rich, medium-appropriate depth.

## Site Structure

### Homepage

- Dark or muted palette. Textured, not clean/corporate.
- Name present but not hero-sized or centered.
- No traditional navigation labels. Rooms are **objects on the page**: a production still, an audio waveform on hover, a pull quote, a visual fragment. Each is a doorway.
- Possible ambient element (subtle animation, slow crossfade of images, optional audio on interaction).
- Tone-setter line instead of a bio. Voice, not resume.
- The bio (current version or revised) lives somewhere accessible but not on the homepage.

### Five Rooms

Each room has its own page and visual personality. Magazine-style layouts tailored to the medium.

1. **Theater** — Production photos in editorial spreads. Review quotes as pullquotes. Credits organized by company or chronologically. 57 entries — needs smart hierarchy (featured productions vs. readings/workshops).

2. **Writing** — Essay excerpts with links. Psychoanalysis writing, AI essays, Medium pieces. Could feature opening paragraphs that pull you in. Thesis (Analytic Introspections) as a centerpiece.

3. **Music** — Embedded SoundCloud/Bandcamp players. FM Noggin featured. The Bandcamp lo-fi recordings. Radiohead Ensemble context. Audio-forward — you should be able to hear something without leaving the page.

4. **Visual** — Scratchboard and visual art as image galleries. Slowed-down videos embedded. More visual, less text. Let the work speak.

5. **Web/Experiments** — Horror Movie Tarot, AI 101, Radiohead invite, Structured Like a Language, The Analytic Anteroom concept. These are interactive — links out to live projects with descriptions and screenshots.

### Navigation Between Rooms

- Once inside a room, provide a way back to the homepage and to other rooms.
- Could be a persistent subtle nav, or could use the same object-based approach.
- Don't break the atmosphere with a generic navbar.

## Key Decisions

- **Mood-first, not content-first**: Homepage prioritizes atmosphere over information density.
- **Five rooms, not nine categories**: Theater, Writing, Music, Visual, Web/Experiments. Collapsed from the current nine filter categories.
- **Hub + Spokes, not single page**: Each room is its own page/view with medium-appropriate layout.
- **Objects as navigation**: Rooms are discovered through visual/audio artifacts, not labeled menu items.
- **Existing catalog data is preserved**: The catalog.json structure still works — rooms are filtered views of it, potentially with additional layout metadata.

## Open Questions

- **Tech approach**: Keep it static HTML? React app? Multi-page with shared layout? The current site is a mix of both.
- **Theater room hierarchy**: 57 entries is still a lot. Feature the reviewed/photographed productions and collapse the readings? Or keep everything?
- **Audio on homepage**: Ambient audio is compelling but divisive. Opt-in (click to play) vs. auto-play? Tone.js generative vs. a SoundCloud embed?
- **Content to add**: Medium essays (how many? which ones?), SoundCloud tracks, scratchboard art, slowed-down videos — need to inventory these.
- **Mobile experience**: Mood-first with spatial objects is harder on mobile. Graceful degradation needed.
- **Dark mode / palette**: Current site is warm/light (parchment tones). Mood-first suggests darker. Full dark? Or moody-warm?

## Content Inventory Needed

Before implementation, need to gather:
- [ ] Medium essay URLs and titles
- [ ] SoundCloud profile/track URLs
- [ ] Scratchboard / visual art images
- [ ] Slowed-down video files or URLs
- [ ] Remaining 43 theater production photos

## Next Steps

1. Content inventory (gather all the new material)
2. `/workflows:plan` for implementation — tech stack decisions, page structure, component design
3. Homepage mood/visual exploration — could benefit from a few reference sites or mood boards
