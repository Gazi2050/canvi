# Tasks

## 1. Adapter and build config

- [ ] 1.1 Install `@cloudflare/vite-plugin` and `wrangler` as dev dependencies via pnpm and verify they appear in `package.json`
- [ ] 1.2 Create `src/waku.server.tsx` (fsRouter + cloudflare adapter, dynamic) and extend `waku.config.ts` with the plugin's rsc/ssr neutral-platform blocks (keeping tailwind/react-compiler plugins), and verify `waku build` emits worker + `dist/public` output

## 2. Wrangler project and D1

- [ ] 2.1 Create `wrangler.jsonc` (app `canvi`, `main: ./src/waku.server`, `compatibility_flags: ["nodejs_als"]`, D1 binding `DB`, assets `dist/public`, `no_bundle`) and verify it parses via `wrangler` config check
- [ ] 2.2 Create the D1 database `canvi-db` (human step if account-bound: `wrangler d1 create canvi-db`), bind it, write `schema.sql` for the `chats` table, execute with `--local`, and verify a write/read round-trip query
- [ ] 2.3 Run `cf-typegen` and verify `Env` (with the D1 binding) typechecks server code with no casts

## 3. Deploy workflow

- [ ] 3.1 Run `wrangler dev` and verify the app renders with a working local D1 round-trip
- [ ] 3.2 Execute schema with `--remote`, run `wrangler deploy`, and verify the public URL serves the app; document the exact commands used

## 4. Phrase acceptance

- [ ] 4.1 Run `pnpm build` and verify it passes with no secrets in client output
- [ ] 4.2 Verify the deployed app completes sign in → chat → agent draw → reload → history as a signed-in user
