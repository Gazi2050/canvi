# Proposal

## Why

The store from Phrase 02 has no face: no way to see, switch, or delete chats, no input surface, and only a static hero. The prototype's chrome — sidebar, floating chat bar, interactive hero — is what makes the product feel like Canvi, and every piece must be a DESIGN.md island.

## What Changes

- Add the chat sidebar island: chat list sorted by `updatedAt`, grouped Today/Yesterday/Previous 7 days/Older, arm-to-confirm delete, collapses off-canvas on narrow screens.
- Add the floating bottom-center chat bar island: message input, send (becomes stop while the agent runs), drag-to-resize with remembered size.
- Take over the static hero from Phrase 01: suggestion chips fill the input on click; hero visible only when canvas and chat are both empty.
- Render user/AI message bubbles and agent status line in the chat log.

## Capabilities

### New Capabilities

- `chat-ui`: sidebar history, floating chat bar, interactive hero prompt, and message bubbles per the prototype and DESIGN.md island rules.

### Modified Capabilities

(none — consumes `chat-store-persistence` documents and the Phrase 01 hero placeholder, changing neither contract)

## Impact

- **Code:** three new components (`src/components/custom/chat-sidebar.tsx`, `chat-bar.tsx`, `hero-prompt.tsx`); new shadcn parts only via `pnpm dlx shadcn@latest add <name>`; `src/components/ui/` never hand-edited.
- **Dependencies:** shadcn registry components as needed (e.g. button/input/scroll-area); no runtime data libraries.
- **Systems:** none (message sending still local echo; agent transport is `agent-backend`).
- **Out of scope (explicit follow-ups):** agent backend + tools, self-critique, Clerk.
