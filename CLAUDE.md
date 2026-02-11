# CLAUDE.md

## Project Overview

Personal portfolio and experimental projects website hosted on GitHub Pages at **topherrasmussen.com**. Hybrid architecture combining static HTML pages (essays) with React + Vite applications (interactive projects).

## Git Identity

This repo uses `topher416` — `Topher Rasmussen <topher416@gmail.com>`.

## GitHub Auth Guardrail (Required Before Push)

Always verify GitHub auth context before pushing:

1. `gh auth status` (active account must be `topher416`)
2. If needed: `gh auth switch -u topher416`
3. Confirm repo credential helper includes `!gh auth git-credential`:
   - `git config --local --get-all credential.helper`
4. If missing, set it:
   - `git config --local credential.helper ""`
   - `git config --local --add credential.helper "!gh auth git-credential"`

If push fails with `403` and message `denied to thtopher`, re-run step 2 and step 4, then retry push.

## Repository Structure

```
topherrasmussen.github.io/
├── index.html                  # Root portfolio homepage
├── CNAME                       # Custom domain: topherrasmussen.com
├── Static essays/pages:
│   ├── ai101.html              # AI crash course (Tailwind CDN)
│   ├── essay.html              # Fantasy of Machine-Assisted Authorship
│   ├── map-territory.html      # Five Parables
│   └── radiohead-invite.html   # Interactive canvas poster
│
├── horrortarot/                # React app — Horror Movie Tarot
│   ├── src/                    # React components (JSX)
│   ├── public/movies.json      # Movie database served at runtime
│   ├── movies.json             # Source movie data (142 KB)
│   ├── dist/                   # Built output (do not edit directly)
│   ├── vite.config.js          # Base path: /horrortarot/
│   ├── tailwind.config.js      # Tailwind 4.x
│   └── package.json            # Dependencies & scripts
│
├── analyticintrospections/     # React app — Long-form essay
│   ├── src/                    # React components (JSX)
│   ├── dist/                   # Built output
│   ├── vite.config.js          # Base path: /analyticintrospections/
│   └── package.json            # Dependencies & scripts (React 18)
│
└── assets/, images/            # Shared static assets
```

## Tech Stack

- **React** 19.x (horrortarot) / 18.x (analyticintrospections)
- **Vite** for build and dev server
- **Tailwind CSS** for styling
- **Three.js** — WebGL shader background (Balatro component)
- **Tone.js** — Generative ambient audio
- **Lucide React** — Icons
- **gh-pages** — Deployment to GitHub Pages

## Common Commands

Each React sub-project has its own `package.json`. Run commands from the sub-project directory:

```bash
# Development
cd horrortarot && npm run dev       # Vite dev server with HMR
cd analyticintrospections && npm run dev

# Build
npm run build                       # Vite production build to dist/

# Deploy
npm run deploy                      # Runs build then gh-pages to deploy dist/

# Linting
npm run lint                        # ESLint

# Data (horrortarot only)
npm run enrich                      # Fetch TMDB movie data
```

## Key Components (horrortarot)

| File | Purpose |
|------|---------|
| `HorrorMovieTarot.jsx` | Main tarot card app (~800+ lines) |
| `Balatro.jsx` | WebGL shader background (GPU-intensive) |
| `ElectricBorder.jsx` | Visual card border effect |
| `LiquidEther.jsx` | Animation component |
| `App.jsx` | Root component |

## Deployment

- Hosted on **GitHub Pages** with custom domain via CNAME
- Each sub-project deploys its `dist/` folder
- The root `index.html` and static HTML files are served directly
- `vite.config.js` base paths must match the subdirectory name (e.g., `/horrortarot/`)

## Known Issues

- `Balatro.jsx` runs continuous WebGL rendering — consumes GPU/battery (documented in EFFICIENCY_REPORT.md)
- Redundant `getRarityStyle()` calls in `HorrorMovieTarot.jsx` (lines 811-812)

## Working With This Repo

- **Do not edit `dist/` folders directly** — they are build outputs
- Static HTML pages (ai101, essay, etc.) use CDN-loaded Tailwind and have no build step
- `movies.json` exists in multiple locations — the source of truth is `horrortarot/movies.json`; `horrortarot/public/movies.json` is the copy served at runtime
- When adding new static pages, link them from `index.html`
