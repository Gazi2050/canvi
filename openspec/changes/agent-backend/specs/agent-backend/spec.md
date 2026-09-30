# Spec Delta

## Purpose

Turns the local-echo chat bar into a live conversation with a streaming AI agent that sees the canvas and plans its work.

## ADDED Requirements

### Requirement: Streaming agent endpoint

The system SHALL expose an agent chat endpoint accepting recent messages, view info, and an optional canvas screenshot, returning a streaming response.

#### Scenario: Message streams back

- **WHEN** the user sends a message with canvas context attached
- **THEN** the agent's reply streams token-by-token into an AI bubble

### Requirement: Canvas-aware system prompt

The system SHALL instruct the agent with the ported `GUIDE` prompt (workflow, design system, tool rules), including current view info, recent chat, and the canvas image when present.

#### Scenario: Agent answers from the canvas

- **WHEN** the user asks what is on the canvas
- **THEN** the agent answers from the attached scene data and image without drawing

### Requirement: Planning contract

The system SHALL require the agent to plan with `todo_write` (full list up front, exactly one `in_progress`, updated as work completes) for any non-trivial drawing task.

#### Scenario: Plan visible for complex work

- **WHEN** the user requests a multi-part drawing
- **THEN** a todo list appears first and progresses as the agent works

### Requirement: Abort and key safety

The system SHALL abort the in-flight run when the user presses stop or switches chats, and SHALL NEVER expose the provider key to the client bundle.

#### Scenario: Stop and switch

- **WHEN** the user presses stop mid-stream or switches chats
- **THEN** streaming halts immediately and no output lands in the wrong chat
