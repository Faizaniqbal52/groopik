# Groopik Brand Theme — "Golden Hour"

> **This file is the single source of truth for Groopik's visual identity.**
> Every color, font, and component decision must trace back to here. If it's not
> in this file, it's not in the product.

---

## Why a theme, and why this one

Netflix is black + one red: cinematic. Spotify is black + one green: nightlife.
Amazon is white + orange: a warehouse that smiles. Each brand owns **one base,
one accent, one feeling** — and repeats it everywhere until you recognize it
from across the room.

Groopik today is a mixture: near-black tech background, indigo→purple gradients,
glassmorphism, glow blobs, three fonts, three.js particles. That's the default
look of a thousand AI/dev-tool landing pages — and it's the *wrong* borrowed
identity, because Groopik isn't a dev tool. It's about **people, parties, trips,
weddings, and the photos you almost never got** (our own headline — the copy
already knows what the brand is; the visuals just don't match it yet).

**The theme is "Golden Hour"** — named after the hour before sunset when
everyone reaches for their camera. It is warm, nostalgic, celebratory, and
human. One sentence to test every design decision against:

> **"A warm, sunlit gallery where your photos are the only stars."**

### The one law: photos are the hero

Photography brands that work (Google Photos, VSCO, Pixieset) put images on
quiet, neutral canvases. Nothing on a Groopik page may be more colorful than
the users' photos. UI stays warm-neutral; exactly **one** accent color exists,
used sparingly (primary buttons, links, focus rings). No gradients on text, no
glows, no particle backgrounds — decoration competes with photos, and photos win.

---

## 1. Color

Warm neutrals (paper & ink, never blue-grays) + one sunset-amber accent.

### Light mode (default — this is the brand)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF6F0` | Page background (warm off-white, like photo paper) |
| `--surface` | `#FFFFFF` | Cards, inputs, nav |
| `--surface-sunken` | `#F3EDE4` | Alternate sections, wells |
| `--ink` | `#211D19` | Headlines, primary text (warm near-black) |
| `--ink-soft` | `#5C554C` | Body/secondary text |
| `--ink-faint` | `#8A8178` | Captions, placeholders (AA on paper — go no lighter) |
| `--line` | `#E7DFD3` | Borders, dividers |
| `--sunset` | `#E8590C` | THE accent: primary buttons, links, focus, live dots |
| `--sunset-deep` | `#C2410C` | Accent hover/active |
| `--sunset-tint` | `#FDEEE3` | Accent backgrounds (badges, selected states) |
| `--leaf` | `#3D8361` | Success only |
| `--brick` | `#C0392B` | Errors/destructive only |

### Dark mode (companion, not the brand)

Warm charcoal — **never** blue-black (`#06080d` is banned).

| Token | Hex |
|---|---|
| `--paper` | `#1C1917` |
| `--surface` | `#26221E` |
| `--surface-sunken` | `#151210` |
| `--ink` | `#F2EDE6` |
| `--ink-soft` | `#B8AFA4` |
| `--ink-faint` | `#7D756B` |
| `--line` | `#38322C` |
| `--sunset` | `#F97316` (slightly brighter for contrast) |
| `--sunset-tint` | `#3A2417` |

Implement both via `next-themes` (already a dependency) + CSS variables.
System preference by default, toggle in the footer.

### Color rules

1. One accent. If something orange is already on screen, the next element is neutral.
2. Success/error colors appear only for actual success/error — never decoratively.
3. No gradients as fills. No glow shadows. Shadows are warm and physical:
   `0 1px 2px rgba(60,42,24,.06), 0 8px 24px rgba(60,42,24,.10)`.

---

## 2. Typography

Two families, loaded with `next/font` (kill the CSS `@import`):

| Role | Font | Why |
|---|---|---|
| Display (headlines) | **Fraunces** (variable, `soft` axis high) | A warm, slightly vintage serif — the "printed photo album" voice. Italic for one emotional word per headline (current `em` pattern stays). |
| UI & body | **Plus Jakarta Sans** (already in use — keep) | Friendly geometric sans, great at small sizes. |

Join codes use `font-variant-numeric: tabular-nums` on Jakarta or system mono —
**JetBrains Mono import is dropped.**

Scale (keep it boring): 12 / 14 / 16 (body) / 18 / 24 / 32 / 48 / 64.
Nothing user-facing below 12px. Headlines `-0.02em`, body normal — no
letter-spaced ALL-CAPS labels except tiny eyebrows, and even those sparingly.

---

## 3. Imagery & the signature element: the print

Groopik's ownable visual is the **photo-as-physical-print**:

- Photos render as prints: white border (`4px`, `--surface`), `2px` radius,
  warm shadow, and on landing/marketing surfaces a subtle rotation (−3° to 3°).
- In the actual event gallery, prints go clean: no rotation, tight masonry,
  hairline `--line` border. Function over charm where users work.
- Empty states use a stack of tilted empty print frames — not abstract icons.
- Marketing imagery: real-feeling candid photos, warm light, faces. Never stock
  gradients, never 3D blobs.

---

## 4. Motion

Physical, quick, quiet — like handling real prints:

- Durations 150–300ms, `cubic-bezier(0.2, 0, 0, 1)`. Nothing loops forever
  (no pulsing dots), nothing floats.
- New photos in the gallery **settle in**: fade + 8px slide + tiny rotation
  correction (−1° → 0°). This is the one signature animation.
- Hover: cards lift 2px with shadow deepening. No scale-ups beyond 1.02.
- Honor `prefers-reduced-motion: reduce` — all transforms off, opacity only.
- **three.js dot surface: deleted.** ~600KB for decoration that fights the law
  ("photos are the hero").

---

## 5. Voice

The copy already has the right voice — keep it and protect it:

- Warm, human, second person: "The photos you almost never got."
- Never techy ("realtime sync engine"), never corporate ("leverage memories").
- Honest: no invented counters, no fake "real events". Trust is the product.

---

## 6. Component quick-reference

| Component | Spec |
|---|---|
| Primary button | `--sunset` fill, white text, 10px radius, hover `--sunset-deep`. One per view. |
| Secondary button | `--surface` fill, `--line` border, `--ink` text. |
| Ghost button | Text-only `--ink-soft`, hover `--surface-sunken` bg. |
| Input | `--surface` bg, `--line` border, focus: 2px `--sunset` ring. 16px text (prevents iOS zoom). |
| Card | `--surface`, `--line` border, 16px radius, warm shadow on hover only. |
| Badge | `--sunset-tint` bg, `--sunset-deep` text, full radius, sentence case. |
| Nav | `--paper` at 90% + blur, hairline `--line` bottom. Logo + wordmark left, one primary CTA right. |
| QR card | Always on pure white regardless of mode (scannability). |

### Logo

Keep the rounded-square + "g" mark but refill it: flat `--sunset` (no
indigo→purple gradient). Wordmark "groopik" lowercase in Jakarta Bold —
lowercase reads friendly; ALL-CAPS + tagline-under-logo reads corporate. Drop
the nav tagline.

---

## 7. Migration checklist

- [ ] Replace `:root` tokens in `globals.css` with the palette above (light + dark via `next-themes`).
- [ ] `next/font`: Fraunces + Plus Jakarta Sans; delete Google Fonts `@import` and JetBrains Mono.
- [ ] Delete `DottedSurface` + `three` dependency; delete glow/grid background divs.
- [ ] Pick ONE styling system (recommend Tailwind v4, already installed, mapped to these tokens); delete injected `<style>` blocks and inline styles.
- [ ] Landing hero: paper background, tilted print collage, one sunset CTA.
- [ ] Event gallery: clean prints, settle-in animation, light default.
- [ ] Compress `/public` PNGs → WebP via `next/image`.
- [ ] Remove fake counter + fake showcase claims (see PROJECT_REVIEW.md §3).
