# System Architecture: Projection-Based Responsibilities

## 🌐 Overview

The system follows a **Domain-Driven Context** architecture. It separates the "Truth" (raw data) from the "Projection" (how data appears on a specific board). This approach ensures that the application can scale horizontally with new board types without duplicating task data. The **Board acts as the orchestrator of projection**, while **Card** and **Column** are pure domains.

<br />

## 📄 Core responsibility layers (SRP - Single Responsibility Principle)

### 1. Card domain (The data truth)

- **Location:** `src/features/card/`
- **Responsibility:** Manages the lifecycle and **real state** of a task. A card exists independently of a board's visual layout. It does not project, mirror, or decide visualization.
- **Must Do:**
  - Maintain: `id`, `boardId`, `columnId`, `status`, and `order`.
  - Persist cards (storage) via `cardReducer.js`.
  - Handle raw mutations (CRUD) through `cardActions.js`.
  - Alter **real state**, never visual state.
- **Constraints:** Must not know about other boards, project cards in different columns, or calculate `displayColumnId`.
- **Data integrity:** Holds the "Source of Truth" (ID, status, title, description).

### 2. Column domain (The structure)

- **Location:** `src/features/column/`
- **Responsibility:** Defines the "slots" (containers) and the **visual and semantic structure** of a board.
- **Logic:** Columns are **passive**. They define `title`, `status`, and `style`, but do not decide visibility.
- **Feature:** Supports "Clone as Override". When a template is edited, the system performs a `cloneAsOverride`, allowing local customization without mutating the original template metadata.
- **Constraints:** Must not project/mirror cards or decide card visibility.

### 3. Board domain (The orchestrator & Projection engine)

- **Location:** `src/features/board/`
- **Responsibility:** The core intelligence and **projection axis**. It decides visualization, resolves mirroring, and filters visible cards.
- **Key components:**
  - `boardTemplates.js`: Source of truth for static layouts and `groupId`.
  - `boardProjection.js`: Contains `getMirrorLocation`, `projectCardToBoard`, and `resolveBoardCards`.
- **Logic:** Calculates the **virtual view**. Nothing here modifies state; it only calculates the projection.

<br />

## 🪞 The mirroring mechanism (Hybrid projection)

Unlike traditional Kanbans where a card belongs to one column, here the Board acts as a **Lens**:

1. **Selection:** A card has a semantic `status` (e.g., "in-progress").

2. **Analysis:** The **board** looks at its **live column state** (from `ColumnContext`).
3. **Hybrid Nature:**
   - **Template Mode:** Native mirroring via `groupId` using explicit maps.
   - **Dynamic Mode:** Full CRUD freedom for users. New boards/columns sync via semantic matching.
4. **Result:** The card appears in "Sprint Backlog" on a Scrum Board and "To Do" on a Kanban Board automatically.

<br />

## 🫷 System invariants (Unbreakable rules)

1. **Single truth:** A card has only one real state (`boardId`/`columnId`).
2. **Active projection:** Board decides visualization; projection is calculated on-the-fly and never persisted.
3. **Structural purity:** Columns are structure, not logic.
4. **No limbo:** The engine validates the live state of columns to ensure cards are always visible.

<br />

**[<- Go back to Tech Docs](../README.md#️-technologies-used)**
