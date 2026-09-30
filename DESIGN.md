---
name: canvi-design-guidelines
description: "Design, build, or substantially improve Canvi: a chat + collaborative whiteboard where a user and an AI agent draw together on an Excalidraw canvas. The product must feel like Excalidraw — hand-drawn, low-friction, approachable, fast to start. Use for any Canvi surface: canvas chrome, chat UI, sidebar, landing, or agent-drawn content. This file is the styling authority referenced by AGENTS.md rule 4."
---

# Canvi Design System

Canvi borrows Excalidraw's design language — a paper canvas, wobbly hand-drawn strokes, small floating tool islands, and restraint. Act as an excellent Excalidraw designer, tool builder, and design engineer. Turn the available material into a surface that feels like a sheet of paper with a few well-placed tools on it. Shape the canvas and the chrome together; do not merely apply a sketchy font to a standard SaaS layout.

## Excalidraw product and brand context

Excalidraw is a virtual collaborative whiteboard for sketching diagrams that have a hand-drawn feel. It is open source, opens straight into a blank canvas, and asks for nothing before the first stroke. Canvi is built on the `@excalidraw/excalidraw` editor, so its canvas inherits this language for free; our job is to make every surface around the canvas — and everything the AI agent draws on the canvas — speak it too.

Make the artifact approachable, informal, fast, and honest. The hand-drawn look is a deliberate signal: it tells people the work is a draft, that ideas are cheap to try, and that nobody needs to be a designer to contribute. Build confidence through immediacy and low friction. Never manufacture it through polish, hype, or heavy chrome.

Start with the person's job, not the product category. Identify what they need to put on the canvas or explain, how quickly they can start, and what would slow them down.

Treat the canvas as the product. Everything else is a small, quiet tool that floats above it and gets out of the way.

## Excalidraw assets and logo usage

Official Excalidraw logotype and mark exist on the Excalidraw+ site (logo.svg, logo-small.svg, logo-dark.svg). These are Excalidraw's brand assets, not Canvi's: **never use them for Canvi branding.** Canvi has its own identity (the spark logo from the prototype sidebar). If Excalidraw assets are ever needed for attribution or "powered by" contexts, prefer SVG, do not redraw, recolor, or add effects, and check the repository (MIT) for current asset terms before shipping.

## Use this priority order

When requirements compete, protect them in this order:

1. Preserve supplied facts, data, and task constraints.
2. Preserve Canvi's stack and conventions: Waku routes, `src/components/custom/` + `src/components/ui/` split, shadcn/Tailwind system, AGENTS.md rules.
3. Make the first action obvious: the reader should be able to start drawing, editing, or reading within one glance.
4. Establish the hand-drawn character through strokes, the paper canvas, floating tool islands, and restraint.
5. Choose a composition specific to this material; avoid a generic SaaS template.
6. Refine responsive behavior, states, and details without weakening the canvas.

Ask one grouped set of questions only when proceeding could change meaning, privacy, collaboration or sharing behavior, or data retention. Otherwise proceed and label assumptions honestly.

## Integrate with the Canvi project

Preserve the existing stack: Waku file routing, React 19 + React Compiler, Tailwind CSS v4 with shadcn/ui tokens in `src/styles.css`. Do not force a new stack, library, or CSS approach.

- **Around the canvas:** Tailwind utility classes only, using the shadcn theme tokens (`bg-background`, `text-foreground`, `border-border`, the `--radius` scale). No new CSS files, no custom classes (AGENTS.md rule 5).
- **The canvas itself:** style the embedded editor only through Excalidraw's documented CSS variables, never by overriding internal selectors. Set variables on `.excalidraw` for light mode and `.excalidraw.theme--dark` for dark mode, with higher specificity prefixed by the app's own selector:

```css
.canvi .excalidraw {
  --color-primary: #6965db;
}
.canvi .excalidraw.theme--dark {
  --color-primary: #a8a5ff;
}
```

The primary colors you can safely override are `--color-primary`, `--color-primary-darker`, `--color-primary-darkest`, `--color-primary-light`, and `--color-primary-contrast-offset`. The contrast offset is a slightly darker (light mode) or lighter (dark mode) primary that fixes perceived contrast problems; it falls back to `--color-primary` when absent. Most other variables in `theme.scss` are not meant to be overridden. This documented override mechanism is the **single sanctioned exception** to the Tailwind-only rule.

