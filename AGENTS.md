# Canvi — Agent Guide

Canvi is a whiteboard application: a full-screen Excalidraw canvas combined with a chat system where **both the user and an AI agent** can talk and draw on the same canvas, with combined chat + canvas history per conversation. This file is the single source of truth for any agent working in this repo. Read it fully before touching anything — it should save you from exploring the codebase from scratch. It does not save you from reading the code you are about to change.

---

## Non-Negotiables

These rules are binding for every agent, on every task. No exceptions without explicit human approval in the conversation.

1. **Never touch anything git-related.** No commits, no branches, no merges, no rebases, no stashes, no git config changes. The human owns version control.
2. **Never change the core architecture or folder structure** without explicit approval. The layout described in this file is fixed until the human says otherwise.
3. **Never add or remove features on your own initiative.** Implement only what is explicitly requested in the current task. If you notice something missing or broken outside your task, mention it — don't fix it.
4. **Follow DESIGN.md and the global CSS file (`src/styles.css`) for all styling decisions.** Do not deviate from what is defined there — no ad-hoc colors, fonts, spacing systems, or shadows. DESIGN.md is the styling law; `src/styles.css` implements it.
5. **Use Tailwind utility classes for all styling. No custom CSS classes.** The only CSS file is `src/styles.css` (theme tokens + Tailwind layers). Do not create component CSS files, do not use inline `style={{}}` when a utility class exists.
6. **shadcn/ui components are the component foundation:**
   - Never directly edit anything in `src/components/ui/` — it is CLI-managed code.
   - If a component needs custom behavior or styling beyond what shadcn provides, create a new component in `src/components/custom/` that wraps or composes the shadcn component.
   - Add new shadcn components only via `pnpm dlx shadcn@latest add <name>`.
7. **OpenSpec-driven development.** Work proceeds phase-by-phase according to OpenSpec definitions. Do not implement anything outside what OpenSpec specifies for the current phase/task. This rule is absolute: `openspec/` is initialized — see `openspec/ROADMAP.md` for the phrase order.

---

## Project Overview

**What the app does:** A collaborative canvas-drawing app. The user gets a full-screen Excalidraw canvas and a chat interface. They can ask the AI agent questions about the canvas, or ask it to draw — the agent plans, draws with high-level tools (diagrams, cards, freeform elements, connections), critiques its own output from screenshots, and iterates. Every chat stores its own canvas and message history together, so switching conversations switches canvases. Authentication (Clerk) gates the app.

**Evolution (why the repo looks like this):**

| Version | Stack | Fate |
|---|---|---|
| v0 | SvelteKit + Drizzle skeleton | Abandoned (first commits) |
| v1 "FreeSpace" (`old-version/`) | Next.js 16, Excalidraw, Dexie/IndexedDB persistence | Frozen reference. Earlier iterations had Clerk auth, a projects dashboard, Neon/Drizzle, and PartyKit realtime collab — all stripped away before freezing. |
| Prototype (`prototype/Whiteboard AI.html`) | Single-file HTML, Excalidraw + full AI agent | **The living product spec.** This is what we are building. |
| Current (`src/`) | **Waku 1.0-rc.2** (React 19.3 + RSC), Hono middleware, Tailwind v4, React Compiler, shadcn/ui | Active development. Currently a clean slate: shadcn is integrated, the product itself is not yet ported. |

**Current direction vs. old version:** The old version was canvas-only (one document, no chat, no AI). The current version adds the chat system, the AI drawing agent, per-chat combined history, and moves from Next.js to Waku. The prototype's in-artifact AI transport (`claude.use('sample')`) must be replaced with real backend API routes (Waku/Hono) calling an LLM provider. Clerk returns as the auth provider.

---

## Architecture

### Stack

