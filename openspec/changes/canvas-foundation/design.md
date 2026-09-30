# Design

## Context

`src/` is the untouched Waku starter: RSC pages, no canvas dependency, `@` alias and Tailwind already wired. Excalidraw touches browser APIs and ships a large bundle, so it must sit behind a client-only boundary and stay out of the server bundle. Reference: `old-version/app/page.tsx` proves the dynamic-import pattern works with Excalidraw 0.18.x. See proposal.md for motivation; see `specs/canvas-foundation/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Establish the reusable client-island pattern for all future browser-only surfaces (chat bar, sidebar).
- Pin one Excalidraw version for the whole rollout.
- Theme the editor strictly through documented CSS variables.

**Non-Goals:**

- Persistence, chat state, agent wiring, auth (their own phrases).
- Custom Excalidraw UI overrides or internal-selector hacks.

## Decisions

- **Client-only island via `React.lazy` + `Suspense` inside a `'use client'` leaf component** (`src/components/custom/whiteboard-canvas.tsx`), imported by the RSC home page. Rationale: Waku has no `ssr: false` API and `'use client'` components are still prerendered — a lazily imported island prerenders as fallback HTML and resolves the editor only in the browser, keeping it out of the RSC/server bundle and away from server-side browser APIs. The old-version proves this pattern's intent under `next/dynamic`, not its Waku mechanism. Alternative (static import in a client component): rejected — bloats the server bundle and risks prerender crashes on browser APIs.
- **Pin `@excalidraw/excalidraw@^0.18.0`.** Rationale: same major line the frozen version shipped, React 19-era. Alternative (latest / 0.17.x CDN from prototype): rejected — unpinned CDN is not reproducible; 0.17 predates the React 19 line.
- **Theme via `.canvi .excalidraw` / `.canvi .excalidraw.theme--dark` variable overrides** (`--color-primary` family only). Rationale: the only documented, upgrade-safe seam; doubles as the project's single sanctioned exception to the Tailwind-only rule. Alternative (overriding internal selectors): rejected — breaks on upstream refactors.
- **Empty-state hero as a separate lightweight component** rendered above the canvas island, driven by element count. Rationale: keeps the canvas component free of chat concerns; the `chat-ui` phrase later takes over its interactivity. Alternative (baking hero into the canvas component): rejected — mixes two phrases' ownership.
- **Keep starter demo routes (`/about`, counter) untouched in this phrase.** Rationale: smallest diff; cleanup is a follow-up, not this phrase's job.
- **Import the package CSS once and size the container; no font self-hosting.** Import `@excalidraw/excalidraw/index.css` alongside the island and render the editor inside a non-zero-height (`100dvh`) container — upstream names these the two most common integration failures (blank/unstyled canvas; cf. `old-version/app/page.tsx:5`). Leave `window.EXCALIDRAW_ASSET_PATH` untouched (default CDN fonts) in this phrase. Rationale: smallest working embed per upstream's own agent guidance (plain embed first; refs/initialData/persistence later). Alternative (self-host fonts now): rejected — extra `public/` assets plus a global script for zero phrase-01 benefit.

## Risks / Trade-offs

- [Excalidraw 0.18 + React 19 + React Compiler friction] → Mitigate by verifying `pnpm build` and a zero-console-error dev session as phrase acceptance; escape hatch is `'use no memo'` on the island file if the compiler misbehaves.
- [Version drift before later phrases] → Mitigate: the pin lives in `package.json`; any bump is a deliberate separate task, not a drive-by.
- [Hero/chrome duplication when `chat-ui` lands] → Mitigate: this phrase's hero is explicitly static/temporary; `chat-ui` spec owns the interactive version.