- **Island values:** island principles below are binding; the exact radius and shadow values come from the token scale already defined in `src/styles.css`. Pick one radius and one shadow per island family and apply them consistently. Do not stack a second shadow or border.

Do not add heavy component kits, icon packs, or animation libraries to imitate the style. The style comes from a small palette, a few fonts, and one rendering idea.

## Work in four passes

### Frame the person's job

Inspect all available material first. Privately establish:

- Who is this for, and are they sketching, presenting, or reading?
- What is the fastest path from arrival to first useful mark?
- What must be collaborative, shareable, or exportable?
- What can stay out of the way until it is needed?

Normalize facts, terms, and units. Distinguish what is a draft from what is final. Never imply permanence, review, or approval the material does not support.

Order by the person's need, not by source order. Support two speeds: a glance path (title, canvas, one primary action) and a working path (tool options, properties, export, sharing).

### Choose the composition

The first viewport is the working surface, not a masthead. Choose the composition that exposes the canvas or the core example with the least mediation.

Match the opening to the job:

- **Canvi (an editor):** the blank canvas is the hero. Tools and the chat bar float above it as compact islands. No splash screen, no sign-in wall, no tour before the first stroke. When the canvas is empty, a centered hero prompt with suggestion chips invites the first move (see the prototype).
- **A landing or explainer page:** show a real sketch, ideally editable or clearly a drawing, before any claim. Let the drawing carry the argument.
- **Documentation:** plain paper background, calm text, hand-drawn diagrams as the evidence.
- **A comparison or process:** draw it as boxes and arrows, on one shared visual basis, rather than describing it in prose.

Choose geometry before components. Map the material to a visual variable:

- Sequence or dependency: arrows between shapes.
- Grouping: a loose frame or dashed boundary.
- Hierarchy: size and stroke weight, not decoration.
- Categories: fill color from the small pastel set, with a matching darker stroke.

Compose the page as a field, not a stack of cards. Leave generous open space around the focal drawing. Slight irregularity is welcome; rigid symmetry works against the character.

## Authoritative visual system

Treat this section as the design authority for Canvi. Values marked (verified) come from Excalidraw's public documentation, blog, or configuration. Values marked (observed) come from the app's defaults as commonly seen and should be checked against the current source before being treated as exact.

### Canvas and rendering

