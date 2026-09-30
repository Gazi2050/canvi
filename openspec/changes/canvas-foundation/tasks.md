# Tasks

## 1. Dependency

- [ ] 1.1 Install `@excalidraw/excalidraw@^0.18.0` via pnpm and verify it appears in `package.json` dependencies and `pnpm-lock.yaml`

## 2. Canvas island component

- [ ] 2.1 Create `src/components/custom/whiteboard-canvas.tsx` as a `'use client'` component that loads the Excalidraw editor via `React.lazy` + `Suspense` (never statically imported), and verify after `pnpm build` that the editor chunk is absent from the `dist/server` output
- [ ] 2.2 Wire Excalidraw CSS-variable theming (`.canvi .excalidraw` / `.canvi .excalidraw.theme--dark`, `--color-primary` family per DESIGN.md) and verify light and dark canvases render with correct tones in `pnpm dev`
- [ ] 2.3 Render the static empty-state hero (title, guidance line, suggestion chips) above the canvas when element count is zero, and verify it shows on a fresh load and hides after the first drawn element

## 3. Home page wiring

- [ ] 3.1 Rewire `src/pages/index.tsx` to render the full-viewport canvas page inside a `100dvh` container with `@excalidraw/excalidraw/index.css` imported, and verify `/` shows an immediately interactive, correctly styled canvas with no splash, sign-in wall, or tour

## 4. Phrase acceptance

- [ ] 4.1 Run `pnpm build` and verify it passes (client + SSR + SSG with no errors)
- [ ] 4.2 Run `pnpm dev`, draw with two built-in tools and undo once, and verify zero console errors or hydration warnings
