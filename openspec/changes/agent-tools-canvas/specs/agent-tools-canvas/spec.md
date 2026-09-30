# Spec Delta

## Purpose

Gives the agent hands: eight tools that read the canvas and mutate it with professional layout quality, undoable and measurable.

## ADDED Requirements

### Requirement: Scene reading

The system SHALL provide `get_scene` returning all elements (ids, positions, text, bindings), the visible viewport, and a suggested free origin for new work.

#### Scenario: Agent inspects before editing

- **WHEN** the agent must touch existing content
- **THEN** it calls `get_scene` first and references exact ids and coordinates

### Requirement: Diagram auto-layout

The system SHALL provide `draw_diagram` that lays out node/edge graphs (TB or LR) with layered placement, cycle-safe ordering, group cluster boxes, and bound arrows.

#### Scenario: Flowchart request

- **WHEN** the user asks for a login flowchart
- **THEN** nodes appear evenly spaced with no overlaps and arrows connect the described flow

### Requirement: Card and element drawing

The system SHALL provide `draw_cards` (tinted rounded cards with badges, titles, body lines) and `draw_elements` (raw skeletons for mockups, art, annotations), both returning measured boxes and ids.

#### Scenario: Roadmap request

- **WHEN** the user asks for a roadmap
- **THEN** aligned 660px cards with badges appear, spaced per the grid rules

### Requirement: Connections and edits

The system SHALL provide `connect` (arrows anchored to facing edges with elbow routing), `update_elements` (move/recolor/rename/resize by id), `delete_elements` (by id, including bound companions), and `focus_view` (fit content or ids on screen).

#### Scenario: Chained build

- **WHEN** the agent draws cards then connects them
- **THEN** arrows anchor edge-to-edge from the ids the draw call returned

### Requirement: History-safe commits

The system SHALL commit every tool mutation with `commitToHistory: true` and version bumps, and scroll the camera to new content.

#### Scenario: Undo after agent draw

- **WHEN** the user presses undo after an agent drawing
- **THEN** the agent's last commit reverts
