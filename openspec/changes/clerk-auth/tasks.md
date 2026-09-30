# Tasks

## 1. Provider and gate

- [ ] 1.1 Install the `@clerk/*` packages per the prevailing Clerk/Waku docs and verify they appear in `package.json`
- [ ] 1.2 Place the Clerk provider in the root layout and gate all app surfaces (signed-out sees sign-in only), and verify a signed-out visit to `/` never renders canvas or chat
- [ ] 1.3 Scope chat-store documents per user and document the key-free local-dev path, and verify two accounts on one browser stay isolated while `pnpm dev` still works without production keys

## 2. Phrase acceptance

- [ ] 2.1 Run `pnpm build` and verify it passes
- [ ] 2.2 Run `pnpm dev` and verify the full flow (sign in → chat → agent draw → reload → history) works end-to-end as a signed-in user
