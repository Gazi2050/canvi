# Tasks

## 1. shadcn parts

- [ ] 1.1 Add needed registry components via `pnpm dlx shadcn@latest add <name>` (button, input, scroll-area or equivalents) and verify they land under `src/components/ui/` unmodified

## 2. Islands

- [ ] 2.1 Create `src/components/custom/chat-sidebar.tsx` (sorted, grouped history; arm-to-confirm delete; off-canvas ≤760px with backdrop) and verify grouping, delete-arming, and narrow-screen collapse in `pnpm dev`
- [ ] 2.2 Create `src/components/custom/chat-bar.tsx` (floating bottom-center input, send/stop states, drag resize with remembered size, message bubbles + status line) and verify send renders a local-echo user bubble
- [ ] 2.3 Create `src/components/custom/hero-prompt.tsx` replacing the Phrase 01 placeholder (chips fill input; visible only when canvas and chat are empty) and verify chip-click fills input and hero hides on first content

## 3. Phrase acceptance

- [ ] 3.1 Run `pnpm build` and verify it passes
- [ ] 3.2 Run `pnpm dev` and verify all three islands match the prototype layout and pass the DESIGN.md reject-list (floating, compact, single radius/shadow family)
