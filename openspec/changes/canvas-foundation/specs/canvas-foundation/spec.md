# Spec Delta

## Purpose

Provides the full-screen Excalidraw drawing surface on the home page that every later Canvi phrase (chat store, chat UI, agent tools) reads from and draws onto.

## ADDED Requirements

### Requirement: Full-viewport canvas surface

The system SHALL render the Excalidraw editor as the home page (`/`), filling the entire viewport with no surrounding chrome except floating islands.

#### Scenario: Canvas fills the viewport

- **WHEN** a user visits `/`
- **THEN** the Excalidraw canvas occupies the full viewport and is immediately interactive (no splash screen, no sign-in wall, no tour)

### Requirement: Client-only editor rendering

The system SHALL NEVER render the Excalidraw editor on the server; the editor MUST load exclusively in the browser.

#### Scenario: No server-side editor render

- **WHEN** the page is prerendered or server-rendered
- **THEN** the build succeeds, the page loads with no hydration errors or console errors, and the editor initializes client-side

### Requirement: Themed editor matching the app

The system SHALL theme the editor through Excalidraw's documented CSS variables for both light and dark modes, consistent with DESIGN.md.

#### Scenario: Light and dark canvas themes

- **WHEN** the app is in light mode
- **THEN** the canvas is a white sheet with near-black strokes and the indigo accent for selection and primary actions
- **WHEN** the app is in dark mode
- **THEN** the canvas uses the dark tone with equivalent hierarchy and contrast (explicit dark tokens, never a filter inversion)

### Requirement: Empty-state hero prompt

The system SHALL display a centered hero (title, one guidance line, suggestion chips) if and only if the canvas has no elements and the chat has no messages.

#### Scenario: Hero visible on empty canvas

- **WHEN** the canvas is empty and no chat messages exist
- **THEN** the hero prompt is visible and centered

#### Scenario: Hero hidden once work begins

- **WHEN** the canvas gains its first element
- **THEN** the hero prompt disappears

(NOTE: hiding on the first chat message belongs to the `chat-ui` phrase, which owns chat state — this phrase covers the canvas half only.)

### Requirement: Built-in drawing tools available

The system SHALL expose Excalidraw's default drawing and editing tools (selection, shapes, arrows, text, undo/redo, export) so a user can draw without any agent involvement.

#### Scenario: User draws unaided

- **WHEN** a user selects a shape tool and drags on the canvas
- **THEN** a hand-drawn (Artist roughness) shape appears and persists for the session