- The canvas is a flat sheet. Default canvas is white in light mode; dark mode uses a dark gray (`#121212`, verified as the app's theme color).
- Shapes are rendered with a sketch renderer, giving wobbly, hand-drawn strokes. Roughness has three levels: Architect (0, clean), Artist (1, the default), and Cartoonist (2, very sketchy).
- Stroke width offers three steps (thin, bold, extra bold). Stroke style offers solid, dashed, and dotted.
- Fill styles are hachure (diagonal lines), cross-hatch, and solid. Hachure is the signature look. Use solid fills sparingly.
- Edges can be sharp or round. Corners on hand-drawn shapes are gently rounded, never pill-shaped.
- Default to Artist roughness. Use Architect only when precision is the point, such as a final export for a slide. Never mix roughness levels within one diagram.

### Color

Excalidraw's palette is built on the Open Color scheme: 13 hues with 10 brightness steps each. The canvas uses the lightest step (0), strokes use the darkest (9), and element backgrounds use around the 6th or 7th step, per the Excalidraw blog (verified). In practice the picker exposes a small set (observed):

| Role | Color | Hex |
| --- | --- | --- |
| Default stroke and text | Near black | `#1e1e1e` |
| Stroke red | Red | `#e03131` |
| Stroke green | Green | `#2f9e44` |
| Stroke blue | Blue | `#1971c2` |
| Stroke orange | Orange | `#f08c00` |
| Fill red | Soft red | `#ffc9c9` |
| Fill green | Soft green | `#b2f2bb` |
| Fill blue | Soft blue | `#a5d8ff` |
| Fill yellow | Soft yellow | `#ffec99` |
| Fill none | Transparent | `transparent` |

Extended fill/stroke pairs used by agent-drawn content (fill / stroke): purple `#f8f0fc` / `#9c36b5`, teal `#e3fafc` / `#0c8599`, gray `#f1f3f5` / `#868e96`, pink `#fff0f6` / `#d6336c`, orange `#fff4e6` / `#e8590c`.

Interface accent (verified from the project's own docs theme): indigo-violet `#6965db`, with darker steps `#5b57d1` and `#4a47b1`. In dark mode the docs theme shifts to `#5650f0` and uses a lower-contrast tint for highlights. The prototype's chrome gradient (`#6c5ce7` → `#8e7bff`) is the Canvi brand accent for primary actions.

Rules:

- Draw in near-black on a light paper. Add color only when it names a category, a state, or a relationship.
- Pair a darker stroke with a lighter fill of the same hue. Do not use saturated fills.
- Use the indigo accent for selection, focus, and the primary action only. Do not spread it across headings or backgrounds.
- Do not turn something green merely because it is favorable. Pair color with a label, shape, or position so meaning survives without it.
- Dark mode is not a naive inversion for authored content. Excalidraw's own dark mode inverts the canvas rendering, which can shift custom colors and is a known complaint. Canvi defines explicit dark tokens (`:root`/`.dark` in `src/styles.css`) instead of relying on a filter, and keeps authored colors accurate.

### Typography

Excalidraw ships four families (verified from the official constants documentation and community sources):

| Family | Role | Use |
| --- | --- | --- |
| Excalifont | Hand-drawn (default text on canvas) | Labels inside diagrams, sketch headings, short annotations |
| Nunito | Normal | Readable body text, longer notes — **already Canvi's UI font** (`--font-sans` in `src/styles.css`) |
| Comic Shanns | Code | Code, commands, paths, identifiers |
| Lilita One | Bold display | Rare, heavy headings |

Rules:

- Use the hand-drawn family for short text that lives inside or beside a drawing. Do not set paragraphs in it.
- Use Nunito for reading. Keep prose near 60 to 68 characters per line.
- Use the code family only for code and identifiers, and set only the identifier in it.
- The application chrome (menus, dialogs, panels) uses a plain sans-serif UI font so tools stay legible (observed; confirm against `theme.scss`).
- Keep the scale small. Most text sits in three sizes: canvas label, UI label, and body. Equivalent items share size and weight.
- Sentence-case headings and labels. No all-caps eyebrows, no tracked overlines, no decorative numbering. Avoid em dashes.

### The island

Excalidraw's chrome is made of islands: small, floating, rounded panels that sit over the canvas instead of framing it (observed). Historical variables from the project include a soft shadow (`0 1px 5px rgba(0, 0, 0, 0.15)`), a 4px radius, and a spacing unit of `0.25rem` (`--space-factor`) (verified from an older issue that quoted the theme; the current values may differ).

Rules:

- Keep the number of islands minimal: a tool row, a properties panel that appears on selection, a chat bar, and a menu. Everything else stays hidden until needed.
- Islands float. They never span the full width, never form a header bar, and never push the canvas around.
- Use one radius and one shadow for all islands of a family (values from the `src/styles.css` token scale). Do not stack a second shadow or a border on top.
- Use spacing in multiples of one base unit. Keep padding tight; the tools should feel compact.
- Tool buttons are icon-first with a tooltip and a keyboard shortcut. Icons are simple line icons at one stroke weight (lucide-react). Do not put icons in colored tiles.
- The selected tool uses the accent tint. Hover uses a subtle neutral fill. Focus uses a clearly visible outline.

### Grid and alignment

The canvas has no page grid; it is infinite. The surrounding pages use a simple single-column or two-column layout with a comfortable reading measure.

- Snap docs and marketing content to a shared left edge. Let drawings break the column and use extra width.
- Let hand-drawn elements be slightly imperfect, but keep text and controls exactly aligned. Wobble belongs to strokes, not to layout.
- Do not force unequal ideas into equal cards. Draw them at their natural size.

### Data and diagrams

- Draw diagrams as boxes, ellipses, diamonds, and arrows. Use rectangles for things, diamonds for decisions, ellipses for start and end or for people.
- Arrows carry direction. Label the arrow when the relationship is not obvious, and place the label beside the line, not on top of it.
- Prefer direct labels inside shapes. Avoid legends.
- Charts, when needed, are drawn in the same sketch style with the same stroke weight. Show units and the baseline. Do not crop an axis to exaggerate a difference.
- Provide a text alternative for any diagram that carries meaning: a short description plus, where useful, the underlying list or table.

### Collaboration and interaction

- Starting is free: no account, no setup before the first stroke. Sharing is one action that produces a link.
- Show other people (and agent activity) as small, unobtrusive indicators with distinct colors.
- Provide undo and redo, keyboard shortcuts for every tool, and a way to export as an image, SVG, or the native file.
- Autosave quietly. Do not interrupt the user with confirmations for reversible actions.
- Make the state visible: what is selected, what will happen on click, who else is here, and when the agent is drawing.

### Motion and delight

Default to stillness in the chrome. Motion belongs to the drawing: strokes appear as they are drawn, selections snap responsively, cursors move smoothly, and the camera glides to new agent-drawn content. Never add parallax, marquees, auto-playing loops, confetti, or bouncing controls. Respect reduced-motion preferences.

Delight comes from speed and from the drawing itself: an example that looks like a friend sketched it, a tool that responds instantly, a shape that does what you meant. Do not manufacture personality with jokes or mascots.

### Media and icons

Use real sketches, exported diagrams, and screenshots of the actual tool. Never use stock imagery, glossy illustrations, 3D renders, or fake product mockups. Keep icons simple, single-weight, and functional.

## Canvi surfaces and the agent's drawing system

This section maps the language above onto Canvi's actual surfaces, and defines the numeric rules the AI agent uses when drawing. Sourced from `prototype/Whiteboard AI.html` — when this section and the prototype disagree, fix whichever is wrong and update both.

### Surface map

- **Canvas** — full viewport, the hero. Never overlaid with static bars.
- **Sidebar** (chat history) — one island: date-grouped list, arm-to-confirm delete, collapses off-canvas on narrow screens.
- **Chat bar** — one floating island at the bottom center; resizable by drag; doubles as stop button while the agent runs.
- **Hero prompt** — centered, only on an empty canvas: title, one line of guidance, suggestion chips. Disappears permanently once the canvas or chat has content.

### Agent drawing rules (numeric, binding)

- **Layout math:** average glyph width ≈ 0.55 × fontSize (0.6 for mono); line height ≈ 1.25 × fontSize (1.5 for multi-line text). Every text must fit its container with 16px+ padding; prefer wider cards over tiny fonts.
- **Cards:** 660px wide default, auto height (≈ `20 + titleSize×1.3 + bodyLines + 22`), tinted fill + saturated border of the same hue, rounded, strokeWidth 2, roughness 1, 20–24px inner padding. Numbered badge: 36×36 solid color, white number, top-left; title starts at `x+72` (or `x+24` without a badge). Default titleSize 22, bodySize 15.
- **Composition grid:** compute layout numerically before drawing — pick column widths, row heights, gaps; 50px vertical gaps between cards, 40px outer padding. Keep the whole design within ~1400×1800 unless asked otherwise.
- **Diagrams:** auto-layered boxes and arrows (TB or LR); diamonds for decisions, ellipses for start/end; arrow labels beside the line; groups boxed with a dashed boundary and a small gray label.
- **Fonts on canvas:** default to the clean sans (`fontFamily 2`) for professional work, mono (`fontFamily 3`) for code and terminals, hand-drawn (`fontFamily 1`) only for playful sketches. Title 32–36, subtitle 16 in `#868e96`, card title 22, body 15–16 in `#495057`, small labels 13.
- **UI mockups:** outer window rect (`#f1f3f5` light or `#1e1e2e` dark), title bar with three 14px circles `#ff5f57 #febc2e #28c840` and a centered title, sidebar/tab strip/content/status bar. Code in mono, size 15, syntax colors: keywords `#cc5de8`/`#9c36b5`, strings `#2f9e44`, functions `#1971c2`, numbers `#e8590c`, comments `#868e96`, line numbers `#adb5bd`.
- **Flow composition:** vertical stack, one arrow per step in the source card's stroke color; dashed arrows for optional or side paths; side notes in a yellow card aligned to the top of the related card.
- **Self-review:** after drawing, the agent critiques the rendered canvas (overlapping or clipped text, text touching borders, uneven gaps, inconsistent card sizes, arrows crossing text, off-palette colors) and fixes every real problem — the same checklist a human reviewer applies below.

### Inspect and revise privately

Render the actual result when tooling exists. Inspect the first viewport, the full page, light and dark modes, and narrow screens.

Review in this order:

1. **First read:** Is the canvas or the core drawing the obvious focus? Can someone start in one gesture?
2. **Character:** Does it feel hand-made and calm, or does it feel like a generic SaaS page with a sketchy font?
3. **Chrome:** Are there fewer tools on screen than you first wanted? Do islands float, share one radius and shadow, and stay compact?
4. **Typography:** Is the hand-drawn font limited to short text? Is body text readable?
5. **Color:** Is the page mostly near-black on paper, with color used only for meaning and for the single accent?
6. **Diagrams:** Do shapes and arrows carry the explanation? Are roughness and stroke weight consistent?
7. **Themes and reflow:** Do light and dark have equivalent hierarchy and contrast? Does the layout recompose without overflow?
8. **Access:** Are labels, focus, keyboard paths, and text alternatives sound?

Fix the highest-impact defect, render again, and repeat. Keep this work internal and deliver the implementation, not a critique.

## Reject generated-design reflexes

Do not ship any of these defaults:

- A hand-drawn font on top of an otherwise standard corporate layout.
- Centered hero copy followed by a card grid.
- Heavy top navigation bars or full-width toolbars over the canvas.
- Gradients, glows, glass, blobs, or textures used as decoration. *(The single exception is Canvi's brand gradient on the logo/primary-action button, as in the prototype.)*
- Pill-shaped buttons, badges, and capsules for ordinary labels.
- Saturated fills, neon accents, or several competing accent colors.
- Mixed roughness levels, mixed stroke weights, or clean vector shapes mixed with sketch shapes in one diagram.
- Paragraphs set in the hand-drawn font.
- Onboarding tours, sign-in walls, or cookie-style interruptions before the first stroke.
- Stock photos, 3D illustrations, or mascots.
- Icons in colored tiles, or mixed icon styles.
- Decorative charts, legends that replace direct labels, or color without meaning.
- Motion that exists only to impress.

Do not compensate by producing a sterile template. Excalidraw restraint is a blank page, a few good tools, honest wobbly strokes, and a lot of room to think.

## Suggested token starter

These are Canvi's canvas-level design tokens (`--cv-*` namespace). They document the visual values; the implementation tokens live in `src/styles.css` (shadcn OKLCH set) and Excalidraw's own CSS variables.

```css
:root {
  --cv-canvas: #ffffff;
  --cv-ink: #1e1e1e;
  --cv-ink-secondary: #343a40;
  --cv-accent: #6965db;
  --cv-accent-strong: #4a47b1;
  --cv-stroke-red: #e03131;
  --cv-stroke-green: #2f9e44;
  --cv-stroke-blue: #1971c2;
  --cv-stroke-orange: #f08c00;
  --cv-fill-red: #ffc9c9;
  --cv-fill-green: #b2f2bb;
  --cv-fill-blue: #a5d8ff;
  --cv-fill-yellow: #ffec99;
  --cv-island-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  --cv-radius: 4px;
  --cv-space: 0.25rem;
  --cv-font-hand: "Excalifont", "Comic Sans MS", cursive;
  --cv-font-body: "Nunito", system-ui, sans-serif;
  --cv-font-code: "Comic Shanns", ui-monospace, monospace;
}

:root[data-theme="dark"] {
  --cv-canvas: #121212;
  --cv-ink: #e9ecef;
  --cv-ink-secondary: #ced4da;
  --cv-accent: #a8a5ff;
}
```

Define explicit dark values for stroke and fill tokens instead of inverting the page with a filter.

## Accessibility and responsive behavior

Use landmarks, one descriptive `h1`, ordered headings, a skip link, native controls, accessible names on every icon button, visible focus, and text alternatives for diagrams. Meet WCAG AA and never rely on color alone. Keep every canvas action reachable by keyboard where the platform allows, and document the shortcuts.

On narrow screens, collapse the tool row into a compact toolbar at the bottom or edge, keep touch targets comfortably large, and let the canvas take the full viewport. Do not conceal overflow. Reflow before shrinking.

## Sources and confidence

Verified from public sources: the product description as a collaborative hand-drawn whiteboard, the dark theme color `#121212`, the Open Color basis and its step choices, the four font families and Excalifont as the default, the documented CSS variable override pattern, the primary color variable names, and the logo asset URLs.

Observed or partly derived, check before treating as exact: the specific picker hex values, the UI font, the island shadow, radius, and spacing values, and the accent tints. Excalidraw's current `theme.scss` and `colors.ts` in the repository at https://github.com/excalidraw/excalidraw are the authority.

The target is Excalidraw judgment, not Excalidraw decoration.
