# Add Radiohead Videos to Music Page

**For Hermes:** Implement this plan step-by-step.

**Goal:** Display three Radiohead cover videos on /music.html with YouTube embeds.

**Architecture:** Add a catalog entry + modify music.html render logic to support responsive YouTube iframes.

**Tech Stack:** Static HTML, CSS, vanilla JS (catalog.json + room.js).

---

### Task 1: Add a new Radiohead Covers entry to `catalog.json`

**Objective:** Register the Radiohead covers as a catalog entry with `"music"` category so it appears on the music page.

**File:** `catalog.json` (line 212 — right before the closing `}`).

**Action:** Add this entry right after the `unmastered-recordings` block (after line 244 in catalog.json, before the `slac-egress` entry):

```json
  {
    "id": "radiohead-covers",
    "title": "Radiohead Covers — Old Town School of Folk Music",
    "year": 2026,
    "categories": ["music", "experiments"],
    "description": "Radiohead ensemble at Old Town School of Folk Music, Szold Hall. Live covers and deep cuts.",
    "videos": [
      { "id": "PxPT1nA3-Ns", "title": "Radiohead Cover", "description": "" },
      { "id": "E-yYJg4qOQs", "title": "Radiohead Cover", "description": "" },
      { "id": "hmkRxeVZ_EI", "title": "Radiohead Cover", "description": "" }
    ],
    "status": "live",
    "tags": ["radiohead", "old-town-school", "live", "covers"]
  },
```

**Verification:** Run `node -e "const d = require('./catalog.json'); const e = d.find(x => x.id === 'radiohead-covers'); console.log(e ? 'OK: ' + e.title : 'MISSING');"` from the repo root. Expected: `OK: Radiohead Covers — Old Town School of Folk Music`.

### Task 2: Update `music.html` render logic to handle video embeds

**Objective:** Modify the inline render function in music.html to detect entries with `entry.videos` and render responsive YouTube iframes.

**File:** `music.html` (lines 38-66).

**Action:** Replace the current render function (the `<script>` block starting at line 38) with the following. The key change: after the existing Bandcamp `if` block, add a check for `entry.videos` that renders YouTube embeds:

```html
    <script>
    initRoom('music', function (entries) {
        var container = document.getElementById('room-entries');
        var html = '';

        entries.forEach(function (entry) {
            html += '<div class="music-feature">';
            html += '<h3 class="music-feature__title">' + entry.title + '</h3>';

            if (entry.description) {
                html += '<p class="music-feature__description">' + entry.description + '</p>';
            }

            // Embed Bandcamp player for the album
            if (entry.id === 'unmastered-recordings') {
                html += '<iframe style="border: 0; width: 100%; height: 120px; margin-top: 16px;" src="https://bandcamp.com/EmbeddedPlayer/album=1996498799/size=large/bgcol=0f0d0b/linkcol=c45a3c/tracklist=false/artwork=small/transparent=true/" seamless loading="lazy"></iframe>';
            }

            // Embed YouTube videos for entries with a videos array
            if (entry.videos && entry.videos.length > 0) {
                html += '<div class="video-grid">';
                entry.videos.forEach(function (v, i) {
                    var title = v.title || (entry.title + ' — Video ' + (i + 1));
                    html += '<div class="video-embed">';
                    if (v.title) {
                        html += '<p class="video-embed__title">' + v.title + '</p>';
                    }
                    html += '<div class="video-wrapper">';
                    html += '<iframe src="https://www.youtube.com/embed/' + v.id + '?rel=0" title="' + title + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>';
                    html += '</div>';
                    html += '</div>';
                });
                html += '</div>';
            }

            if (entry.url) {
                var external = entry.url.indexOf('http') === 0;
                var target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
                html += '<a href="' + entry.url + '"' + target + ' class="music-feature__link">Listen &rarr;</a>';
            }

            html += '</div>';
        });

        container.innerHTML = html;
    });
    </script>
```

**Verification:** Open `music.html` in a browser. Expected: music page shows FM Noggin link, Unmastered Recordings Bandcamp embed, AND the new Radiohead Covers section with three video embeds.

### Task 3: Add CSS for responsive video embeds

**Objective:** Style the video grid so YouTube embeds are responsive (16:9 aspect ratio, stacks on mobile).

**File:** `site.css` (after line 669 — the last `.music-feature__link` rule).

**Action:** Append the following to `site.css`:

```css

/* Music room — video embeds */
.video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: 20px;
    margin-top: 16px;
}

.video-embed {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.video-embed__title {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-bright);
    margin: 0;
}

.video-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    border-radius: 4px;
    background: #000;
}

.video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
}
```

**Verification:** On a narrow viewport (< 680px), videos stack vertically. On wider viewports, they display in a 2 or 3 column grid depending on width.

### Task 4: Commit and verify

**Objective:** Commit all changes.

**Commands:**
```bash
cd ~/repositories/topherrasmussen.github.io
git add catalog.json music.html site.css
git commit -m "Add Radiohead covers video embeds to music page"
```

**Verification:** `git log -1` shows the commit. Check `music.html` renders without JS errors.

---

**End of plan.**