- **Framework:** Waku 1.0.0-rc.2 — React Server Components meta-framework on Vite. File-based routing in `src/pages/`. Pages export `default` (component), optional `getData`, and `getConfig` (render mode: `'static' | 'dynamic'`).
- **Server:** Hono middleware (see `src/middleware/`); API routes live in `src/pages/_api/` (Waku convention), dynamic by default. The agent route streams via the AI SDK (`useChat` on the client).
- **UI:** React 19.3 with React Compiler enabled (babel preset in `waku.config.ts` — don't add manual `useMemo`/`useCallback` rituals; the compiler handles memoization).
- **Styling:** Tailwind CSS v4 (Vite plugin, CSS-first config in `src/styles.css` — there is no `tailwind.config.js`) + shadcn/ui (new-york style, radix base).
- **Canvas:** `@excalidraw/excalidraw` (as in both previous versions) — client-only, dynamically imported; it must never render server-side.
- **Auth:** Clerk (per `clerk-auth`; was proven in v1's earlier iterations).
- **Persistence:** per-chat documents (messages + canvas elements). localStorage now (prototype parity); D1 (`canvi-db`, binding `DB`) is the recorded future backend — see `chat-store-persistence` + `cloudflare-deploy`.
- **Deploy:** Cloudflare Workers via `waku/adapters/cloudflare` (`src/waku.server.tsx`, owned by `cloudflare-deploy`); `nodejs_als` compat flag; no Node `fs` server-side; no Durable Objects.
- **Package manager:** pnpm. **Node scripts:** `pnpm dev` (→ http://localhost:3000), `pnpm build`, `pnpm start`, `pnpm typegen`.

### Structure

```
canvi/
├── src/
│   ├── pages/                  # Waku file-based routing
│   │   ├── _layout.tsx         # Root layout: fonts, meta, Header/Footer
│   │   ├── index.tsx           # Home
│   │   ├── about.tsx           # About
│   │   └── pages.gen.ts        # GENERATED route types — never hand-edit
│   ├── components/
│   │   ├── custom/             # App components (ours — editable)
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── counter.tsx
│   │   └── ui/                 # shadcn components (CLI-managed — NEVER edit)
│   ├── lib/
│   │   └── utils.ts            # re-exports cn() from the `cn` package
│   ├── middleware/
│   │   └── no-trailing-slash.ts
│   └── styles.css              # ONLY css file: Tailwind + tw-animate-css + theme tokens
├── prototype/
│   └── Whiteboard AI.html      # Product spec: complete working prototype (single file)
├── old-version/                # Frozen Next.js app — read for context, don't copy or run
├── public/
├── components.json             # shadcn CLI config (new-york, rsc, @/ aliases)
├── DESIGN.md                   # Styling authority: design language + agent drawing rules
├── openspec/                   # OpenSpec: changes/ (one folder per phrase), ROADMAP.md (master list), config.yaml
├── waku.config.ts              # Tailwind + React + React Compiler + @ alias
└── tsconfig.json               # strict, bundler resolution, @/* → ./src/*
```

**Spec-owned modules (one OpenSpec change each — implement in ROADMAP order, archive before advancing):** chat store (`src/lib/chat-store.ts`), canvas island (`src/components/custom/whiteboard-canvas.tsx`), agent backend (`src/pages/_api/agent/chat.ts`, prompt in `src/lib/agent/`), agent tools (`src/lib/agent/tools.ts`: `get_scene`, `draw_diagram`, `draw_cards`, `draw_elements`, `connect`, `update_elements`, `delete_elements`, `focus_view`), D1 persistence, Clerk auth wrapper. See `openspec/changes/` + `openspec/ROADMAP.md`.

---

## Core Modules

**Existing:**

- **`src/pages/_layout.tsx`** — root layout. Imports `styles.css`, loads Nunito from Google Fonts, renders Header/Footer around children. All pages inherit it.
- **`src/components/custom/*`** — application components. `header.tsx` and `footer.tsx` are server components; `counter.tsx` is a `'use client'` component and the reference example for client interactivity + shadcn composition.
- **`src/components/ui/*`** — shadcn registry output (`button.tsx` currently). Regenerated by CLI; treated as a dependency, not our code.
- **`src/styles.css`** — theme system: Tailwind import, `tw-animate-css`, `@custom-variant dark`, `@theme inline` block mapping shadcn CSS variables to Tailwind utilities (with Nunito as `--font-sans`), OKLCH tokens for `:root`/`.dark`, and the base layer. The implementation of the design tokens defined in `DESIGN.md` (rule 4).
- **`DESIGN.md`** — the styling authority: design language, palette, typography, island rules, and the agent's numeric drawing system. Read it before any UI or canvas work.
- **`src/middleware/no-trailing-slash.ts`** — Hono `trimTrailingSlash` middleware.

**The prototype as spec (`prototype/Whiteboard AI.html`):** a complete, working implementation of the target product in one file. When building any feature, read the corresponding part of this file first — it defines the chat sidebar (date-grouped history, arm-to-confirm delete), the hero prompt with suggestion chips, the floating resizable chat bar, the AI agent's system prompt (`GUIDE` — a full design system: palettes, fonts, card metrics, text-sizing math), the tool set with schemas, and the screenshot self-critique loop (up to 3 passes). Port behavior, not code — it's untranspiled vanilla JS by design.

---

## Data Flow

Target flow (from the prototype; to be implemented phase-by-phase):

**Chat message → canvas:**

1. User types a message in the chat bar → appended to the current chat's message list → rendered as a user bubble → persisted (debounced, together with the canvas snapshot).
2. The message (plus recent history + a canvas screenshot + view info) is sent to the agent backend (in the prototype: `claude.use('sample')`; in the real app: a Waku/Hono API route wrapping an LLM provider).
3. The agent plans (`todo_write` for non-trivial tasks) and emits tool calls: `get_scene` to read exact ids/coordinates, then drawing tools (`draw_diagram`, `draw_cards`, `draw_elements`, `connect`) or edit tools (`update_elements`, `delete_elements`, `focus_view`).
4. Each tool call executes against the Excalidraw API: elements are converted to real Excalidraw elements (`convertToExcalidrawElements`), committed to the scene with `commitToHistory: true` and version bumps, and the camera scrolls to new content. Tool results (measured bounding boxes, ids) feed the agent's next step.
5. After drawing, the canvas is exported to an image; the agent critiques it like a reviewer and fixes real problems, up to 3 passes.
6. Final agent text becomes an AI bubble; messages + canvas elements are persisted together under the chat's id.

**Canvas action → history:** direct user edits on the Excalidraw canvas trigger `onChange` → debounced persist of the current chat's `{messages, elements}` snapshot. Switching chats saves the outgoing chat, loads the target chat's snapshot (resetting the scene and clearing history), and aborts any in-flight agent run.

**Combined history model:** one chat = `{id, title (from first user message), updatedAt, messages[], elements[]}`. The sidebar lists chats sorted by `updatedAt`, grouped by recency. Deleting a chat removes its document and, if active, resets to a fresh chat.

---

## Conventions

- **Naming:** components and files in `kebab-case.tsx` (`project-card.tsx` style); named exports for components (`export const Header`), default export for Waku pages. Types/interfaces in `PascalCase`.
- **Imports:** use the `@/` alias for anything under `src/` (`@/components/custom/counter`, `@/lib/utils`). Keep import groups ordered: external packages, then `@/` imports, then relative.
- **Client/server boundary:** Waku pages and layout are React Server Components by default. Add `'use client'` only at the leaves that need interactivity/state (see `counter.tsx`). Excalidraw and anything touching browser APIs must be client-only `React.lazy` + `Suspense` islands — Waku has no `ssr:false` (reference: `canvas-foundation` design).
- **Styling:** Tailwind utilities only, theme colors via shadcn tokens (`bg-primary`, `text-muted-foreground`, `border-border`, ...), radii via the `--radius` scale (`rounded-md` etc.). No new CSS files, no custom classes, no inline styles where utilities exist (rule 4/5).
- **shadcn usage:** import from `@/components/ui/<name>`; compose rather than modify (rule 6). `cn()` comes from `@/lib/utils`.
- **State management:** plain client store (`src/lib/chat-store.ts`, Phrase 02); no SWR/React Query unless a spec proves need. AI SDK `useChat` owns agent-conversation state.
- **React Compiler is enabled** — write idiomatic React; don't hand-memoize unless profiling proves a need the compiler can't see.
- **No test framework, linter, or formatter is configured yet.** Verification = `pnpm build` passing + manual check in `pnpm dev` unless OpenSpec says otherwise. State what you verified and how.
- **Generated files:** never hand-edit `src/pages.gen.ts` (regenerate with `pnpm typegen`).

---

*Last updated: 2026-09-30, after OpenSpec rollout (8/8 changes) + deploy decisions. When the architecture or stack changes, update this file in the same task.*
