# Design

## Context

Phrases 01–07 assume `pnpm dev` on Node. The Waku Cloudflare guide and D1 get-started define the target precisely (adapter, vite plugin, wrangler shape, binding access). This phrase applies them to Canvi. See proposal.md for motivation; see `specs/cloudflare-deploy/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Reproducible 0-to-deployed path captured as tasks, not tribal knowledge.
- D1 as the durable home of the Phrase 02 document model.

**Non-Goals:**

- R2, CI/CD, custom domains, production Clerk enforcement (Phrase 07 owns gating).

## Decisions

- **Server entry `src/waku.server.tsx`: `fsRouter` + `waku/adapters/cloudflare`, dynamic (no `static: true`).** Rationale: chat/agent are per-request; static export would silently disable them. Alternative (static export): rejected — wrong for this app.
- **`@cloudflare/vite-plugin` with rsc/ssr `platform: 'neutral'` blocks; existing plugins retained.** Rationale: runs workerd runtime locally so D1 bindings work in dev without shims. Alternative (adapter only, no plugin): rejected — loses local bindings.
- **`wrangler.jsonc`: name `canvi`, `main: ./src/waku.server`, `compatibility_flags: ["nodejs_als"]`, D1 binding `DB` → `canvi-db`, assets `dist/public` with drop-trailing-slash, `no_bundle: true`.** Rationale: Waku needs ALS; `nodejs_compat` is the recorded fallback (it mocks fs, which workerd forbids). Alternative (toml): rejected — jsonc is current.
- **Schema `chats(id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT, updated_at INTEGER, messages TEXT, elements TEXT)`; access via `env.DB.prepare(...).bind(...)`.** Rationale: direct map of `ChatDocument`; prepared statements prevent injection. Alternative (KV): rejected — documents are relational (per-user listing, recency sort).
- **`cf-typegen` (`worker-configuration.d.ts`) after every wrangler edit.** Rationale: `Env` drift breaks typechecking silently otherwise. Alternative (hand-maintained types): rejected — generated is authoritative.
- **Migration = import-once of localStorage docs; Durable Objects unavailable (no design impact — agent is request/streaming).** Rationale: continuity for existing local chats; streaming SSE fits Workers without DOs.

## Risks / Trade-offs

- [Guide drift (Waku/Cloudflare move fast)] → Mitigate: re-verify links at implementation; version/date pins recorded in tasks.
- [Human-side prerequisites (account, login, remote D1)] → Mitigate: tasks flag them as human steps with exact commands.
- [Workerd Node-API gaps in deps] → Mitigate: `nodejs_als` first, `nodejs_compat` fallback recorded; no fs-dependent code allowed server-side.
