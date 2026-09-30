# Tasks

## 1. Store module

- [ ] 1.1 Create `src/lib/chat-store.ts` with the `ChatDocument` type (`{id, title, updatedAt, messages[], elements[]}`) plus create/read/update/delete/switch primitives, and verify the module imports cleanly with no dependencies beyond React types
- [ ] 1.2 Implement debounced (~600ms) persistence to localStorage with quota-failure warning, and verify rapid successive writes collapse into one stored write

## 2. Canvas wiring

- [ ] 2.1 Wire the editor island's `onChange` into the store's debounced save (elements treated opaquely), and verify drawing then reloading restores the elements

## 3. Lifecycle

- [ ] 3.1 Implement chat switching (save-outgoing, load-incoming with scene reset, abort in-flight runs) and title derivation from the first user message, and verify switching swaps both transcript and canvas with no cross-chat leakage
- [ ] 3.2 Implement chat deletion (document removal; active-delete resets to a fresh chat), and verify deleting the active chat clears canvas and transcript

## 4. Phrase acceptance

- [ ] 4.1 Run `pnpm build` and verify it passes
- [ ] 4.2 Run `pnpm dev`, create two chats with distinct content, reload, and verify both chats restore exactly
