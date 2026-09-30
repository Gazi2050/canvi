# Spec Delta

## Purpose

Provides the visible chat chrome — history sidebar, floating input bar, and hero prompt —Floating as DESIGN.md islands over the canvas.

## ADDED Requirements

### Requirement: History sidebar

The system SHALL show a sidebar island listing chats sorted by `updatedAt` (descending), grouped by recency (Today, Yesterday, Previous 7 days, Older), each row showing title plus relative time and shape count.

#### Scenario: Grouped history

- **WHEN** chats exist across several days
- **THEN** they appear under the correct recency headers in newest-first order

### Requirement: Arm-to-confirm delete

The system SHALL require two presses to delete a chat: first press arms the row's delete control, second press within a short window deletes.

#### Scenario: Accidental delete prevented

- **WHEN** the user presses delete once and does nothing
- **THEN** the control disarms and the chat survives

### Requirement: Floating chat bar

The system SHALL render a floating bottom-center chat bar island with a message input and send button; while the agent runs, send MUST become a stop control.

#### Scenario: Send and stop

- **WHEN** the user submits a message
- **THEN** it appears as a user bubble and the button becomes stop until the run ends

### Requirement: Interactive hero prompt

The system SHALL show the centered hero (title, guidance line, suggestion chips) if and only if canvas and chat are both empty; clicking a chip MUST fill the input.

#### Scenario: Chips drive input

- **WHEN** the user clicks a suggestion chip on an empty canvas
- **THEN** the input fills with the chip text ready to send

#### Scenario: Hero hides on first content

- **WHEN** the first canvas element appears or the first chat message is sent
- **THEN** the hero disappears (covering the chat-message half deferred from Phrase 01)

### Requirement: Narrow-screen behavior

The system SHALL collapse the sidebar off-canvas on narrow screens (≤760px) with a backdrop, keeping the canvas full-viewport.

#### Scenario: Mobile sidebar

- **WHEN** the viewport is narrow
- **THEN** the sidebar hides off-canvas and the canvas takes the full viewport until summoned
