# Groopik — Project Review & Fix List

> Snapshot of a full code review (July 2026). Keep this file updated: check items off as they land.
> Priorities: 🔴 urgent (exploitable / user-visible breakage) · 🟠 important · 🟡 nice-to-have

---

## 1. Security (🔴 fix before anything else)

- [ ] 🔴 **Delete route has no authorization.** `app/api/delete/route.ts` accepts any
  `filePath` from the client and deletes it from R2. Anyone can wipe any photo, any
  manifest, or `_meta/events/*.json` with a single curl. The `canDelete()` check in
  `app/event/[id]/page.tsx` is client-side cosmetics only.
  → Server must verify the requester's session token owns the photo (or is the host)
  and must only ever delete keys that belong to that event's photo prefix.
- [ ] 🔴 **"Host" is just a URL param.** Joining with `?name=Host` grants host powers,
  and the host token is `host_${eventId}` — derivable from the public event ID.
  → Issue a real random host secret at event creation, store it server-side, verify it.
- [ ] 🔴 **Session tokens are invented by the client** (`app/join/page.tsx`) and never
  validated server-side. → Server-issued tokens (httpOnly cookie or signed value).
- [ ] 🔴 **No server-side upload limits.** The 20-photo cap and type/size checks exist
  client-side; the API re-checks type/size but not the per-session cap, and there is
  no rate limiting. Open bucket = open bill. → Enforce caps + rate limit in the route.
- [ ] 🟠 **Unsanitized file names in R2 keys** (`app/api/upload/route.ts`). Strip
  slashes/control chars, or use only the generated UUID + extension.
- [ ] 🟠 **Join codes from `Math.random()`** — not crypto-grade, 6 chars guessable at
  scale. → `crypto.randomBytes`, and rate-limit code lookups.

## 2. Data correctness

- [ ] 🔴 **Manifest race loses photos.** Upload does read-manifest → modify → write
  (`app/api/upload/route.ts`). Two simultaneous uploads overwrite each other; the
  photo lands in R2 but never appears in the gallery. This is the exact
  "many guests uploading at once" scenario the product exists for.
  → Options: (a) move metadata to a real DB (Supabase is already a dependency —
  a `photos` table + Realtime subscription also kills the 5s polling), or
  (b) write one small JSON object per photo and list by prefix instead of one
  mutable manifest.

## 3. Functional bugs

- [ ] 🟠 **Cancel doesn't cancel.** In `uploadPhotos`, `if (cancelled) break` reads a
  stale closure value — only the in-flight file aborts, the rest keep uploading.
  → Use a `useRef` flag, not state.
- [ ] 🟠 **Bad event ID = infinite "Loading…"** on `/event/[id]`. Add an error state.
- [ ] 🟠 **Download All** fires N simultaneous downloads; browsers block after a few.
  → Zip server-side (or JSZip client-side).
- [ ] 🟠 **Fake social proof.** Nav counter starts at hardcoded 2847 and increments on
  a random timer; the "Real events" showcase claims "Every card is a real event"
  over invented data. Remove the claims or wire to real numbers — if a user notices,
  trust in "your photos stay yours" dies with it.
- [ ] 🟡 Copyright year says 2026 on two pages, 2025 on `/join`.
- [ ] 🟡 Footer "links" are `<span onClick>` — use `<Link>` (SEO, keyboard access).
- [ ] 🟡 All errors surface as `alert()`/`confirm()` — replace with toasts/dialogs.
- [ ] 🟡 Dead code: `scrollY` state, unused `useRef` import, unused `{ url, filePath }`
  destructure in `app/page.tsx`; `lib/supabase.ts` is never imported anywhere;
  `next-themes` installed but unused.

## 4. README vs reality

The README describes a product that is not in this repo. Either build it or rewrite it —
shipping the gap is worse than a modest honest README.

- [ ] 🔴 Claims Supabase Realtime / PostgreSQL / anonymous sessions / room-scoped JWTs
  — actual implementation is JSON files in R2 polled every 5 seconds, with no auth.
- [ ] 🟠 Claims chunked/resumable uploads, room expiry, bulk export, pre-signed upload
  URLs — none exist.
- [ ] 🟠 Links to `docs/decisions.md`, `docs/setup.md`, `.env.example`, `LICENSE` —
  none of these files exist. Create them or drop the links.
- [ ] 🟡 "Failure Modes Encountered" describes incidents/fixes for features never built.

## 5. Performance

- [ ] 🟠 Six ~1MB PNGs (7MB in `/public`) loaded as plain `<img>` in the hero.
  → `next/image` + compress to WebP/AVIF (~50–100KB each). Event Wi-Fi is the
  primary use case; the landing page must be light.
- [ ] 🟠 three.js (~600KB) loaded just for the background dot surface. Drop it
  (the new theme removes it anyway — see `docs/BRAND_THEME.md`).
- [ ] 🟠 Three Google font families via render-blocking CSS `@import` in
  `globals.css`. → `next/font`, two families max (see theme doc).

## 6. Design / frontend architecture

Full brand direction lives in **`docs/BRAND_THEME.md`** — that file is the single
source of truth for colors, type, and visual rules.

- [ ] 🟠 Three styling systems fight each other: Tailwind v4 (installed, imported,
  unused) + 470 lines of CSS injected via `<style>{pageStyles}</style>` in client
  components + inline `style={{}}` everywhere on the event page. Pick ONE
  (recommendation: Tailwind with the theme tokens from BRAND_THEME.md) and delete
  the rest.
- [ ] 🟠 No light theme, no `prefers-reduced-motion`, custom checkbox `div`s are not
  focusable/screen-reader visible, several 9–11px text styles,
  `--color-text-tertiary` (30% white) fails contrast.
- [ ] 🟡 No custom error/not-found pages, no robots/sitemap, no web manifest
  (README claims PWA).

## 7. General repo (the Python predictor)

- [ ] 🟡 No README, no `requirements.txt`, no tests — nobody can run it without
  reverse-engineering. A 10-line README + pinned deps fixes it.

---

## Suggested order of attack

1. Delete-route authorization + host secret (§1) — exploitable today.
2. Manifest race → Supabase table + Realtime (§2) — also makes the README honest.
3. Rewrite README to match reality (§4).
4. Remove fake counter/showcase claims (§3).
5. Theme rebuild per `docs/BRAND_THEME.md` + one styling system + next/image +
   next/font (§5–6).
6. Small fixes: error states, toasts, Links, zip download, LICENSE (§3).
