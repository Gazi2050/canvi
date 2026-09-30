# Proposal

## Why

Seven phrases of product behavior mean nothing until the app runs outside `localhost`: no worker adapter, no D1 database, no schema, no deploy path exists. This final phrase takes the rollout from 0 to deployed on Cloudflare Workers with D1 persistence.

## What Changes

- Add the Cloudflare worker entry (`src/waku.server.tsx`, `waku/adapters/cloudflare`) and `@cloudflare/vite-plugin` config (rsc/ssr neutral-platform blocks; existing Tailwind/React-compiler plugins retained).
- Add `wrangler.jsonc` (app `canvi`, `nodejs_als` compat flag, D1 binding `DB` → database `canvi-db`, static assets from `dist/public`, `no_bundle`).
- Create the D1 database plus a `chats` schema for `ChatDocument`s, with local (`--local`) and remote (`--remote`) workflows.
- Generate worker types via `cf-typegen` (`worker-configuration.d.ts`, `Env` with the D1 binding).
- Establish the build → `wrangler dev` → `wrangler deploy` workflow.

## Capabilities

### New Capabilities

- `cloudflare-deploy`: worker adapter + build config, wrangler project, D1 database and schema, typed bindings, and the deploy workflow.

### Modified Capabilities

(none — consumes the `chat-store-persistence` document model as the schema source without changing its contract)

## Impact

- **Code:** one new server entry; config edits (`waku.config.ts`, new `wrangler.jsonc`, `schema.sql`); D1 migration path for localStorage documents (import-once, later implementation).
- **Dependencies:** `+ @cloudflare/vite-plugin`, `+ wrangler` (dev only).
- **Systems:** first live infrastructure (Worker + D1); Clerk env keys ride the same wrangler config.
- **Out of scope:** R2 (no scope needs it), data seeding beyond schema, CI/CD pipelines.
